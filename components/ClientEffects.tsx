"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function ClientEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    revealElements.forEach((el) => {
      // Re-bind after client navigation — without this, sections stay opacity:0
      el.classList.remove("active");
      revealObserver.observe(el);
    });

    // Reveal anything already in view immediately (e.g. stats band under hero)
    requestAnimationFrame(() => {
      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const inView =
          rect.top < window.innerHeight * 0.9 && rect.bottom > 0;
        if (inView) el.classList.add("active");
      });
    });

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
      revealObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (idle) clearTimeout(idle);
      root.classList.remove("is-scrolling");
    };
  }, [pathname]);

  return null;
}
