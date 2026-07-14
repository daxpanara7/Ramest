"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const DEFAULT_ENTER_DELAY = 120;
export const DEFAULT_LEAVE_DELAY = 180;

export type UseDelayedHoverOptions = {
  /** Ms to wait after pointer enter before expanding. Default: 120 */
  enterDelay?: number;
  /** Ms to wait after pointer leave before collapsing. Default: 180 */
  leaveDelay?: number;
  /** When false, hover is forced off and timers are cleared. */
  enabled?: boolean;
};

export type UseDelayedHoverReturn = {
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  /** Imperatively set hover state (cancels pending timers). */
  setHovered: (value: boolean) => void;
  hoverProps: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
};

/**
 * Hover state with enter/leave grace periods so rapid pointer motion
 * does not jitter open/close animations.
 */
export function useDelayedHover(
  options: UseDelayedHoverOptions = {}
): UseDelayedHoverReturn {
  const {
    enterDelay = DEFAULT_ENTER_DELAY,
    leaveDelay = DEFAULT_LEAVE_DELAY,
    enabled = true,
  } = options;

  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enabledRef = useRef(enabled);
  const enterDelayRef = useRef(enterDelay);
  const leaveDelayRef = useRef(leaveDelay);

  useEffect(() => {
    enabledRef.current = enabled;
    enterDelayRef.current = enterDelay;
    leaveDelayRef.current = leaveDelay;
  }, [enabled, enterDelay, leaveDelay]);

  const clearTimers = useCallback(() => {
    if (enterTimerRef.current !== null) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
    if (leaveTimerRef.current !== null) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      isHoveredRef.current = false;
      setIsHovered(false);
    }
  }, [enabled, clearTimers]);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const onMouseEnter = useCallback(() => {
    if (!enabledRef.current) return;

    if (leaveTimerRef.current !== null) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    if (isHoveredRef.current) return;

    if (enterTimerRef.current !== null) {
      clearTimeout(enterTimerRef.current);
    }

    enterTimerRef.current = setTimeout(() => {
      enterTimerRef.current = null;
      isHoveredRef.current = true;
      setIsHovered(true);
    }, enterDelayRef.current);
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!enabledRef.current) return;

    if (enterTimerRef.current !== null) {
      clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }

    if (!isHoveredRef.current) return;

    if (leaveTimerRef.current !== null) {
      clearTimeout(leaveTimerRef.current);
    }

    leaveTimerRef.current = setTimeout(() => {
      leaveTimerRef.current = null;
      isHoveredRef.current = false;
      setIsHovered(false);
    }, leaveDelayRef.current);
  }, []);

  const setHovered = useCallback(
    (value: boolean) => {
      clearTimers();
      isHoveredRef.current = value;
      setIsHovered(value);
    },
    [clearTimers]
  );

  return {
    isHovered,
    onMouseEnter,
    onMouseLeave,
    setHovered,
    hoverProps: { onMouseEnter, onMouseLeave },
  };
}
