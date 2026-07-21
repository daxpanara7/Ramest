"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";


export default function SecuritySettings() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div>
        <h3 className="font-display text-lg">Security</h3>
        <p className="text-sm text-muted-foreground">Authentication, sessions and audit configuration.</p>
      </div>
      <Card className="lg:col-span-2">
        <CardContent className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Require 2FA for all admins</p>
              <p className="text-xs text-muted-foreground">Enforces TOTP for every admin account.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">SSO via Google Workspace</p>
              <p className="text-xs text-muted-foreground">Only ramesttechnolabs.com emails allowed.</p>
            </div>
            <Badge className="border-transparent bg-emerald-500/12 text-emerald-400 ring-1 ring-inset ring-emerald-500/20 text-[10.5px]">Connected</Badge>
          </div>
          <Separator />
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">Session lifetime</Label>
            <Input defaultValue="24 hours" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-widest text-muted-foreground">IP allowlist</Label>
            <Input placeholder="e.g. 203.0.113.0/24" />
          </div>
          <div className="flex justify-end">
            <Button size="sm">Save changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
