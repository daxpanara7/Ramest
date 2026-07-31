"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, RefreshCw, Search } from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useApi, qs } from "@/lib/admin/use-api";
import { formatDateTime, relativeTime } from "@/lib/admin/format";

/**
 * Original stream layout, live over /api/activity.
 *
 * The endpoint filters by exact `action` and `userId` only — it has no free
 * text search — so the box narrows the loaded page client-side while the
 * dropdown performs a real server-side action filter.
 */

type Activity = {
  id: string; action: string;
  entity: string | null; entityId: string | null;
  ip: string | null; createdAt: string;
  user: { id: string; name: string; email: string } | null;
};
type ActivityList = { items: Activity[]; total: number };

const PAGE_SIZE = 50;

export default function ActivityLogsPage() {
  const [q, setQ] = useState("");
  const [action, setAction] = useState("all");
  const [page, setPage] = useState(0);

  useEffect(() => { setPage(0); }, [action]);

  const path = `/activity${qs({
    action: action === "all" ? undefined : action,
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  })}`;

  const { data, loading, error, reload } = useApi<ActivityList>(path);
  // Unfiltered sample, purely to populate the action dropdown.
  const { data: sample } = useApi<ActivityList>("/activity?take=100");

  const actions = useMemo(
    () => Array.from(new Set((sample?.items ?? []).map((a) => a.action))).sort(),
    [sample],
  );

  const rows = useMemo(() => {
    const items = data?.items ?? [];
    if (!q) return items;
    const needle = q.toLowerCase();
    return items.filter((l) =>
      `${l.user?.name ?? "system"} ${l.action} ${l.entity ?? ""} ${l.ip ?? ""}`
        .toLowerCase()
        .includes(needle),
    );
  }, [data, q]);

  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Section>
      <PageHeader
        title="Activity Logs"
        description="A stream of user and system events."
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

      <Card className="p-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events…" className="h-9 pl-8" />
          </div>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="h-9 w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              {actions.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground sm:ml-auto">
            {loading ? "Loading…" : `${total} event${total === 1 ? "" : "s"}`}
          </p>
        </div>
      </Card>

      <Card className="p-0">
        {loading && rows.length === 0 ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : rows.length === 0 ? (
          <p className="py-14 text-center text-sm text-muted-foreground">
            {q || action !== "all" ? "No events match these filters." : "No activity recorded yet."}
          </p>
        ) : (
          <ol className="divide-y divide-border/60">
            {rows.map((l) => (
              <li key={l.id} className="flex items-start gap-3 p-4">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{l.user?.name ?? "System"}</span>{" "}
                    <span className="text-muted-foreground">{l.action}</span>{" "}
                    {l.entity && <span className="font-medium">{l.entity}</span>}
                  </p>
                  <p className="text-[11px] text-muted-foreground" title={formatDateTime(l.createdAt)}>
                    {relativeTime(l.createdAt)}
                    {l.ip ? ` · ${l.ip}` : ""}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-border/60 px-4 py-2.5 text-xs text-muted-foreground">
            <span>Page {page + 1} of {pages}</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs"
                disabled={page === 0 || loading} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" className="h-7 px-2 text-xs"
                disabled={page >= pages - 1 || loading} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>
    </Section>
  );
}
