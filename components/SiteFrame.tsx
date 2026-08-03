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

    /* Last value written, so an unchanged frame touches no DOM at all.
       Writing a custom property invalidates style for the footer subtree even
       when the value is identical — at 120Hz that is 120 pointless style
       recalcs a second, and it is a large subtree. */
    let lastShift = "";

    const parallax = () => {
      ticking = false;
      if (!shell || !height || reduced.matches) {
        if (lastShift !== "") {
          lastShift = "";
          el.style.removeProperty("--fr-shift");
        }
        return;
      }

      const revealed = window.innerHeight - shell.getBoundingClientRect().bottom;
      const usable = Math.max(1, height - FOOTER_OVERLAP);

      /* Off-screen short-circuit. On a long page (the blog index is three
         rows of cards) the footer is nowhere near the viewport for most of
         the scroll, yet this still recomputed and rewrote every frame. Once
         the value has been pinned to its resting state there is nothing to
         do until the footer is actually approaching. */
      if (revealed <= 0) {
        const resting = `${(height * 0.35).toFixed(1)}px`;
        if (lastShift !== resting) {
          lastShift = resting;
          el.style.setProperty("--fr-shift", resting);
        }
        return;
      }

      const progress = Math.min(1, Math.max(0, revealed / usable));
      const next = `${((1 - progress) * height * 0.35).toFixed(1)}px`;
      if (next === lastShift) return;
      lastShift = next;
      el.style.setProperty("--fr-shift", next);
    };

    /* Scroll handler does ZERO layout work.
     *
     * It previously ran three forced synchronous layouts on EVERY scroll
     * event — doc.scrollHeight, getComputedStyle(shell).marginBottom and
     * el.offsetHeight — and then wrote doc.scrollTop. Reading geometry mid-
     * scroll forces the browser to flush layout before it can answer, and
     * writing scrollTop fights macOS momentum. Together that is the visible
     * fluctuation: the page appears to stutter and snap while scrolling.
     *
     * Now the listener only sets a flag. All measurement happens once per
     * frame inside rAF, and the expensive drift check is sampled rather than
     * run continuously.
     */
    let maxScroll = 0;
    const refreshMax = () => {
      const doc = document.scrollingElement;
      maxScroll = doc ? doc.scrollHeight - window.innerHeight : 0;
    };

    const frame = () => {
      ticking = false;

      // Clamp against a CACHED max — no scrollHeight read per frame. Only
      // correct a real overshoot, with a 1px tolerance so sub-pixel rounding
      // never triggers a write (a write every frame is itself the judder).
      const doc = document.scrollingElement;
      if (doc && maxScroll > 0 && doc.scrollTop > maxScroll + 1) {
        doc.scrollTop = maxScroll;
      }

      /* The drift self-heal that used to live here is GONE.
       *
       * It ran `getComputedStyle(shell).marginBottom` and `el.offsetHeight`
       * every 30th frame. Both are forced synchronous layouts, and firing
       * them mid-scroll made the browser flush layout twice a second — a
       * regular, rhythmic hitch. That is exactly the "jitter/fluctuation"
       * that was still showing up on the blog page, and it was worse there
       * than on the homepage because the blog has no Lenis smoothing to mask
       * a dropped frame.
       *
       * It was only ever guarding against the footer's height changing after
       * first measure (late fonts, viewport resize). Both of those already
       * have precise triggers — `document.fonts.ready` and the
       * ResizeObserver on the footer below — so polling for them during
       * scroll bought nothing. Measurement now happens when the thing being
       * measured actually changes, never on a timer.
       */

      parallax();
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(frame);
      }
    };

    sync();
    refreshMax();
    parallax();
    // Fonts change text metrics after first measure — re-sync when ready.
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        sync();
        refreshMax();
        parallax();
      });
    }
    const observer = new ResizeObserver(() => {
      sync();
      refreshMax();
      parallax();
    });
    observer.observe(el);
    // Also watch the scrolling content: blog covers and late-loading media
    // change the document height, which invalidates the cached maxScroll.
    // This replaces what the polled self-heal was really protecting against,
    // and it fires only when the height genuinely changes.
    if (shell) observer.observe(shell);
    window.addEventListener("scroll", onScroll, { passive: true });
        // Named, so the cleanup below can actually remove it — an inline arrow
    // here would leak a listener on every route change.
    const onResize = () => {
      refreshMax();
      onScroll();
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
