"use client";

import { PageHeader, Section } from "@/components/admin/primitives";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";


const roles = [
  { name: "Owner", members: 1, desc: "Full access to the workspace, billing, and destructive actions." },
  { name: "Admin", members: 3, desc: "Manage content, users, integrations and settings." },
  { name: "Editor", members: 8, desc: "Create and publish content; manage media." },
  { name: "Viewer", members: 15, desc: "Read-only access to dashboards and content." },
];

const permissions = [
  { g: "Content", items: ["View blogs", "Create blogs", "Publish blogs", "Delete blogs"] },
  { g: "Leads", items: ["View leads", "Reply to leads", "Export leads"] },
  { g: "Settings", items: ["Manage settings", "Manage API keys", "Manage billing"] },
  { g: "Users", items: ["Invite users", "Change roles", "Suspend users"] },
];

export default function RolesPage() {
  return (
    <Section>
      <PageHeader
        title="Roles & Permissions"
        description="Fine-grained access control for your workspace."
        actions={<Button size="sm"><Plus className="mr-1.5 h-3.5 w-3.5" /> Custom role</Button>}
      />

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {roles.map((r) => (
          <Card key={r.name}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{r.name}</CardTitle>
                <Badge variant="secondary" className="text-[10.5px]">{r.members} members</Badge>
              </div>
              <CardDescription className="text-xs">{r.desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Permissions matrix</CardTitle>
          <CardDescription>Configure what each role can do</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-left">
                <th className="px-4 py-2.5 font-medium">Capability</th>
                {roles.map((r) => (
                  <th key={r.name} className="px-4 py-2.5 text-center font-medium">{r.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.flatMap((g) => [
                <tr key={g.g} className="bg-muted/10">
                  <td colSpan={5} className="px-4 py-2 text-[10.5px] uppercase tracking-widest text-muted-foreground">{g.g}</td>
                </tr>,
                ...g.items.map((p) => (
                  <tr key={p} className="border-b border-border/40 last:border-0">
                    <td className="px-4 py-2.5">{p}</td>
                    {roles.map((r, i) => (
                      <td key={r.name} className="px-4 py-2.5 text-center">
                        <Checkbox defaultChecked={i < 3 || (i === 3 && p.startsWith("View"))} />
                      </td>
                    ))}
                  </tr>
                )),
              ])}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Section>
  );
}
