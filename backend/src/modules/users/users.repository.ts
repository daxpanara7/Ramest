import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/** Never selects passwordHash — this is the shape returned to the admin UI. */
const userSelect = {
  id: true,
  name: true,
  email: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  roles: {
    select: {
      role: { select: { id: true, name: true } },
    },
  },
} satisfies Prisma.UserSelect;

export type SafeUser = Prisma.UserGetPayload<{ select: typeof userSelect }>;

/**
 * Data access for admin users. Keeps Prisma queries out of the service so the
 * service holds only business logic (Controller -> Service -> Repository).
 */
@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: { search?: string; skip?: number; take?: number }) {
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(params.search
        ? {
            OR: [
              { name: { contains: params.search, mode: 'insensitive' } },
              { email: { contains: params.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        select: userSelect,
        orderBy: { createdAt: 'desc' },
        skip: params.skip ?? 0,
        take: Math.min(params.take ?? 25, 100),
      }),
      this.prisma.user.count({ where }),
    ]);
    return { items, total };
  }

  findById(id: string): Promise<SafeUser | null> {
    return this.prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: userSelect,
    });
  }

  /** Includes soft-deleted users to keep email uniqueness checks correct. */
  findByEmail(email: string) {
    return this.prisma.user.findFirst({ where: { email } });
  }

  countExistingRoles(roleIds: string[]) {
    return this.prisma.role.count({ where: { id: { in: [...new Set(roleIds)] } } });
  }

  create(data: {
    name: string;
    email: string;
    passwordHash: string;
    roleIds?: string[];
  }): Promise<SafeUser> {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        roles: data.roleIds?.length
          ? { create: [...new Set(data.roleIds)].map((roleId) => ({ roleId })) }
          : undefined,
      },
      select: userSelect,
    });
  }

  /** Updates scalar fields and, when roleIds is provided, replaces role assignments atomically. */
  async update(id: string, data: Prisma.UserUpdateInput, roleIds?: string[]) {
    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id }, data });
      if (roleIds) {
        await tx.userRole.deleteMany({ where: { userId: id } });
        const unique = [...new Set(roleIds)];
        if (unique.length) {
          await tx.userRole.createMany({
            data: unique.map((roleId) => ({ userId: id, roleId })),
          });
        }
      }
    });
    return this.findById(id);
  }

  softDelete(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date(), isActive: false },
    });
  }
}
