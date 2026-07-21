"use client";

import { PageHeader, Section, Stat } from "@/components/admin/primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe2, MapPin, TrendingUp, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";


const regions = [
  { name: "India", visits: 48200, share: 42, delta: "+8.4%" },
  { name: "United States", visits: 21400, share: 19, delta: "+3.1%" },
  { name: "United Kingdom", visits: 9800, share: 8.5, delta: "+1.6%" },
  { name: "UAE", visits: 8100, share: 7, delta: "+12.2%" },
  { name: "Germany", visits: 6900, share: 6, delta: "+0.8%" },
  { name: "Singapore", visits: 5400, share: 4.7, delta: "+4.5%" },
];

export default function GeoPage() {
  return (
    <Section>
      <PageHeader title="GEO Dashboard" description="Geographic reach and localized SEO performance." />

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Countries reached" value={64} delta="+3" icon={<Globe2 className="h-4 w-4" />} />
        <Stat label="Top region" value="India" icon={<MapPin className="h-4 w-4" />} />
        <Stat label="Localized pages" value={38} delta="+6" icon={<Building2 className="h-4 w-4" />} />
        <Stat label="Regional growth" value="+14.2%" delta="+2.1%" icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top regions</CardTitle>
          <CardDescription>By visits, last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {regions.map((r) => (
            <div key={r.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{r.name}</span>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="tabular-nums">{r.visits.toLocaleString()}</span>
                  <Badge variant="secondary" className="text-[10px]">{r.delta}</Badge>
                </div>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${r.share * 2}%` }} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </Section>
  );
}
