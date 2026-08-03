"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SettingsSection, Field } from "@/components/admin/settings-form";
import { useSettings } from "@/lib/admin/use-settings";

/** Persisted under the "company.*" prefix in the settings table. */
export default function CompanySettings() {
  const s = useSettings("company", {
    "company.legalName": "",
    "company.registrationNo": "",
    "company.gstin": "",
    "company.email": "",
    "company.phone": "",
    "company.country": "India",
    "company.address": "",
  });

  return (
    <SettingsSection
      title="Company"
      description="Legal and billing details."
      loading={s.loading} error={s.error} saveError={s.saveError}
      dirty={s.dirty} saving={s.saving} justSaved={s.justSaved}
      onSave={s.save} onReset={s.reset} onRetry={s.reload}
    >
      <Field label="Legal name">
        <Input value={s.str("company.legalName")} onChange={(e) => s.set("company.legalName", e.target.value)} />
      </Field>
      <Field label="Registration no.">
        <Input value={s.str("company.registrationNo")} onChange={(e) => s.set("company.registrationNo", e.target.value)} />
      </Field>
      <Field label="GSTIN">
        <Input value={s.str("company.gstin")} onChange={(e) => s.set("company.gstin", e.target.value)} />
      </Field>
      <Field label="Email">
        <Input type="email" value={s.str("company.email")} onChange={(e) => s.set("company.email", e.target.value)} />
      </Field>
      <Field label="Phone">
        <Input value={s.str("company.phone")} onChange={(e) => s.set("company.phone", e.target.value)} />
      </Field>
      <Field label="Country">
        <Input value={s.str("company.country")} onChange={(e) => s.set("company.country", e.target.value)} />
      </Field>
      <Field label="Registered address" full>
        <Textarea rows={3} value={s.str("company.address")} onChange={(e) => s.set("company.address", e.target.value)} />
      </Field>
    </SettingsSection>
  );
}
