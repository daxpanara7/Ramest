"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

/**
 * Renders the marketing chrome (header/footer/skip-link) for the public site,
 * but nothing for /admin routes — the admin panel supplies its own full-screen
 * layout.
 *
 * Footer reveal: the footer is pinned to the viewport bottom behind the page,
 * and the scrolling content sits above it on an opaque surface. As you reach
 * the end of the page the content slides up like a card and uncovers the
 * footer underneath. The content needs bottom room equal to the footer's
 * height for that to be reachable, which is measured here because the footer
 * reflows with the viewport.
 */
export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const footerRef = useRef<HTMLDivElement>(null);
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const el = footerRef.current;
    if (!el) return;

    let height = 0;

    const sync = () => {
      height = Math.round(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty(
        "--footer-reveal",
        `${height}px`,
      );
    };

    // Reveal parallax: while the page-shell "card" slides up and uncovers the
    // footer, the footer CONTENT rises into place at a slower rate. Only the
    // inner content moves (via --fr-shift, consumed in footer.css); the fixed
    // blue surface itself never shifts. Translating the whole fixed container
    // was the previous, wrong approach — pushing it down opened a gap between
    // the card and the footer that flashed the page canvas.
    // Footer tucks this far under the card (see .page-shell margin-bottom).
    const FOOTER_OVERLAP = 64;
    const shell = document.querySelector<HTMLElement>(".page-shell");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let ticking = false;

    const parallax = () => {
      ticking = false;
      if (!shell || !height || reduced.matches) {
        el.style.removeProperty("--fr-shift");
        return;
      }
      const revealed = window.innerHeight - shell.getBoundingClientRect().bottom;
      const usable = Math.max(1, height - FOOTER_OVERLAP);
      const progress = Math.min(1, Math.max(0, revealed / usable));
      el.style.setProperty(
        "--fr-shift",
        `${((1 - progress) * height * 0.35).toFixed(1)}px`,
      );
    };

    // HARD STOP: never allow the viewport past the resting frame (rounded
    // card sitting on the footer). The browser caps scrollTop at the doc end
    // already; this snaps back any transient overshoot (elastic, momentum,
    // stale layout) the same frame it happens — on every page.
    const clampScroll = () => {
      const doc = document.scrollingElement;
      if (!doc) return;
      const max = doc.scrollHeight - window.innerHeight;
      if (doc.scrollTop > max) doc.scrollTop = max;
    };

    const onScroll = () => {
      clampScroll();
      // Self-heal on every scroll: the reserved scroll room (shell
      // margin-bottom) must equal the footer's REAL height. If they ever
      // drift (late font load, viewport change, stale measurement), you can
      // scroll PAST the fully-revealed footer into a bare rectangle —
      // re-sync the instant a mismatch is detected.
      if (shell) {
        const applied = parseFloat(getComputedStyle(shell).marginBottom) || 0;
        const expected = el.offsetHeight - FOOTER_OVERLAP;
        if (applied > 0 && Math.abs(applied - expected) > 1) sync();
      }
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(parallax);
      }
    };

    sync();
    parallax();
    // Fonts change text metrics after first measure — re-sync when ready.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        sync();
        parallax();
      });
    }
    const observer = new ResizeObserver(() => {
      sync();
      parallax();
    });
    observer.observe(el);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      el.style.removeProperty("--fr-shift");
    };
  }, [isAdmin, pathname]);

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Fixed chrome lives OUTSIDE the clipped shell: the shell clips its
          children to its rounded bottom corners, and a fixed element inside
          a clipping ancestor is the one case engines disagree on. */}
      <Header />

      {/* Everything that scrolls over the footer */}
      <div className="page-shell">
        <div className="bg-grid" aria-hidden="true" />
        <main className="main" id="main-content">
          {children}
        </main>
      </div>

      {/* Pinned behind the page shell; revealed at the end of the scroll */}
      <div className="footer-reveal" ref={footerRef}>
        <Footer />
      </div>
    </>
  );
}
