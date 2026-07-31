"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Upload, Grid2x2, List, Search, Folder, Loader2, Trash2, AlertCircle, RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { api, ApiError, API_BASE, getAccessToken } from "@/lib/admin/api";
import { useApi, qs } from "@/lib/admin/use-api";
import { formatDateTime, relativeTime, formatBytes } from "@/lib/admin/format";

/**
 * Original layout — folder rail, grid/list toggle, search — over /api/media.
 *
 * Upload uses raw fetch, not the api() helper: this is multipart FormData and
 * api() force-sets Content-Type to application/json, which strips the
 * multipart boundary and makes Multer reject the body.
 *
 * The folder rail has no server concept behind it — MediaAsset has no folder
 * column. Rather than delete the design, the rail filters by MIME type, which
 * is the real grouping the data supports.
 */

type Asset = {
  id: string; key: string; url: string;
  mimeType: string; bytes: number;
  alt: string | null; width: number | null; height: number | null;
  createdAt: string;
};

/**
 * The API stores a hashed key, not the uploaded filename, so there is no
 * original name to show. Prefer the alt text the user set, else the key.
 */
const displayName = (a: Asset) => a.alt?.trim() || a.key;
type AssetList = { items: Asset[]; total: number };

const FOLDERS: { label: string; mime?: string }[] = [
  { label: "All media" },
  { label: "Images", mime: "image/" },
  { label: "PDFs", mime: "application/pdf" },
  { label: "Documents", mime: "application/" },
  { label: "Video", mime: "video/" },
  { label: "Text", mime: "text/" },
];

const PAGE_SIZE = 60;
const isImage = (m: string) => m.startsWith("image/");

/** Absolute URL for a stored asset (API_BASE ends in /api, url starts with /api). */
const assetUrl = (a: Asset) =>
  a.url.startsWith("http") ? a.url : `${API_BASE.replace(/\/api$/, "")}${a.url}`;

