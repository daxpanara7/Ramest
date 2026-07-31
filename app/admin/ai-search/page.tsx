"use client";

import { useMemo } from "react";
import {
  AlertCircle, BrainCircuit, Layers, MessageSquareQuote, RefreshCw, Sparkles,
} from "lucide-react";
import { PageHeader, Section, Stat } from "@/components/admin/primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useApi } from "@/lib/admin/use-api";

/**
 * AI Search — AEO / GEO / LLMO.
 *
 * Naming, because these three letters collide constantly:
 *   AEO  Answer Engine Optimization    — being the answer in AI Overviews,
 *                                        featured snippets, voice results
 *   GEO  Generative Engine Optimization — being cited inside generated
 *                                        answers (ChatGPT, Perplexity, Gemini)
 *   LLMO Large Language Model Optimization — being present in model training
 *                                        and retrieval corpora
 *
 * NOT geography. Country data lives on /admin/geo.
 *
 * WHAT IS REAL HERE: the question-shaped query analysis. Google Search
 * Console reports the actual queries people type, and question-form queries
 * ("what is…", "how to…", "best … in …") are precisely the ones AI answer
 * engines synthesise from. That makes them the highest-signal AEO targets
 * available without a paid tracker.
 *
 * WHAT IS NOT YET REAL: citation counts inside ChatGPT/Perplexity answers.
 * No API exposes that. It needs a scheduled job that prompts each engine and
 * records whether the domain is cited — a build, not a config. Those cards
 * render honest zeros rather than invented numbers.
 */

type QueryRow = {
  query: string; clicks: number; impressions: number; ctr: number; position: number;
};
type QueryList = { enabled: boolean; items: QueryRow[] };

/** Prefixes/tokens that mark a query as question-shaped. */
const QUESTION_STARTS = [
  "what", "how", "why", "when", "where", "who", "which", "can", "is", "are",
  "does", "do", "should", "will",
];
const COMPARISON = ["vs", "versus", "best", "top", "alternative", "compare", "cheapest"];

function classify(q: string): "question" | "comparison" | "navigational" {
  const t = q.toLowerCase().trim();
  const first = t.split(/\s+/)[0];
  if (QUESTION_STARTS.includes(first) || t.includes("?")) return "question";
  if (COMPARISON.some((c) => t.split(/\s+/).includes(c))) return "comparison";
  return "navigational";
}

export default function AiSearchPage() {
  const { data, loading, error, reload } = useApi<QueryList>("/seo/search-console/queries?days=90");

  const rows = data?.items ?? [];

  const analysed = useMemo(
    () => rows.map((r) => ({ ...r, kind: classify(r.query) })).sort((a, b) => b.impressions - a.impressions),
    [rows],
  );

  const questions = analysed.filter((r) => r.kind === "question");
  const comparisons = analysed.filter((r) => r.kind === "comparison");
  // "Opportunity" = people are asking, but you rank badly enough that an AI
  // engine is unlikely to pull from you. Position 10 is roughly page-one edge.
  const opportunities = analysed.filter((r) => r.impressions > 0 && r.position > 10);

  const answerCoverage = analysed.length > 0
    ? Math.round((analysed.filter((r) => r.position <= 10).length / analysed.length) * 100)
    : null;

  return (
    <Section>
      <PageHeader
        title="AI Search (AEO / GEO / LLMO)"
        description="Answer, Generative and LLM engine optimization — how discoverable you are inside AI answers."
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

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Tracked queries" value={analysed.length} icon={<MessageSquareQuote className="h-4 w-4" />} />
        <Stat label="Question-shaped" value={questions.length} icon={<Sparkles className="h-4 w-4" />} />
        <Stat label="Page-one coverage" value={answerCoverage === null ? "—" : `${answerCoverage}%`} icon={<Layers className="h-4 w-4" />} />
        <Stat label="AI citations" value="—" icon={<BrainCircuit className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Question-shaped queries (AEO)</CardTitle>
          <CardDescription>
            Real searches phrased as questions — the exact input answer engines synthesise from
          </CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/60">
          {loading && rows.length === 0 ? (
            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="my-3 h-8 w-full" />)
          ) : questions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No question-shaped queries yet. As impressions grow, they appear here automatically.
            </p>
          ) : questions.map((r) => (
            <div key={r.query} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <p className="text-sm">{r.query}</p>
              <div className="flex shrink-0 items-center gap-2">
                <Badge className={r.position <= 10
                  ? "border-transparent bg-emerald-500/12 text-emerald-600 ring-1 ring-inset ring-emerald-500/20 text-[10.5px]"
                  : "border-transparent bg-muted text-muted-foreground text-[10.5px]"}
                >{r.position <= 10 ? "Covered" : "Missing"}</Badge>
                <span className="w-24 text-right text-xs text-muted-foreground tabular-nums">
                  pos {r.position} · {r.impressions} impr
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Biggest opportunities</CardTitle>
            <CardDescription>People are searching, but you rank below position 10</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {loading && rows.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="my-3 h-7 w-full" />)
            ) : opportunities.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Nothing flagged — every query with impressions ranks on page one.
              </p>
            ) : opportunities.slice(0, 10).map((r) => (
              <div key={r.query} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <span className="min-w-0 truncate text-sm">{r.query}</span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  pos {r.position} · {r.impressions} impr
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Comparison &amp; intent queries</CardTitle>
            <CardDescription>&quot;best&quot;, &quot;vs&quot;, &quot;top&quot; — high-intent, heavily used by AI answers</CardDescription>
          </CardHeader>
          <CardContent className="divide-y divide-border/60">
            {loading && rows.length === 0 ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="my-3 h-7 w-full" />)
            ) : comparisons.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No comparison-style queries recorded yet.
              </p>
            ) : comparisons.slice(0, 10).map((r) => (
              <div key={r.query} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                <span className="min-w-0 truncate text-sm">{r.query}</span>
                <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
                  pos {r.position} · {r.clicks} clicks
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">GEO &amp; LLMO citation tracking</CardTitle>
          <CardDescription>Whether ChatGPT, Perplexity and Gemini cite this domain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-sm">
            <p className="font-medium">Not yet wired — and no API can provide it.</p>
            <p className="mt-1.5 text-muted-foreground">
              No search API reports citations inside generated answers. Making this real needs a
              scheduled job that prompts each engine with your target questions and records whether
              <span className="font-mono"> ramesttechnolabs.com </span>
              appears in the response. That is a build, not a configuration — so these numbers stay
              blank rather than being invented.
            </p>
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
