"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { api, ApiError } from "./api";
import { useApi } from "./use-api";

/**
 * Settings form controller for the /admin/settings/* pages.
 *
 * All settings live in one key/value table, grouped by a dotted prefix
 * ("company.name", "email.fromName"). A page declares the prefix it owns and
 * the keys it renders; this hook loads them, tracks edits, and saves the
 * whole form in one PATCH.
 *
 * Dirty tracking compares against the last saved snapshot rather than the
 * initial load, so Save stays disabled until something genuinely changed and
 * re-enables correctly after a save.
 */

type Values = Record<string, unknown>;
type SettingsResponse = { items: unknown[]; values: Values; total: number };

export function useSettings(prefix: string, defaults: Values = {}) {
  const { data, loading, error, reload } = useApi<SettingsResponse>(
    `/settings?prefix=${encodeURIComponent(prefix)}`,
  );

  const [draft, setDraft] = useState<Values>({});
  const [saved, setSaved] = useState<Values>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  // Server values win over defaults; defaults only fill keys never set.
  useEffect(() => {
    if (!data) return;
    const merged = { ...defaults, ...data.values };
    setDraft(merged);
    setSaved(merged);
    // defaults is a literal at every call site, so it is intentionally not a
    // dependency — including it would reset the draft on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(saved),
    [draft, saved],
  );

  const set = useCallback((key: string, value: unknown) => {
    setJustSaved(false);
    setDraft((d) => ({ ...d, [key]: value }));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    try {
      // Send only what changed — an unchanged key does not need a write,
      // and it keeps the audit log meaningful.
      const changed = Object.entries(draft).filter(
        ([k, v]) => JSON.stringify(v) !== JSON.stringify(saved[k]),
      );
      if (changed.length === 0) return;

      await api("/settings", {
        method: "PATCH",
        body: { settings: changed.map(([key, value]) => ({ key, value })) },
      });
      setSaved(draft);
      setJustSaved(true);
      reload();
    } catch (e) {
      setSaveError(e instanceof ApiError ? e.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  }, [draft, saved, reload]);

  const reset = useCallback(() => {
    setDraft(saved);
    setSaveError(null);
    setJustSaved(false);
  }, [saved]);

  /** Convenience readers — settings come back as unknown JSON. */
  const str = useCallback(
    (key: string, fallback = "") => {
      const v = draft[key];
      return typeof v === "string" ? v : v === undefined || v === null ? fallback : String(v);
    },
    [draft],
  );
  const bool = useCallback(
    (key: string, fallback = false) => {
      const v = draft[key];
      return typeof v === "boolean" ? v : fallback;
    },
    [draft],
  );
  const num = useCallback(
    (key: string, fallback = 0) => {
      const v = draft[key];
      return typeof v === "number" ? v : Number(v) || fallback;
    },
    [draft],
  );

  return {
    loading, error, reload,
    set, str, bool, num,
    save, reset, saving, saveError, dirty, justSaved,
  };
}
