import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Google reCAPTCHA v3 verification (Task 04). Returns the score so callers can
 * decide (leads are stored either way, but a low score flags likely spam).
 *
 * When no secret key is configured (local dev), verification is skipped and a
 * neutral score is returned so the form still works — production must set it.
 */
@Injectable()
export class RecaptchaService {
  private readonly logger = new Logger(RecaptchaService.name);

  constructor(private readonly config: ConfigService) {}

  async verify(token: string | undefined, ip?: string): Promise<number | null> {
    const secret = this.config.get<string>('RECAPTCHA_SECRET_KEY');
    if (!secret) {
      this.logger.warn('RECAPTCHA_SECRET_KEY not set — skipping verification');
      return null;
    }
    if (!token) return 0;

    try {
      const body = new URLSearchParams({ secret, response: token });
      if (ip) body.append('remoteip', ip);

      const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });
      const data = (await res.json()) as { success: boolean; score?: number };
      return data.success ? (data.score ?? 0) : 0;
    } catch (err) {
      this.logger.error(`reCAPTCHA verify failed: ${String(err)}`);
      return null; // fail open — never lose a real lead to a Google outage
    }
  }
}
