"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type DropdownKey = "services" | "company";

/** Matches the capsule's `width/min-width/padding` transition in style.css. */
const CAPSULE_TRANSITION_MS = 450;
/** A little past it, so a dropped `transitionend` still releases the gate. */
const CAPSULE_SETTLE_FALLBACK_MS = CAPSULE_TRANSITION_MS + 60;
/** Dwell before opening from a cold state — short enough to feel instant. */
const ENTER_DELAY_MS = 70;
/** Grace after leaving, long enough to cross the capsule→panel gap. */
const LEAVE_DELAY_MS = 180;

/**
 * Desktop nav dropdown controller.
 *
 * ---------------------------------------------------------------------------
 * THE BUG THIS EXISTS TO KILL
 * ---------------------------------------------------------------------------
 * The header capsule animates its width over 450ms when you hover it. For the
 * whole of that animation the nav items slide horizontally *underneath a
 * stationary cursor*, and the browser fires a genuine `mouseenter` on every
 * item that passes below the pointer.
 *
 * So: you park the cursor where "Services" will end up, "Company" sweeps
 * through that point on its way out, and Company's mouseenter fires first.
 * Company opens. A moment later Services lands under the cursor and takes
 * over. That is the flash — and it is 100% reproducible after a refresh
 * because that is when the capsule is guaranteed to start collapsed.
 *
 * No amount of React state hygiene fixes it. The previous implementation was
 * already a correct single-source-of-truth state machine and the flash
 * survived, because the events it was reacting to were not wrong — they were
 * real hovers over elements that happened to be moving.
 *
 * ---------------------------------------------------------------------------
 * THE FIX — two rules, both about ignoring element motion
 * ---------------------------------------------------------------------------
 * 1. GATE. While the capsule is expanding, no dropdown may open at all.
 *    Hovering a moving target is not a real intent signal, so we refuse to
 *    read it as one. The gate lifts on the capsule's `transitionend` (with a
 *    timeout fallback, since a dropped transitionend must not wedge the menu
 *    shut forever).
 *
 * 2. CONFIRM BY HIT-TEST. We never trust which element *sent* an event. When
 *    it is time to open, we hit-test the pointer's actual coordinates with
 *    `elementFromPoint` and open whatever is genuinely under the cursor right
 *    then. A stale mouseenter from an element that has since slid away
 *    resolves to a different answer and is discarded.
 *
 * Together these also fix the "Company looks permanently hovered" symptom:
 * Company was being opened by the sweep and then held open by its own
 * leave-grace timer while the pointer sat over Services.
 *
 * The moment the gate lifts we hit-test once and open whatever the cursor is
 * already resting on — so the menu still appears without a second wiggle, and
 * the 450ms is spent watching the capsule expand rather than waiting.
 */
