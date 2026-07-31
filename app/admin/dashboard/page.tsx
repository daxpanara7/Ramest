"use client";

import Link from "next/link";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, PieChart, Pie, Cell, Legend,
} from "recharts";
import {
  FileText, Newspaper, Users2, Mail, ShieldCheck, ArrowUpRight, ExternalLink,
  Search, Image as ImageIcon, RefreshCw, AlertCircle,
} from "lucide-react";
import { PageHeader, Section, Stat } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { visitorSeries, leadSeries, trafficSources } from "@/lib/mock-data";
import { apiLeadStatusBadge, postStatusBadge } from "@/components/admin/badges";
import { useApi } from "@/lib/admin/use-api";
import { relativeTime, formatDateTime } from "@/lib/admin/format";

/**
 * Layout is unchanged from the original design. What changed is where the
 * numbers come from:
 *
 *   LIVE   — the five stat values, Recent blog posts, Recent leads, Recent
 *            activity. All from GET /api/dashboard and /api/blog/posts.
 *   STATIC — the three charts (Visitors & Blog views, Traffic sources, Lead
 *            generation) and the "vs last month" deltas. The backend stores
 *            no page views, referrers, or historical snapshots, so these
 *            still render the sample series. They are the Search Console
 *            integration's job — see SEARCH_CONSOLE_TODO below.
 *
 * Nothing is removed while it waits: the cards keep rendering so the layout
 * is exactly what was designed.
 */

// TODO(search-console): replace visitorSeries / trafficSources / leadSeries
// and the Stat deltas once the Search Console API is wired. Clicks,
// impressions, CTR and average position all come from
// searchanalytics.query; traffic sources need GA4 rather than GSC.
const SEARCH_CONSOLE_TODO = true;

const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

type DashboardStats = {
  users: { total: number };
  blogPosts: { published: number; draft: number };
  newsletter: { activeSubscribers: number };
  leads: {
    total: number;
    byStatus: Record<string, number>;
    recent: {
      id: string; name: string; email: string;
      company: string | null; service: string | null;
      status: string; createdAt: string;
    }[];
  };
  activity: {
    recent: {
      id: string; action: string; entity: string | null;
      createdAt: string; user: { name: string; email: string } | null;
    }[];
  };
};

type Post = {
  id: string; title: string; slug: string; status: string;
  updatedAt: string;
  category: { name: string } | null;
};
type PostList = { items: Post[]; total: number };

