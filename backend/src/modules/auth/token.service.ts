import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHash, randomBytes } from 'node:crypto';
import type { AccessTokenPayload } from '../../common/guards/jwt-auth.guard';

/**
 * Token minting and verification.
 *
 * - Access token: short-lived JWT, carries roles + permissions so guards need
 *   no DB round-trip. Sent as a Bearer header (no CSRF surface).
 * - Refresh token: opaque random string. Only its SHA-256 hash is stored, so a
 *   database leak does not expose usable tokens. Rotated on every refresh.
 */
@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async signAccessToken(payload: AccessTokenPayload): Promise<string> {
    return this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: this.config.get<string>('JWT_ACCESS_TTL') ?? '15m',
    });
  }

  /** Returns the raw token (sent to client) and its hash (stored in DB). */
  generateRefreshToken(): { token: string; hash: string } {
    const token = randomBytes(48).toString('base64url');
    return { token, hash: this.hashRefreshToken(token) };
  }

  hashRefreshToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  refreshTtlMs(): number {
    const ttl = this.config.get<string>('JWT_REFRESH_TTL') ?? '7d';
    const days = Number(ttl.replace('d', '')) || 7;
    return days * 24 * 60 * 60 * 1000;
  }
}
