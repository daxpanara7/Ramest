"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";


export default function EmailSettings() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div>
        <h3 className="font-display text-lg">Email</h3>
        <p className="text-sm text-muted-foreground">Sending domain, SMTP, and notification defaults.</p>
      </div>
      <Card className="lg:col-span-2">
        <CardContent className="space-y-5 p-6">
          <Field label="From name"><Input defaultValue="Ramest Technolabs" /></Field>
          <Field label="From address"><Input defaultValue="notifications@ramesttechnolabs.com" /></Field>
          <Field label="Reply-to"><Input defaultValue="hello@ramesttechnolabs.com" /></Field>
          <div className="space-y-3 rounded-lg border border-border/60 p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Domain verification</p>
            <div className="flex items-center justify-between text-sm">
              <span>SPF</span><span className="text-emerald-400">Verified</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>DKIM</span><span className="text-emerald-400">Verified</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>DMARC</span><span className="text-amber-400">Warning · p=none</span>
            </div>
          </div>
          <Toggle label="Send weekly digest to admins" />
          <Toggle label="Notify on new lead" defaultChecked />
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Send test</Button>
            <Button size="sm">Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
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
function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
