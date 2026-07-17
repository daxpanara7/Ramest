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

    return () => {
      revealObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
