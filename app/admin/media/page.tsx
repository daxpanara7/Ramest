"use client";

import { useState } from "react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Upload, Grid2x2, List, Search, Folder } from "lucide-react";
import { mediaItems } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";


export default function MediaPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [q, setQ] = useState("");
  const rows = mediaItems.filter((m) => !q || m.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Section>
      <PageHeader
        title="Media Library"
        description={`${mediaItems.length} assets · 42.6 MB used`}
        actions={<Button size="sm"><Upload className="mr-1.5 h-3.5 w-3.5" /> Upload</Button>}
      />

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <Card className="h-fit p-2">
          <div className="px-2 py-2 text-[10.5px] uppercase tracking-widest text-muted-foreground">Folders</div>
          {["All media", "Blog", "Brand", "Team", "Case studies", "Screenshots"].map((f, i) => (
            <button key={f} className={cn(
              "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
              i === 0 ? "bg-accent" : "hover:bg-accent/60"
            )}>
              <Folder className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{f}</span>
              <span className="ml-auto text-[11px] text-muted-foreground">{[128, 42, 14, 22, 18, 32][i]}</span>
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
              <Button size="icon" variant={view === "grid" ? "secondary" : "ghost"} className="h-7 w-7" onClick={() => setView("grid")}>
                <Grid2x2 className="h-3.5 w-3.5" />
              </Button>
              <Button size="icon" variant={view === "list" ? "secondary" : "ghost"} className="h-7 w-7" onClick={() => setView("list")}>
                <List className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {view === "grid" ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {rows.map((m, i) => (
                <Card key={m.id} className="group overflow-hidden p-0 transition-colors hover:border-primary/30">
                  <div
                    className="aspect-square"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.3 0.05 ${20 + i * 12}) 0%, oklch(0.22 0.02 ${20 + i * 12}) 100%)`,
                    }}
                  />
                  <div className="border-t border-border/60 p-2.5">
                    <p className="truncate text-xs font-medium">{m.name}</p>
                    <p className="flex justify-between text-[10.5px] text-muted-foreground">
                      <span>{m.size}</span><span>{m.type}</span>
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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((m) => (
                    <TableRow key={m.id}>
                      <TableCell className="font-medium">{m.name}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[10.5px]">{m.type}</Badge></TableCell>
                      <TableCell className="text-muted-foreground">{m.size}</TableCell>
                      <TableCell className="text-right text-muted-foreground">{m.uploaded}</TableCell>
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
