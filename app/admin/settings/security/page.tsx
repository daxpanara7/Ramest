"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { SettingsSection, Field } from "@/components/admin/settings-form";
import { useSettings } from "@/lib/admin/use-settings";

/**
 * Persisted under the "security.*" prefix.
 *
 * These values are stored but not yet enforced by the API — 2FA and IP
 * allowlisting need guard-level implementation. The SSO row was previously
 * hardcoded to "Connected", which claimed an integration that does not
 * exist; it now states the truth.
 */
export default function SecuritySettings() {
  const s = useSettings("security", {
    "security.require2fa": false,
    "security.sessionHours": 24,
    "security.ipAllowlist": "",
  });

  return (
    <SettingsSection
      title="Security"
      description="Authentication, sessions and audit configuration."
      loading={s.loading} error={s.error} saveError={s.saveError}
      dirty={s.dirty} saving={s.saving} justSaved={s.justSaved}
      onSave={s.save} onReset={s.reset} onRetry={s.reload}
    >
      <div className="md:col-span-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Require 2FA for all admins</p>
          <p className="text-xs text-muted-foreground">Stored as policy — enforcement is not implemented yet.</p>
        </div>
        <Switch checked={s.bool("security.require2fa")} onCheckedChange={(v) => s.set("security.require2fa", v)} />
      </div>

      <div className="md:col-span-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">SSO via Google Workspace</p>
          <p className="text-xs text-muted-foreground">Not configured.</p>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-[10.5px] text-muted-foreground">
          Not connected
        </span>
      </div>

      <div className="md:col-span-2"><Separator /></div>

      <Field label="Session lifetime (hours)" full>
        <Input
          type="number" min={1} max={720}
          value={s.num("security.sessionHours", 24)}
          onChange={(e) => s.set("security.sessionHours", Number(e.target.value) || 24)}
        />
      </Field>
      <Field label="IP allowlist" full>
        <Input
          placeholder="e.g. 203.0.113.0/24"
          value={s.str("security.ipAllowlist")}
          onChange={(e) => s.set("security.ipAllowlist", e.target.value)}
        />
      </Field>
    </SettingsSection>
  );
}
