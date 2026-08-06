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
/** No scroll input for this long means the gesture is over and it is safe to
 *  hand the wheel to Lenis. Long enough to outlast the gap between notches of
 *  a continuous trackpad flick, short enough that the smoothing is in place
 *  before the user starts scrolling again. */
const SETTLE_MS = 450;

export default function HomeMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const EVENTS = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    let cleanup: (() => void) | undefined;
    let cancelled = false;
    let started = false;
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    let settleId: ReturnType<typeof setTimeout> | undefined;
    let lastInput = 0;

    // Function declaration, not const: `start` below calls it, and a const
    // arrow would still be in its temporal dead zone at that point.
    function stopWaiting() {
      for (const e of EVENTS) window.removeEventListener(e, start);
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timerId !== undefined) clearTimeout(timerId);
    }

    /* Tracks scroll input right up to the moment the engine is installed, so
       `activate` can tell a gesture in flight from a settled page. Separate
       from the EVENTS listeners above because those detach on first fire. */
    const noteInput = () => {
      lastInput = performance.now();
    };

    function stopWatchingInput() {
      window.removeEventListener("wheel", noteInput);
      window.removeEventListener("touchmove", noteInput);
      if (settleId !== undefined) clearTimeout(settleId);
    }

    /* Installing Lenis mid-gesture is the visible fluctuation.
     *
     * The engine used to initialise on the FIRST wheel event. Lenis takes the
     * wheel away from the browser and re-drives it with its own smoothing and
     * a 1.8x multiplier, so it was swapping the scrolling model out from
     * under a gesture that was already moving: the page lurched, changed
     * speed, and sometimes appeared to jump. Nothing was dropping frames —
     * the scroll physics genuinely changed underfoot.
     *
     * So the module is still FETCHED on the first hint of scroll intent (that
     * costs nothing visually and keeps it off the critical path), but it is
     * only INSTALLED once no wheel or touch has arrived for SETTLE_MS. The
     * handover therefore always happens on a stationary page, where it is
     * imperceptible. */
    function activate(init: () => () => void) {
      if (cancelled) return;
      const since = performance.now() - lastInput;
      if (since < SETTLE_MS) {
        settleId = setTimeout(() => activate(init), SETTLE_MS - since);
        return;
      }
      stopWatchingInput();
      cleanup = init();
    }

    function start() {
      if (started || cancelled) return;
      started = true;
      stopWaiting();

      import("@/lib/motion/engine")
        .then(({ initHomeMotion }) => {
          if (!cancelled) activate(initHomeMotion);
        })
        .catch(() => {
          /* static page remains fully usable */
        });
    }

    for (const e of EVENTS) window.addEventListener(e, start, { passive: true });
    window.addEventListener("wheel", noteInput, { passive: true });
    window.addEventListener("touchmove", noteInput, { passive: true });

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
      stopWatchingInput();
      cleanup?.();
    };
  }, []);

  return null;
}
