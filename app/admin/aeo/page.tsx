"use client";

import { useMemo } from "react";
import { AlertCircle, BrainCircuit, Layers, MessageSquareQuote, RefreshCw, Sparkles } from "lucide-react";
import { PageHeader, Section, Stat } from "@/components/admin/primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/admin/use-api";

/**
 * Answer Engine Optimization — how well the site answers the questions
 * people actually type.
 *
 * Real input: Search Console queries. Question-shaped searches ("what is",
 * "how to") are exactly what answer engines synthesise from, so ranking for
 * them is the measurable part of AEO. Coverage is derived from position:
 * page-one results are the pool answer engines draw on.
 *
 * The deeper AI-citation view lives on /admin/ai-search; this page is the
 * question-coverage scorecard.
 */

type QueryRow = {
  query: string; clicks: number; impressions: number; ctr: number; position: number;
};
type QueryList = { enabled: boolean; items: QueryRow[] };

const QUESTION_STARTS = [
  "what", "how", "why", "when", "where", "who", "which", "can", "is", "are",
  "does", "do", "should", "will",
];

const isQuestion = (q: string) => {
  const t = q.toLowerCase().trim();
  return QUESTION_STARTS.includes(t.split(/\s+/)[0]) || t.includes("?");
};

export default function AeoPage() {
  const { data, loading, error, reload } = useApi<QueryList>(
    "/seo/search-console/queries?days=90",
  );

  const rows = data?.items ?? [];

  const questions = useMemo(
    () => rows.filter((r) => isQuestion(r.query)).sort((a, b) => b.impressions - a.impressions),
    [rows],
  );

  const covered = questions.filter((r) => r.position <= 10).length;
  const coverage = questions.length > 0 ? Math.round((covered / questions.length) * 100) : null;
  const totalImpressions = questions.reduce((sum, r) => sum + r.impressions, 0);
  const avgPos = questions.length > 0
    ? Math.round((questions.reduce((s, r) => s + r.position, 0) / questions.length) * 10) / 10
    : null;

  return (
    <Section>
      <PageHeader
        title="AEO Dashboard"
        description="Answer Engine Optimization — coverage of the questions people actually search."
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
        <Stat label="Tracked queries" value={rows.length} icon={<MessageSquareQuote className="h-4 w-4" />} />
        <Stat label="Question-shaped" value={questions.length} icon={<Sparkles className="h-4 w-4" />} />
        <Stat label="Answer coverage" value={coverage === null ? "—" : `${coverage}%`} icon={<Layers className="h-4 w-4" />} />
        <Stat label="Avg. position" value={avgPos === null ? "—" : avgPos} icon={<BrainCircuit className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tracked questions</CardTitle>
          <CardDescription>
            Real question-shaped searches from Google · {totalImpressions.toLocaleString()} impressions, last 90 days
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/60">
          {loading && rows.length === 0 ? (
            Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="my-3 h-8 w-full" />)
          ) : questions.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-muted-foreground">
                No question-shaped queries recorded yet.
              </p>
              <p className="mx-auto mt-2 max-w-md text-xs text-muted-foreground">
                This is the AEO gap worth closing: publish content that answers
                the questions buyers ask, and they will start appearing here.
              </p>
            </div>
          ) : questions.map((r) => (
            <div key={r.query} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <p className="text-sm">{r.query}</p>
              <div className="flex shrink-0 items-center gap-2">
                <Badge className={r.position <= 10
                  ? "border-transparent bg-emerald-500/12 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 text-[10.5px]"
                  : "border-transparent bg-muted text-muted-foreground text-[10.5px]"}>
                  {r.position <= 10 ? "Covered" : "Missing"}
                </Badge>
                <span className="w-28 text-right text-xs tabular-nums text-muted-foreground">
                  pos {r.position} · {r.impressions} impr
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Section>
  );
}
