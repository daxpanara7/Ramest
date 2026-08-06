import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApplicationStatus, JobApplication } from '@prisma/client';
import { randomBytes } from 'crypto';
import { MailService } from '../../common/mail/mail.service';
import { RecaptchaService } from '../../common/recaptcha/recaptcha.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { ApplicationsRepository } from './applications.repository';
import { ResumeStorageService } from './resume-storage.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ListApplicationsQueryDto } from './dto/list-applications-query.dto';

const ALL_STATUSES: ApplicationStatus[] = [
  ApplicationStatus.NEW,
  ApplicationStatus.REVIEWING,
  ApplicationStatus.SHORTLISTED,
  ApplicationStatus.INTERVIEWING,
  ApplicationStatus.OFFERED,
  ApplicationStatus.HIRED,
  ApplicationStatus.REJECTED,
  ApplicationStatus.SPAM,
];

/**
 * Resume formats a recruiter can actually open. PDF first because it is what
 * we ask for; the Word types stay allowed because a large share of candidates
 * only have a .docx and rejecting it costs us the application.
 */
export const ALLOWED_RESUME_MIME: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/rtf': '.rtf',
  'text/rtf': '.rtf',
};

export const MAX_RESUME_BYTES = 5 * 1024 * 1024; // 5 MB

/** Floor for a genuine fill of this form. See LeadsService for the rationale. */
const MIN_FILL_MS = 2_500;

