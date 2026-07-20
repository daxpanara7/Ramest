import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type MailInput = { to: string; subject: string; html: string; replyTo?: string };

/**
 * Transactional email via Resend (Task 12). If RESEND_API_KEY is absent (local
 * dev), emails are logged instead of sent so the flow is testable without a key.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly config: ConfigService) {}

  private get from() {
    return this.config.get<string>('MAIL_FROM') ?? 'noreply@ramesttechnolabs.com';
  }

  async send({ to, subject, html, replyTo }: MailInput): Promise<void> {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    if (!apiKey) {
      this.logger.warn(`[mail skipped — no RESEND_API_KEY] to=${to} subject="${subject}"`);
      return;
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.from,
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      this.logger.error(`Resend send failed (${res.status}): ${detail}`);
      throw new Error('Email delivery failed');
    }
  }

  /** Notify the team of a new enquiry (Task 12, step 2). */
  async notifyNewLead(lead: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    company?: string | null;
    service?: string | null;
    message: string;
  }): Promise<void> {
    const to = this.config.get<string>('MAIL_NOTIFY_TO') ?? 'hr@ramesttechnolabs.com';
    await this.send({
      to,
      replyTo: lead.email,
      subject: `New enquiry — ${lead.name}${lead.company ? ` (${lead.company})` : ''}`,
      html: `
        <h2>New contact enquiry</h2>
        <p><strong>Name:</strong> ${esc(lead.name)}</p>
        <p><strong>Email:</strong> ${esc(lead.email)}</p>
        <p><strong>Phone:</strong> ${esc(lead.phone ?? '—')}</p>
        <p><strong>Company:</strong> ${esc(lead.company ?? '—')}</p>
        <p><strong>Service:</strong> ${esc(lead.service ?? '—')}</p>
        <p><strong>Message:</strong></p>
        <p>${esc(lead.message).replace(/\n/g, '<br>')}</p>
        <hr><p style="color:#888">Lead ID: ${lead.id}</p>`,
    });
  }

  /** Confirmation to the person who submitted (Task 12, step 3). */
  async sendLeadConfirmation(lead: { name: string; email: string }): Promise<void> {
    await this.send({
      to: lead.email,
      subject: 'We received your message — Ramest Technolabs',
      html: `
        <p>Hi ${esc(lead.name.split(' ')[0] || lead.name)},</p>
        <p>Thanks for reaching out to Ramest Technolabs. We have received your
        message and one of our engineers will get back to you within one
        business day.</p>
        <p>— Ramest Technolabs<br>Ahmedabad, Gujarat, India</p>`,
    });
  }
}

/** Minimal HTML escaping for values interpolated into email markup. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
