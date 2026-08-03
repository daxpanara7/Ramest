/**
 * Reusable animation utilities — the site's motion vocabulary.
 *
 * Every helper is GSAP-based, animates ONLY transform/opacity (compositor
 * properties, so 60fps), and is progressive enhancement: initial states are
 * set by JS at init, never by CSS, so if this module never loads the page is
 * fully visible and static.
 *
 * This module touches `window` at import time (plugin registration), so it
 * must only ever be imported from client code — HomeMotion lazy-imports it
 * inside useEffect, which also keeps GSAP out of the shared bundle.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

export type Targets = gsap.TweenTarget;

const EASE = "power3.out";

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Shared enter-viewport ScrollTrigger config for one-shot reveals. */
function enterOnce(trigger: Element | string): ScrollTrigger.Vars {
  return { trigger, start: "top 85%", once: true };
}

/* ---------------------------------------------------------------- reveals */

export function fadeUp(targets: Targets, vars: gsap.TweenVars = {}) {
  const t = gsap.utils.toArray<Element>(targets);
  if (!t.length) return null;
  return gsap.from(t, {
    y: 44,
    autoAlpha: 0,
    duration: 0.9,
    ease: EASE,
    scrollTrigger: enterOnce(t[0]),
    ...vars,
  });
}

export function fadeLeft(targets: Targets, vars: gsap.TweenVars = {}) {
  const t = gsap.utils.toArray<Element>(targets);
  if (!t.length) return null;
  return gsap.from(t, {
    x: -60,
    autoAlpha: 0,
    duration: 0.9,
    ease: EASE,
    scrollTrigger: enterOnce(t[0]),
    ...vars,
  });
}

export function fadeRight(targets: Targets, vars: gsap.TweenVars = {}) {
  const t = gsap.utils.toArray<Element>(targets);
  if (!t.length) return null;
  return gsap.from(t, {
    x: 60,
    autoAlpha: 0,
    duration: 0.9,
    ease: EASE,
    scrollTrigger: enterOnce(t[0]),
    ...vars,
  });
}

/** Staggered fade-up for grids of cards/items. Trigger is the container. */
export function stagger(
  container: Element,
  itemSelector: string,
  vars: gsap.TweenVars = {},
) {
  const items = container.querySelectorAll(itemSelector);
  if (!items.length) return null;
  return gsap.from(items, {
    y: 36,
    autoAlpha: 0,
    duration: 0.8,
    ease: EASE,
    stagger: 0.08,
    scrollTrigger: enterOnce(container),
    ...vars,
  });
}

/* --------------------------------------------------------------- parallax */

export type ParallaxOptions = {
  /** Fraction of natural scroll distance the layer moves (0.3–0.5 = classic). */
  speed?: number;
  /** Element whose scroll progress drives the movement (defaults to target). */
  trigger?: Element;
};

