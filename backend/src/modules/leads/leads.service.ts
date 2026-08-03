import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContactLead, LeadStatus } from '@prisma/client';
import { MailService } from '../../common/mail/mail.service';
import { RecaptchaService } from '../../common/recaptcha/recaptcha.service';
import { AuditService } from '../../common/audit/audit.service';
import { AuthUser } from '../../common/decorators/current-user.decorator';
import { LeadsRepository } from './leads.repository';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { ListLeadsQueryDto } from './dto/list-leads-query.dto';

const ALL_STATUSES: LeadStatus[] = [
  LeadStatus.NEW,
  LeadStatus.CONTACTED,
  LeadStatus.QUALIFIED,
  LeadStatus.WON,
  LeadStatus.LOST,
  LeadStatus.SPAM,
];

const CSV_HEADER = 'name,email,phone,company,service,status,country,createdAt';

/**
 * Floor for a genuine fill of this form (name + email + a 10-char-minimum
 * message). Deliberately conservative — the cost of a false positive here is
 * a lost customer, so it only catches submissions no human could produce.
 */
const MIN_FILL_MS = 2_500;

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly leads: LeadsRepository,
    private readonly mail: MailService,
    private readonly recaptcha: RecaptchaService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Task 12 flow: (1) score + persist, (2) notify the team, (3) confirm to the
   * sender. Email failures are logged but never fail the request — the lead is
   * already safely stored, and losing the DB write to a mail outage would be
   * the worst outcome.
   */
  async create(dto: CreateLeadDto, meta: { ip?: string; country?: string; userAgent?: string }) {
    /* --- layer 1: deterministic filters, dropped silently ----------------
       These catch the traffic reCAPTCHA is weakest against — plain scripted
       POSTs that never execute the page's JS.

       Dropped SILENTLY (the caller gets an ordinary success) rather than
       rejected, on purpose. A 403 here would tell the bot exactly which
       field is the trap and how fast is too fast, and it would adapt within
       a run. Nothing is written and no mail is sent, so the spam still never
       reaches you — which is the actual requirement. */
    const trippedHoneypot = Boolean(dto.website && dto.website.trim());
    const submittedTooFast =
      typeof dto.elapsedMs === 'number' && dto.elapsedMs < MIN_FILL_MS;

    if (trippedHoneypot || submittedTooFast) {
      this.logger.warn(
        `Bot filter tripped — discarded (honeypot=${trippedHoneypot} fast=${submittedTooFast} elapsed=${dto.elapsedMs ?? 'n/a'}ms) ip=${meta.ip}`,
      );
      return { id: null, status: LeadStatus.NEW };
    }

    /* --- layer 2: reCAPTCHA, a hard gate ---------------------------------
       assertHuman throws 403 when the token is missing, rejected by Google,
       or scores below the threshold — nothing is stored and no mail is sent.

       Two cases still pass deliberately, and neither is a loophole:
         - RECAPTCHA_SECRET_KEY unset  → nothing to verify against. Layer 1
           and the 5/min per-IP throttle still apply.
         - Google's siteverify unreachable → failing closed would take the
           contact form down for everyone every time Google has an incident.

       Set LEADS_REQUIRE_CAPTCHA=false to fall back to scoring without
       blocking, if the block ever costs real enquiries. */
    const minScore = Number(this.config.get('RECAPTCHA_MIN_SCORE') ?? 0.5);
    const hardBlock =
      String(this.config.get('LEADS_REQUIRE_CAPTCHA') ?? 'true') !== 'false';

    const score = hardBlock
      ? await this.recaptcha.assertHuman(dto.recaptchaToken, meta.ip, minScore)
      : await this.recaptcha.verify(dto.recaptchaToken, meta.ip);

    // Only reachable with the block disabled; keeps the old scored-but-kept
    // behaviour intact behind that flag.
    const looksLikeSpam = score !== null && score < minScore;

    const lead = await this.leads.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      company: dto.company,
      service: dto.service,
      message: dto.message,
      ip: meta.ip,
      country: meta.country,
      userAgent: meta.userAgent,
      recaptchaScore: score,
      status: looksLikeSpam ? LeadStatus.SPAM : LeadStatus.NEW,
    });

    // Do not email the team for spam-scored submissions.
    if (!looksLikeSpam) {
      void this.dispatchEmails(lead);
    }

    return { id: lead.id, status: lead.status };
  }

  private async dispatchEmails(lead: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    company: string | null;
    service: string | null;
    message: string;
  }) {
    try {
      await Promise.all([
        this.mail.notifyNewLead(lead),
        this.mail.sendLeadConfirmation(lead),
      ]);
    } catch (err) {
      this.logger.error(`Lead ${lead.id} saved but email failed: ${String(err)}`);
    }
  }

  /** Admin list with pagination + status/search/assignee filters (Task 08/11). */
  async list(query: ListLeadsQueryDto): Promise<{ items: ContactLead[]; total: number }> {
    return this.leads.findMany({
      status: query.status,
      search: query.search,
      assigneeId: query.assigneeId,
      skip: query.skip,
      take: Math.min(query.take ?? 25, 100),
    });
  }

  /** Single lead lookup for the admin detail view. */
  async findOne(id: string): Promise<ContactLead> {
    const lead = await this.leads.findById(id);
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
    return lead;
  }

  /** Admin edit: status / notes / assignment. Always audited with old->new status. */
  async update(id: string, dto: UpdateLeadDto, user: AuthUser, ip?: string): Promise<ContactLead> {
    const existing = await this.leads.findById(id);
    if (!existing) {
      throw new NotFoundException('Lead not found');
    }

    const updated = await this.leads.update(id, {
      ...(dto.status !== undefined ? { status: dto.status } : {}),
      ...(dto.adminNotes !== undefined ? { adminNotes: dto.adminNotes } : {}),
      ...(dto.assigneeId !== undefined ? { assigneeId: dto.assigneeId } : {}),
    });

    await this.audit.record({
      userId: user.id,
      action: 'lead.update',
      entity: 'ContactLead',
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

  /** Soft delete — never removes the row, just stamps deletedAt. */
  async remove(id: string, user: AuthUser, ip?: string): Promise<{ ok: true }> {
    const existing = await this.leads.findById(id);
    if (!existing) {
      throw new NotFoundException('Lead not found');
    }

    await this.leads.softDelete(id);

    await this.audit.record({
      userId: user.id,
      action: 'lead.delete',
      entity: 'ContactLead',
      entityId: id,
      ip,
      metadata: { statusAtDeletion: existing.status },
    });

    return { ok: true };
  }

  /** CSV export honoring the same status filter as the list endpoint. */
  async exportCsv(status?: LeadStatus): Promise<string> {
    const rows = await this.leads.findForExport({ status });
    const lines = rows.map((r) =>
      [r.name, r.email, r.phone, r.company, r.service, r.status, r.country, r.createdAt.toISOString()]
        .map(csvEscape)
        .join(','),
    );
    return [CSV_HEADER, ...lines].join('\n');
  }

  /** Counts grouped by status, zero-filled for statuses with no leads. */
  async stats(): Promise<Record<LeadStatus, number>> {
    const rows = await this.leads.countByStatus();
    const base = ALL_STATUSES.reduce(
      (acc, s) => ({ ...acc, [s]: 0 }),
      {} as Record<LeadStatus, number>,
    );
    for (const row of rows) {
      base[row.status] = row.count;
    }
    return base;
  }
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  const str = String(value);
  return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}
