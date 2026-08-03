"use client";

import { useEffect } from "react";

/**
 * Mounts the homepage motion system (Lenis smooth scroll + GSAP effects).
 *
 * The engine is lazy-imported so GSAP/Lenis are code-split into their own
 * chunk, never server-rendered, and never loaded on other routes. Renders
 * nothing; if the import fails the page simply stays static — no content is
 * ever hidden behind this. `.reveal` is driven by ClientEffects'
 * IntersectionObserver, not by GSAP, so nothing is invisible while this waits.
 *
 * Importing straight from useEffect still put ~130 KB of parse work inside the
 * page-load window, which is what Lighthouse reports as unused JavaScript: the
 * homepage renders and becomes interactive without any of it. So the fetch now
 * waits for whichever comes first —
 *
 *   1. the first real scroll intent (wheel / touch / key / pointer), which is
 *      the exact moment smooth scrolling and the stacked-card effects start to
 *      matter, or
 *   2. the browser's first idle gap, capped by a timeout so it always arrives.
 *
 * Reduced-motion users never download it at all: the check moved ahead of the
 * import, where before the module was fetched and then discarded itself.
 */
export default function HomeMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    let started = false;
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;

    // Function declaration, not const: `start` below calls it, and a const
    // arrow would still be in its temporal dead zone at that point.
    function stopWaiting() {
      for (const e of EVENTS) window.removeEventListener(e, start);
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timerId !== undefined) clearTimeout(timerId);
    }

    function start() {
      if (started || cancelled) return;
      started = true;
      stopWaiting();

      import("@/lib/motion/engine")
        .then(({ initHomeMotion }) => {
          if (!cancelled) cleanup = initHomeMotion();
        })
        .catch(() => {
          /* static page remains fully usable */
        });
    }

    for (const e of EVENTS) window.addEventListener(e, start, { passive: true });

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(start, { timeout: 2000 });
    } else {
      // Safari < 17 has no requestIdleCallback; a short timer is close enough
      // and still lands well after first paint.
      timerId = setTimeout(start, 1200);
    }

    return () => {
      cancelled = true;
      stopWaiting();
      cleanup?.();
    };
  }, []);

  return null;
}
