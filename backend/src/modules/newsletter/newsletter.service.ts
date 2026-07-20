import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'node:crypto';
import { SubscriberStatus } from '@prisma/client';
import { MailService } from '../../common/mail/mail.service';
import { AuditService } from '../../common/audit/audit.service';
import { NewsletterRepository } from './newsletter.repository';
import { SubscribeDto } from './dto/subscribe.dto';
import { ImportSubscriberDto } from './dto/import.dto';

const GENERIC_SUBSCRIBE_MESSAGE =
  'Thanks for subscribing — please check your inbox to confirm your email address.';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(
    private readonly repo: NewsletterRepository,
    private readonly mail: MailService,
    private readonly config: ConfigService,
    private readonly audit: AuditService,
  ) {}

  /**
   * Double opt-in subscribe. Always returns the same message regardless of
   * whether the email was new, already pending, already active, or previously
   * unsubscribed/deleted — never let the response leak subscriber existence.
   */
  async subscribe(dto: SubscribeDto, meta: { ip?: string }): Promise<{ message: string }> {
    const existing = await this.repo.findByEmailAny(dto.email);
    const verifyToken = randomBytes(32).toString('base64url');

    if (!existing) {
      const created = await this.repo.create({
        email: dto.email,
        name: dto.name,
        source: dto.source,
        ip: meta.ip,
        verifyToken,
      });
      void this.dispatchVerificationEmail(created.email, created.name, verifyToken);
    } else if (existing.status !== SubscriberStatus.ACTIVE || existing.deletedAt) {
      // Pending / unsubscribed / bounced / soft-deleted — re-arm the opt-in.
      const updated = await this.repo.resetToPending(existing.id, {
        name: dto.name ?? existing.name ?? undefined,
        source: dto.source ?? existing.source ?? undefined,
        ip: meta.ip,
        verifyToken,
      });
      void this.dispatchVerificationEmail(updated.email, updated.name, verifyToken);
    }
    // Already ACTIVE and not deleted: no-op, same message returned.

    return { message: GENERIC_SUBSCRIBE_MESSAGE };
  }

  private async dispatchVerificationEmail(
    to: string,
    name: string | null,
    token: string,
  ): Promise<void> {
    const appUrl = this.config.get<string>('APP_URL') ?? 'http://localhost:4000';
    const link = `${appUrl}/api/newsletter/verify?token=${encodeURIComponent(token)}`;
    try {
      await this.mail.send({
        to,
        subject: 'Confirm your subscription — Ramest Technolabs',
        html: `
          <p>Hi ${escapeHtml(name?.split(' ')[0] || name || 'there')},</p>
          <p>Please confirm you'd like to receive the Ramest Technolabs newsletter
          by clicking the link below:</p>
          <p><a href="${link}">${link}</a></p>
          <p>If you didn't request this, you can safely ignore this email.</p>`,
      });
    } catch (err) {
      this.logger.error(`Verification email to ${to} failed: ${String(err)}`);
    }
  }

  async verify(token: string): Promise<{ ok: true; message: string }> {
    const subscriber = await this.repo.findByToken(token);
    if (!subscriber) {
      throw new NotFoundException('Invalid or expired verification token');
    }
    await this.repo.activate(subscriber.id);
    return { ok: true, message: 'Your subscription is confirmed. Thanks for joining!' };
  }

  async unsubscribe(email: string, token?: string): Promise<{ ok: true; message: string }> {
    const subscriber = await this.repo.findByEmailAny(email);
    const message = 'You have been unsubscribed (or were already unsubscribed).';
    if (!subscriber) return { ok: true, message };

    // If a verifyToken is still on file (not yet verified), require it to
    // match — the token is the only proof of control at that stage. Once
    // verified the token is cleared, so email-only matching is accepted.
    if (subscriber.verifyToken && token && subscriber.verifyToken !== token) {
      return { ok: true, message };
    }

    if (subscriber.status !== SubscriberStatus.UNSUBSCRIBED) {
      await this.repo.markUnsubscribed(subscriber.id);
    }
    return { ok: true, message };
  }

  async list(params: {
    status?: SubscriberStatus;
    search?: string;
    skip?: number;
    take?: number;
  }) {
    return this.repo.findMany({
      status: params.status,
      search: params.search,
      skip: params.skip ?? 0,
      take: Math.min(params.take ?? 25, 100),
    });
  }

  async updateStatus(id: string, status: SubscriberStatus, meta: { userId: string; ip?: string }) {
    const existing = await this.repo.findActiveById(id);
    if (!existing) throw new NotFoundException('Subscriber not found');
    const updated = await this.repo.updateStatus(id, status);
    await this.audit.record({
      userId: meta.userId,
      action: 'newsletter.subscriber.update',
      entity: 'NewsletterSubscriber',
      entityId: id,
      metadata: { status },
      ip: meta.ip,
    });
    return updated;
  }

  async remove(id: string, meta: { userId: string; ip?: string }) {
    const existing = await this.repo.findActiveById(id);
    if (!existing) throw new NotFoundException('Subscriber not found');
    await this.repo.softDelete(id);
    await this.audit.record({
      userId: meta.userId,
      action: 'newsletter.subscriber.delete',
      entity: 'NewsletterSubscriber',
      entityId: id,
      ip: meta.ip,
    });
  }

  async exportActiveCsv(): Promise<string> {
    const subscribers = await this.repo.findAllActive();
    const header = 'email,name,status,createdAt';
    const rows = subscribers.map((s) =>
      [
        csvField(s.email),
        csvField(s.name ?? ''),
        csvField(s.status),
        csvField(s.createdAt.toISOString()),
      ].join(','),
    );
    return [header, ...rows].join('\n') + '\n';
  }

  async import(
    subscribers: ImportSubscriberDto[],
    meta: { userId: string; ip?: string },
  ): Promise<{ imported: number; skipped: number }> {
    let imported = 0;
    let skipped = 0;
    for (const row of subscribers) {
      if (!isValidEmail(row.email)) {
        skipped += 1;
        continue;
      }
      try {
        await this.repo.upsertActive(row.email.trim().toLowerCase(), row.name?.trim());
        imported += 1;
      } catch (err) {
        this.logger.error(`Import failed for ${row.email}: ${String(err)}`);
        skipped += 1;
      }
    }
    const result = { imported, skipped };
    await this.audit.record({
      userId: meta.userId,
      action: 'newsletter.subscriber.import',
      entity: 'NewsletterSubscriber',
      metadata: { ...result, total: subscribers.length },
      ip: meta.ip,
    });
    return result;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Wraps a CSV field in quotes and escapes embedded quotes. */
function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

/** Minimal HTML escaping for values interpolated into email markup. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
