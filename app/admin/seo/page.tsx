"use client";

import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip,
  XAxis, YAxis,
} from "recharts";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { seoScores, keywordSeries } from "@/lib/mock-data";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";


function ScoreRing({ label, value, hint }: { label: string; value: number; hint: string }) {
  const r = 36, c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
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
            <span className="font-display text-2xl tracking-tight">{value}</span>
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
  return (
    <Section>
      <PageHeader
        title="SEO Dashboard"
        description="Search performance, technical health and content coverage."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ScoreRing label="SEO Score" value={seoScores.seo} hint="Above target (85+)" />
        <ScoreRing label="GEO Score" value={seoScores.geo} hint="Improving month-over-month" />
        <ScoreRing label="AEO Score" value={seoScores.aeo} hint="Answer coverage growing" />
        <ScoreRing label="Performance" value={seoScores.perf} hint="Core Web Vitals healthy" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between space-y-0">
            <div>
              <CardTitle className="text-base">Keyword growth</CardTitle>
              <CardDescription>Top-3 and top-10 positions</CardDescription>
            </div>
            <Badge variant="secondary" className="text-[10.5px]">Trailing 6 months</Badge>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={keywordSeries} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="top3" stroke="var(--chart-1)" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="top10" stroke="var(--chart-2)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Core Web Vitals</CardTitle>
            <CardDescription>75th percentile · last 28 days</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { k: "LCP", v: "1.9s", ok: true },
              { k: "INP", v: "142ms", ok: true },
              { k: "CLS", v: "0.03", ok: true },
              { k: "TTFB", v: "480ms", ok: false },
            ].map((r) => (
              <div key={r.k} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{r.k}</p>
                  <p className="text-xs text-muted-foreground">{r.ok ? "Passing" : "Needs work"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm tabular-nums">{r.v}</span>
                  {r.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <AlertTriangle className="h-4 w-4 text-amber-400" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Organic traffic</CardTitle>
            <CardDescription>Clicks & impressions</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={keywordSeries.map((k, i) => ({ m: k.m, clicks: 800 + i * 220, impressions: 4200 + i * 1100 }))}
                margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="s1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="m" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="impressions" stroke="var(--chart-2)" fill="none" strokeWidth={2} />
                <Area type="monotone" dataKey="clicks" stroke="var(--chart-1)" fill="url(#s1)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Metadata & schema</CardTitle>
            <CardDescription>Coverage across published pages</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {[
              { k: "Meta titles set", v: "112 / 112", ok: true },
              { k: "Meta descriptions set", v: "108 / 112", ok: true },
              { k: "OpenGraph images", v: "94 / 112", ok: false },
              { k: "Article schema", v: "112 / 112", ok: true },
              { k: "Breadcrumb schema", v: "88 / 112", ok: false },
              { k: "FAQ schema (AEO)", v: "41 / 112", ok: false },
            ].map((r) => (
              <div key={r.k} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <span className="text-sm">{r.k}</span>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-muted-foreground tabular-nums">{r.v}</span>
                  {r.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-destructive" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}