export default function MediaPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [folder, setFolder] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  const mime = FOLDERS[folder].mime;
  const { data, loading, error, reload } = useApi<AssetList>(
    `/media${qs({ mimeType: mime, take: PAGE_SIZE })}`,
  );

  const all = data?.items ?? [];
  const rows = useMemo(
    () => all.filter((m) =>
      !debouncedQ ||
      displayName(m).toLowerCase().includes(debouncedQ.toLowerCase()) ||
      m.key.toLowerCase().includes(debouncedQ.toLowerCase())),
    [all, debouncedQ],
  );

  const totalBytes = all.reduce((sum, a) => sum + a.bytes, 0);

  return (
    <Section>
      <PageHeader
        title="Media Library"
        description={
          loading && !data ? "Loading…" : `${data?.total ?? 0} assets · ${formatBytes(totalBytes)} on this page`
        }
        actions={
          <>
            <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
              <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <UploadButton onUploaded={reload} />
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

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Card className="h-fit p-2">
          <div className="px-2 py-2 text-[10.5px] uppercase tracking-widest text-muted-foreground">Folders</div>
          {FOLDERS.map((f, i) => (
            <button
              key={f.label}
              onClick={() => setFolder(i)}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
                i === folder ? "bg-accent" : "hover:bg-accent/60",
              )}
            >
              <Folder className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{f.label}</span>
              {i === folder && (
                <span className="ml-auto text-[11px] text-muted-foreground">{data?.total ?? 0}</span>
              )}
            </button>
          ))}
        </Card>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files…" className="h-9 pl-8" />
            </div>
            <div className="ml-auto flex items-center rounded-md border border-border/60 p-0.5">
              <Button size="icon" variant={view === "grid" ? "secondary" : "ghost"} className="h-7 w-7" onClick={() => setView("grid")} aria-label="Grid view">
                <Grid2x2 className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant={view === "list" ? "secondary" : "ghost"} className="h-7 w-7" onClick={() => setView("list")} aria-label="List view">
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {loading && all.length === 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
            </div>
          ) : rows.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <p className="text-sm text-muted-foreground">
                  {debouncedQ ? "No files match that search." : "No media yet — upload your first file."}
                </p>
              </CardContent>
            </Card>
          ) : view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {rows.map((m, i) => (
                <Card key={m.id} className="group overflow-hidden p-0 transition-colors hover:border-primary/30">
                  <div className="relative aspect-square">
                    {isImage(m.mimeType) ? (
                      // Plain <img>: user uploads on an arbitrary host, which
                      // next/image would need remotePatterns config for.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={assetUrl(m)} alt={m.alt ?? ""} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div
                        className="flex h-full w-full items-center justify-center"
                        style={{ background: `linear-gradient(135deg, oklch(0.93 0.03 ${20 + i * 12}) 0%, oklch(0.87 0.02 ${20 + i * 12}) 100%)` }}
                      >
                        <span className="font-mono text-[11px] uppercase text-muted-foreground">
                          {m.key.split(".").pop()}
                        </span>
                      </div>
                    )}
                    <DeleteAsset asset={m} onDeleted={reload} className="absolute right-1.5 top-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100" />
                  </div>
                  <div className="border-t border-border/60 p-2.5">
                    <p className="truncate text-xs font-medium" title={displayName(m)}>{displayName(m)}</p>
                    <p className="flex justify-between text-[10.5px] text-muted-foreground">
                      <span>{formatBytes(m.bytes)}</span>
                      <span>{m.mimeType.split("/")[1]?.toUpperCase() ?? m.mimeType}</span>
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="overflow-hidden p-0">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Uploaded</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">
                        <a href={assetUrl(m)} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {displayName(m)}
                        </a>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10.5px]">
                          {m.mimeType.split("/")[1]?.toUpperCase() ?? m.mimeType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{formatBytes(m.bytes)}</TableCell>
                      <TableCell className="text-right text-muted-foreground" title={formatDateTime(m.createdAt)}>
                        {relativeTime(m.createdAt)}
                      </TableCell>
                      <TableCell><DeleteAsset asset={m} onDeleted={reload} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </div>
    </Section>
  );
}

function UploadButton({ onUploaded }: { onUploaded: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const send = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    const failed: string[] = [];

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.append("file", file);
      try {
        // No Content-Type header on purpose — the browser must set it with
        // the generated multipart boundary.
        const res = await fetch(`${API_BASE}/media/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` },
          credentials: "include",
          body: form,
        });
        if (!res.ok) {
          const d = await res.json().catch(() => null);
          throw new Error(Array.isArray(d?.message) ? d.message.join(", ") : d?.message ?? `HTTP ${res.status}`);
        }
      } catch (e) {
        failed.push(`${file.name}: ${e instanceof Error ? e.message : "failed"}`);
      }
    }

    setBusy(false);
    if (input.current) input.current.value = "";
    onUploaded();
    if (failed.length) alert(`Some uploads failed:\n${failed.join("\n")}`);
  };

  return (
    <>
      <input ref={input} type="file" multiple className="hidden" onChange={(e) => void send(e.target.files)} />
      <Button size="sm" onClick={() => input.current?.click()} disabled={busy}>
        {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Upload className="mr-1.5 h-3.5 w-3.5" />}
        Upload
      </Button>
    </>
  );
}

function DeleteAsset({
  asset, onDeleted, className,
}: { asset: Asset; onDeleted: () => void; className?: string }) {
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!confirm(`Delete "${asset.alt?.trim() || asset.key}"? Any page using it will break.`)) return;
    setBusy(true);
    try {
      await api(`/media/${asset.id}`, { method: "DELETE" });
      onDeleted();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "Could not delete file.");
      setBusy(false);
    }
  };

  return (
    <Button
      variant="ghost" size="icon"
      className={cn("h-7 w-7 bg-background/80 text-muted-foreground backdrop-blur hover:text-destructive", className)}
      onClick={remove} disabled={busy} aria-label={`Delete ${asset.key}`}
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
    </Button>
  );
}
