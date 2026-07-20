import { Injectable } from '@nestjs/common';
import { DashboardRepository } from './dashboard.repository';

@Injectable()
export class DashboardService {
  constructor(private readonly repo: DashboardRepository) {}

  /** All aggregates are fetched in parallel — no query depends on another. */
  async getStats() {
    const [
      totalUsers,
      publishedPosts,
      draftPosts,
      activeSubscribers,
      totalLeads,
      leadsByStatus,
      recentLeads,
      recentActivity,
    ] = await Promise.all([
      this.repo.countUsers(),
      this.repo.countBlogPosts('PUBLISHED'),
      this.repo.countBlogPosts('DRAFT'),
      this.repo.countActiveSubscribers(),
      this.repo.countLeads(),
      this.repo.countLeadsByStatus(),
      this.repo.recentLeads(5),
      this.repo.recentActivity(5),
    ]);

    return {
      users: { total: totalUsers },
      blogPosts: { published: publishedPosts, draft: draftPosts },
      newsletter: { activeSubscribers },
      leads: {
        total: totalLeads,
        byStatus: leadsByStatus.reduce<Record<string, number>>((acc, row) => {
          acc[row.status] = row._count;
          return acc;
        }, {}),
        recent: recentLeads,
      },
      activity: { recent: recentActivity },
    };
  }
}
