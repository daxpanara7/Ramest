import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Data access for auth. Keeps Prisma queries out of the service so the service
 * holds only auth logic (Controller -> Service -> Repository).
 */
@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** User with roles + permissions, for login and permission resolution. */
  findActiveUserByEmail(email: string) {
    return this.prisma.user.findFirst({
      where: { email, isActive: true, deletedAt: null },
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      },
    });
  }

  findActiveUserById(id: string) {
    return this.prisma.user.findFirst({
      where: { id, isActive: true, deletedAt: null },
      include: {
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
      },
    });
  }

  createRefreshToken(data: {
    userId: string;
    tokenHash: string;
    userAgent?: string;
    ip?: string;
    expiresAt: Date;
  }) {
    return this.prisma.refreshToken.create({ data });
  }

  findValidRefreshToken(tokenHash: string) {
    return this.prisma.refreshToken.findFirst({
      where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    });
  }

  revokeRefreshToken(id: string) {
    return this.prisma.refreshToken.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  /** Revoke all sessions for a user (logout-all / password change). */
  revokeAllForUser(userId: string) {
    return this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  touchLastLogin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}
