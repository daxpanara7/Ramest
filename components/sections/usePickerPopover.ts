"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

/** Default height budget for a panel; its list scrolls past this. */
const MAX_HEIGHT = 320;

type Pos = {
  left: number;
  width: number;
  maxHeight: number;
  /** Distance from the viewport edge the panel is anchored to. */
  top?: number;
  bottom?: number;
};

type Options = {
  open: boolean;
  /** Called on a pointer press outside both the anchor and the panel. */
  onDismiss: () => void;
  maxHeight?: number;
  /** Floor for the panel width; it is never narrower than the anchor. */
  minWidth?: number;
};

/**
 * Placement and dismissal for a dropdown panel that lives in a portal.
 *
 * Shared by every picker on the site so they behave identically — the country
 * code list and the contact form's service and budget lists are the same
 * control with different rows, and drift between them is exactly what a second
 * copy of this logic would produce.
 *
 * The panel has to be portalled to <body> and positioned `fixed`: the forms it
 * opens inside set `overflow:hidden` on their card for the corner radius, which
 * would clip an absolutely positioned menu at the card edge — and on the
 * stacked mobile layout, clip it almost entirely.
 *
 * The panel element MUST carry `data-lenis-prevent`. The homepage runs Lenis
 * smooth scroll (components/motion/HomeMotion.tsx), which listens for wheel on
 * the window, calls preventDefault() and drives the document itself — so a
 * wheel over this list scrolled the page instead of the list, and no amount of
 * overscroll-behavior on the list could stop it, because the list never saw a
 * native scroll at all. That attribute is Lenis's own opt-out: it walks the
 * event's composed path and ignores the gesture entirely, leaving the browser
 * to scroll whatever is under the pointer. The contact form never showed the
 * bug for the one reason that page does not mount Lenis.
 */
export function usePickerPopover({
  open,
  onDismiss,
  maxHeight = MAX_HEIGHT,
  minWidth = 0,
}: Options) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const popRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const [pos, setPos] = useState<Pos | null>(null);
  const [mounted, setMounted] = useState(false);

  // A portal needs a DOM to aim at, and the server render has none.
  useEffect(() => setMounted(true), []);

  // Held in a ref so a caller passing an inline arrow does not resubscribe the
  // document listener on every render.
  const dismissRef = useRef(onDismiss);
  useEffect(() => {
    dismissRef.current = onDismiss;
  }, [onDismiss]);

  const place = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    // Matches the field's width by default. A panel wider than its anchor
    // hangs past the right edge, which reads as a misaligned box rather than a
    // menu belonging to that input.
    const width = Math.min(Math.max(r.width, minWidth), window.innerWidth - 16);
    const left = Math.min(
      Math.max(8, r.left),
      Math.max(8, window.innerWidth - width - 8),
    );
    const below = window.innerHeight - r.bottom - 16;
    const above = r.top - 16;
    // Flip above the field when there is more room there — on a phone the
    // form sits low enough that a downward panel would be mostly off-screen.
    setPos(
      below >= 240 || below >= above
        ? {
            left,
            width,
            top: r.bottom + 8,
            maxHeight: Math.min(maxHeight, Math.max(180, below)),
          }
        : {
            left,
            width,
            bottom: window.innerHeight - r.top + 8,
            maxHeight: Math.min(maxHeight, Math.max(180, above)),
          },
    );
  }, [maxHeight, minWidth]);

  useLayoutEffect(() => {
    if (!open) return;
    place();
    // `capture` so a scroll on any ancestor repositions, not just the window —
    // but the panel's own scrolling moves nothing, and re-placing on every tick
    // of it would re-render the whole list per frame.
    const onScroll = (e: Event) => {
      if (popRef.current?.contains(e.target as Node)) return;
      place();
    };
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (anchorRef.current?.contains(t) || popRef.current?.contains(t)) return;
      dismissRef.current();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  /* The panel chrome — search row, border, the gap around the list — is not
     scrollable, so a wheel or drag there chains straight to the page. Send it
     to the list instead. Native and non-passive: React registers onWheel and
     onTouchMove passively at the root, where preventDefault() is a no-op. */
  useEffect(() => {
    const pop = popRef.current;
    if (!open || !pop) return;

    const outsideList = (t: EventTarget | null) =>
      !listRef.current || !listRef.current.contains(t as Node);

    const onWheel = (e: WheelEvent) => {
      const list = listRef.current;
      if (!list || !outsideList(e.target)) return;
      // deltaMode 1 is lines, 2 is pages — both need converting to pixels.
      const px =
        e.deltaMode === 1
          ? e.deltaY * 16
          : e.deltaMode === 2
            ? e.deltaY * list.clientHeight
            : e.deltaY;
      list.scrollTop += px;
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (outsideList(e.target)) e.preventDefault();
    };

    pop.addEventListener("wheel", onWheel, { passive: false });
    pop.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      pop.removeEventListener("wheel", onWheel);
      pop.removeEventListener("touchmove", onTouchMove);
    };
  }, [open]);

  /* Measured before the panel mounts, not after: a popover rendered at an
     unknown position has to hide until it is placed, and a hidden element
     cannot take focus — the search box would stay unfocused on open. */
  const style: CSSProperties = pos
    ? {
        top: pos.top,
        bottom: pos.bottom,
        left: pos.left,
        width: pos.width,
        maxHeight: pos.maxHeight,
      }
    : { opacity: 0, pointerEvents: "none" };

  return { anchorRef, popRef, listRef, style, place, mounted };
}

/**
 * Keep the highlighted row in view during keyboard walking — and only then.
 * Hover moves the active index too, and following the pointer would fight the
 * wheel.
 *
 * Deliberately not `el.scrollIntoView({block:"nearest"})`: the panel is
 * portalled to <body>, so "nearest" also counts the document as a scroll
 * container and slides the whole page — smoothly, since the page sets
 * `scroll-behavior: smooth`, which is what made the page appear to scroll away
 * whenever a list was scrolled. This math never leaves the list.
 */
export function scrollRowIntoView(
  list: HTMLElement | null,
  idx: number,
) {
  const el = list?.querySelector<HTMLElement>(`[data-idx="${idx}"]`);
  if (!list || !el) return;
  const lr = list.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  if (r.top < lr.top) list.scrollTop -= lr.top - r.top;
  else if (r.bottom > lr.bottom) list.scrollTop += r.bottom - lr.bottom;
}
