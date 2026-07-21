"use client";

import { PageHeader, Section } from "@/components/admin/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { UserPlus, Search, MoreHorizontal } from "lucide-react";
import { users } from "@/lib/mock-data";
import { userStatusBadge } from "@/components/admin/badges";
import { useState } from "react";


export default function UsersPage() {
  const [q, setQ] = useState("");
  const rows = users.filter((u) => !q || (u.name + u.email).toLowerCase().includes(q.toLowerCase()));

  return (
    <Section>
      <PageHeader
        title="Users"
        description={`${users.length} people have access to this workspace.`}
        actions={<Button size="sm"><UserPlus className="mr-1.5 h-3.5 w-3.5" /> Invite user</Button>}
      />

      <Card className="overflow-hidden p-0">
        <div className="flex items-center gap-3 border-b border-border/60 p-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name or email…" className="h-9 pl-8" />
          </div>
        </div>
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow className="hover:bg-transparent">
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last active</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="bg-primary/15 text-[10px] text-primary">
                        {u.name.split(" ").map((s) => s[0]).slice(0, 2).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline" className="text-[10.5px]">{u.role}</Badge></TableCell>
                <TableCell>{userStatusBadge(u.status)}</TableCell>
                <TableCell className="text-muted-foreground">{u.lastActive}</TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Section>
  );
}
