"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { SettingsSection, Field } from "@/components/admin/settings-form";
import { useSettings } from "@/lib/admin/use-settings";

/**
 * Persisted under the "email.*" prefix.
 *
 * The SPF/DKIM/DMARC panel is intentionally read-only and unpopulated: those
 * are DNS facts, not settings. Showing them as live would need a DNS lookup
 * or the Resend domains API, so they render "not checked" rather than
 * claiming a verification that was never performed.
 */
export default function EmailSettings() {
  const s = useSettings("email", {
    "email.fromName": "Ramest Technolabs",
    "email.fromAddress": "",
    "email.replyTo": "",
    "email.weeklyDigest": false,
    "email.notifyOnLead": true,
  });

  return (
    <SettingsSection
      title="Email"
      description="Sending domain, SMTP, and notification defaults."
      loading={s.loading} error={s.error} saveError={s.saveError}
      dirty={s.dirty} saving={s.saving} justSaved={s.justSaved}
      onSave={s.save} onReset={s.reset} onRetry={s.reload}
    >
      <Field label="From name" full>
        <Input value={s.str("email.fromName")} onChange={(e) => s.set("email.fromName", e.target.value)} />
      </Field>
      <Field label="From address" full>
        <Input type="email" value={s.str("email.fromAddress")} onChange={(e) => s.set("email.fromAddress", e.target.value)} />
      </Field>
      <Field label="Reply-to" full>
        <Input type="email" value={s.str("email.replyTo")} onChange={(e) => s.set("email.replyTo", e.target.value)} />
      </Field>

      <div className="md:col-span-2 space-y-3 rounded-lg border border-border/60 p-4">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Domain verification</p>
        {["SPF", "DKIM", "DMARC"].map((r) => (
          <div key={r} className="flex items-center justify-between text-sm">
            <span>{r}</span>
            <span className="text-muted-foreground">Not checked</span>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          These are DNS records, not settings — wiring them live needs the
          Resend domains API.
        </p>
      </div>

      <div className="md:col-span-2 flex items-center justify-between">
        <p className="text-sm">Send weekly digest to admins</p>
        <Switch checked={s.bool("email.weeklyDigest")} onCheckedChange={(v) => s.set("email.weeklyDigest", v)} />
      </div>
      <div className="md:col-span-2 flex items-center justify-between">
        <p className="text-sm">Notify on new lead</p>
        <Switch checked={s.bool("email.notifyOnLead", true)} onCheckedChange={(v) => s.set("email.notifyOnLead", v)} />
      </div>
    </SettingsSection>
  );
}
