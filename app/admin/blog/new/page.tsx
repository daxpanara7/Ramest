"use client";

import Link from "next/link";
import { ArrowLeft, Eye, Image as ImageIcon, Bold, Italic, Link as LinkIcon, List, Heading2, Code, Quote } from "lucide-react";
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


const toolbar = [
  { icon: Heading2, label: "Heading" },
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: LinkIcon, label: "Link" },
  { icon: List, label: "List" },
  { icon: Quote, label: "Quote" },
  { icon: Code, label: "Code" },
  { icon: ImageIcon, label: "Image" },
];

export default function NewBlogPage() {
  return (
    <Section>
      <PageHeader
        title="Write a new post"
        description="Draft, preview, and schedule content for the Ramest blog."
        actions={
          <>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/blog"><ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Back</Link>
            </Button>
            <Button variant="outline" size="sm"><Eye className="mr-1.5 h-3.5 w-3.5" /> Preview</Button>
            <Button variant="outline" size="sm">Save draft</Button>
            <Button size="sm">Publish</Button>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="overflow-hidden">
          <CardContent className="space-y-5 p-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs uppercase tracking-widest text-muted-foreground">Title</Label>
              <Input
                id="title" placeholder="A memorable headline for your post"
                className="h-auto border-0 bg-transparent p-0 font-display text-3xl tracking-tight shadow-none focus-visible:ring-0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-xs uppercase tracking-widest text-muted-foreground">Slug</Label>
              <Input id="slug" defaultValue="a-memorable-headline" className="h-9 font-mono text-sm" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="excerpt" className="text-xs uppercase tracking-widest text-muted-foreground">Excerpt</Label>
              <Textarea id="excerpt" rows={2} placeholder="One or two sentences that summarize the post." />
            </div>

            <Separator />

            <div>
              <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border/60 bg-muted/30 p-1">
                {toolbar.map((t) => (
                  <Button key={t.label} size="icon" variant="ghost" className="h-8 w-8" aria-label={t.label}>
                    <t.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
              <Textarea
                rows={18} placeholder="Start writing…"
                className="mt-3 min-h-[400px] resize-y border-border/60 font-[15px] leading-relaxed"
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Publish</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Status"><Badge variant="secondary">Draft</Badge></Row>
              <Row label="Visibility">
                <Select defaultValue="public">
                  <SelectTrigger className="h-8 w-[130px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                    <SelectItem value="password">Password</SelectItem>
                  </SelectContent>
                </Select>
              </Row>
              <Row label="Publish date"><Input type="date" className="h-8 w-[150px]" /></Row>
              <Row label="Featured"><Switch /></Row>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Taxonomy</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Category</Label>
                <Select defaultValue="engineering">
                  <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Engineering", "Design", "AI/ML", "Mobile", "SEO", "DevOps"].map((c) => (
                      <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-1.5 rounded-md border border-border/60 bg-background p-2">
                  {["nextjs", "typescript", "postgres"].map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10.5px]">{t}</Badge>
                  ))}
                  <input className="flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground" placeholder="Add tag…" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">Featured image</CardTitle></CardHeader>
            <CardContent>
              <div className="flex aspect-[16/10] items-center justify-center rounded-md border border-dashed border-border/70 bg-muted/30 text-xs text-muted-foreground">
                <div className="text-center">
                  <ImageIcon className="mx-auto mb-2 h-5 w-5" />
                  Drop an image or <span className="text-primary">browse</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-sm">SEO</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-1.5">
                <Label htmlFor="seo-title" className="text-xs text-muted-foreground">SEO title</Label>
                <Input id="seo-title" placeholder="Under 60 characters" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seo-desc" className="text-xs text-muted-foreground">Meta description</Label>
                <Textarea id="seo-desc" rows={3} placeholder="Under 160 characters" />
              </div>
              <Row label="Index this post"><Switch defaultChecked /></Row>
            </CardContent>
          </Card>
        </div>
      </div>
    </Section>
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
