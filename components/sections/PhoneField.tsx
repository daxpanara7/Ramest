"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { COUNTRIES, POPULAR, flagEmoji, type Country } from "@/lib/country-codes";
import { usePickerPopover, scrollRowIntoView } from "./usePickerPopover";

type Props = {
  id: string;
  /** National part only — the dialling code lives in `country`. */
  value: string;
  onValueChange: (v: string) => void;
  country: Country;
  onCountryChange: (c: Country) => void;
  placeholder?: string;
  /** Paints the wrapper and marks the input invalid to assistive tech. */
  invalid?: boolean;
  /** Id of the FieldError paragraph explaining why. */
  describedBy?: string;
  /** Receives the live input value — reading `value` from the parent's state
   *  instead would be one render stale when someone types and tabs straight
   *  out, and the field would validate the previous keystroke. */
  onBlur?: (value: string) => void;
};

/**
 * Phone input with a country-code picker.
 *
 * The panel, its placement and its dismissal come from `usePickerPopover`,
 * shared with SelectField so every dropdown on a form is the same control.
 *
 * Filtering matches name, ISO code and dialling code, so "+971", "ae" and
 * "emirates" all reach the same row.
 */
export default function PhoneField({
  id,
  value,
  onValueChange,
  country,
  onCountryChange,
  // Short on purpose: the country trigger eats the left third of the field,
  // and "Enter contact number" clips at the two-column width.
  placeholder = "Phone number",
  invalid = false,
  describedBy,
  onBlur,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const listId = `${useId()}-countries`;

  const { anchorRef, popRef, listRef, style, place, mounted } =
    usePickerPopover({
      open,
      onDismiss: () => {
        setOpen(false);
        setQuery("");
      },
    });

  const results = useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return null; // null = show the grouped default view
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.iso.toLowerCase() === q ||
        c.dial.startsWith(q),
    );
  }, [query]);

  /* One flat array in render order, so arrow keys walk the list the user sees
     rather than the alphabetical source order. */
  const rows = useMemo(
    () => results ?? [...POPULAR, ...COUNTRIES],
    [results],
  );

  const openPop = () => {
    place();
    setOpen(true);
  };

  // Focus the search box on open; the list is long enough that typing is the
  // fast path even for someone who reached it with the mouse.
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  // A new query is a new list — start it at the top rather than wherever the
  // previous one happened to be scrolled to.
  useEffect(() => {
    setActive(0);
    if (listRef.current) listRef.current.scrollTop = 0;
  }, [query, listRef]);

  // Hover moves `active` too, so the list only chases the highlight while the
  // keyboard is driving it — see scrollRowIntoView.
  const keyNav = useRef(false);

  useEffect(() => {
    if (!open || !keyNav.current) return;
    scrollRowIntoView(listRef.current, active);
  }, [active, open, listRef]);

  const close = (returnFocus = true) => {
    setOpen(false);
    setQuery("");
    if (returnFocus) triggerRef.current?.focus();
  };

  const pick = (c: Country) => {
    onCountryChange(c);
    setOpen(false);
    setQuery("");
    // Straight into the number — selecting a code is never the last step.
    phoneRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" || e.key === "Tab") {
      // Tab is not swallowed: focus goes back to the trigger and the browser's
      // own default moves it on to the number field from there — without that,
      // Tab would leave from inside the portal at the end of <body>.
      if (e.key === "Escape") e.preventDefault();
      close();
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      keyNav.current = true;
      setActive((i) => {
        const next = e.key === "ArrowDown" ? i + 1 : i - 1;
        return (next + rows.length) % rows.length;
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
      const c = rows[active];
      if (c) pick(c);
    }
  };

  const option = (c: Country, idx: number) => (
    <li key={`${c.iso}-${idx}`}>
      <button
        type="button"
        role="option"
        id={`${listId}-${idx}`}
        data-idx={idx}
        aria-selected={c.iso === country.iso}
        className={`picker-opt${idx === active ? " is-active" : ""}${c.iso === country.iso ? " is-selected" : ""}`}
        // pointerdown would fire before the outside-click handler settles;
        // mousemove-driven highlight keeps mouse and keyboard in agreement.
        onMouseMove={() => {
          keyNav.current = false;
          setActive(idx);
        }}
        onClick={() => pick(c)}
      >
        <span className="phone-flag" aria-hidden="true">{flagEmoji(c.iso)}</span>
        <span className="picker-opt-name">{c.name}</span>
        <span className="picker-opt-meta">+{c.dial}</span>
      </button>
    </li>
  );

  const pop = (
    <div
      ref={popRef}
      className="picker-pop"
      style={style}
      onKeyDown={onKeyDown}
      // Hands the wheel back to the browser inside the panel — see the note in
      // usePickerPopover. Without it the homepage's Lenis scrolls the document.
      data-lenis-prevent
    >
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
          aria-label="Search countries"
          autoComplete="off"
          placeholder="Search country or code…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <ul className="picker-list" id={listId} role="listbox" aria-label="Country code" ref={listRef}>
        {rows.length === 0 ? (
          <li className="picker-empty">No country matches “{query.trim()}”.</li>
        ) : results ? (
          rows.map(option)
        ) : (
          <>
            <li className="picker-group" role="presentation">Popular</li>
            {POPULAR.map((c, i) => option(c, i))}
            <li className="picker-group" role="presentation">All countries</li>
            {COUNTRIES.map((c, i) => option(c, POPULAR.length + i))}
          </>
        )}
      </ul>
    </div>
  );

  return (
    <div
      className={`phone-field${open ? " is-open" : ""}${invalid ? " is-invalid" : ""}`}
      ref={anchorRef}
    >
      <button
        ref={triggerRef}
        type="button"
        className="phone-country"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Country code: ${country.name}, +${country.dial}. Change`}
        onClick={() => (open ? close() : openPop())}
        onKeyDown={(e) => {
          if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            openPop();
          }
        }}
      >
        <span className="phone-flag" aria-hidden="true">{flagEmoji(country.iso)}</span>
        <span className="phone-dial">+{country.dial}</span>
        <svg className="phone-caret" viewBox="0 0 24 24" width="12" height="12" aria-hidden="true" focusable="false">
          <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <input
        ref={phoneRef}
        id={id}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        className="phone-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        // Comfortably past the longest real number once separators are typed;
        // the server caps the stored value at 40 including the dialling code.
        maxLength={24}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />

      {mounted && open ? createPortal(pop, document.body) : null}
    </div>
  );
}