const CSV_HEADER =
  'fullName,email,phone,totalExperience,position,status,resume,country,createdAt';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger(ApplicationsService.name);

  constructor(
    private readonly applications: ApplicationsRepository,
    private readonly resumes: ResumeStorageService,
    private readonly mail: MailService,
    private readonly recaptcha: RecaptchaService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Public submit: (1) bot filters, (2) reCAPTCHA gate, (3) store the resume,
   * (4) persist the row, (5) notify HR and confirm to the candidate.
   *
   * The row is written before any email goes out, and mail failures are
   * logged rather than thrown — an application that is safely in the database
   * must never be lost to a mail outage.
   */
  async create(
    dto: CreateApplicationDto,
    file: Express.Multer.File | undefined,
    meta: { ip?: string; country?: string; userAgent?: string },
  ): Promise<{ id: string | null; status: ApplicationStatus }> {
    /* --- layer 1: deterministic filters, dropped silently --------------- */
    const trippedHoneypot = Boolean(dto.website && dto.website.trim());
    const submittedTooFast =
      typeof dto.elapsedMs === 'number' && dto.elapsedMs < MIN_FILL_MS;

    if (trippedHoneypot || submittedTooFast) {
      this.logger.warn(
        `Bot filter tripped — application discarded (honeypot=${trippedHoneypot} fast=${submittedTooFast}) ip=${meta.ip}`,
      );
      return { id: null, status: ApplicationStatus.NEW };
    }

    /* --- layer 2: reCAPTCHA, a hard gate (same policy as leads) --------- */
    const minScore = Number(this.config.get('RECAPTCHA_MIN_SCORE') ?? 0.5);
    const hardBlock =
      String(this.config.get('LEADS_REQUIRE_CAPTCHA') ?? 'true') !== 'false';

    const score = hardBlock
      ? await this.recaptcha.assertHuman(dto.recaptchaToken, meta.ip, minScore)
      : await this.recaptcha.verify(dto.recaptchaToken, meta.ip);

    const looksLikeSpam = score !== null && score < minScore;

    /* --- resume: validated here as well as at the interceptor ---------- */
    const resume = file ? await this.storeResume(file) : null;

    const application = await this.applications.create({
      fullName: dto.fullName,
      email: dto.email,
      phone: dto.phone,
      totalExperience: dto.totalExperience,
      position: dto.position,
      coverNote: dto.coverNote,
      resumeKey: resume?.key,
      resumeName: resume?.name,
      resumeMime: resume?.mime,
      resumeBytes: resume?.bytes,
      ip: meta.ip,
      country: meta.country,
      userAgent: meta.userAgent,
      recaptchaScore: score,
      source: 'careers',
      status: looksLikeSpam ? ApplicationStatus.SPAM : ApplicationStatus.NEW,
    });

    if (!looksLikeSpam) {
      /* Feeds the admin notification bell, which reads the ActivityLog — the
         only event stream the system has. Without this a new application is
         invisible in the console until someone reloads the list. userId is
         null because the actor is the public, not a logged-in user. Spam-
         scored rows are skipped so the bell stays signal, not noise. */
      await this.audit.record({
        userId: null,
        action: 'application.created',
        entity: 'JobApplication',
        entityId: application.id,
        ip: meta.ip,
        metadata: {
          candidate: application.fullName,
          position: application.position,
          experience: application.totalExperience,
          hasResume: Boolean(application.resumeKey),
        },
      });
      void this.dispatchEmails(application);
    }

    return { id: application.id, status: application.status };
  }

  /**
   * Validates and writes the uploaded CV. The mime check is repeated here
   * rather than left to the Multer fileFilter so a future caller that skips
   * the interceptor cannot write an executable to the uploads directory.
   */
  private async storeResume(file: Express.Multer.File) {
    const ext = ALLOWED_RESUME_MIME[file.mimetype];
    if (!ext) {
      throw new BadRequestException(
        'Resume must be a PDF, DOC, DOCX or RTF file.',
      );
    }
    if (file.size > MAX_RESUME_BYTES) {
      throw new BadRequestException('Resume exceeds the 5 MB limit.');
    }

    // Random key, never the uploaded filename — that is attacker-controlled
    // and would otherwise let a submission choose its own path on disk.
    const key = `${randomBytes(16).toString('hex')}${ext}`;
    await this.resumes.save(file.buffer, key);

    return {
      key,
      name: sanitizeFilename(file.originalname) || `resume${ext}`,
      mime: file.mimetype,
      bytes: file.size,
    };
  }

  private async dispatchEmails(app: JobApplication) {
    const to = this.config.get<string>('MAIL_NOTIFY_TO') ?? 'hr@ramesttechnolabs.com';
    try {
      await Promise.all([
        this.mail.send({
          to,
          replyTo: app.email,
          subject: `New application — ${app.position} (${app.fullName})`,
          html: `
        <h2>New job application</h2>
        <p><strong>Name:</strong> ${esc(app.fullName)}</p>
        <p><strong>Email:</strong> ${esc(app.email)}</p>
        <p><strong>Mobile:</strong> ${esc(app.phone)}</p>
        <p><strong>Total experience:</strong> ${esc(app.totalExperience)}</p>
        <p><strong>Position applied for:</strong> ${esc(app.position)}</p>
        <p><strong>Resume:</strong> ${app.resumeName ? esc(app.resumeName) : 'not attached'}</p>
        ${app.coverNote ? `<p><strong>Note:</strong><br>${esc(app.coverNote).replace(/\n/g, '<br>')}</p>` : ''}
        <hr><p style="color:#888">Open the admin console → Job Applications to download the resume.<br>
        Application ID: ${app.id}</p>`,
        }),
        this.mail.send({
          to: app.email,
          subject: 'We received your application — Ramest Technolabs',
          html: `
        <p>Hi ${esc(app.fullName.split(' ')[0] || app.fullName)},</p>
        <p>Thanks for applying for <strong>${esc(app.position)}</strong> at Ramest
        Technolabs. Your application is with our team — if it looks like a fit we
        will reach out to arrange a first conversation.</p>
        <p>— Ramest Technolabs<br>Ahmedabad, Gujarat, India</p>`,
        }),
      ]);
    } catch (err) {
      this.logger.error(`Application ${app.id} saved but email failed: ${String(err)}`);
    }
  }

  /** Admin list with pagination + status/search/position filters. */
  async list(
    query: ListApplicationsQueryDto,
  ): Promise<{ items: JobApplication[]; total: number }> {
    return this.applications.findMany({
      status: query.status,
      search: query.search,
      position: query.position,
      skip: query.skip,
      take: Math.min(query.take ?? 25, 100),
    });
  }

  async findOne(id: string): Promise<JobApplication> {
    const application = await this.applications.findById(id);
    if (!application) {
      throw new NotFoundException('Application not found');
    }
    return application;
  }

  /** Admin edit: status / notes. Always audited with old->new status. */
  async update(
    id: string,
    dto: UpdateApplicationDto,
    user: AuthUser,
    ip?: string,
  ): Promise<JobApplication> {
    const existing = await this.applications.findById(id);
    if (!existing) {
      throw new NotFoundException('Application not found');
    }

    const updated = await this.applications.update(id, {
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.adminNotes !== undefined ? { adminNotes: dto.adminNotes } : {}),
    });

    await this.audit.record({
      userId: user.id,
      action: 'application.update',
      entity: 'JobApplication',
      entityId: id,
      ip,
      metadata: {
        statusFrom: existing.status,
        statusTo: updated.status,
        changes: dto,
      },
    });

    return updated;
  }

  /**
   * Soft delete. The resume file is removed from disk as well: keeping a CV
   * for a candidate whose record was deleted is exactly the kind of stale
   * personal data a retention policy exists to prevent.
   */
  async remove(id: string, user: AuthUser, ip?: string): Promise<{ ok: true }> {
    const existing = await this.applications.findById(id);
    if (!existing) {
      throw new NotFoundException('Application not found');
    }

    await this.applications.softDelete(id);
    if (existing.resumeKey) {
      await this.resumes.remove(existing.resumeKey);
    }

    await this.audit.record({
      userId: user.id,
      action: 'application.delete',
      entity: 'JobApplication',
      entityId: id,
      ip,
      metadata: { statusAtDeletion: existing.status, position: existing.position },
    });

    return { ok: true };
  }

  /**
   * Status history for one application: created, then every status change.
   * 404s first if the application does not exist, so a bad id cannot be
   * probed through this route.
   */
  async history(id: string) {
    await this.findOne(id);
    return this.applications.findHistory(id);
  }

  /** Resolves an on-disk resume for the authorised download route. */
  async resolveResume(
    id: string,
  ): Promise<{ path: string; mimeType: string; filename: string }> {
    const application = await this.findOne(id);
    if (!application.resumeKey) {
      throw new NotFoundException('This application has no resume attached');
    }
    if (!(await this.resumes.exists(application.resumeKey))) {
      // The row survives a redeploy; the file may not (ephemeral container FS).
      throw new NotFoundException('The resume file is no longer available on the server');
    }
    return {
      path: this.resumes.filePath(application.resumeKey),
      mimeType: application.resumeMime ?? 'application/octet-stream',
      filename: application.resumeName ?? `${application.fullName}-resume`,
    };
  }

  /** CSV export honoring the same status filter as the list endpoint. */
  async exportCsv(status?: ApplicationStatus): Promise<string> {
    const rows = await this.applications.findForExport({ status });
    const lines = rows.map((r) =>
      [
        r.fullName,
        r.email,
        r.phone,
        r.totalExperience,
        r.position,
        r.status,
        r.resumeName ?? '',
        r.country ?? '',
        r.createdAt.toISOString(),
      ]
        .map(csvEscape)
        .join(','),
    );
    return [CSV_HEADER, ...lines].join('\n');
  }

  /** Counts grouped by status, zero-filled, plus the position list. */
  async stats(): Promise<{
    byStatus: Record<ApplicationStatus, number>;
    total: number;
    positions: string[];
  }> {
    const [rows, positions] = await Promise.all([
      this.applications.countByStatus(),
      this.applications.distinctPositions(),
    ]);
    const byStatus = ALL_STATUSES.reduce(
      (acc, s) => ({ ...acc, [s]: 0 }),
      {} as Record<ApplicationStatus, number>,
    );
    let total = 0;
    for (const row of rows) {
      byStatus[row.status] = row.count;
      total += row.count;
    }
    return { byStatus, total, positions };
  }
}

/**
 * Strips path separators and control characters from the uploaded filename.
 * It is only ever used as a display label and a Content-Disposition value —
 * never as a path — but a raw `../` in the admin table is still noise nobody
 * wants to see.
 */
function sanitizeFilename(name: string): string {
  return name
    .replace(/[/\\]/g, '-')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, 180);
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/** Minimal HTML escaping for values interpolated into email markup. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
