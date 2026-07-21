"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";


export default function GeneralSettings() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div>
        <h3 className="font-display text-lg">Workspace</h3>
        <p className="text-sm text-muted-foreground">Public information about your admin workspace.</p>
      </div>
      <Card className="lg:col-span-2">
        <CardContent className="space-y-5 p-6">
          <Field label="Workspace name"><Input defaultValue="Ramest Technolabs" /></Field>
          <Field label="Website"><Input defaultValue="https://www.ramesttechnolabs.com" /></Field>
          <Field label="Timezone">
            <Select defaultValue="ist">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="pt">America/Los_Angeles</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="About">
            <Textarea rows={3} defaultValue="We design and build custom software, mobile & web apps, and AI/ML solutions." />
          </Field>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Public status page</p>
              <p className="text-xs text-muted-foreground">Expose /status with uptime metrics.</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">Cancel</Button>
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
