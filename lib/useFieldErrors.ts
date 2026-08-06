"use client";

import { useCallback, useRef, useState } from "react";

export type FieldValidators = Record<string, (value: string) => string | null>;

/**
 * The per-field error behaviour the three public forms share.
 *
 * Timing is the whole point of this hook. A field is judged on blur, not on
 * every keystroke — flagging an email as invalid while someone is still typing
 * the domain is noise, and it trains people to ignore the message. But once a
 * field *is* flagged it re-checks on change, so the error clears the moment it
 * is fixed instead of lingering until the next blur.
 */
export function useFieldErrors(validators: FieldValidators) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Held in a ref so the callbacks stay stable across renders even though the
  // caller passes a fresh object literal each time.
  const rules = useRef(validators);
  rules.current = validators;

  /** Judge a field. Call from onBlur. */
  const validate = useCallback((field: string, value: string) => {
    const message = rules.current[field]?.(value) ?? null;
    setErrors((prev) => {
      if (!message) {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      }
      if (prev[field] === message) return prev;
      return { ...prev, [field]: message };
    });
    return message;
  }, []);

  /** Re-judge, but only a field already showing an error. Call from onChange. */
  const revalidate = useCallback((field: string, value: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const message = rules.current[field]?.(value) ?? null;
      if (message === prev[field]) return prev;
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }, []);

  /**
   * Judges every field in `values`, publishes the result, and moves focus to
   * the first failure so a keyboard user is not left hunting for it.
   *
   * `values` is iterated in insertion order, so declare it in visual field
   * order and "first failure" means the topmost one.
   *
   * @param ids field name -> input id, for the focus move.
   * @returns true when the form is clear to submit.
   */
  const validateAll = useCallback(
    (values: Record<string, string>, ids: Record<string, string> = {}) => {
      const found: Record<string, string> = {};
      for (const [field, value] of Object.entries(values)) {
        const message = rules.current[field]?.(value) ?? null;
        if (message) found[field] = message;
      }
      setErrors(found);

      const firstFailed = Object.keys(values).find((field) => found[field]);
      const id = firstFailed ? ids[firstFailed] : undefined;
      if (id) {
        // Deferred so React has committed the error text before focus lands on
        // the input pointing at it — screen readers announce the
        // aria-describedby target at focus time, not before.
        //
        // A timer rather than requestAnimationFrame: rAF does not run at all
        // while the tab is unfocused or hidden, which would silently drop the
        // focus move for anyone submitting in a background tab.
        setTimeout(() => {
          const el = document.getElementById(id);
          el?.focus();
          el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 0);
      }
      return Object.keys(found).length === 0;
    },
    []
  );

  const clearErrors = useCallback(() => setErrors({}), []);

  /** Set or clear one field's error directly (file pickers, server replies). */
  const setFieldError = useCallback((field: string, message: string | null) => {
    setErrors((prev) => {
      if (!message) {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      }
      return { ...prev, [field]: message };
    });
  }, []);

  return { errors, validate, revalidate, validateAll, clearErrors, setFieldError };
}

/**
 * The aria wiring a flagged input needs, so every form spells it the same way.
 * Spread onto the input: `{...fieldAria("contact-email", errors.email)}`.
 */
export function fieldAria(id: string, message?: string) {
  return {
    "aria-invalid": message ? (true as const) : undefined,
    "aria-describedby": message ? `${id}-error` : undefined,
  };
}
