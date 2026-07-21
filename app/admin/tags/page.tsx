"use client";

import { PageHeader, Section } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";


const tags = [
  "nextjs", "typescript", "postgres", "supabase", "ai", "llm", "rag",
  "figma", "ux", "design-systems", "swiftui", "kotlin", "react-native",
  "docker", "kubernetes", "cloudflare", "seo", "aeo", "geo", "analytics",
  "growth", "b2b", "startup", "case-study",
];

export default function TagsPage() {
  return (
    <Section>
      <PageHeader
        title="Tags"
        description="Fine-grained topics used across content."
        actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> New tag</Button>}
      />

      <Card>
        <CardContent className="space-y-4 p-5">
          <Input placeholder="Search tags…" className="h-9 max-w-sm" />
          <div className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <Badge key={t} variant="outline" className="group gap-1 rounded-full px-3 py-1 text-xs">
                #{t}
                <button className="ml-0.5 opacity-0 transition-opacity group-hover:opacity-100" aria-label={`Remove ${t}`}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Section>
  );
}
