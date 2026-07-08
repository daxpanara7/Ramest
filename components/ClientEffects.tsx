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

    const magneticBtns = document.querySelectorAll(
      ".button-primary, .button-secondary"
    );

    const handlers: Array<{
      el: Element;
      move: (e: Event) => void;
      out: () => void;
    }> = [];

    magneticBtns.forEach((btn) => {
      const move = (e: Event) => {
        const me = e as MouseEvent;
        const position = (btn as HTMLElement).getBoundingClientRect();
        const x = me.pageX - position.left - position.width / 2;
        const y = me.pageY - position.top - position.height / 2;
        (btn as HTMLElement).style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
      };
      const out = () => {
        (btn as HTMLElement).style.transform = "translate(0px, 0px)";
      };
      btn.addEventListener("mousemove", move);
      btn.addEventListener("mouseout", out);
      handlers.push({ el: btn, move, out });
    });

    return () => {
      revealObserver.disconnect();
      handlers.forEach(({ el, move, out }) => {
        el.removeEventListener("mousemove", move);
        el.removeEventListener("mouseout", out);
      });
    };
  }, [pathname]);

  return null;
}
