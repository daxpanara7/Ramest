import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Google reCAPTCHA v3 verification.
 *
 * Two call styles, because the right failure mode differs by endpoint:
 *
 *  - `verify()` — scores and returns. Used by leads, where a low score is
 *    stored as a spam signal but the lead is kept either way. Losing a real
 *    enquiry is worse than storing a junk one.
 *  - `assertHuman()` — gates. Used by login and newsletter signup, where a
 *    missing or failing token must stop the request outright.
 *
 * Both treat a Google *outage* as pass-through: if siteverify is unreachable
 * we allow the request rather than locking admins out of their own panel.
 * Rate limiting (@Throttle) stays the backstop in that window. A token that
 * Google actively rejects is different — that is a hard fail.
 */

export type RecaptchaOutcome =
  /** No secret configured — local dev. Nothing to check. */
  | { status: 'disabled' }
  /** Google verified the token. */
  | { status: 'ok'; score: number }
  /** Google rejected the token, or the client sent none. */
  | { status: 'rejected'; score: number }
  /** siteverify unreachable or malformed — cannot tell either way. */
  | { status: 'unavailable' };

/** Google's own guidance: 0.5 is the default human/bot boundary. */
const DEFAULT_MIN_SCORE = 0.5;

@Injectable()
export class RecaptchaService {
  private readonly logger = new Logger(RecaptchaService.name);

  constructor(private readonly config: ConfigService) {}

  /** True once RECAPTCHA_SECRET_KEY is set. */
  get enabled(): boolean {
    return Boolean(this.config.get<string>('RECAPTCHA_SECRET_KEY'));
  }

  async check(token: string | undefined, ip?: string): Promise<RecaptchaOutcome> {
    const secret = this.config.get<string>('RECAPTCHA_SECRET_KEY');
    if (!secret) {
      this.logger.warn('RECAPTCHA_SECRET_KEY not set — skipping verification');
      return { status: 'disabled' };
    }
    if (!token) return { status: 'rejected', score: 0 };

    try {
      const body = new URLSearchParams({ secret, response: token });
      if (ip) body.append('remoteip', ip);

      // Never let a hung Google request hold an admin login open.
      const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: AbortSignal.timeout(5_000),
      });
      const data = (await res.json()) as { success: boolean; score?: number };
      return data.success
        ? { status: 'ok', score: data.score ?? 0 }
        : { status: 'rejected', score: 0 };
    } catch (err) {
      this.logger.error(`reCAPTCHA verify failed: ${String(err)}`);
      return { status: 'unavailable' };
    }
  }

  /**
   * Score-only. Returns null when verification could not run at all (no
   * secret, or Google unreachable) so callers can store "unknown" rather than
   * a misleading 0.
   */
  async verify(token: string | undefined, ip?: string): Promise<number | null> {
    const outcome = await this.check(token, ip);
    switch (outcome.status) {
      case 'ok':
      case 'rejected':
        return outcome.score;
      default:
        return null;
    }
  }

  /**
   * Hard gate. Throws 403 when captcha is active and the token is missing,
   * rejected, or scores below `minScore`.
   */
  async assertHuman(
    token: string | undefined,
    ip?: string,
    minScore: number = DEFAULT_MIN_SCORE,
  ): Promise<number | null> {
    const outcome = await this.check(token, ip);

    switch (outcome.status) {
      case 'disabled':
        return null;
      case 'unavailable':
        // Fail open deliberately — see the class comment.
        this.logger.warn('reCAPTCHA unavailable — allowing request through');
        return null;
      case 'rejected':
        throw new ForbiddenException('Failed bot verification. Please reload and try again.');
      case 'ok':
        if (outcome.score < minScore) {
          this.logger.warn(`reCAPTCHA score ${outcome.score} below ${minScore} from ip=${ip}`);
          throw new ForbiddenException('Failed bot verification. Please reload and try again.');
        }
        return outcome.score;
    }
  }
}
