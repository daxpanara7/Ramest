"use client";

import { PageHeader, Section } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Plus } from "lucide-react";


const categories = [
  { name: "Engineering", slug: "engineering", posts: 34, color: "var(--chart-1)" },
  { name: "Design", slug: "design", posts: 18, color: "var(--chart-2)" },
  { name: "AI/ML", slug: "ai-ml", posts: 22, color: "var(--chart-3)" },
  { name: "Mobile", slug: "mobile", posts: 12, color: "var(--chart-4)" },
  { name: "SEO", slug: "seo", posts: 9, color: "var(--chart-5)" },
  { name: "DevOps", slug: "devops", posts: 14, color: "var(--chart-1)" },
  { name: "Databases", slug: "databases", posts: 7, color: "var(--chart-2)" },
  { name: "Company", slug: "company", posts: 5, color: "var(--chart-3)" },
];

export default function CategoriesPage() {
  return (
    <Section>
      <PageHeader
        title="Categories"
        description="Organize blog content into browsable topics."
        actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New category</Button>}
      />
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <Card key={c.slug} className="group transition-colors hover:border-border">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <span className="h-8 w-1 rounded-full" style={{ background: c.color }} />
                <div>
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">/{c.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10.5px]">{c.posts} posts</Badge>
                <Button size="icon" variant="ghost" className="h-7 w-7 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