/** Scroll parallax: layer drifts vertically at a fraction of scroll speed. */
export function parallax(target: Element, opts: ParallaxOptions = {}) {
  const { speed = 0.35, trigger = target } = opts;
  return gsap.to(target, {
    y: () => -(speed * 220),
    ease: "none",
    scrollTrigger: {
      trigger,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
  });
}

export type MouseLayer = { el: Element; depth: number };

/**
 * Mouse parallax: layers drift toward/away from the cursor by depth.
 * Uses gsap.quickTo — one pointermove handler, zero layout reads.
 * Returns a cleanup function.
 */
export function mouseParallax(
  container: Element,
  layers: MouseLayer[],
  maxShift = 18,
): () => void {
  const movers = layers.map(({ el, depth }) => ({
    depth,
    x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power2.out" }),
    y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power2.out" }),
  }));

  const onMove = (e: PointerEvent) => {
    const nx = (e.clientX / window.innerWidth) * 2 - 1;
    const ny = (e.clientY / window.innerHeight) * 2 - 1;
    for (const m of movers) {
      m.x(nx * maxShift * m.depth);
      m.y(ny * maxShift * m.depth);
    }
  };

  container.addEventListener("pointermove", onMove as EventListener, {
    passive: true,
  });
  return () =>
    container.removeEventListener("pointermove", onMove as EventListener);
}

/* ----------------------------------------------------------- big moments */

/** Image reveal: clip + scale settle as the image enters. */
export function imageReveal(targets: Targets, vars: gsap.TweenVars = {}) {
  const t = gsap.utils.toArray<Element>(targets);
  if (!t.length) return null;
  return gsap.from(t, {
    autoAlpha: 0,
    scale: 1.08,
    duration: 1.1,
    ease: EASE,
    scrollTrigger: enterOnce(t[0]),
    ...vars,
  });
}

/** Text reveal: element's direct children rise in sequence. */
export function textReveal(container: Element, vars: gsap.TweenVars = {}) {
  const items = container.children.length ? container.children : [container];
  return gsap.from(items, {
    y: 28,
    autoAlpha: 0,
    duration: 0.8,
    ease: EASE,
    stagger: 0.07,
    scrollTrigger: enterOnce(container),
    ...vars,
  });
}

/** Hero entrance: eyebrow → title → copy → actions, staggered. */
export function heroReveal(hero: Element) {
  const parts = hero.querySelectorAll(
    ".hero-badge, .hero-title, .hero-desc, .hero-actions",
  );
  if (!parts.length) return null;
  return gsap.from(parts, {
    y: 40,
    autoAlpha: 0,
    duration: 1,
    ease: EASE,
    stagger: 0.12,
    delay: 0.1,
  });
}

/** Generic section entrance: header rises, then its content. */
export function sectionReveal(section: Element) {
  const header = section.querySelector(".section-header, .eng-header");
  return header ? fadeUp(header, { scrollTrigger: enterOnce(section) }) : null;
}

/** Footer entrance: columns rise as the footer scrolls into view. */
export function footerReveal(footer: Element) {
  const cols = footer.querySelectorAll(".footer-col");
  if (!cols.length) return null;
  return gsap.from(cols, {
    y: 36,
    autoAlpha: 0,
    duration: 0.9,
    ease: EASE,
    stagger: 0.08,
    scrollTrigger: enterOnce(footer),
  });
}

/**
 * Navbar entrance. The header centers itself with translateX(-50%), so we
 * must not write transforms here — opacity only.
 */
export function navbarReveal(nav: Element) {
  return gsap.from(nav, { autoAlpha: 0, duration: 0.8, ease: "power2.out" });
}

/** Button hover micro-interaction (scale + settle). Returns cleanup. */
export function buttonHover(el: Element, scale = 1.04): () => void {
  const enter = () =>
    gsap.to(el, { scale, duration: 0.35, ease: "power2.out" });
  const leave = () => gsap.to(el, { scale: 1, duration: 0.45, ease: EASE });
  el.addEventListener("pointerenter", enter);
  el.addEventListener("pointerleave", leave);
  return () => {
    el.removeEventListener("pointerenter", enter);
    el.removeEventListener("pointerleave", leave);
  };
}

/* ------------------------------------------------------------ card stack */

/**
 * Stacked-section parallax: each card is CSS position:sticky, so the next
 * section slides over the previous one. This adds the depth cue — while a
 * card is being covered it scales down and dims slightly, scrubbed to
 * scroll. Sticky works without JS; this only enhances it.
 */
export function stackCards(cards: Element[]) {
  const tweens: gsap.core.Tween[] = [];
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    // Depth cue = scale + a dark veil (the card's ::after, driven through a
    // CSS variable). NEVER element opacity: sticky cards stack behind each
    // other, so a translucent card lets the previous one bleed through.
    tweens.push(
      gsap.to(card, {
        scale: 0.955,
        "--veil": 0.5,
        transformOrigin: "center top",
        ease: "none",
        // Force a 3D matrix so the scale runs on the compositor instead of
        // triggering a main-thread repaint of a full-viewport card each frame.
        force3D: true,
        scrollTrigger: {
          trigger: next,
          start: "top bottom",
          end: "top 15%",
          // Numeric scrub adds ~0.4s of catch-up smoothing. `scrub: true`
          // maps 1:1 to scroll position, so every jitter in the wheel or
          // trackpad delta shows up directly in the scale — that is what
          // reads as "rough".
          scrub: 0.4,
          // Snap layer promotion to whole pixels; sub-pixel scaling on a
          // large card is what makes text shimmer while it animates.
          fastScrollEnd: true,
        },
      }),
    );
  });
  return tweens;
}

/**
 * Magnetic button: the element leans toward the cursor while hovered and
 * springs back on leave. quickTo keeps it on the compositor.
 * Returns a cleanup function.
 */
export function magnetic(el: Element, strength = 0.35): () => void {
  const x = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
  const y = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });

  const onMove = (e: PointerEvent) => {
    const r = (el as HTMLElement).getBoundingClientRect();
    x((e.clientX - (r.left + r.width / 2)) * strength);
    y((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.45)" });
  };

  el.addEventListener("pointermove", onMove as EventListener, {
    passive: true,
  });
  el.addEventListener("pointerleave", onLeave);
  return () => {
    el.removeEventListener("pointermove", onMove as EventListener);
    el.removeEventListener("pointerleave", onLeave);
  };
}

/* -------------------------------------------------------------- count-up */

/** Animate a stat like "30+" / "98%" from 0 when it scrolls into view. */
export function countUp(el: Element) {
  const raw = el.textContent ?? "";
  const match = raw.match(/^(\d+)(.*)$/);
  if (!match) return null;
  const end = parseInt(match[1], 10);
  const suffix = match[2];
  const state = { n: 0 };
  return gsap.to(state, {
    n: end,
    duration: 1.4,
    ease: "power2.out",
    scrollTrigger: enterOnce(el),
    onUpdate: () => {
      el.textContent = `${Math.round(state.n)}${suffix}`;
    },
  });
}
