"use client";

import { useState } from "react";
import { AlertCircle, RefreshCw, Search } from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { useApi, qs } from "@/lib/admin/use-api";
import { formatDateTime, relativeTime } from "@/lib/admin/format";

/**
 * Security-relevant slice of the same ActivityLog the Activity page reads.
 *
 * "Audit" here means the write actions worth reviewing after the fact —
 * auth, permissions, users, deletions — as opposed to routine content edits.
 * Severity is derived from the action name rather than stored, because the
 * log records what happened, not how alarming it is.
 */

type Entry = {
  id: string; action: string; entity: string | null; entityId: string | null;
  ip: string | null; createdAt: string;
  user: { name: string; email: string } | null;
};
type EntryList = { items: Entry[]; total: number };

const PAGE_SIZE = 25;

/** Actions that belong in a security review. */
const AUDIT_PREFIXES = [
  "auth.", "user.", "role.", "permission.", "setting.", "media.delete",
  "post.delete", "lead.delete", "category.delete", "tag.delete",
];

const isAudit = (action: string) =>
  AUDIT_PREFIXES.some((p) => action.startsWith(p) || action === p);

function severityOf(action: string): "info" | "warn" {
  // Anything that removes access or data, or a failed auth, is worth flagging.
  if (/delete|suspend|revoke|fail|lock/.test(action)) return "warn";
  return "info";
}

export default function AuditLogsPage() {
  const [page, setPage] = useState(0);
  const [q, setQ] = useState("");

  // Fetch a wide window and filter client-side: the API has no "security
  // actions only" filter, and the log is small enough that one page of 100
  // covers far more than 25 audit rows.
  const { data, loading, error, reload } = useApi<EntryList>(
    `/activity${qs({ skip: page * 100, take: 100 })}`,
  );

  const all = (data?.items ?? []).filter((e) => isAudit(e.action));
  const rows = all.filter(
    (e) =>
      !q ||
      e.action.toLowerCase().includes(q.toLowerCase()) ||
      (e.user?.email ?? "").toLowerCase().includes(q.toLowerCase()) ||
      (e.entity ?? "").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Section>
      <PageHeader
        title="Audit Logs"
        description="Security-relevant events — authentication, permissions, and deletions."
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

      <Card className="overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b border-border/60 p-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="h-9 pl-8" />
          </div>
          <p className="ml-auto text-xs text-muted-foreground">
            {loading ? "Loading…" : `${rows.length} security event${rows.length === 1 ? "" : "s"}`}
          </p>
        </div>

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead>Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>IP</TableHead>
              <TableHead className="text-right">Severity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && rows.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-9 w-full" /></TableCell></TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  {q ? "No events match that search." : "No security events recorded yet."}
                </TableCell>
              </TableRow>
            ) : rows.map((e) => {
              const sev = severityOf(e.action);
              return (
                <TableRow key={e.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground" title={formatDateTime(e.createdAt)}>
                    {relativeTime(e.createdAt)}
                  </TableCell>
                  <TableCell className="font-medium">{e.user?.email ?? "system"}</TableCell>
                  <TableCell className="font-mono text-xs">{e.action}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {e.entity ? `${e.entity}${e.entityId ? ` · ${e.entityId.slice(0, 12)}` : ""}` : "—"}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{e.ip ?? "—"}</TableCell>
                  <TableCell className="text-right">
                    <Badge className={sev === "warn"
                      ? "border-transparent bg-amber-500/12 text-amber-600 ring-1 ring-inset ring-amber-500/20 text-[10.5px]"
                      : "border-transparent bg-muted text-muted-foreground text-[10.5px]"}>
                      {sev}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {(data?.total ?? 0) > 100 && (
          <div className="flex items-center justify-between border-t border-border/60 px-3 py-2.5 text-xs text-muted-foreground">
            <span>Scanning {page * 100 + 1}–{page * 100 + 100} of {data?.total}</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs" disabled={page === 0 || loading}
                onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs"
                disabled={(page + 1) * 100 >= (data?.total ?? 0) || loading}
                onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </Section>
  );
}
