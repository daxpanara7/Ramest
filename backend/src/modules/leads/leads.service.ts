import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LeadStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../common/mail/mail.service';
import { RecaptchaService } from '../../common/recaptcha/recaptcha.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
    private readonly recaptcha: RecaptchaService,
    private readonly config: ConfigService,
  ) {}

  /**
   * Task 12 flow: (1) score + persist, (2) notify the team, (3) confirm to the
   * sender. Email failures are logged but never fail the request — the lead is
   * already safely stored, and losing the DB write to a mail outage would be
   * the worst outcome.
   */
  async create(dto: CreateLeadDto, meta: { ip?: string; country?: string; userAgent?: string }) {
    const score = await this.recaptcha.verify(dto.recaptchaToken, meta.ip);
    const minScore = Number(this.config.get('RECAPTCHA_MIN_SCORE') ?? 0.5);
    const looksLikeSpam = score !== null && score < minScore;

    const lead = await this.prisma.contactLead.create({
      data: {
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
      },
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

  /** Admin list with pagination + status filter (Task 08/11). */
  async list(params: { skip?: number; take?: number; status?: LeadStatus }) {
    const where: Prisma.ContactLeadWhereInput = {
      deletedAt: null,
      ...(params.status ? { status: params.status } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.contactLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip ?? 0,
        take: Math.min(params.take ?? 25, 100),
      }),
      this.prisma.contactLead.count({ where }),
    ]);
    return { items, total };
  }
}
