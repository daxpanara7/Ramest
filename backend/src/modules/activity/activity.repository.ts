import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Data access for the immutable ActivityLog. No soft delete here — activity
 * rows are never deleted (see AuditService).
 */
@Injectable()
export class ActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    userId?: string;
    action?: string;
    skip?: number;
    take?: number;
  }) {
    const where: Prisma.ActivityLogWhereInput = {
      ...(params.userId ? { userId: params.userId } : {}),
      ...(params.action ? { action: params.action } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip ?? 0,
        take: Math.min(params.take ?? 25, 100),
        include: {
          user: { select: { id: true, name: true, email: true } },
        },
      }),
      this.prisma.activityLog.count({ where }),
    ]);
    return { items, total };
  }
}