export function useNavDropdown({
  enabled,
  capsuleOpen,
  headerRef,
}: {
  /** Desktop only — mobile uses the accordions. */
  enabled: boolean;
  /** True while the capsule is hovered/expanded. */
  capsuleOpen: boolean;
  headerRef: React.RefObject<HTMLElement | null>;
}) {
  const [open, setOpen] = useState<DropdownKey | null>(null);
  const openRef = useRef<DropdownKey | null>(null);

  /** False while the capsule is mid-expansion — see rule 1. */
  const settledRef = useRef(false);
  const [settled, setSettled] = useState(false);

  /** Last known real pointer position, for the rule-2 hit-test. */
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const apply = useCallback((next: DropdownKey | null) => {
    if (openRef.current === next) return;
    openRef.current = next;
    setOpen(next);
  }, []);

  /**
   * Rule 2. Which dropdown is the pointer *actually* over right now?
   * `elementFromPoint` reflects the live, post-layout truth, so an event from
   * an element that has since moved away cannot win.
   */
  const hitTest = useCallback((): DropdownKey | null => {
    const p = pointerRef.current;
    if (!p) return null;
    const el = document.elementFromPoint(p.x, p.y);
    const host = el?.closest<HTMLElement>("[data-dropdown]");
    const key = host?.dataset.dropdown;
    return key === "services" || key === "company" ? key : null;
  }, []);

  /* --- track the real pointer ------------------------------------------- */
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);

  /* --- rule 1: the gate -------------------------------------------------- */
  useEffect(() => {
    if (!enabled || !capsuleOpen) {
      settledRef.current = false;
      setSettled(false);
      return;
    }

    settledRef.current = false;
    setSettled(false);

    const header = headerRef.current;
    let done = false;
    const release = () => {
      if (done) return;
      done = true;
      settledRef.current = true;
      setSettled(true);
    };

    // The capsule animates several properties; any of the geometry ones
    // finishing means it has stopped moving.
    /* The expansion is actually driven by `max-width` on .nav-menu (the
       capsule is width:max-content, so it just follows its content). Listen
       on the header without a target check so the bubbling nav-menu event
       counts — keying only on the header's own `width` would never fire,
       because a max-content width change does not emit a transition. */
    const onTransitionEnd = (e: TransitionEvent) => {
      if (
        e.propertyName === "max-width" ||
        e.propertyName === "width" ||
        e.propertyName === "min-width" ||
        e.propertyName === "padding-inline"
      ) {
        release();
      }
    };

    header?.addEventListener("transitionend", onTransitionEnd);
    const fallback = setTimeout(release, CAPSULE_SETTLE_FALLBACK_MS);

    return () => {
      clearTimeout(fallback);
      header?.removeEventListener("transitionend", onTransitionEnd);
    };
  }, [enabled, capsuleOpen, headerRef]);

  /**
   * The one path that ever opens a menu.
   *
   * It never opens what it was told to — it waits out the dwell and then
   * opens whatever `hitTest()` says is under the cursor at that instant.
   * That single property is what makes pass-through harmless: dragging the
   * pointer across Company on the way to Services fires Company's
   * mouseenter, but by the time the timer resolves the cursor is over
   * Services, so Services is what opens. Company never flashes.
   */
  const schedule = useCallback(() => {
    if (!enabled || !settledRef.current) return;
    if (openTimerRef.current !== null) clearTimeout(openTimerRef.current);
    openTimerRef.current = setTimeout(() => {
      openTimerRef.current = null;
      apply(hitTest());
    }, ENTER_DELAY_MS);
  }, [enabled, apply, hitTest]);

  /* --- the gate lifts: adopt whatever the cursor has settled on ---------- */
  useEffect(() => {
    if (!enabled || !settled) return;
    schedule();
  }, [enabled, settled, schedule]);

  /* --- pointer entered a trigger ----------------------------------------- */
  const onEnter = useCallback(
    (key: DropdownKey, e?: { clientX: number; clientY: number }) => {
      if (!enabled) return;
      if (e) pointerRef.current = { x: e.clientX, y: e.clientY };

      // Rule 1 — the capsule is still moving. Whatever sent this is a target
      // sliding under the cursor, not a decision the user made.
      if (!settledRef.current) return;
      if (closeTimerRef.current !== null) {
        clearTimeout(closeTimerRef.current);
        closeTimerRef.current = null;
      }
      if (openRef.current === key) return;

      // Something is already open: switch in one atomic state change, no
      // close-then-open gap. Still hit-test first, so a mouseenter fired by
      // the panel re-laying out cannot hijack the open menu.
      if (openRef.current !== null) {
        apply(hitTest() ?? key);
        return;
      }

      schedule();
    },
    [enabled, apply, hitTest, schedule],
  );

  /* --- pointer left a trigger's subtree ---------------------------------- */
  const onLeave = useCallback(() => {
    if (!enabled) return;
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      // If the pointer merely crossed the capsule→panel gap it is now back
      // inside a dropdown; re-adopt it instead of closing.
      const actual = hitTest();
      apply(actual);
    }, LEAVE_DELAY_MS);
  }, [enabled, apply, hitTest]);

  const closeNow = useCallback(() => {
    clearTimers();
    apply(null);
  }, [clearTimers, apply]);

  /* --- leaving the capsule, or going mobile, always closes --------------- */
  useEffect(() => {
    if (!capsuleOpen || !enabled) closeNow();
  }, [capsuleOpen, enabled, closeNow]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  return {
    open,
    /** True once the capsule has stopped moving — drives the caret tracking. */
    settled,
    onEnter,
    onLeave,
    closeNow,
  };
}
