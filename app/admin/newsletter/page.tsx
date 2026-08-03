"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle, Download, Loader2, Mail, RefreshCw, Search, Trash2,
  TrendingUp, Upload, UserMinus, UserPlus,
} from "lucide-react";
import { PageHeader, Section, Stat } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { subscriberStatusBadge } from "@/components/admin/badges";
import { api, ApiError, API_BASE, getAccessToken } from "@/lib/admin/api";
import { useApi, qs } from "@/lib/admin/use-api";
import { formatDateTime, relativeTime } from "@/lib/admin/format";
import { useConfirm } from "@/components/admin/use-confirm";

/**
 * Original layout, live data from /api/newsletter/subscribers.
 *
 * "Avg. open rate" is the one tile with no possible source — there is no
 * campaign or open-tracking table in the schema. It keeps its place in the
 * grid rather than being removed; wiring it needs an email-sending provider
 * (Resend already has webhooks for delivered/opened events).
 */

type Subscriber = {
  id: string; email: string; name: string | null;
  status: string; source: string | null;
  verifiedAt: string | null; unsubscribedAt: string | null;
  createdAt: string;
};
type SubscriberList = { items: Subscriber[]; total: number };

const STATUSES = ["PENDING", "ACTIVE", "UNSUBSCRIBED"];
const PAGE_SIZE = 25;
const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export default function NewsletterPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(q); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const path = `/newsletter/subscribers${qs({
    search: debouncedQ || undefined,
    status: status === "all" ? undefined : status,
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  })}`;

  const { data, loading, error, reload } = useApi<SubscriberList>(path);
  const { data: all } = useApi<SubscriberList>("/newsletter/subscribers?take=100");
  const { data: unsub } = useApi<SubscriberList>("/newsletter/subscribers?status=UNSUBSCRIBED&take=1");

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Counted from the first 100 records — the API has no date-range filter, so
  // this is exact until the list outgrows a page.
  const newThisWeek = useMemo(() => {
    const cutoff = Date.now() - 7 * 86_400_000;
    return (all?.items ?? []).filter((s) => new Date(s.createdAt).getTime() >= cutoff).length;
  }, [all]);

  return (
    <Section>
      <PageHeader
        title="Newsletter"
        description="Subscribers, campaigns and growth."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm" disabled title="POST /newsletter/import exists — needs a CSV picker">
              <Upload className="mr-1.5 h-3.5 w-3.5" /> Import
            </Button>
            <ExportButton />
            <Button size="sm" disabled title="Campaign sending is not in the API yet">New campaign</Button>
          </>
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
        <Stat label="Subscribers" value={(all?.total ?? 0).toLocaleString()} icon={<Mail className="h-4 w-4" />} />
        <Stat label="New this week" value={newThisWeek} icon={<UserPlus className="h-4 w-4" />} />
        <Stat label="Unsubscribed" value={unsub?.total ?? 0} icon={<UserMinus className="h-4 w-4" />} />
        <Stat label="Avg. open rate" value="—" icon={<TrendingUp className="h-4 w-4" />} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-border/60 p-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email…" className="h-9 pl-8" />
          </div>
          <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
            <SelectTrigger className="h-9 w-[170px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{title(s)}</SelectItem>)}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground md:ml-auto">
            {loading ? "Loading…" : `${total} subscriber${total === 1 ? "" : "s"}`}
          </p>
        </div>

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead>Email</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && rows.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={5}><Skeleton className="h-9 w-full" /></TableCell></TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                  {debouncedQ || status !== "all" ? "No subscribers match these filters." : "No subscribers yet."}
                </TableCell>
              </TableRow>
            ) : rows.map((s) => <SubscriberRow key={s.id} sub={s} onChanged={reload} />)}
          </TableBody>
        </Table>

        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-border/60 px-3 py-2.5 text-xs text-muted-foreground">
            <span>Showing {rows.length} of {total}</span>
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

function SubscriberRow({ sub, onChanged }: { sub: Subscriber; onChanged: () => void }) {
  const confirm = useConfirm();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const setStatus = async (next: string) => {
    setBusy(true); setErr(null);
    try {
      await api(`/newsletter/subscribers/${sub.id}`, { method: "PATCH", body: { status: next } });
      onChanged();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Update failed");
    } finally { setBusy(false); }
  };

  const remove = async () => {
    const yes = await confirm({
      title: `Remove ${sub.email}?`,
      description: "They will stop receiving the newsletter and be removed from the list.",
      confirmLabel: "Remove",
    });
    if (!yes) return;
    setBusy(true); setErr(null);
    try {
      await api(`/newsletter/subscribers/${sub.id}`, { method: "DELETE" });
      onChanged();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Delete failed");
      setBusy(false);
    }
  };

  return (
    <TableRow>
      <TableCell className="font-medium">
        {sub.email}
        {err && <span className="ml-2 text-xs text-destructive">{err}</span>}
      </TableCell>
      <TableCell>
        {sub.source
          ? <Badge variant="outline" className="text-[10.5px]">{sub.source}</Badge>
          : <span className="text-muted-foreground">—</span>}
      </TableCell>
      <TableCell>{subscriberStatusBadge(sub.status)}</TableCell>
      <TableCell className="text-right text-muted-foreground" title={formatDateTime(sub.createdAt)}>
        {relativeTime(sub.createdAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Select value={sub.status} onValueChange={setStatus} disabled={busy}>
            <SelectTrigger className="h-7 w-[150px] text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => <SelectItem key={s} value={s}>{title(s)}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={remove} disabled={busy} aria-label={`Remove ${sub.email}`}>
            {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

/** exportActiveCsv() takes no params — it always returns ACTIVE subscribers. */
function ExportButton() {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const res = await fetch(`${API_BASE}/newsletter/export`, {
        headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` }, credentials: "include",
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "newsletter-subscribers.csv"; a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Could not export subscribers. Please try again.");
    } finally { setBusy(false); }
  };

  return (
    <Button variant="outline" size="sm" onClick={download} disabled={busy}>
      {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-1.5 h-3.5 w-3.5" />}
      Export
    </Button>
  );
}
