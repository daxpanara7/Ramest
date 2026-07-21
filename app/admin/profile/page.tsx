"use client";

import { PageHeader, Section } from "@/components/admin/primitives";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";


export default function ProfilePage() {
  return (
    <Section>
      <PageHeader title="Profile" description="Your personal account settings." />

      <Card className="surface-glow overflow-hidden">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center md:flex-row md:text-left">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-primary/15 text-2xl text-primary">RR</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="font-display text-2xl tracking-tight">Ravi Ramesh</h2>
            <p className="text-sm text-muted-foreground">Owner · ravi@ramesttechnolabs.com</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
              <Badge variant="secondary">Owner</Badge>
              <Badge variant="outline">2FA enabled</Badge>
              <Badge variant="outline">Joined Jan 2020</Badge>
            </div>
          </div>
          <Button variant="outline" size="sm">Change avatar</Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-5 p-6">
            <h3 className="font-display text-lg">Details</h3>
            <Field label="Full name"><Input defaultValue="Ravi Ramesh" /></Field>
            <Field label="Email"><Input defaultValue="ravi@ramesttechnolabs.com" /></Field>
            <Field label="Role"><Input defaultValue="Founder & CEO" /></Field>
            <Field label="Bio"><Textarea rows={3} defaultValue="Building enterprise-grade products at Ramest Technolabs." /></Field>
            <div className="flex justify-end"><Button size="sm">Save</Button></div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-5 p-6">
            <h3 className="font-display text-lg">Password & sessions</h3>
            <Field label="Current password"><Input type="password" /></Field>
            <Field label="New password"><Input type="password" /></Field>
            <Field label="Confirm password"><Input type="password" /></Field>
            <div className="rounded-lg border border-border/60 p-3 text-sm">
              <p className="font-medium">Active sessions</p>
              <p className="mt-1 text-xs text-muted-foreground">Chrome · Ahmedabad · current</p>
              <p className="text-xs text-muted-foreground">Safari · iPhone · 2 days ago</p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm">Sign out all</Button>
              <Button size="sm">Update password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
