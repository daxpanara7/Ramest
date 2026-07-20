import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { AuditService } from '../../common/audit/audit.service';
import type { AccessTokenPayload } from '../../common/guards/jwt-auth.guard';

type ReqMeta = { ip?: string; userAgent?: string };

/** Roles+permissions flattened from the nested Prisma include. */
function resolveGrants(user: {
  roles: { role: { name: string; permissions: { permission: { key: string } }[] } }[];
}) {
  const roles = user.roles.map((ur) => ur.role.name);
  const permissions = [
    ...new Set(
      user.roles.flatMap((ur) => ur.role.permissions.map((rp) => rp.permission.key)),
    ),
  ];
  return { roles, permissions };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly repo: AuthRepository,
    private readonly passwords: PasswordService,
    private readonly tokens: TokenService,
    private readonly audit: AuditService,
  ) {}

  /** Verify credentials and issue an access token + a rotating refresh token. */
  async login(email: string, password: string, meta: ReqMeta) {
    const user = await this.repo.findActiveUserByEmail(email);
    // Always run a verify to keep timing uniform whether or not the user exists.
    const ok = user
      ? await this.passwords.verify(user.passwordHash, password)
      : await this.passwords.verifyDummy(password);

    if (!user || !ok) {
      await this.audit.record({ action: 'auth.login.failed', metadata: { email }, ip: meta.ip });
      throw new UnauthorizedException('Invalid email or password');
    }

    const { accessToken, refreshToken } = await this.issueSession(user, meta);
    await this.repo.touchLastLogin(user.id);
    await this.audit.record({ userId: user.id, action: 'auth.login', ip: meta.ip });

    return { user: this.publicUser(user), accessToken, refreshToken };
  }

  /** Rotate a refresh token: validate, revoke old, issue new. */
  async refresh(rawToken: string, meta: ReqMeta) {
    if (!rawToken) throw new UnauthorizedException('No refresh token');
    const hash = this.tokens.hashRefreshToken(rawToken);
    const existing = await this.repo.findValidRefreshToken(hash);
    if (!existing) throw new UnauthorizedException('Invalid or expired session');

    const user = await this.repo.findActiveUserById(existing.userId);
    if (!user) throw new UnauthorizedException('Account unavailable');

    await this.repo.revokeRefreshToken(existing.id); // rotation
    const { accessToken, refreshToken } = await this.issueSession(user, meta);
    return { accessToken, refreshToken };
  }

  async logout(rawToken: string | undefined, userId?: string, meta?: ReqMeta) {
    if (rawToken) {
      const existing = await this.repo.findValidRefreshToken(
        this.tokens.hashRefreshToken(rawToken),
      );
      if (existing) await this.repo.revokeRefreshToken(existing.id);
    }
    if (userId) await this.audit.record({ userId, action: 'auth.logout', ip: meta?.ip });
  }

  private async issueSession(
    user: Parameters<typeof resolveGrants>[0] & { id: string; email: string; name: string },
    meta: ReqMeta,
  ) {
    const { roles, permissions } = resolveGrants(user);
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      roles,
      permissions,
    };
    const accessToken = await this.tokens.signAccessToken(payload);
    const { token: refreshToken, hash } = this.tokens.generateRefreshToken();
    await this.repo.createRefreshToken({
      userId: user.id,
      tokenHash: hash,
      userAgent: meta.userAgent,
      ip: meta.ip,
      expiresAt: new Date(Date.now() + this.tokens.refreshTtlMs()),
    });
    return { accessToken, refreshToken };
  }

  private publicUser(user: Parameters<typeof resolveGrants>[0] & {
    id: string;
    email: string;
    name: string;
  }) {
    const { roles, permissions } = resolveGrants(user);
    return { id: user.id, email: user.email, name: user.name, roles, permissions };
  }
}
