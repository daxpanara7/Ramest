"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle, Filter, Loader2, Plus, RefreshCw, Search, Star, Trash2, Upload, Undo2,
} from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { postStatusBadge } from "@/components/admin/badges";
import { api, ApiError } from "@/lib/admin/api";
import { useApi, qs } from "@/lib/admin/use-api";
import { formatDateTime, relativeTime } from "@/lib/admin/format";

/**
 * Original layout, live data from /api/blog/posts.
 *
 * Publishing goes through POST :id/publish rather than a status PATCH: the
 * server also stamps publishedAt, and it is gated by `blog:publish`
 * separately from `blog:write`, so an editor can draft without publishing.
 *
 * Author names come from a single /users fetch mapped by authorId — the post
 * list returns authorId only, and one request per row would be a storm.
 * Views has no source until the Search Console integration lands.
 */

type Post = {
  id: string; title: string; slug: string;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
  authorId: string | null;
  updatedAt: string;
  category: { id: string; name: string } | null;
  tags: { tag: { id: string; name: string; slug: string } }[];
};
type PostList = { items: Post[]; total: number };
type Category = { id: string; name: string };
type UserList = { items: { id: string; name: string }[] };

const STATUSES = ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"];
const PAGE_SIZE = 25;
const title = (s: string) => s.charAt(0) + s.slice(1).toLowerCase();

export default function BlogPage() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [status, setStatus] = useState("all");
  const [categoryId, setCategoryId] = useState("all");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkBusy, setBulkBusy] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedQ(q); setPage(0); }, 350);
    return () => clearTimeout(t);
  }, [q]);

  const path = `/blog/posts${qs({
    search: debouncedQ || undefined,
    status: status === "all" ? undefined : status,
    categoryId: categoryId === "all" ? undefined : categoryId,
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE,
  })}`;

  const { data, loading, error, reload } = useApi<PostList>(path);
  const { data: categories } = useApi<Category[]>("/blog/categories");
  const { data: users } = useApi<UserList>("/users?take=100");
  const { data: published } = useApi<PostList>("/blog/posts?status=PUBLISHED&take=1");

  const rows = data?.items ?? [];
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const allChecked = selected.length > 0 && selected.length === rows.length;

  const authorName = useMemo(() => {
    const map = new Map((users?.items ?? []).map((u) => [u.id, u.name]));
    return (id: string | null) => (id ? map.get(id) ?? "—" : "—");
  }, [users]);

  // Sequential, not Promise.all: the API is rate-limited and a partial
  // failure should not leave the UI claiming everything succeeded.
  const bulk = async (kind: "publish" | "delete") => {
    if (kind === "delete" && !confirm(`Delete ${selected.length} post(s)? This cannot be undone.`)) return;
    setBulkBusy(true);
    const failed: string[] = [];
    for (const id of selected) {
      try {
        if (kind === "delete") await api(`/blog/posts/${id}`, { method: "DELETE" });
        else await api(`/blog/posts/${id}/publish`, { method: "POST", body: {} });
      } catch { failed.push(id); }
    }
    setBulkBusy(false);
    setSelected([]);
    reload();
    if (failed.length) alert(`${failed.length} of ${selected.length} failed.`);
  };

  return (
    <Section>
      <PageHeader
        title="Blog"
        description={
          loading && !data ? "Loading…" : `${total} posts · ${published?.total ?? 0} published`
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button size="sm" asChild>
              <Link href="/admin/blog/new"><Plus className="mr-1.5 h-3.5 w-3.5" /> New post</Link>
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

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-border/60 p-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title…" className="h-9 pl-8" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={(v) => { setStatus(v); setPage(0); }}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                {STATUSES.map((s) => <SelectItem key={s} value={s}>{title(s)}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setPage(0); }}>
              <SelectTrigger className="h-9 w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {(categories ?? []).map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm" disabled title="Author and date filters are not in the API yet">
              <Filter className="mr-1.5 h-3.5 w-3.5" /> Filters
            </Button>
            {selected.length > 0 && (
              <div className="ml-2 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs">
                <span className="font-medium text-primary">{selected.length} selected</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs"
                  onClick={() => bulk("publish")} disabled={bulkBusy}>
                  {bulkBusy ? <Loader2 className="h-3 w-3 animate-spin" /> : "Publish"}
                </Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-destructive"
                  onClick={() => bulk("delete")} disabled={bulkBusy}>Delete</Button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-10">
                  <Checkbox
                    checked={allChecked}
                    onCheckedChange={(v) => setSelected(v ? rows.map((r) => r.id) : [])}
                  />
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && rows.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}><TableCell colSpan={8}><Skeleton className="h-9 w-full" /></TableCell></TableRow>
                ))
              ) : rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="py-12 text-center text-sm text-muted-foreground">
                    {debouncedQ || status !== "all" || categoryId !== "all"
                      ? "No posts match these filters."
                      : "No posts yet."}
                  </TableCell>
                </TableRow>
              ) : rows.map((b) => (
                <PostRow
                  key={b.id}
                  post={b}
                  author={authorName(b.authorId)}
                  checked={selected.includes(b.id)}
                  onCheck={(v) => setSelected((s) => (v ? [...s, b.id] : s.filter((x) => x !== b.id)))}
                  onChanged={reload}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 px-3 py-2.5 text-xs text-muted-foreground">
          <span>Showing {rows.length} of {total}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs"
              disabled={page === 0 || loading} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs"
              disabled={page >= pages - 1 || loading} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </Section>
  );
}

