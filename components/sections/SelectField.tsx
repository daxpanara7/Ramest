"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePickerPopover, scrollRowIntoView } from "./usePickerPopover";

type Props = {
  id: string;
  value: string;
  onChange: (v: string) => void;
  /** Shown on the trigger until something is chosen, e.g. "Project Budget". */
  placeholder: string;
  options: readonly string[];
  name?: string;
  /** Announced to screen readers; the visible label is usually `sr-only`. */
  label?: string;
};

/** Above this many rows the panel gets a search box; below it, scanning wins. */
const SEARCH_FROM = 10;

/** How long consecutive keystrokes count as one type-to-jump query. */
const TYPEAHEAD_MS = 700;

/**
 * Themed dropdown for the contact form's Interested Service and Project
 * Budget fields.
 *
 * A listbox rather than a native <select>, because a native select's popup is
 * painted by the operating system: it arrives grey and system-styled next to
 * the country picker, which is the site's navy panel. `appearance:none` only
 * ever restyled the closed control, never the open list — the two dropdowns on
 * one form could not be made to match while one of them was native.
 *
 * So this shares PhoneField's panel outright: same portal placement, same
 * rows, same keyboard model, via `usePickerPopover`. What is given up is the
 * platform's own behaviour, and each piece is replaced here — type-to-jump for
 * short lists, a search box for long ones, arrow/Home/End/Escape, and
 * `role="combobox"` over a hidden input so the field still carries a name.
 */
export default function SelectField({
  id,
  value,
  onChange,
  placeholder,
  options,
  name,
  label,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const keyNav = useRef(false);

  const listId = `${useId()}-options`;
  const searchable = options.length >= SEARCH_FROM;

  const { anchorRef, popRef, listRef, style, place, mounted } =
    usePickerPopover({
      open,
      onDismiss: () => {
        setOpen(false);
        setQuery("");
      },
    });

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const openPop = () => {
    place();
    // Open on the current answer rather than the top of the list, so arrowing
    // from an already-chosen value moves relative to it.
    const i = options.indexOf(value);
    setActive(i < 0 ? 0 : i);
    keyNav.current = true;
    setOpen(true);
  };

  const close = (returnFocus = true) => {
    setOpen(false);
    setQuery("");
    if (returnFocus) triggerRef.current?.focus();
  };

  const pick = (v: string) => {
    onChange(v);
    close();
  };

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  // A new query is a new list — start it at the top rather than wherever the
  // previous one happened to be scrolled to.
  useEffect(() => {
    if (!query) return;
    setActive(0);
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [query, listRef]);

  useEffect(() => {
    if (!open || !keyNav.current) return;
    scrollRowIntoView(listRef.current, active);
  }, [active, open, listRef]);

  /* Type-to-jump, the one native-select behaviour a short list still wants:
     "b" walks to Below $10K. Only for the unsearchable lists — where there is
     a search box, the same keystrokes belong to it. */
  const typed = useRef({ q: "", at: 0 });

  const typeahead = (key: string) => {
    const now = Date.now();
    const q =
      (now - typed.current.at < TYPEAHEAD_MS ? typed.current.q : "") +
      key.toLowerCase();
    typed.current = { q, at: now };
    // A repeated single letter cycles through the matches for that letter,
    // which is what holding "s" does in a native select.
    const repeat = q.length > 1 && q.split("").every((c) => c === q[0]);
    const needle = repeat ? q[0] : q;
    const from = repeat ? active + 1 : 0;
    const hit = rows.findIndex(
      (o, i) => i >= from && o.toLowerCase().startsWith(needle),
    );
    const idx =
      hit >= 0
        ? hit
        : rows.findIndex((o) => o.toLowerCase().startsWith(needle));
    if (idx < 0) return false;
    keyNav.current = true;
    setActive(idx);
    return true;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openPop();
      }
      return;
    }
    if (e.key === "Escape" || e.key === "Tab") {
      // Tab is not swallowed: focus is put back on the trigger and the
      // browser's own default then moves it to the next field from there —
      // without that, Tab would leave from inside the portal at the end of
      // <body> and land nowhere near the form.
      if (e.key === "Escape") e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      keyNav.current = true;
      setActive((i) => {
        const next = e.key === "ArrowDown" ? i + 1 : i - 1;
        return rows.length ? (next + rows.length) % rows.length : 0;
      });
      return;
    }
    if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      keyNav.current = true;
      setActive(e.key === "Home" ? 0 : rows.length - 1);
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      const v = rows[active];
      if (v !== undefined) pick(v);
      return;
    }
    if (!searchable && e.key.length === 1 && !e.metaKey && !e.ctrlKey) {
      if (typeahead(e.key)) e.preventDefault();
    }
  };

  const pop = (
    <div
      ref={popRef}
      className="picker-pop"
      style={style}
      // Hands the wheel back to the browser inside the panel — see the note in
      // usePickerPopover. Without it the homepage's Lenis scrolls the document.
      data-lenis-prevent
    >
      {searchable ? (
        <div className="picker-search">
          <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true" focusable="false">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14Zm5 12 4 4"
            />
          </svg>
          <input
            ref={searchRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={rows.length ? `${listId}-${active}` : undefined}
            aria-label={`Search ${label ?? placeholder}`}
            autoComplete="off"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      ) : null}

      <ul
        className="picker-list"
        id={listId}
        role="listbox"
        aria-label={label ?? placeholder}
        ref={listRef}
      >
        {rows.length === 0 ? (
          <li className="picker-empty">No match for “{query.trim()}”.</li>
        ) : (
          rows.map((o, idx) => (
            <li key={o}>
              <button
                type="button"
                role="option"
                id={`${listId}-${idx}`}
                data-idx={idx}
                aria-selected={o === value}
                className={`picker-opt${idx === active ? " is-active" : ""}${o === value ? " is-selected" : ""}`}
                // Keeps focus where it already is — on the trigger, or in the
                // search box — so the keyboard model survives a mouse click.
                onMouseDown={(e) => e.preventDefault()}
                // mousemove-driven highlight keeps mouse and keyboard in
                // agreement; there is never a second, competing highlight.
                onMouseMove={() => {
                  keyNav.current = false;
                  setActive(idx);
                }}
                onClick={() => pick(o)}
              >
                <span className="picker-opt-name">{o}</span>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );

  return (
    <div
      className={`select-field${open ? " is-open" : ""}`}
      ref={anchorRef}
      onKeyDown={onKeyDown}
    >
      {/* The value still leaves the component under a name, for autofill and
          for any caller that reads the form rather than the state. */}
      <input type="hidden" name={name} value={value} />

      <button
        ref={triggerRef}
        type="button"
        id={id}
        className={`select-field-input${value ? "" : " is-placeholder"}`}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close() : openPop())}
      >
        <span className="select-field-value">{value || placeholder}</span>
      </button>

      <svg
        className="select-field-chevron"
        viewBox="0 0 20 20"
        width="16"
        height="16"
        aria-hidden="true"
        focusable="false"
      >
        <path
          d="M5 7.5 10 12.5 15 7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {mounted && open ? createPortal(pop, document.body) : null}
    </div>
  );
}
