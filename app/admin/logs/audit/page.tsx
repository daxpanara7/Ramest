"use client";

import { PageHeader, Section } from "@/components/admin/primitives";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";


const audit = [
  { at: "2026-07-21 09:12 UTC", actor: "ravi@ramesttechnolabs.com", event: "role.update", target: "yash → viewer", ip: "203.0.113.14", severity: "info" },
  { at: "2026-07-21 08:44 UTC", actor: "priya@ramesttechnolabs.com", event: "blog.publish", target: "post_a12", ip: "198.51.100.32", severity: "info" },
  { at: "2026-07-21 06:02 UTC", actor: "system", event: "auth.rate_limit", target: "5 failed logins for aarav", ip: "45.9.148.11", severity: "warn" },
  { at: "2026-07-20 22:37 UTC", actor: "ravi@ramesttechnolabs.com", event: "api_key.create", target: "CI / GitHub Actions", ip: "203.0.113.14", severity: "info" },
  { at: "2026-07-20 20:11 UTC", actor: "anaya@ramesttechnolabs.com", event: "user.suspend", target: "self-suspended", ip: "192.0.2.99", severity: "warn" },
  { at: "2026-07-20 17:04 UTC", actor: "system", event: "backup.completed", target: "db_full_20260720", ip: "internal", severity: "info" },
];

export default function AuditLogsPage() {
  return (
    <Section>
      <PageHeader title="Audit Logs" description="Immutable record of security-relevant events." />
      <Card className="overflow-hidden p-0">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead>Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audit.map((r, i) => (
              <TableRow key={i}>
                <TableCell className="font-mono text-xs text-muted-foreground">{r.at}</TableCell>
                <TableCell>{r.actor}</TableCell>
                <TableCell><code className="rounded bg-muted/60 px-1.5 py-0.5 text-xs">{r.event}</code></TableCell>
                <TableCell className="text-muted-foreground">{r.target}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{r.ip}</TableCell>
                <TableCell>
                  <Badge className={r.severity === "warn"
                    ? "border-transparent bg-amber-500/12 text-amber-400 ring-1 ring-inset ring-amber-500/20 text-[10.5px]"
                    : "border-transparent bg-muted text-muted-foreground text-[10.5px]"}
                  >{r.severity}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Section>
  );
}
