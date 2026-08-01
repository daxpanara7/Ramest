/**
 * Homepage motion orchestration: premium smooth scrolling (Lenis driven by
 * GSAP's ticker, synced to ScrollTrigger) plus every scroll/mouse effect,
 * wired to the redesigned homepage's hx- selectors.
 *
 * Client-only — lazy-imported from HomeMotion inside useEffect, so none of
 * this ships in the shared bundle or runs during SSR.
 *
 * Deliberately NOT ScrollSmoother: it re-parents the page into a transformed
 * wrapper, which breaks position:fixed elements (our pill header). Lenis
 * keeps native document scroll, so fixed elements keep working.
 */
import Lenis from "lenis";
import {
  ScrollTrigger,
  countUp,
  gsap,
  magnetic,
  mouseParallax,
  navbarReveal,
  parallax,
  prefersReducedMotion,
  stackCards,
} from "./animations";

export function initHomeMotion(): () => void {
  if (prefersReducedMotion()) return () => {};

  const cleanups: Array<() => void> = [];

  /* ---- premium scroll: Lenis + ScrollTrigger, one rAF loop (GSAP ticker) */
  const lenis = new Lenis({
    lerp: 0.08, // soft acceleration/deceleration (lower = floatier)
    wheelMultiplier: 1,
    /* syncTouch was ON and caused the mobile stutter. It takes momentum away
       from the browser's compositor and re-drives it from JS, so every frame
       has to wait on the main thread — on a phone that reads as juddering
       and rubber-banding. Native touch momentum is already smooth and runs
       off-thread, so Lenis now handles wheel only and leaves touch alone. */
    syncTouch: false,
    smoothWheel: true,
  });
  lenis.on("scroll", ScrollTrigger.update);
  const tick = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  cleanups.push(() => {
    gsap.ticker.remove(tick);
    lenis.destroy();
  });

  /* ---- navbar: fade in, opacity only (header centers via translateX) */
  const header = document.querySelector(".header");
  if (header) navbarReveal(header);

  /* ---- hero: depth layers only. The entrance is pure CSS (homepage.css)
     so the H1 is painted with the first frame — better LCP, and GSAP can
     never leave hero content hidden. */
  const hero = document.querySelector(".nv-hero");
  if (hero) {
    /* depth layers: scroll parallax + mouse drift. Aurora c animates via
       CSS, so GSAP only ever touches a and b — no transform fights. */
    const glowA = hero.querySelector(".nv-aurora-a");
    const glowB = hero.querySelector(".nv-aurora-b");
    if (glowA) parallax(glowA, { speed: 0.35, trigger: hero });
    if (glowB) parallax(glowB, { speed: -0.25, trigger: hero });

    if (window.matchMedia("(pointer: fine)").matches) {
      const layers = [
        glowA && { el: glowA, depth: 1 },
        glowB && { el: glowB, depth: -0.7 },
      ].filter(Boolean) as { el: Element; depth: number }[];
      if (layers.length) cleanups.push(mouseParallax(hero, layers, 16));

      /* cursor spotlight: a fixed-size disc moved with transforms only.
         Hero rect is cached and refreshed on resize — no layout reads in the
         pointermove path. */
      const spotlight = hero.querySelector(".nv-spotlight");
      if (spotlight) {
        const sx = gsap.quickTo(spotlight, "x", {
          duration: 0.55,
          ease: "power2.out",
        });
        const sy = gsap.quickTo(spotlight, "y", {
          duration: 0.55,
          ease: "power2.out",
        });
        let rect = hero.getBoundingClientRect();
        const onResize = () => {
          rect = hero.getBoundingClientRect();
        };
        const onSpot = (e: PointerEvent) => {
          hero.classList.add("hx-spot-on");
          sx(e.clientX - rect.left);
          sy(e.clientY - rect.top);
        };
        window.addEventListener("resize", onResize, { passive: true });
        hero.addEventListener("pointermove", onSpot as EventListener, {
          passive: true,
        });
        cleanups.push(() => {
          window.removeEventListener("resize", onResize);
          hero.removeEventListener("pointermove", onSpot as EventListener);
        });
      }
    }
  }

  /* ---- magnetic CTAs (fine pointers only) */
  if (window.matchMedia("(pointer: fine)").matches) {
    document
      .querySelectorAll(".hx-magnetic")
      .forEach((el) => cleanups.push(magnetic(el, 0.3)));
  }

  /* ---- counters: only mutate text, so a missed trigger can never hide
     content */
  document.querySelectorAll("[data-countup]").forEach((el) => countUp(el));

  /* NOTE: no opacity-hiding reveals inside the sticky stack — ScrollTrigger
     start positions are unreliable inside position:sticky containers, and a
     missed trigger would leave content permanently invisible. The site's
     existing .reveal IntersectionObserver handles section entrances. */

  /* ---- stacked sections: sticky offset math for EVERY viewport.
     Each card's sticky top = min(0, viewportHeight - cardHeight), so cards
     taller than the screen scroll fully through before pinning — this is
     what makes the stack usable on mobile. Recomputed on any resize. */
  const stack = gsap.utils.toArray<HTMLElement>(".stack-card");
  if (stack.length) {
    const setStackTops = () => {
      const vh = window.innerHeight;
      for (const card of stack) {
        card.style.setProperty(
          "--stack-top",
          `${Math.min(0, Math.round(vh - card.offsetHeight))}px`,
        );
      }
      ScrollTrigger.refresh();
    };
    setStackTops();
    const ro = new ResizeObserver(setStackTops);
    stack.forEach((card) => ro.observe(card));
    window.addEventListener("resize", setStackTops, { passive: true });
    cleanups.push(() => {
      ro.disconnect();
      window.removeEventListener("resize", setStackTops);
    });
  }

  /* ---- covered-card scale + veil (pointer devices; scrubbed) */
  const mm = gsap.matchMedia();
  mm.add("(min-width: 769px)", () => {
    if (stack.length) stackCards(stack);
  });
  cleanups.push(() => mm.revert());

  /* ---- teardown */
  return () => {
    cleanups.forEach((fn) => fn());
    ScrollTrigger.getAll().forEach((st) => st.kill());
  };
}
