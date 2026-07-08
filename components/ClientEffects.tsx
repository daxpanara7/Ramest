"use client";

import { useEffect } from "react";

export default function ClientEffects() {
  useEffect(() => {
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));

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
  }, []);

  return null;
}
