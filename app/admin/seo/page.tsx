"use client";

import { useMemo } from "react";
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip,
  XAxis, YAxis,
} from "recharts";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, AlertCircle } from "lucide-react";
import { useApi } from "@/lib/admin/use-api";

/**
 * Original layout. Data now comes from two real sources:
 *
 *   LIVE  — organic traffic, position trend, and the SEO score ring, all from
 *           Google Search Console via /api/seo/search-console/*.
 *         — metadata & schema coverage, computed from published posts.
 *   TODO  — Core Web Vitals needs CrUX / PageSpeed Insights; the GEO and AEO
 *           rings need the AI-citation tracker on /admin/ai-search. Those
 *           cards stay in place showing "—" rather than inventing numbers.
 */

type Totals = { clicks: number; impressions: number; ctr: number; position: number };
type GscSummary = {
  enabled: boolean;
  current?: Totals;
  previous?: Totals;
  deltaPct?: { clicks: number | null; impressions: number | null };
  series?: { date: string; clicks: number; impressions: number; ctr: number; position: number }[];
};
type Coverage = {
  totalPublished: number;
  summary: {
    missingMetaTitle: number; missingMetaDescription: number;
    missingCanonical: number; missingOgImage: number; fullyComplete: number;
  };
};

function ScoreRing({ label, value, hint }: { label: string; value: number | null; hint: string }) {
  const r = 36, c = 2 * Math.PI * r;
  const shown = value ?? 0;
  const off = c - (shown / 100) * c;
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <div className="relative h-24 w-24">
          <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
            <circle cx="50" cy="50" r={r} stroke="var(--border)" strokeWidth="8" fill="none" />
            <circle cx="50" cy="50" r={r} stroke="var(--primary)" strokeWidth="8" fill="none"
              strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-2xl tracking-tight">{value ?? "—"}</span>
          </div>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
          <p className="mt-1 text-sm">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SeoPage() {
  const { data: gsc, loading, error, reload } = useApi<GscSummary>("/seo/search-console/summary?days=90");
  const { data: cov } = useApi<Coverage>("/seo/metadata-coverage");

  const series = gsc?.series ?? [];

  /**
   * A visibility score from real signals rather than a vanity number:
   * CTR (max 40) + average position (max 40) + impression volume (max 20).
   * Documented here because an unexplained 0-100 score is untrustworthy.
   */
  const seoScore = useMemo(() => {
    const c = gsc?.current;
    if (!c || c.impressions === 0) return null;
    const ctrPts = Math.min(c.ctr * 100 * 2, 40);
    const posPts = Math.max(0, 40 - Math.max(0, c.position - 1) * 1.2);
    const volPts = Math.min(Math.log10(c.impressions + 1) * 8, 20);
    return Math.round(ctrPts + posPts + volPts);
  }, [gsc]);

  const coverageRows = useMemo(() => {
    if (!cov) return null;
    const t = cov.totalPublished;
    const s = cov.summary;
    const row = (k: string, missing: number) => ({
      k, v: `${t - missing} / ${t}`, ok: t > 0 && missing === 0,
    });
    return [
      row("Meta titles set", s.missingMetaTitle),
      row("Meta descriptions set", s.missingMetaDescription),
      row("Canonical URLs set", s.missingCanonical),
      row("OpenGraph images", s.missingOgImage),
      row("Fully complete pages", t - s.fullyComplete),
    ];
  }, [cov]);

  return (
    <Section>
      <PageHeader
        title="SEO Dashboard"
        description="Search performance, technical health and content coverage."
        actions={
          <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      {error && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
          <Button variant="ghost" size="sm" className="ml-auto h-7" onClick={reload}>Retry</Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScoreRing
          label="SEO Score"
          value={seoScore}
          hint={gsc?.current ? `${gsc.current.clicks} clicks · pos ${gsc.current.position.toFixed(1)}` : "Awaiting Search Console"}
        />
        <ScoreRing label="GEO Score" value={null} hint="Needs the AI citation tracker" />
        <ScoreRing label="AEO Score" value={null} hint="Needs the AI citation tracker" />
        <ScoreRing label="Performance" value={null} hint="Needs PageSpeed Insights" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Average position</CardTitle>
              <CardDescription>Lower is better · Google Search</CardDescription>
            </div>
            <Badge variant="secondary" className="text-[10.5px]">Trailing 90 days</Badge>
          </CardHeader>
          <CardContent className="h-72">
            {loading && series.length === 0 ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : series.length === 0 ? (
              <Empty note="No Search Console data for this window yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  {/* Inverted: position 1 is best, so the good direction is up. */}
                  <YAxis reversed stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Line type="monotone" dataKey="position" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 2 }} name="Avg. position" />
                  <Line type="monotone" dataKey="ctr" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 2 }} name="CTR %" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Core Web Vitals</CardTitle>
            <CardDescription>75th percentile · last 28 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Field data needs CrUX / PageSpeed Insights — the rows stay so
                the layout holds, with honest "—" rather than made-up timings. */}
            {["LCP", "INP", "CLS", "TTFB"].map((k) => (
              <div key={k} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{k}</p>
                  <p className="text-xs text-muted-foreground">Not measured</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm tabular-nums text-muted-foreground">—</span>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground/50" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Organic traffic</CardTitle>
              <CardDescription>Clicks &amp; impressions · Google Search</CardDescription>
            </div>
            {gsc?.deltaPct?.clicks !== null && gsc?.deltaPct?.clicks !== undefined && (
              <Badge variant="secondary" className="text-[10.5px]">
                {gsc.deltaPct.clicks > 0 ? "+" : ""}{gsc.deltaPct.clicks}% clicks
              </Badge>
            )}
          </CardHeader>
          <CardContent className="h-64">
            {loading && series.length === 0 ? (
              <Skeleton className="h-full w-full rounded-lg" />
            ) : series.length === 0 ? (
              <Empty note="No Search Console data for this window yet." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                  <defs>
                    <linearGradient id="s1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="impressions" stroke="var(--chart-2)" fill="none" strokeWidth={2} />
                  <Area type="monotone" dataKey="clicks" stroke="var(--chart-1)" fill="url(#s1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metadata &amp; schema</CardTitle>
            <CardDescription>Coverage across published pages</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {!coverageRows ? (
              Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="my-3 h-6 w-full" />)
            ) : cov?.totalPublished === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No published posts yet — publish one and coverage appears here.
              </p>
            ) : coverageRows.map((r) => (
              <div key={r.k} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <span className="text-sm">{r.k}</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono tabular-nums text-muted-foreground">{r.v}</span>
                  {r.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <XCircle className="h-4 w-4 text-destructive" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function Empty({ note }: { note: string }) {
  return (
    <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground">
      {note}
    </div>
  );
}
