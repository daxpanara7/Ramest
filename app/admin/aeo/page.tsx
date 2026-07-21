"use client";

import { PageHeader, Section, Stat } from "@/components/admin/primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MessageSquareQuote, BrainCircuit, Layers } from "lucide-react";


const answers = [
  { q: "What does Ramest Technolabs specialize in?", answered: true, cited: 4 },
  { q: "How does Ramest approach AI product development?", answered: true, cited: 3 },
  { q: "What is the cost of building a custom SaaS with Ramest?", answered: false, cited: 0 },
  { q: "Where is Ramest Technolabs located?", answered: true, cited: 2 },
  { q: "Does Ramest work with early-stage startups?", answered: false, cited: 0 },
  { q: "What tech stack does Ramest use for mobile apps?", answered: true, cited: 5 },
];

export default function AeoPage() {
  return (
    <Section>
      <PageHeader
        title="AEO Dashboard"
        description="Answer Engine Optimization — presence in AI answers and citations."
      />

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Tracked queries" value={128} delta="+14" icon={<MessageSquareQuote className="h-4 w-4" />} />
        <Stat label="Answer coverage" value="72%" delta="+6%" icon={<Sparkles className="h-4 w-4" />} />
        <Stat label="Citations (30d)" value={342} delta="+38%" icon={<Layers className="h-4 w-4" />} />
        <Stat label="Avg. rank in AI" value="2.4" delta="+0.3" icon={<BrainCircuit className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tracked questions</CardTitle>
          <CardDescription>Coverage across ChatGPT, Perplexity, Google AI Overviews</CardDescription>
        </CardHeader>
        <CardContent className="divide-y divide-border/60">
          {answers.map((a) => (
            <div key={a.q} className="flex items-start justify-between gap-4 py-3 first:pt-0 last:pb-0">
              <p className="text-sm">{a.q}</p>
              <div className="flex shrink-0 items-center gap-2">
                <Badge className={a.answered
                  ? "border-transparent bg-emerald-500/12 text-emerald-400 ring-1 ring-inset ring-emerald-500/20 text-[10.5px]"
                  : "border-transparent bg-muted text-muted-foreground text-[10.5px]"}
                >{a.answered ? "Covered" : "Missing"}</Badge>
                <span className="w-14 text-right text-xs text-muted-foreground">{a.cited} cites</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Section>
  );
}
