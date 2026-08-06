"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Download, Search, Briefcase, UserCheck, Star, XCircle,
  AlertCircle, RefreshCw, Trash2, Loader2, FileText, Paperclip, ExternalLink,
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
import { applicationStatusBadge } from "@/components/admin/badges";
import { api, ApiError, API_BASE, getAccessToken } from "@/lib/admin/api";
import { openAttachment } from "@/lib/admin/attachment";
import { useApi, qs } from "@/lib/admin/use-api";
import { formatDateTime, relativeTime } from "@/lib/admin/format";
import { useConfirm } from "@/components/admin/use-confirm";

/**
 * Job applications from the public careers form.
 *
 * Same shape as the Contact Leads console — filtering and paging run on the
 * SERVER (the endpoint caps `take` at 100), search is debounced, and the row
 * sheet is where status, notes and the resume live.
 */

type Application = {
  id: string;
  fullName: string; email: string; phone: string;
  totalExperience: string; position: string;
  coverNote: string | null;
  status: string; adminNotes: string | null;
  resumeName: string | null; resumeMime: string | null; resumeBytes: number | null;
  ip: string | null; country: string | null;
  recaptchaScore: number | null;
  createdAt: string; updatedAt: string;
};

type ApplicationList = { items: Application[]; total: number };
type HistoryEntry = {
  id: string;
  action: string;
  createdAt: string;
  metadata: { statusFrom?: string; statusTo?: string } | null;
  user: { name: string } | null;
};
type ApplicationStats = {
  byStatus: Record<string, number>;
  total: number;
  positions: string[];
};

const STATUSES = [
  "NEW", "REVIEWING", "SHORTLISTED", "INTERVIEWING",
  "OFFERED", "HIRED", "REJECTED", "SPAM",
];
const PAGE_SIZE = 25;
const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

