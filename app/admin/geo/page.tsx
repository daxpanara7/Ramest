"use client";

import { useMemo } from "react";
import { PageHeader, Section, Stat } from "@/components/admin/primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe2, MapPin, TrendingUp, Building2, AlertCircle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/admin/use-api";

/**
 * GEOGRAPHIC reach — countries and regions.
 *
 * Deliberately NOT "GEO" in the Generative Engine Optimization sense: that
 * now lives on /admin/ai-search. The two were colliding on one three-letter
 * name while needing completely different data sources.
 *
 * Data is real Google Search Console country data. It counts *search clicks*,
 * not all visits — GSC has no view of direct, referral or social traffic.
 */

type CountryRow = {
  country: string;      // ISO-3, lowercase, e.g. "ind"
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};
type CountryList = { enabled: boolean; items: CountryRow[] };

/** ISO-3166-1 alpha-3 → display name, for the codes GSC actually returns. */
const COUNTRY_NAMES: Record<string, string> = {
  ind: "India", usa: "United States", gbr: "United Kingdom", are: "UAE",
  deu: "Germany", sgp: "Singapore", can: "Canada", aus: "Australia",
  fra: "France", nld: "Netherlands", esp: "Spain", ita: "Italy",
  pak: "Pakistan", bgd: "Bangladesh", lka: "Sri Lanka", npl: "Nepal",
  sau: "Saudi Arabia", qat: "Qatar", kwt: "Kuwait", omn: "Oman",
  zaf: "South Africa", nga: "Nigeria", ken: "Kenya", bra: "Brazil",
  mex: "Mexico", jpn: "Japan", kor: "South Korea", chn: "China",
  idn: "Indonesia", mys: "Malaysia", tha: "Thailand", phl: "Philippines",
  vnm: "Vietnam", tur: "Turkey", pol: "Poland", swe: "Sweden",
  che: "Switzerland", irl: "Ireland", nzl: "New Zealand", isr: "Israel",
};
const label = (code: string) => COUNTRY_NAMES[code] ?? code.toUpperCase();

export default function GeoPage() {
  const { data, loading, error, reload } = useApi<CountryList>("/seo/search-console/countries?days=28");

  const rows = useMemo(
    () => [...(data?.items ?? [])].sort((a, b) => b.clicks - a.clicks),
    [data],
  );

  const totalClicks = rows.reduce((sum, r) => sum + r.clicks, 0);
  const maxClicks = rows[0]?.clicks ?? 0;
  const withClicks = rows.filter((r) => r.clicks > 0).length;

  return (
    <Section>
      <PageHeader
        title="Geographic Reach"
        description="Where your search traffic comes from — countries and regions, last 28 days."
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

      {data && !data.enabled && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
          Search Console is not configured — set GOOGLE_SERVICE_ACCOUNT_JSON on the API.
        </div>
      )}

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Countries reached" value={rows.length} icon={<Globe2 className="h-4 w-4" />} />
        <Stat label="Top region" value={rows[0] ? label(rows[0].country) : "—"} icon={<MapPin className="h-4 w-4" />} />
        <Stat label="Countries with clicks" value={withClicks} icon={<Building2 className="h-4 w-4" />} />
        <Stat label="Total search clicks" value={totalClicks.toLocaleString()} icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top regions</CardTitle>
          <CardDescription>By Google Search clicks, last 28 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading && rows.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)
          ) : rows.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No country data yet — Search Console needs impressions before it reports by region.
            </p>
          ) : rows.map((r) => {
            const share = totalClicks > 0 ? (r.clicks / totalClicks) * 100 : 0;
            // Bar scales against the leader, not the total, so small countries
            // stay visible instead of collapsing to an invisible sliver.
            const width = maxClicks > 0
              ? Math.max((r.clicks / maxClicks) * 100, r.clicks > 0 ? 4 : 1.5)
              : 1.5;
            return (
              <div key={r.country} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{label(r.country)}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="tabular-nums">{r.clicks.toLocaleString()} clicks</span>
                    <span className="tabular-nums">{r.impressions.toLocaleString()} impr.</span>
                    <Badge variant="secondary" className="text-[10px]">
                      {share >= 1 ? `${share.toFixed(0)}%` : "<1%"}
                    </Badge>
                  </div>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${width}%` }} />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Regional detail</CardTitle>
          <CardDescription>CTR and average position per country</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-left">
                <th className="px-4 py-2.5 font-medium">Country</th>
                <th className="px-4 py-2.5 text-right font-medium">Clicks</th>
                <th className="px-4 py-2.5 text-right font-medium">Impressions</th>
                <th className="px-4 py-2.5 text-right font-medium">CTR</th>
                <th className="px-4 py-2.5 text-right font-medium">Avg. position</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">No data yet.</td></tr>
              ) : rows.map((r) => (
                <tr key={r.country} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-2.5">{label(r.country)}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.clicks}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.impressions}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.ctr}%</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Section>
  );
}
