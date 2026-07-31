"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { api, ApiError } from "./api";
import { useAuth } from "./auth-context";

/**
 * Read a backend endpoint into React state.
 *
 * Waits for AuthProvider's silent-refresh bootstrap before firing: on a cold
 * page load the in-memory access token does not exist yet, so an eager fetch
 * would 401, burn a refresh, and race the one AuthProvider is already doing.
 *
 * `reload()` re-fetches — call it after a mutation so the table reflects what
 * the server actually stored rather than what the client assumed.
 */
export function useApi<T>(path: string | null) {
  const { loading: authLoading, user } = useAuth();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guards against a slow response from an earlier path overwriting a newer
  // one (type a search fast and the responses can land out of order).
  const reqId = useRef(0);

  const run = useCallback(async () => {
    if (authLoading || !user || !path) return;
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    try {
      const res = await api<T>(path);
      if (id === reqId.current) setData(res);
    } catch (e) {
      if (id === reqId.current) {
        setError(e instanceof ApiError ? e.message : "Could not load data.");
      }
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, [path, authLoading, user]);

  useEffect(() => {
    void run();
  }, [run]);

  return { data, loading: loading || authLoading, error, reload: run };
}

/** Build a query string, dropping empty/undefined values. */
export function qs(params: Record<string, string | number | undefined | null>) {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}
