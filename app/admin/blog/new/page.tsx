"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft, Eye, Image as ImageIcon, Bold, Italic, Link as LinkIcon, List,
  Heading2, Code, Quote, Loader2, AlertCircle, Check, X,
} from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { api, ApiError, API_BASE, getAccessToken } from "@/lib/admin/api";
import { useApi } from "@/lib/admin/use-api";

/**
 * Post editor — creates via POST /blog/posts, then switches to PATCH once an
 * id exists, so "Save draft" twice updates instead of creating duplicates.
 * ?id= loads an existing post for editing.
 *
 * The toolbar wraps the selection in markdown rather than being decorative.
 * A rich-text editor writing contentJson would be the next step; contentHtml
 * is what the public blog renders today.
 *
 * "Visibility" and "Featured" have no server fields (BlogPost has neither).
 * They stay in place because the design calls for them, but they are disabled
 * and labelled rather than silently doing nothing.
 */

type Category = { id: string; name: string };
type Tag = { id: string; name: string; slug: string };
type Post = {
  id: string; title: string; slug: string; excerpt: string | null;
  contentHtml: string | null; status: string;
  categoryId: string | null; coverImageId: string | null;
  metaTitle: string | null; metaDescription: string | null;
  canonicalUrl: string | null; noindex: boolean;
  tags: { tag: Tag }[];
};

export default function NewBlogPageWrapper() {
  // useSearchParams needs a Suspense boundary in the app router.
  return (
    <Suspense fallback={<Section><p className="text-sm text-muted-foreground">Loading editor…</p></Section>}>
      <NewBlogPage />
    </Suspense>
  );
}

