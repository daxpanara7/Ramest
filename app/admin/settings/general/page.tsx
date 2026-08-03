"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { SettingsSection, Field } from "@/components/admin/settings-form";
import { useSettings } from "@/lib/admin/use-settings";

/** Persisted under the "general.*" prefix. */
export default function GeneralSettings() {
  const s = useSettings("general", {
    "general.workspaceName": "Ramest Technolabs",
    "general.website": "https://www.ramesttechnolabs.com",
    "general.timezone": "ist",
    "general.about": "",
    "general.statusPage": true,
  });

  return (
    <SettingsSection
      title="Workspace"
      description="Public information about your admin workspace."
      loading={s.loading} error={s.error} saveError={s.saveError}
      dirty={s.dirty} saving={s.saving} justSaved={s.justSaved}
      onSave={s.save} onReset={s.reset} onRetry={s.reload}
    >
      <Field label="Workspace name" full>
        <Input value={s.str("general.workspaceName")} onChange={(e) => s.set("general.workspaceName", e.target.value)} />
      </Field>
      <Field label="Website" full>
        <Input value={s.str("general.website")} onChange={(e) => s.set("general.website", e.target.value)} />
      </Field>
      <Field label="Timezone" full>
        <Select value={s.str("general.timezone", "ist")} onValueChange={(v) => s.set("general.timezone", v)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ist">Asia/Kolkata (IST)</SelectItem>
            <SelectItem value="utc">UTC</SelectItem>
            <SelectItem value="pt">America/Los_Angeles</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field label="About" full>
        <Textarea rows={3} value={s.str("general.about")} onChange={(e) => s.set("general.about", e.target.value)} />
      </Field>

      <div className="md:col-span-2"><Separator /></div>

      <div className="md:col-span-2 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Public status page</p>
          <p className="text-xs text-muted-foreground">Expose /status with uptime metrics.</p>
        </div>
        <Switch
          checked={s.bool("general.statusPage", true)}
          onCheckedChange={(v) => s.set("general.statusPage", v)}
        />
      </div>
    </SettingsSection>
  );
}
