"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download, Filter, Search, Users2, PhoneCall, CheckCircle2, XCircle,
  AlertCircle, RefreshCw, Trash2, Loader2,
} from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { apiLeadStatusBadge } from "@/components/admin/badges";
import { api, ApiError, API_BASE, getAccessToken } from "@/lib/admin/api";
import { useApi, qs } from "@/lib/admin/use-api";
import { formatDateTime, relativeTime } from "@/lib/admin/format";

/**
 * Layout matches the original design. Data is now live from /api/leads.
 *
 * Filtering and paging run on the SERVER: the endpoint caps `take` at 100, so
 * filtering a client-side array would silently only ever search the first
 * page. Search is debounced so each keystroke is not a request.
 */

type Lead = {
  id: string; name: string; email: string;
  phone: string | null; company: string | null; service: string | null;
  message: string; status: string; adminNotes: string | null;
  ip: string | null; country: string | null;
  recaptchaScore: number | null;
  createdAt: string; updatedAt: string;
};

type LeadList = { items: Lead[]; total: number };
type LeadStats = Record<string, number>;

const STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "WON", "LOST", "SPAM"];
const PAGE_SIZE = 25;
const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export default function LeadsPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const [active, setActive] = useState<Lead | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(q); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const path = `/leads${qs({
    search: debouncedQ || undefined,
    status: status === "all" ? undefined : status,
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  })}`;

  const { data, loading, error, reload } = useApi<LeadList>(path);
  const { data: stats, reload: reloadStats } = useApi<LeadStats>("/leads/stats");

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const refreshAll = () => { void reload(); void reloadStats(); };

  return (
    <Section>
      <PageHeader
        title="Contact Leads"
        description="Inbound inquiries from your website and campaigns."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={refreshAll} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <ExportButton status={status} />
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
        <Stat label="Total leads" value={Object.values(stats ?? {}).reduce((a, b) => a + b, 0)} icon={<Users2 className="h-4 w-4" />} />
        <Stat label="Contacted" value={stats?.CONTACTED ?? 0} icon={<PhoneCall className="h-4 w-4" />} />
        <Stat label="Won" value={stats?.WON ?? 0} icon={<CheckCircle2 className="h-4 w-4" />} />
        <Stat label="Lost" value={stats?.LOST ?? 0} icon={<XCircle className="h-4 w-4" />} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-border/60 p-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search leads…" className="h-9 pl-8" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
              <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{title(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" disabled title="Assignee and date-range filters are not in the API yet">
              <Filter className="mr-1.5 h-3.5 w-3.5" /> More filters
            </Button>
          </div>
          <p className="text-xs text-muted-foreground md:ml-auto">
            {loading ? "Loading…" : `${total} lead${total === 1 ? "" : "s"}`}
          </p>
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
            {loading && rows.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-9 w-full" /></TableCell></TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="py-12 text-center text-sm text-muted-foreground">
                  {debouncedQ || status !== "all"
                    ? "No leads match these filters."
                    : "No leads yet. Submissions from the site contact form appear here."}
                </TableCell>
              </TableRow>
            ) : rows.map((l) => (
              <TableRow key={l.id} className="cursor-pointer" onClick={() => setActive(l)}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/15 text-[10px] text-primary">
                        {l.name.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{l.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{l.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{l.company ?? "—"}</TableCell>
                <TableCell>
                  {l.service
                    ? <Badge variant="outline" className="text-[10.5px]">{l.service}</Badge>
                    : <span className="text-muted-foreground">—</span>}
                </TableCell>
                <TableCell>{apiLeadStatusBadge(l.status)}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{l.phone ?? "—"}</TableCell>
                <TableCell className="text-right text-muted-foreground" title={formatDateTime(l.createdAt)}>
                  {relativeTime(l.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pages > 1 && (
          <div className="flex items-center justify-between border-t border-border/60 px-3 py-2.5 text-xs">
            <span className="text-muted-foreground">Page {page + 1} of {pages}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-7" disabled={page === 0 || loading}
                onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" className="h-7" disabled={page >= pages - 1 || loading}
                onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>

      <LeadSheet
        lead={active}
        onClose={() => setActive(null)}
        onSaved={() => { refreshAll(); setActive(null); }}
      />
    </Section>
  );
}

function LeadSheet({
  lead, onClose, onSaved,
}: { lead: Lead | null; onClose: () => void; onSaved: () => void }) {
  const [status, setStatus] = useState("NEW");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!lead) return;
    setStatus(lead.status);
    setNotes(lead.adminNotes ?? "");
    setErr(null);
  }, [lead]);

  const dirty = useMemo(
    () => !!lead && (status !== lead.status || notes !== (lead.adminNotes ?? "")),
    [lead, status, notes],
  );

  const patch = async (body: Record<string, string>) => {
    if (!lead) return;
    setSaving(true); setErr(null);
    try {
      await api(`/leads/${lead.id}`, { method: "PATCH", body });
      onSaved();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!lead || !confirm(`Delete the lead from ${lead.name}? This cannot be undone.`)) return;
    setDeleting(true); setErr(null);
    try {
      await api(`/leads/${lead.id}`, { method: "DELETE" });
      onSaved();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not delete.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Sheet open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        {lead && (
          <>
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">{lead.name}</SheetTitle>
              <SheetDescription>
                {lead.company ? `${lead.company} · ` : ""}
                <a href={`mailto:${lead.email}`} className="underline underline-offset-2">{lead.email}</a>
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Detail label="Phone" value={lead.phone ?? "—"} />
                <Detail label="Service" value={lead.service ?? "—"} />
                <Detail label="Status" value={title(lead.status)} />
                <Detail label="Created" value={formatDateTime(lead.createdAt)} />
                <Detail label="Country" value={lead.country ?? "—"} />
                <Detail
                  label="reCAPTCHA"
                  value={lead.recaptchaScore === null ? "not verified" : lead.recaptchaScore.toFixed(2)}
                />
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Message</h4>
                <p className="whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-sm leading-relaxed">
                  {lead.message}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">Timeline</h4>
                <ol className="relative space-y-4 border-l border-border/70 pl-4">
                  {/* Real events only — the API records createdAt/updatedAt.
                      Per-event history needs an audit trail scoped to leads. */}
                  <li className="relative">
                    <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary" />
                    <p className="text-sm">Lead created from contact form</p>
                    <p className="text-[11px] text-muted-foreground">{formatDateTime(lead.createdAt)}</p>
                  </li>
                  {lead.updatedAt !== lead.createdAt && (
                    <li className="relative">
                      <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-primary" />
                      <p className="text-sm">Last updated by the team</p>
                      <p className="text-[11px] text-muted-foreground">{formatDateTime(lead.updatedAt)}</p>
                    </li>
                  )}
                  <li className="relative">
                    <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-muted-foreground/40" />
                    <p className="text-sm text-muted-foreground">Current status: {title(lead.status)}</p>
                    <p className="text-[11px] text-muted-foreground">{relativeTime(lead.updatedAt)}</p>
                  </li>
                </ol>
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Status</h4>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => <SelectItem key={s} value={s}>{title(s)}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Notes</h4>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add a private note about this lead…"
                  rows={4}
                />
                {err && <p role="alert" className="mt-2 text-sm text-destructive">{err}</p>}
                <div className="mt-3 flex items-center justify-between gap-2">
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"
                    onClick={remove} disabled={deleting || saving}>
                    {deleting ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Trash2 className="mr-1.5 h-3.5 w-3.5" />}
                    Delete
                  </Button>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline"
                      onClick={() => patch({ status: "CONTACTED", adminNotes: notes })}
                      disabled={saving || deleting || lead.status === "CONTACTED"}>
                      Mark Contacted
                    </Button>
                    <Button size="sm" onClick={() => patch({ status, adminNotes: notes })}
                      disabled={!dirty || saving || deleting}>
                      {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                      Save note
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/** Uses fetch + blob, not <a href>, because the endpoint needs the Bearer header. */
function ExportButton({ status }: { status: string }) {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const res = await fetch(
        `${API_BASE}/leads/export${status === "all" ? "" : `?status=${status}`}`,
        { headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` }, credentials: "include" },
      );
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "leads.csv"; a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Could not export leads. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={download} disabled={busy}>
      {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Download className="mr-1.5 h-3.5 w-3.5" />}
      Export CSV
    </Button>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate font-medium" title={value}>{value}</p>
    </div>
  );
}
