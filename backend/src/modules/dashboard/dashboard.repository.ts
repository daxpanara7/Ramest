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
}
