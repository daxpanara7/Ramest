"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/admin/api";
import { PageLoading, PageError } from "@/components/admin/status";

type Dashboard = {
  users: { total: number };
  blogPosts: { published: number; draft: number };
  newsletter: { activeSubscribers: number };
  leads: {
    total: number;
    byStatus: Record<string, number>;
    recent: { id: string; name: string; email: string; status: string; createdAt: string }[];
  };
  activity: { recent: { id: string; action: string; createdAt: string }[] };
};

export default function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<Dashboard>("/dashboard")
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <PageError message={error} />;
  if (!data) return <PageLoading />;

  const stats = [
    { label: "Total leads", value: data.leads.total, icon: "fa-inbox" },
    { label: "Published posts", value: data.blogPosts.published, icon: "fa-newspaper" },
    { label: "Draft posts", value: data.blogPosts.draft, icon: "fa-pen" },
    { label: "Active subscribers", value: data.newsletter.activeSubscribers, icon: "fa-envelope" },
    { label: "Admin users", value: data.users.total, icon: "fa-users" },
  ];
  const recentLeads = data.leads.recent;
  const recentActivity = data.activity.recent;

  return (
    <div>
      <header className="admin-page-head">
        <h1>Dashboard</h1>
        <p>A snapshot of activity across the site.</p>
      </header>

      <div className="admin-stat-grid">
        {stats.map((s) => (
          <div className="admin-stat-card" key={s.label}>
            <span className="admin-stat-icon" aria-hidden="true">
              <i className={`fa-solid ${s.icon}`} />
            </span>
            <div>
              <div className="admin-stat-value">{s.value}</div>
              <div className="admin-stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-two-col">
        <section className="admin-card">
          <h2>Recent leads</h2>
          {recentLeads.length === 0 ? (
            <p className="admin-muted">No leads yet.</p>
          ) : (
            <table className="admin-table">
              <tbody>
                {recentLeads.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <strong>{l.name}</strong>
                      <br />
                      <span className="admin-muted">{l.email}</span>
                    </td>
                    <td>
                      <span className={`admin-badge status-${l.status.toLowerCase()}`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section className="admin-card">
          <h2>Recent activity</h2>
          {recentActivity.length === 0 ? (
            <p className="admin-muted">Nothing logged yet.</p>
          ) : (
            <ul className="admin-activity">
              {recentActivity.map((a) => (
                <li key={a.id}>
                  <code>{a.action}</code>
                  <span className="admin-muted">{new Date(a.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
