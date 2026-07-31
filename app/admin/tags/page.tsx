"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2, Plus, RefreshCw, X } from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { api, ApiError } from "@/lib/admin/api";
import { useApi } from "@/lib/admin/use-api";

/**
 * Original layout — one card, a search box, and #chips — now live over
 * /api/blog/tags.
 *
 * Create and delete only; the API exposes no update, because renaming a tag
 * changes its slug and would break any published URL pointing at it.
 *
 * Filtering is client-side here, unlike Leads/Newsletter: this endpoint
 * returns the full list unpaginated, so there is no first-page trap.
 */

type Tag = { id: string; name: string; slug: string; createdAt: string };

export default function TagsPage() {
  const { data, loading, error, reload } = useApi<Tag[]>("/blog/tags");
  const [q, setQ] = useState("");
  const [creating, setCreating] = useState(false);

  const tags = data ?? [];
  const shown = useMemo(
    () => tags.filter((t) => !q || t.name.toLowerCase().includes(q.toLowerCase()) || t.slug.includes(q.toLowerCase())),
    [tags, q],
  );

  return (
    <Section>
      <PageHeader
        title="Tags"
        description="Fine-grained topics used across content."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New tag
            </Button>
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

      <Card>
        <CardContent className="space-y-4 p-5">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search tags…"
            className="h-9 max-w-sm"
          />

          {loading && tags.length === 0 ? (
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 14 }).map((_, i) => <Skeleton key={i} className="h-7 w-24 rounded-full" />)}
            </div>
          ) : shown.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {q ? "No tags match that search." : "No tags yet — create one to get started."}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {shown.map((t) => <TagChip key={t.id} tag={t} onDeleted={reload} />)}
              </div>
              <p className="text-xs text-muted-foreground">
                {shown.length} of {tags.length} tag{tags.length === 1 ? "" : "s"}
              </p>
            </>
          )}
        </CardContent>
      </Card>

      <TagDialog
        open={creating}
        onClose={() => setCreating(false)}
        onSaved={() => { setCreating(false); reload(); }}
      />
    </Section>
  );
}

function TagChip({ tag, onDeleted }: { tag: Tag; onDeleted: () => void }) {
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!confirm(`Delete the tag "${tag.name}"? It will be removed from any posts using it.`)) return;
    setBusy(true);
    try {
      await api(`/blog/tags/${tag.id}`, { method: "DELETE" });
      onDeleted();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not delete tag.");
      setBusy(false);
    }
  };

  return (
    <Badge variant="outline" className="group gap-1 rounded-full px-3 py-1 text-xs">
      #{tag.slug}
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        aria-label={`Remove ${tag.name}`}
        className="ml-0.5 rounded-full opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 hover:text-destructive"
      >
        {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <X className="h-3 w-3" />}
      </button>
    </Badge>
  );
}

function TagDialog({
  open, onClose, onSaved,
}: { open: boolean; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (open) { setName(""); setErr(null); }
  }, [open]);

  const submit = async () => {
    if (!name.trim()) { setErr("Name is required."); return; }
    setBusy(true); setErr(null);
    try {
      await api("/blog/tags", { method: "POST", body: { name: name.trim() } });
      onSaved();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not create tag.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New tag</DialogTitle>
          <DialogDescription>The slug is derived from the name by the server.</DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); void submit(); }} className="space-y-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Next.js"
            maxLength={60}
            autoFocus
          />
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        </form>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button size="sm" onClick={submit} disabled={busy || !name.trim()}>
            {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
