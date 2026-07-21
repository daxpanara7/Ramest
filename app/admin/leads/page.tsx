"use client";

import { useMemo, useState } from "react";
import { Download, Filter, Search } from "lucide-react";
import { PageHeader, Section, Stat } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle,
} from "@/components/ui/sheet";
import { leads, type Lead } from "@/lib/mock-data";
import { leadStatusBadge } from "@/components/admin/badges";
import { Users2, PhoneCall, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";


export default function LeadsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [active, setActive] = useState<Lead | null>(null);

  const rows = useMemo(() => leads.filter((l) =>
    (status === "all" || l.status.toLowerCase() === status) &&
    (!q || (l.name + l.company + l.email).toLowerCase().includes(q.toLowerCase()))
  ), [q, status]);

  return (
    <Section>
      <PageHeader
        title="Contact Leads"
        description="Inbound inquiries from your website and campaigns."
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="mr-1.5 h-3.5 w-3.5" /> Export CSV</Button>
            <Button size="sm">Add lead</Button>
          </>
        }
      />

      <div className="grid gap-3 md:grid-cols-4">
        <Stat label="Total leads" value={342} delta="+18.4%" icon={<Users2 className="h-4 w-4" />} />
        <Stat label="Contacted" value={198} delta="+7.2%" icon={<PhoneCall className="h-4 w-4" />} />
        <Stat label="Won" value={54} delta="+22.0%" icon={<CheckCircle2 className="h-4 w-4" />} />
        <Stat label="Lost" value={31} delta="-3.5%" icon={<XCircle className="h-4 w-4" />} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-border/60 p-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads…" className="h-9 pl-8" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {["New", "Contacted", "Qualified", "Won", "Lost"].map((s) => (
                  <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> More filters</Button>
          </div>
        </div>

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead>Contact</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((l) => (
              <TableRow key={l.id} className="cursor-pointer" onClick={() => setActive(l)}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/15 text-[10px] text-primary">
                        {l.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{l.name}</div>
                      <div className="text-xs text-muted-foreground">{l.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{l.company}</TableCell>
                <TableCell><Badge variant="outline" className="text-[10.5px]">{l.service}</Badge></TableCell>
                <TableCell>{leadStatusBadge(l.status)}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{l.phone}</TableCell>
                <TableCell className="text-right text-muted-foreground">{l.createdAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">{active.name}</SheetTitle>
                <SheetDescription>{active.company} · {active.email}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Detail label="Phone" value={active.phone} />
                  <Detail label="Service" value={active.service} />
                  <Detail label="Status" value={active.status} />
                  <Detail label="Created" value={active.createdAt} />
                </div>

                <Separator />

                <div>
                  <h4 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Timeline</h4>
                  <ol className="relative space-y-4 border-l border-border/70 pl-4">
                    {[
                      { t: "Lead created from contact form", at: active.createdAt },
                      { t: "Auto-response email sent", at: "just after" },
                      { t: "Assigned to Aarav Shah", at: "1h later" },
                    ].map((e, i) => (
                      <li key={i} className="relative">
                        <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary" />
                        <p className="text-sm">{e.t}</p>
                        <p className="text-[11px] text-muted-foreground">{e.at}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                <Separator />

                <div>
                  <h4 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Notes</h4>
                  <Textarea placeholder="Add a private note about this lead…" rows={4} />
                  <div className="mt-3 flex justify-end gap-2">
                    <Button size="sm" variant="outline">Mark Contacted</Button>
                    <Button size="sm">Save note</Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </Section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
