"use client";

import { useEffect } from "react";

/**
 * Mounts the homepage motion system (Lenis smooth scroll + GSAP effects).
 *
 * The engine is lazy-imported inside useEffect so GSAP/Lenis are code-split
 * into their own chunk, never server-rendered, and never loaded on other
 * routes. Renders nothing; if the import fails or reduced-motion is set, the
 * page simply stays static — no content is ever hidden behind this.
 */
export default function HomeMotion() {
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    import("@/lib/motion/engine")
      .then(({ initHomeMotion }) => {
        if (!cancelled) cleanup = initHomeMotion();
      })
      .catch(() => {
        /* static page remains fully usable */
      });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return null;
}
