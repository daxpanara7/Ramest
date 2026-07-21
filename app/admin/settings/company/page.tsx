"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


export default function CompanySettings() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div>
        <h3 className="font-display text-lg">Company</h3>
        <p className="text-sm text-muted-foreground">Legal and billing details.</p>
      </div>
      <Card className="lg:col-span-2">
        <CardContent className="grid gap-5 p-6 md:grid-cols-2">
          <Field label="Legal name"><Input defaultValue="Ramest Technolabs Pvt. Ltd." /></Field>
          <Field label="Registration no."><Input defaultValue="U72900GJ2019PTC110842" /></Field>
          <Field label="GSTIN"><Input defaultValue="24AAJCR1234R1Z5" /></Field>
          <Field label="Email"><Input defaultValue="hello@ramesttechnolabs.com" /></Field>
          <Field label="Phone"><Input defaultValue="+91 98230 12345" /></Field>
          <Field label="Country"><Input defaultValue="India" /></Field>
          <div className="md:col-span-2">
            <Field label="Registered address"><Textarea rows={3} defaultValue="4th Floor, Iscon Business Hub, Ahmedabad, Gujarat 380015, India" /></Field>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
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
