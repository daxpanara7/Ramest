"use client";

import { useEffect, useRef } from "react";
import { API_BASE } from "@/lib/api-base";

/**
 * Wakes the API the first time someone actually engages with a form.
 *
 * Render's free tier sleeps after ~15 minutes idle, and the cold start lands
 * entirely on whoever submits first. Warming it early is genuinely worth
 * doing — a visitor spends 30-60s filling one of these forms, which is far
 * more than the container needs to come back up.
 *
 * What changed is *when*. The ping used to fire from a mount effect, so every
 * visit to the homepage, contact page and careers page opened a request to
 * the backend during page load, whether or not the form was ever touched.
 * That cost a request on the critical path, and when the API was asleep or
 * unreachable it logged a failed request to the console — which is a real
 * Lighthouse best-practices failure, not just noise.
 *
 * Binding to the form itself means the ping happens on the first focus, tap
 * or keypress inside it. That is strictly later than mount but still tens of
 * seconds before submit, so the cold-start protection is unchanged while page
 * load stays clean.
 *
 * Returns a ref to attach to the form (or any wrapper containing its fields).
 */
export function useApiWarmup<T extends HTMLElement>(onWarm?: () => void) {
  const ref = useRef<T>(null);
  /* Held in a ref so a caller passing an inline arrow does not re-bind the
     listeners on every render. */
  const onWarmRef = useRef(onWarm);
  onWarmRef.current = onWarm;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const EVENTS = ["focusin", "pointerdown", "keydown"] as const;
    let fired = false;

    const warm = () => {
      if (fired) return;
      fired = true;
      for (const e of EVENTS) el.removeEventListener(e, warm);
      // Best-effort: never surfaced to the user, never blocks the real submit.
      fetch(`${API_BASE}/health`, { method: "GET", keepalive: true }).catch(
        () => {},
      );
      onWarmRef.current?.();
    };

    for (const e of EVENTS) el.addEventListener(e, warm, { passive: true });
    return () => {
      for (const e of EVENTS) el.removeEventListener(e, warm);
    };
  }, []);

  return ref;
}
