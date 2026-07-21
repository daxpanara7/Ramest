"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Plus } from "lucide-react";


const keys = [
  { name: "Production", key: "sk_live_9f3a…8b21", created: "Jan 12, 2026", lastUsed: "2 min ago" },
  { name: "Staging", key: "sk_test_1d2f…7c40", created: "Nov 3, 2025", lastUsed: "1d ago" },
  { name: "CI / GitHub Actions", key: "sk_ci_44aa…1090", created: "Oct 22, 2025", lastUsed: "3h ago" },
];

export default function ApiSettings() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div>
        <h3 className="font-display text-lg">API keys</h3>
        <p className="text-sm text-muted-foreground">Tokens for programmatic access to the admin API.</p>
      </div>
      <div className="space-y-3 lg:col-span-2">
        <div className="flex justify-end">
          <Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New key</Button>
        </div>
        {keys.map((k) => (
          <Card key={k.name}>
            <CardContent className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{k.name}</p>
                  <Badge variant="outline" className="text-[10.5px]">Live</Badge>
                </div>
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">{k.key}</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Created {k.created}</span>
                <span>Last used {k.lastUsed}</span>
                <Button variant="ghost" size="icon" className="h-7 w-7"><Copy className="h-3.5 w-3.5" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
