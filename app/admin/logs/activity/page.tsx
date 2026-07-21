"use client";

import { PageHeader, Section } from "@/components/admin/primitives";
import { Card } from "@/components/ui/card";
import { activityLogs } from "@/lib/mock-data";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";


export default function ActivityLogsPage() {
  const [q, setQ] = useState("");
  const rows = activityLogs.filter((l) => !q || (l.user + l.action + l.target).toLowerCase().includes(q.toLowerCase()));
  return (
    <Section>
      <PageHeader title="Activity Logs" description="A stream of user and system events." />
      <Card className="p-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="h-9 pl-8" />
        </div>
      </Card>
      <Card className="p-0">
        <ol className="divide-y divide-border/60">
          {rows.map((l) => (
            <li key={l.id} className="flex items-start gap-3 p-4">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
              <div className="min-w-0 flex-1">
                <p className="text-sm">
                  <span className="font-medium">{l.user}</span>{" "}
                  <span className="text-muted-foreground">{l.action}</span>{" "}
                  <span className="font-medium">{l.target}</span>
                </p>
                <p className="text-[11px] text-muted-foreground">{l.at}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </Section>
  );
}