/** Never rounds down to "0 KB" — a tiny file reads as a broken upload. */
const formatBytes = (bytes: number | null) =>
  bytes === null ? "—"
    : bytes < 1024 ? `${bytes} B`
    : bytes < 1024 * 1024 ? `${Math.round(bytes / 1024)} KB`
    : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function ApplicationsPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [status, setStatus] = useState("all");
  const [position, setPosition] = useState("all");
  const [page, setPage] = useState(0);
  const [active, setActive] = useState<Application | null>(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(q); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const path = `/applications${qs({
    search: debouncedQ || undefined,
    status: status === "all" ? undefined : status,
    position: position === "all" ? undefined : position,
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  })}`;

  const { data, loading, error, reload } = useApi<ApplicationList>(path);
  const { data: stats, reload: reloadStats } = useApi<ApplicationStats>("/applications/stats");

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const refreshAll = () => { void reload(); void reloadStats(); };

  return (
    <Section>
      <PageHeader
        title="Job Applications"
        description="Candidates who applied through the careers page, with their resumes."
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
        <Stat label="Total applications" value={stats?.total ?? 0} icon={<Briefcase className="h-4 w-4" />} />
        <Stat label="Shortlisted" value={stats?.byStatus?.SHORTLISTED ?? 0} icon={<Star className="h-4 w-4" />} />
        <Stat label="Interviewing" value={stats?.byStatus?.INTERVIEWING ?? 0} icon={<UserCheck className="h-4 w-4" />} />
        <Stat label="Rejected" value={stats?.byStatus?.REJECTED ?? 0} icon={<XCircle className="h-4 w-4" />} />
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-border/60 p-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email or role…" className="h-9 pl-8" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
              <SelectTrigger className="h-9 w-[150px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>{title(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={position} onValueChange={(v) => { setPosition(v); setPage(0); }}>
              <SelectTrigger className="h-9 w-[220px]"><SelectValue placeholder="All positions" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All positions</SelectItem>
                {(stats?.positions ?? []).map((p) => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground md:ml-auto">
            {loading ? "Loading…" : `${total} application${total === 1 ? "" : "s"}`}
          </p>
        </div>

        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead>Candidate</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead className="text-right">Applied</TableHead>
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
                  {debouncedQ || status !== "all" || position !== "all"
                    ? "No applications match these filters."
                    : "No applications yet. Submissions from the careers page appear here."}
                </TableCell>
              </TableRow>
            ) : rows.map((a) => (
              <TableRow key={a.id} className="cursor-pointer" onClick={() => setActive(a)}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/15 text-[10px] text-primary">
                        {a.fullName.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{a.fullName}</div>
                      <div className="truncate text-xs text-muted-foreground">{a.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="max-w-[240px]">
                  <span className="line-clamp-2">{a.position}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[10.5px]">{a.totalExperience}</Badge>
                </TableCell>
                <TableCell>{applicationStatusBadge(a.status)}</TableCell>
                <TableCell>
                  {a.resumeName ? (
                    <ResumeRowLink id={a.id} filename={a.resumeName} />
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell className="text-right text-muted-foreground" title={formatDateTime(a.createdAt)}>
                  {relativeTime(a.createdAt)}
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

      <ApplicationSheet
        application={active}
        onClose={() => setActive(null)}
        onSaved={() => { refreshAll(); setActive(null); }}
      />
    </Section>
  );
}

function ApplicationSheet({
  application, onClose, onSaved,
}: { application: Application | null; onClose: () => void; onSaved: () => void }) {
  const confirm = useConfirm();
  const [status, setStatus] = useState("NEW");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!application) return;
    setStatus(application.status);
    setNotes(application.adminNotes ?? "");
    setErr(null);
  }, [application]);

  const dirty = useMemo(
    () => !!application &&
      (status !== application.status || notes !== (application.adminNotes ?? "")),
    [application, status, notes],
  );

  const patch = async (body: Record<string, string>) => {
    if (!application) return;
    setSaving(true); setErr(null);
    try {
      await api(`/applications/${application.id}`, { method: "PATCH", body });
      onSaved();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not save.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!application) return;
    const yes = await confirm({
      title: `Delete ${application.fullName}'s application?`,
      description: "This also removes the stored resume from the server. It cannot be undone.",
    });
    if (!yes) return;
    setDeleting(true); setErr(null);
    try {
      await api(`/applications/${application.id}`, { method: "DELETE" });
      onSaved();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not delete.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Sheet open={!!application} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg">
        {application && (
          <>
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">{application.fullName}</SheetTitle>
              <SheetDescription>
                Applied for {application.position} ·{" "}
                <a href={`mailto:${application.email}`} className="underline underline-offset-2">
                  {application.email}
                </a>
              </SheetDescription>
            </SheetHeader>

            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <Detail label="Mobile" value={application.phone} />
                <Detail label="Experience" value={application.totalExperience} />
                <Detail label="Status" value={title(application.status)} />
                <Detail label="Applied" value={formatDateTime(application.createdAt)} />
                <Detail label="Country" value={application.country ?? "—"} />
                <Detail
                  label="reCAPTCHA"
                  value={application.recaptchaScore === null ? "not verified" : application.recaptchaScore.toFixed(2)}
                />
              </div>

              <Separator />

              <div>
                <h4 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Resume</h4>
                {application.resumeName ? (
                  <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 p-3">
                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium" title={application.resumeName}>
                        {application.resumeName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatBytes(application.resumeBytes)}
                      </p>
                    </div>
                    <ResumeButton id={application.id} filename={application.resumeName} />
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No resume was attached.</p>
                )}
              </div>

              {application.coverNote && (
                <>
                  <Separator />
                  <div>
                    <h4 className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Note</h4>
                    <p className="whitespace-pre-wrap rounded-lg bg-muted/40 p-3 text-sm leading-relaxed">
                      {application.coverNote}
                    </p>
                  </div>
                </>
              )}

              <Separator />

              <StatusHistory id={application.id} />

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
                  placeholder="Interview feedback, screening notes…"
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
                      onClick={() => patch({ status: "SHORTLISTED", adminNotes: notes })}
                      disabled={saving || deleting || application.status === "SHORTLISTED"}>
                      Shortlist
                    </Button>
                    <Button size="sm" onClick={() => patch({ status, adminNotes: notes })}
                      disabled={!dirty || saving || deleting}>
                      {saving && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                      Save
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

/**
 * Every status this application has been through, and who moved it.
 *
 * Read from the audit trail rather than a status column's history, so the
 * record cannot disagree with what actually happened: a candidate always
 * enters as "New" (the form has no way to submit anything else), and every
 * step after that is an admin action with a name and a timestamp against it.
 */
function StatusHistory({ id }: { id: string }) {
  const { data, loading } = useApi<HistoryEntry[]>(`/applications/${id}/history`);
  const entries = data ?? [];

  return (
    <div>
      <h4 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
        Status history
      </h4>
      {loading && entries.length === 0 ? (
        <Skeleton className="h-16 w-full" />
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recorded changes yet.</p>
      ) : (
        <ol className="relative space-y-4 border-l border-border/70 pl-4">
          {entries.map((e) => {
            const created = e.action === "application.created";
            const from = e.metadata?.statusFrom;
            const to = e.metadata?.statusTo;
            const moved = from && to && from !== to;
            return (
              <li key={e.id} className="relative">
                <span
                  className={`absolute -left-[21px] top-1.5 h-2 w-2 rounded-full ${
                    created ? "bg-primary" : moved ? "bg-amber-500" : "bg-muted-foreground/40"
                  }`}
                />
                <p className="text-sm">
                  {created ? (
                    <>Applied through the careers page — status <strong>New</strong></>
                  ) : moved ? (
                    <>Status changed {title(from)} → <strong>{title(to!)}</strong></>
                  ) : (
                    "Notes updated"
                  )}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {formatDateTime(e.createdAt)}
                  {e.user?.name ? ` · ${e.user.name}` : created ? " · candidate" : ""}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

/**
 * The "Attached" cell in a listing row: opens the resume in a new tab.
 *
 * stopPropagation because the row itself opens the detail sheet — without it,
 * one click would do both.
 */
function ResumeRowLink({ id, filename }: { id: string; filename: string }) {
  const [busy, setBusy] = useState(false);

  const onClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setBusy(true);
    const ok = await openAttachment(`/applications/${id}/resume`, filename);
    setBusy(false);
    if (!ok) alert("Could not open the resume. The file may no longer be on the server.");
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      title={`Open ${filename} in a new tab`}
      className="inline-flex items-center gap-1.5 rounded text-xs text-muted-foreground transition-colors hover:text-primary hover:underline disabled:opacity-50"
    >
      {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <Paperclip className="h-3 w-3" />}
      Attached
    </button>
  );
}

/** The View button inside the detail sheet. */
function ResumeButton({ id, filename }: { id: string; filename: string }) {
  const [busy, setBusy] = useState(false);

  const open = async () => {
    setBusy(true);
    const ok = await openAttachment(`/applications/${id}/resume`, filename);
    setBusy(false);
    if (!ok) alert("Could not open the resume. The file may no longer be on the server.");
  };

  return (
    <Button variant="outline" size="sm" className="h-8 shrink-0" onClick={open} disabled={busy}>
      {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <ExternalLink className="mr-1.5 h-3.5 w-3.5" />}
      View
    </Button>
  );
}

/** Same Bearer-header reason as ResumeButton. */
function ExportButton({ status }: { status: string }) {
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      const res = await fetch(
        `${API_BASE}/applications/export${status === "all" ? "" : `?status=${status}`}`,
        { headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` }, credentials: "include" },
      );
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "applications.csv"; a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Could not export applications. Please try again.");
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
