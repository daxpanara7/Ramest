"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __reveal?: { bind: () => void };
  }
}

export default function ClientEffects() {
  const pathname = usePathname();
  /* The inline <head> bootstrap has already bound the observer for the page
     we loaded on. Re-binding here would remove `.active` from sections the
     user is currently looking at and fade them back in — a flash on every
     first render. So this only runs from the SECOND pathname onwards, i.e.
     for client-side navigations, which is the only case the bootstrap cannot
     see. */
  const firstPath = useRef(true);

  useEffect(() => {
    if (firstPath.current) {
      firstPath.current = false;
    } else {
      window.__reveal?.bind();
    }

    /* Marks the document while a scroll is in flight.
     *
     * Card grids animate `transform` + a large-blur `box-shadow` on :hover. As
     * the page scrolls under a stationary cursor, every card that passes the
     * pointer enters and leaves :hover, so each one starts a 0.3s lift and a
     * shadow repaint mid-scroll. That is the jitter — the page is not dropping
     * frames, it is animating rows of cards that nobody asked to hover.
     *
     * CSS uses this to suppress hover effects until scrolling stops. Listener
     * is passive and does nothing but set a class, so it never delays a frame.
     */
    const root = document.documentElement;
    let idle: ReturnType<typeof setTimeout> | undefined;
    let marked = false;

    const onScroll = () => {
      if (!marked) {
        marked = true;
        root.classList.add("is-scrolling");
      }
      if (idle) clearTimeout(idle);
      idle = setTimeout(() => {
        marked = false;
        root.classList.remove("is-scrolling");
      }, 120);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (idle) clearTimeout(idle);
      root.classList.remove("is-scrolling");
    };
  }, [pathname]);

  return null;
}