export default function DashboardPage() {
  const { data, loading, error, reload } = useApi<DashboardStats>("/dashboard");
  const { data: posts } = useApi<PostList>("/blog/posts?take=5");

  const totalBlogs = (data?.blogPosts.published ?? 0) + (data?.blogPosts.draft ?? 0);
  const recentPosts = posts?.items ?? [];
  const recentLeads = data?.leads.recent ?? [];
  const recentActivity = data?.activity.recent ?? [];

  return (
    <Section>
      <PageHeader
        title="Overview"
        description="A snapshot of content performance, leads, and platform health."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" asChild><Link href="/admin/blog/new">New post</Link></Button>
          </>
        }
      />

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <Button variant="ghost" size="sm" className="ml-auto h-7" onClick={reload}>Retry</Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <Stat label="Total Blogs" value={totalBlogs} delta="+8.2%" icon={<Newspaper className="h-4 w-4" />} />
        <Stat label="Published" value={data?.blogPosts.published ?? 0} delta="+4.6%" icon={<FileText className="h-4 w-4" />} />
        <Stat label="Contact Leads" value={data?.leads.total ?? 0} delta="+18.4%" icon={<Users2 className="h-4 w-4" />} />
        <Stat label="Subscribers" value={(data?.newsletter.activeSubscribers ?? 0).toLocaleString()} delta="+2.1%" icon={<Mail className="h-4 w-4" />} />
        <Stat label="Team" value={data?.users.total ?? 0} delta="0%" icon={<ShieldCheck className="h-4 w-4" />} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Visitors &amp; Blog views</CardTitle>
              <CardDescription>Trailing 12 months</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-1">
              <ArrowUpRight className="h-3 w-3" /> 24.6% MoM
            </Badge>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={visitorSeries} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="v1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="v2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  cursor={{ stroke: "var(--border)" }}
                />
                <Area type="monotone" dataKey="views" stroke="var(--chart-2)" strokeWidth={2} fill="url(#v2)" />
                <Area type="monotone" dataKey="visitors" stroke="var(--chart-1)" strokeWidth={2} fill="url(#v1)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Traffic sources</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={trafficSources} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} strokeWidth={0}>
                  {trafficSources.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
                </Pie>
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Lead generation</CardTitle>
              <CardDescription>Weekly leads vs qualified</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/leads" className="text-xs">View all <ExternalLink className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={leadSeries} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  cursor={{ fill: "color-mix(in oklab, var(--foreground) 4%, transparent)" }}
                />
                <Bar dataKey="leads" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="qualified" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick actions</CardTitle>
            <CardDescription>Jump into common workflows</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2">
            {[
              { href: "/admin/blog/new", label: "New blog", icon: Newspaper },
              { href: "/admin/leads", label: "Leads", icon: Users2 },
              { href: "/admin/newsletter", label: "Subscribers", icon: Mail },
              { href: "/admin/seo", label: "SEO", icon: Search },
              { href: "/admin/media", label: "Media", icon: ImageIcon },
              { href: "/admin/settings/general", label: "Settings", icon: ShieldCheck },
            ].map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2.5 text-sm transition-colors hover:border-primary/40 hover:bg-accent/40"
              >
                <a.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                <span>{a.label}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Recent blog posts</CardTitle>
              <CardDescription>Latest content activity</CardDescription>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/admin/blog" className="text-xs">All posts</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPosts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                      No posts yet.
                    </TableCell>
                  </TableRow>
                ) : recentPosts.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="max-w-[320px]">
                      <div className="truncate font-medium">{b.title}</div>
                      <div className="text-xs text-muted-foreground" title={formatDateTime(b.updatedAt)}>
                        {relativeTime(b.updatedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      {b.category
                        ? <Badge variant="outline" className="text-[10.5px]">{b.category.name}</Badge>
                        : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>{postStatusBadge(b.status)}</TableCell>
                    {/* Views needs an analytics source — Search Console page
                        clicks/impressions once that integration lands. */}
                    <TableCell className="text-right tabular-nums text-muted-foreground">—</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent activity</CardTitle>
            <CardDescription>Team &amp; system events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pr-1">
            {recentActivity.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">No activity recorded yet.</p>
            ) : recentActivity.map((l) => (
              <div key={l.id} className="flex gap-3">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{l.user?.name ?? "System"}</span>{" "}
                    <span className="text-muted-foreground">{l.action}</span>{" "}
                    {l.entity && <span className="font-medium">{l.entity}</span>}
                  </p>
                  <p className="text-[11px] text-muted-foreground/80" title={formatDateTime(l.createdAt)}>
                    {relativeTime(l.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle className="text-base">Recent leads</CardTitle>
            <CardDescription>Latest inquiries from the site</CardDescription>
          </div>
          <Button size="sm" variant="ghost" asChild>
            <Link href="/admin/leads" className="text-xs">Open CRM</Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-sm text-muted-foreground">
                    No leads yet.
                  </TableCell>
                </TableRow>
              ) : recentLeads.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>
                    <div className="font-medium">{l.name}</div>
                    <div className="text-xs text-muted-foreground">{l.email}</div>
                  </TableCell>
                  <TableCell>{l.company ?? "—"}</TableCell>
                  <TableCell>
                    {l.service
                      ? <Badge variant="outline" className="text-[10.5px]">{l.service}</Badge>
                      : <span className="text-muted-foreground">—</span>}
                  </TableCell>
                  <TableCell>{apiLeadStatusBadge(l.status)}</TableCell>
                  <TableCell className="text-right text-muted-foreground" title={formatDateTime(l.createdAt)}>
                    {relativeTime(l.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Section>
  );
}
