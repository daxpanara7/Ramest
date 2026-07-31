"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { api, ApiError } from "@/lib/admin/api";
import { useApi } from "@/lib/admin/use-api";

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

/**
 * Category CRUD over /api/blog/categories.
 *
 * Slug generation is left to the server, which slugifies the name and
 * enforces uniqueness — a client-side guess would only drift from it. The
 * field is still exposed as an optional override.
 *
 * Post counts are real: the categories endpoint returns no count, so one
 * /blog/posts fetch is tallied client-side by categoryId. One request per
 * card would have been a request storm.
 */

type Category = {
  id: string; name: string; slug: string;
  description: string | null; createdAt: string;
};

export default function CategoriesPage() {
  const { data, loading, error, reload } = useApi<Category[]>("/blog/categories");
  // One fetch, counted client-side — a request per card would be a storm.
  const { data: posts } = useApi<{ items: { categoryId: string | null }[] }>("/blog/posts?take=100");

  const postCount = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of posts?.items ?? []) {
      if (p.categoryId) counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1);
    }
    return (id: string) => counts.get(id) ?? 0;
  }, [posts]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [creating, setCreating] = useState(false);

  const categories = data ?? [];

  return (
    <Section>
      <PageHeader
        title="Categories"
        description="Organize blog content into browsable topics."
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> New category
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

      {loading && categories.length === 0 ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[124px] rounded-xl" />)}
        </div>
      ) : categories.length === 0 ? (
        <Card>
          <CardContent className="py-14 text-center">
            <p className="text-sm text-muted-foreground">No categories yet.</p>
            <Button size="sm" className="mt-4" onClick={() => setCreating(true)}>
              <Plus className="mr-1.5 h-3.5 w-3.5" /> Create the first one
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => (
            <Card key={c.id} className="group transition-colors hover:border-border">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="h-8 w-1 shrink-0 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <div className="min-w-0">
                    <p className="truncate font-medium">{c.name}</p>
                    <p className="truncate text-xs text-muted-foreground">/{c.slug}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="secondary" className="text-[10.5px]">{postCount(c.id)} posts</Badge>
                  <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100"
                    onClick={() => setEditing(c)} aria-label={`Edit ${c.name}`}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <DeleteButton category={c} onDone={reload} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <CategoryDialog
        open={creating}
        category={null}
        onClose={() => setCreating(false)}
        onSaved={() => { setCreating(false); reload(); }}
      />
      <CategoryDialog
        open={!!editing}
        category={editing}
        onClose={() => setEditing(null)}
        onSaved={() => { setEditing(null); reload(); }}
      />
    </Section>
  );
}

function CategoryDialog({
  open, category, onClose, onSaved,
}: { open: boolean; category: Category | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(category?.name ?? "");
    setSlug(category?.slug ?? "");
    setDescription(category?.description ?? "");
    setErr(null);
  }, [open, category]);

  const submit = async () => {
    if (!name.trim()) { setErr("Name is required."); return; }
    setBusy(true); setErr(null);
    try {
      const body: Record<string, string> = { name: name.trim() };
      if (slug.trim()) body.slug = slug.trim();
      if (description.trim()) body.description = description.trim();

      if (category) await api(`/blog/categories/${category.id}`, { method: "PATCH", body });
      else await api("/blog/categories", { method: "POST", body });
      onSaved();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not save.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{category ? "Edit category" : "New category"}</DialogTitle>
          <DialogDescription>
            Leave the slug empty and the server derives it from the name.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Field label="Name">
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Engineering" maxLength={120} />
          </Field>
          <Field label="Slug (optional)">
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="engineering" maxLength={160} className="font-mono text-sm" />
          </Field>
          <Field label="Description (optional)">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={500} />
          </Field>
          {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose} disabled={busy}>Cancel</Button>
          <Button size="sm" onClick={submit} disabled={busy}>
            {busy && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {category ? "Save changes" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteButton({ category, onDone }: { category: Category; onDone: () => void }) {
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!confirm(`Delete "${category.name}"? Posts in it are not deleted.`)) return;
    setBusy(true);
    try {
      await api(`/blog/categories/${category.id}`, { method: "DELETE" });
      onDone();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not delete.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
      onClick={remove} disabled={busy} aria-label={`Delete ${category.name}`}>
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </Button>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
