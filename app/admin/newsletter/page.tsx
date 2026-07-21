"use client";

import { PageHeader, Section, Stat } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Search, Mail, UserPlus, UserMinus, TrendingUp } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { subscribers } from "@/lib/mock-data";
import { useState, useMemo } from "react";


export default function NewsletterPage() {
  const [q, setQ] = useState("");
  const rows = useMemo(() =>
    subscribers.filter((s) => !q || s.email.toLowerCase().includes(q.toLowerCase())),
    [q]
  );

  return (
    <Section>
      <PageHeader
        title="Newsletter"
        description="Subscribers, campaigns and growth."
        actions={
          <>
            <Button variant="outline" size="sm"><Upload className="mr-1.5 h-3.5 w-3.5" /> Import</Button>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export</Button>
            <Button size="sm">New campaign</Button>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Subscribers" value="5,820" delta="+2.1%" icon={<Mail className="h-4 w-4" />} />
        <Stat label="New this week" value="128" delta="+12.4%" icon={<UserPlus className="h-4 w-4" />} />
        <Stat label="Unsubscribed" value="19" delta="-0.3%" icon={<UserMinus className="h-4 w-4" />} />
        <Stat label="Avg. open rate" value="42.6%" delta="+1.4%" icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b border-border/60 p-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email…" className="h-9 pl-8" />
          </div>
        </div>
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead>Email</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.email}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10.5px]">{s.source}</Badge></TableCell>
                <TableCell>
                  <Badge className={s.status === "Active"
                    ? "border-transparent bg-emerald-500/12 text-emerald-400 ring-1 ring-inset ring-emerald-500/20"
                    : "border-transparent bg-muted text-muted-foreground"}
                  >{s.status}</Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">{s.joined}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Section>
  );
}
