import { Injectable } from '@nestjs/common';
import { Prisma, SubscriberStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Data access for the newsletter module. Keeps Prisma queries out of the
 * service (Controller -> Service -> Repository).
 *
 * Note: `email` and `verifyToken` are unique at the DB level regardless of
 * `deletedAt`, so lookups used by the public subscribe/verify/unsubscribe
 * flow intentionally do not filter on `deletedAt` — a soft-deleted row still
 * owns its email/token and must be found (and revived) rather than colliding
 * on create. Admin list/read paths do filter `deletedAt: null`.
 */
@Injectable()
export class NewsletterRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Includes soft-deleted rows — email is globally unique. */
  findByEmailAny(email: string) {
    return this.prisma.newsletterSubscriber.findUnique({ where: { email } });
  }

  findByToken(token: string) {
    return this.prisma.newsletterSubscriber.findUnique({ where: { verifyToken: token } });
  }

  findActiveById(id: string) {
    return this.prisma.newsletterSubscriber.findFirst({ where: { id, deletedAt: null } });
  }

  create(data: {
    email: string;
    name?: string;
    source?: string;
    ip?: string;
    verifyToken: string;
  }) {
    return this.prisma.newsletterSubscriber.create({
      data: {
        email: data.email,
        name: data.name,
        source: data.source,
        ip: data.ip,
        verifyToken: data.verifyToken,
        status: SubscriberStatus.PENDING,
      },
    });
  }

  /** Re-arm an existing (unverified/unsubscribed/soft-deleted) row for opt-in. */
  resetToPending(
    id: string,
    data: { name?: string; source?: string; ip?: string; verifyToken: string },
  ) {
    return this.prisma.newsletterSubscriber.update({
      where: { id },
      data: {
        name: data.name,
        source: data.source,
        ip: data.ip,
        verifyToken: data.verifyToken,
        status: SubscriberStatus.PENDING,
        verifiedAt: null,
        unsubscribedAt: null,
        deletedAt: null,
      },
    });
  }

  activate(id: string) {
    return this.prisma.newsletterSubscriber.update({
      where: { id },
      data: { status: SubscriberStatus.ACTIVE, verifiedAt: new Date(), verifyToken: null },
    });
  }

  markUnsubscribed(id: string) {
    return this.prisma.newsletterSubscriber.update({
      where: { id },
      data: { status: SubscriberStatus.UNSUBSCRIBED, unsubscribedAt: new Date() },
    });
  }

  async findMany(params: {
    status?: SubscriberStatus;
    search?: string;
    skip: number;
    take: number;
  }) {
    const where: Prisma.NewsletterSubscriberWhereInput = {
      deletedAt: null,
      ...(params.status ? { status: params.status } : {}),
      ...(params.search
        ? { email: { contains: params.search, mode: Prisma.QueryMode.insensitive } }
        : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.newsletterSubscriber.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip,
        take: params.take,
      }),
      this.prisma.newsletterSubscriber.count({ where }),
    ]);
    return { items, total };
  }

  updateStatus(id: string, status: SubscriberStatus) {
    return this.prisma.newsletterSubscriber.update({ where: { id }, data: { status } });
  }

  softDelete(id: string) {
    return this.prisma.newsletterSubscriber.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  findAllActive() {
    return this.prisma.newsletterSubscriber.findMany({
      where: { status: SubscriberStatus.ACTIVE, deletedAt: null },
      orderBy: { createdAt: 'asc' },
    });
  }

  /** Imported rows are trusted — upsert straight to ACTIVE. */
  upsertActive(email: string, name?: string) {
    return this.prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, name, status: SubscriberStatus.ACTIVE, verifiedAt: new Date(), source: 'import' },
      update: {
        name,
        status: SubscriberStatus.ACTIVE,
        verifiedAt: new Date(),
        deletedAt: null,
        unsubscribedAt: null,
      },
    });
  }
}
