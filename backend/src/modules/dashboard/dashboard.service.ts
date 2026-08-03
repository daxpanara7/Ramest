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

  /**
   * Time series for the dashboard charts.
   *
   * Postgres COUNT() comes back as bigint, which JSON.stringify cannot
   * serialise — every count is coerced to Number here rather than at the
   * controller, so no caller can forget.
   */
  async series(days = 30, months = 12) {
    const [leads, posts, countries] = await Promise.all([
      this.repo.leadsPerDay(days),
      this.repo.postsPerMonth(months),
      this.repo.leadsByCountry(),
    ]);

    return {
      leadsPerDay: leads.map((r) => ({
        date: r.day.toISOString().slice(0, 10),
        leads: Number(r.total),
        qualified: Number(r.qualified),
      })),
      postsPerMonth: posts.map((r) => ({
        month: r.month.toISOString().slice(0, 7),
        posts: Number(r.total),
      })),
      leadsByCountry: countries
        .map((c) => ({ country: c.country ?? "Unknown", value: c._count }))
        .sort((a, b) => b.value - a.value),
    };
  }
}
