"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Filter, Plus, Search, Star } from "lucide-react";
import { PageHeader, Section } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { blogs } from "@/lib/mock-data";
import { statusBadge } from "@/components/admin/badges";
import { Card } from "@/components/ui/card";


export default function BlogPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [selected, setSelected] = useState<string[]>([]);

  const rows = useMemo(() => blogs.filter((b) =>
    (status === "all" || b.status.toLowerCase() === status) &&
    (!q || b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase()))
  ), [q, status]);

  const allChecked = selected.length > 0 && selected.length === rows.length;

  return (
    <Section>
      <PageHeader
        title="Blog"
        description={`${blogs.length} posts · ${blogs.filter((b) => b.status === "Published").length} published`}
        actions={
          <>
            <Button variant="outline" size="sm"><Filter className="mr-1.5 h-3.5 w-3.5" /> Filters</Button>
            <Button size="sm" asChild>
              <Link href="/admin/blog/new"><Plus className="mr-1.5 h-3.5 w-3.5" /> New post</Link>
            </Button>
          </>
        }
      />

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-border/60 p-3 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title or author…" className="h-9 pl-8" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-9 w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
            {selected.length > 0 && (
              <div className="ml-2 flex items-center gap-2 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-xs">
                <span className="font-medium text-primary">{selected.length} selected</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Publish</Button>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-destructive">Delete</Button>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(b.id)}
                      onCheckedChange={(v) =>
                        setSelected((s) => (v ? [...s, b.id] : s.filter((x) => x !== b.id)))
                      }
                    />
                  </TableCell>
                  <TableCell className="max-w-[380px]">
                    <div className="flex items-center gap-2">
                      {b.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                      <span className="truncate font-medium">{b.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{b.author}</TableCell>
                  <TableCell><Badge variant="outline" className="text-[10.5px]">{b.category}</Badge></TableCell>
                  <TableCell>{statusBadge(b.status)}</TableCell>
                  <TableCell className="text-right tabular-nums">{b.views.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-muted-foreground">{b.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t border-border/60 px-3 py-2.5 text-xs text-muted-foreground">
          <span>Showing {rows.length} of {blogs.length}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Previous</Button>
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs">Next</Button>
          </div>
        </div>
      </Card>
    </Section>
  );
}