function NewBlogPage() {
  const router = useRouter();
  const params = useSearchParams();
  const editId = params.get("id");

  const [postId, setPostId] = useState<string | null>(editId);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<string>("none");
  const [tagIds, setTagIds] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImageId, setCoverImageId] = useState<string | null>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [noindex, setNoindex] = useState(false);
  const [status, setStatus] = useState("DRAFT");

  const [saving, setSaving] = useState<null | "draft" | "publish">(null);
  const [err, setErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const { data: categories } = useApi<Category[]>("/blog/categories");
  const { data: allTags, reload: reloadTags } = useApi<Tag[]>("/blog/tags");
  const { data: existing } = useApi<Post>(editId ? `/blog/posts/${editId}` : null);

  useEffect(() => {
    if (!existing) return;
    setPostId(existing.id);
    setTitle(existing.title);
    setSlug(existing.slug);
    setExcerpt(existing.excerpt ?? "");
    setContent(existing.contentHtml ?? "");
    setCategoryId(existing.categoryId ?? "none");
    setTagIds(existing.tags.map((t) => t.tag.id));
    setCoverImageId(existing.coverImageId);
    setMetaTitle(existing.metaTitle ?? "");
    setMetaDescription(existing.metaDescription ?? "");
    setNoindex(existing.noindex);
    setStatus(existing.status);
  }, [existing]);

  const body = useCallback(() => {
    const b: Record<string, unknown> = {
      title: title.trim(),
      excerpt: excerpt.trim() || undefined,
      contentHtml: content || undefined,
      categoryId: categoryId === "none" ? undefined : categoryId,
      tagIds,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      noindex,
      coverImageId: coverImageId ?? undefined,
    };
    // Only send a slug the user actually typed — an empty one makes the
    // server derive and uniquify it.
    if (slug.trim()) b.slug = slug.trim();
    return b;
  }, [title, slug, excerpt, content, categoryId, tagIds, metaTitle, metaDescription, noindex, coverImageId]);

  const save = async (mode: "draft" | "publish") => {
    if (!title.trim()) { setErr("A title is required."); return; }
    setSaving(mode); setErr(null); setSaved(false);
    try {
      let id = postId;
      if (id) {
        await api(`/blog/posts/${id}`, { method: "PATCH", body: body() });
      } else {
        const created = await api<Post>("/blog/posts", { method: "POST", body: body() });
        id = created.id;
        setPostId(id);
        setSlug(created.slug);
        // Keep the URL in sync so a refresh edits rather than re-creates.
        router.replace(`/admin/blog/new?id=${id}`);
      }
      if (mode === "publish") {
        await api(`/blog/posts/${id}/publish`, { method: "POST", body: {} });
        setStatus("PUBLISHED");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "Could not save the post.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <Section>
      <PageHeader
        title={postId ? "Edit post" : "Write a new post"}
        description="Draft, preview, and schedule content for the Ramest blog."
        actions={
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/blog"><ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back</Link>
            </Button>
            <Button variant="outline" size="sm" asChild disabled={!postId}>
              <a href={slug ? `/blog/${slug}` : "#"} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-1.5 h-3.5 w-3.5" /> Preview
              </a>
            </Button>
            <Button variant="outline" size="sm" onClick={() => save("draft")} disabled={saving !== null}>
              {saving === "draft" && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Save draft
            </Button>
            <Button size="sm" onClick={() => save("publish")} disabled={saving !== null}>
              {saving === "publish" && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
              Publish
            </Button>
          </>
        }
      />

      {err && (
        <div role="alert" className="flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {err}
        </div>
      )}
      {saved && (
        <div role="status" className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
          <Check className="h-4 w-4 shrink-0" /> Saved.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs uppercase tracking-widest text-muted-foreground">Title</Label>
              <Input
                id="title" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="A memorable headline for your post" maxLength={200}
                className="h-auto border-0 bg-transparent p-0 font-display text-3xl tracking-tight shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs uppercase tracking-widest text-muted-foreground">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)}
                placeholder="leave empty to generate from the title"
                className="h-9 font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-xs uppercase tracking-widest text-muted-foreground">Excerpt</Label>
              <Textarea id="excerpt" rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                placeholder="One or two sentences that summarize the post." />
            </div>

            <Separator />

            <Editor value={content} onChange={setContent} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Publish</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Status">
                <Badge variant={status === "PUBLISHED" ? "default" : "secondary"}>
                  {status.charAt(0) + status.slice(1).toLowerCase()}
                </Badge>
              </Row>
              <Row label="Visibility">
                <Select defaultValue="public" disabled>
                  <SelectTrigger className="h-8 w-[130px]" title="No visibility field on the server yet"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="password">Password</SelectItem>
                  </SelectContent>
                </Select>
              </Row>
              <Row label="Publish date">
                <Input type="date" className="h-8 w-[150px]" disabled title="Scheduling is not in the API yet" />
              </Row>
              <Row label="Featured">
                <Switch disabled title="No featured field on the server yet" />
              </Row>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Taxonomy</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger className="h-9"><SelectValue placeholder="Choose…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No category</SelectItem>
                    {(categories ?? []).map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <TagPicker
                all={allTags ?? []}
                selected={tagIds}
                onChange={setTagIds}
                input={tagInput}
                setInput={setTagInput}
                onCreated={reloadTags}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Featured image</CardTitle></CardHeader>
            <CardContent>
              <CoverPicker
                url={coverUrl}
                onPicked={(id, url) => { setCoverImageId(id); setCoverUrl(url); }}
                onCleared={() => { setCoverImageId(null); setCoverUrl(null); }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-1.5">
                <Label htmlFor="seo-title" className="text-xs text-muted-foreground">
                  SEO title
                  <span className={metaTitle.length > 60 ? "ml-2 text-destructive" : "ml-2 text-muted-foreground/70"}>
                    {metaTitle.length}/60
                  </span>
                </Label>
                <Input id="seo-title" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
                  placeholder="Under 60 characters" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seo-desc" className="text-xs text-muted-foreground">
                  Meta description
                  <span className={metaDescription.length > 160 ? "ml-2 text-destructive" : "ml-2 text-muted-foreground/70"}>
                    {metaDescription.length}/160
                  </span>
                </Label>
                <Textarea id="seo-desc" rows={3} value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)} placeholder="Under 160 characters" />
              </div>
              <Row label="Index this post">
                <Switch checked={!noindex} onCheckedChange={(v) => setNoindex(!v)} />
              </Row>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
  );
}

/** Markdown toolbar that actually wraps the current selection. */
function Editor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const wrap = (before: string, after = before, placeholder = "text") => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const selected = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + selected + after + value.slice(e);
    onChange(next);
    // Restore the caret inside the wrapper after React re-renders.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + selected.length);
    });
  };

  const toolbar = [
    { icon: Heading2, label: "Heading", run: () => wrap("\n## ", "\n", "Heading") },
    { icon: Bold, label: "Bold", run: () => wrap("**") },
    { icon: Italic, label: "Italic", run: () => wrap("_") },
    { icon: LinkIcon, label: "Link", run: () => wrap("[", "](https://)", "link text") },
    { icon: List, label: "List", run: () => wrap("\n- ", "\n", "item") },
    { icon: Quote, label: "Quote", run: () => wrap("\n> ", "\n", "quote") },
    { icon: Code, label: "Code", run: () => wrap("`") },
    { icon: ImageIcon, label: "Image", run: () => wrap("![", "](https://)", "alt text") },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-1">
        {toolbar.map((t) => (
          <Button key={t.label} size="icon" variant="ghost" className="h-8 w-8"
            aria-label={t.label} title={t.label} type="button" onClick={t.run}>
            <t.icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <Textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={18}
        placeholder="Start writing…"
        className="mt-3 min-h-[400px] resize-y border-border/60 font-[15px] leading-relaxed"
      />
    </div>
  );
}

function TagPicker({
  all, selected, onChange, input, setInput, onCreated,
}: {
  all: Tag[]; selected: string[]; onChange: (v: string[]) => void;
  input: string; setInput: (v: string) => void; onCreated: () => void;
}) {
  const [busy, setBusy] = useState(false);
  const chosen = all.filter((t) => selected.includes(t.id));

  const add = async () => {
    const name = input.trim();
    if (!name) return;
    const existing = all.find((t) => t.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      if (!selected.includes(existing.id)) onChange([...selected, existing.id]);
      setInput("");
      return;
    }
    setBusy(true);
    try {
      const created = await api<Tag>("/blog/tags", { method: "POST", body: { name } });
      onChange([...selected, created.id]);
      setInput("");
      onCreated();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not create tag.");
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">Tags</Label>
      <div className="flex flex-wrap gap-1.5 rounded-md border border-border/60 bg-background p-2">
        {chosen.map((t) => (
          <Badge key={t.id} variant="secondary" className="gap-1 text-[10.5px]">
            {t.name}
            <button type="button" aria-label={`Remove ${t.name}`}
              onClick={() => onChange(selected.filter((id) => id !== t.id))}>
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
          placeholder={busy ? "Creating…" : "Add tag…"}
          value={input}
          disabled={busy}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); void add(); }
          }}
        />
      </div>
      <p className="text-[11px] text-muted-foreground">Press Enter to add. New names create a tag.</p>
    </div>
  );
}

function CoverPicker({
  url, onPicked, onCleared,
}: { url: string | null; onPicked: (id: string, url: string) => void; onCleared: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const upload = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${API_BASE}/media/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` },
        credentials: "include",
        body: form,
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.message ?? "Upload failed");
      const asset = (await res.json()) as { id: string; url: string };
      const abs = asset.url.startsWith("http") ? asset.url : `${API_BASE.replace(/\/api$/, "")}${asset.url}`;
      onPicked(asset.id, abs);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally { setBusy(false); }
  };

  return (
    <>
      <input ref={input} type="file" accept="image/*" className="hidden"
        onChange={(e) => void upload(e.target.files?.[0])} />
      {url ? (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Cover" className="aspect-[16/10] w-full rounded-md object-cover" />
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={() => input.current?.click()} disabled={busy}>
              Replace
            </Button>
            <Button size="sm" variant="ghost" className="text-destructive" onClick={onCleared} disabled={busy}>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="flex aspect-[16/10] w-full items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/30 text-xs text-muted-foreground transition-colors hover:border-primary/40"
        >
          <div className="text-center">
            {busy
              ? <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin" />
              : <ImageIcon className="mx-auto mb-2 h-5 w-5" />}
            Drop an image or <span className="text-primary">browse</span>
          </div>
        </button>
      )}
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
