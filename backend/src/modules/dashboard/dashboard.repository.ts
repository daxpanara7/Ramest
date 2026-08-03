import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Data access for dashboard aggregates. Every method is a single cheap query
 * (count/groupBy/limited findMany) so the service can run them all in parallel.
 */
@Injectable()
export class DashboardRepository {
  constructor(private readonly prisma: PrismaService) {}

  countUsers() {
    return this.prisma.user.count({ where: { deletedAt: null } });
  }

  countBlogPosts(status: 'PUBLISHED' | 'DRAFT') {
    return this.prisma.blogPost.count({ where: { deletedAt: null, status } });
  }

  countActiveSubscribers() {
    return this.prisma.newsletterSubscriber.count({
      where: { deletedAt: null, status: 'ACTIVE' },
    });
  }

  countLeads() {
    return this.prisma.contactLead.count({ where: { deletedAt: null } });
  }

  countLeadsByStatus() {
    return this.prisma.contactLead.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: true,
    });
  }

  recentLeads(take: number) {
    return this.prisma.contactLead.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      take,
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        service: true,
        status: true,
        createdAt: true,
      },
    });
  }

  recentActivity(take: number) {
    return this.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  /**
   * Leads per day for the last N days, bucketed in SQL rather than in JS —
   * pulling every row back just to group it would scale with lead volume.
   * generate_series fills days with zero leads, which a plain GROUP BY drops
   * and which would otherwise make the chart lie about quiet days.
   */
  leadsPerDay(days: number) {
    return this.prisma.$queryRaw<{ day: Date; total: bigint; qualified: bigint }[]>`
      SELECT d.day::date AS day,
             COUNT(l.id) AS total,
             COUNT(l.id) FILTER (WHERE l.status IN ('QUALIFIED','WON')) AS qualified
      FROM generate_series(
             CURRENT_DATE - (${days}::int - 1) * INTERVAL '1 day',
             CURRENT_DATE,
             INTERVAL '1 day'
           ) AS d(day)
      LEFT JOIN "ContactLead" l
             ON l."createdAt" >= d.day
            AND l."createdAt" <  d.day + INTERVAL '1 day'
            AND l."deletedAt" IS NULL
      GROUP BY d.day
      ORDER BY d.day ASC;
    `;
  }

  /** Published posts per month for the last N months. */
  postsPerMonth(months: number) {
    return this.prisma.$queryRaw<{ month: Date; total: bigint }[]>`
      SELECT m.month::date AS month, COUNT(p.id) AS total
      FROM generate_series(
             date_trunc('month', CURRENT_DATE) - (${months}::int - 1) * INTERVAL '1 month',
             date_trunc('month', CURRENT_DATE),
             INTERVAL '1 month'
           ) AS m(month)
      LEFT JOIN "BlogPost" p
             ON p."publishedAt" >= m.month
            AND p."publishedAt" <  m.month + INTERVAL '1 month'
            AND p."deletedAt" IS NULL
      GROUP BY m.month
      ORDER BY m.month ASC;
    `;
  }

  /** Lead volume grouped by source-ish dimension we actually store. */
  leadsByCountry() {
    return this.prisma.contactLead.groupBy({
      by: ['country'],
      where: { deletedAt: null },
      _count: true,
    });
  }
}