function PostRow({
  post, author, checked, onCheck, onChanged,
}: {
  post: Post; author: string; checked: boolean;
  onCheck: (v: boolean) => void; onChanged: () => void;
}) {
  const [busy, setBusy] = useState<null | "toggle" | "delete">(null);
  const [err, setErr] = useState<string | null>(null);
  const isPublished = post.status === "PUBLISHED";

  const call = async (kind: "toggle" | "delete") => {
    if (kind === "delete" && !confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setBusy(kind); setErr(null);
    try {
      if (kind === "delete") await api(`/blog/posts/${post.id}`, { method: "DELETE" });
      else await api(`/blog/posts/${post.id}/${isPublished ? "unpublish" : "publish"}`, { method: "POST", body: {} });
      onChanged();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Action failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <Checkbox checked={checked} onCheckedChange={(v) => onCheck(!!v)} />
      </TableCell>
      <TableCell className="max-w-[380px]">
        <div className="flex items-center gap-2">
          {post.status === "PUBLISHED" && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
          <Link href={`/admin/blog/new?id=${post.id}`} className="truncate font-medium hover:underline">{post.title}</Link>
        </div>
        <div className="truncate font-mono text-[11px] text-muted-foreground">/{post.slug}</div>
        {err && <div className="text-xs text-destructive">{err}</div>}
      </TableCell>
      <TableCell className="text-muted-foreground">{author}</TableCell>
      <TableCell>
        {post.category
          ? <Badge variant="outline" className="text-[10.5px]">{post.category.name}</Badge>
          : <span className="text-muted-foreground">—</span>}
      </TableCell>
      <TableCell>{postStatusBadge(post.status)}</TableCell>
      {/* Views awaits the Search Console / analytics integration. */}
      <TableCell className="text-right tabular-nums text-muted-foreground">—</TableCell>
      <TableCell className="text-right text-muted-foreground" title={formatDateTime(post.updatedAt)}>
        {relativeTime(post.updatedAt)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="sm" className="h-7 text-xs"
            onClick={() => call("toggle")} disabled={busy !== null}>
            {busy === "toggle"
              ? <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
              : isPublished ? <Undo2 className="mr-1 h-3.5 w-3.5" /> : <Upload className="mr-1 h-3.5 w-3.5" />}
            {isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={() => call("delete")} disabled={busy !== null} aria-label={`Delete ${post.title}`}>
            {busy === "delete" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
