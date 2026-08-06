"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export type ClientQuote = {
  quote: string;
  name: string;
  role: string;
  /** Country/location shown on the name plate, mirroring the reference layout. */
  location?: string;
  /** Optional real photo. Drop a .webp in /public/assets/clients and set this —
      the component switches from the initials avatar to the image with no
      other change. Kept optional so the section ships with zero image
      requests until real client photos exist. */
  image?: string;
};

/**
 * Client-impact testimonial rail.
 *
 * A CSS scroll-snap rail, same pattern as .blog-rail — no carousel library, so
 * nothing is added to the shared bundle beyond this file. The centre card is
 * detected with an IntersectionObserver against a centre-line root margin
 * rather than on scroll, so there is no scroll handler competing with Lenis
 * on the main thread.
 *
 * Avatars are CSS gradients with initials: zero network requests, so the
 * section costs nothing on LCP. `image` swaps in a real photo per quote.
 */
/** Stable id so the inline pre-paint centring script can find the rail.
 *  Only ever one rail per page. */
const RAIL_ID = "ci-rail";

export default function ClientImpact({ quotes }: { quotes: ClientQuote[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  /* Open on the middle card, not the first: the reference layout reads as a
     centre-focused carousel, which only works if there is a card visible on
     BOTH sides at rest. Starting at index 0 left the active card pinned to
     the left edge with empty space beside it. */
  const initial = Math.floor(quotes.length / 2);
  const [active, setActive] = useState(initial);

  /* Centre the middle card.
   *
   * useLayoutEffect alone could not do this on a first load. It runs before
   * the browser paints REACT's commit, but the server-rendered HTML has
   * already been painted long before hydration starts — so the rail was
   * visibly drawn hard against its left edge and then snapped to the middle
   * once the bundle arrived. The inline script rendered just after the rail
   * (below) handles that case instead: it runs while the parser is still
   * inside the body, before the first paint, so there is nothing to see.
   *
   * This effect is still needed for client-side navigation back to the page,
   * where React reuses the DOM and inline scripts do not re-execute. The
   * guard makes it a no-op whenever the rail is already positioned, so the
   * two mechanisms can never fight. */
  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail || rail.scrollLeft > 0) return;
    const el = rail.querySelectorAll<HTMLElement>(".ci-item")[initial];
    if (!el) return;
    rail.scrollLeft = el.offsetLeft - (rail.clientWidth - el.clientWidth) / 2;
  }, [initial]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    const items = Array.from(rail.querySelectorAll<HTMLElement>(".ci-item"));
    if (!items.length) return;

    /* A 1px-tall band down the middle of the rail: whichever card overlaps it
       is the centred one. Cheaper and steadier than measuring on every frame. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = items.indexOf(e.target as HTMLElement);
            if (i !== -1) setActive(i);
          }
        }
      },
      { root: rail, rootMargin: "0px -50% 0px -50%", threshold: 0 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [quotes.length]);

  /* Centre a card by index. The arrows pass active±1; the dots pass their own
     index so clicking dot 6 jumps straight there instead of stepping. */
  const goTo = useCallback((index: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const items = Array.from(rail.querySelectorAll<HTMLElement>(".ci-item"));
    const next = Math.min(Math.max(index, 0), items.length - 1);
    const el = items[next];
    if (!el) return;
    /* scrollTo on the rail, not scrollIntoView — scrollIntoView would also
       scroll the PAGE to bring the rail into view and fight the stacked-card
       sticky layout. */
    rail.scrollTo({
      left: el.offsetLeft - (rail.clientWidth - el.clientWidth) / 2,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="ci-wrap">
      <div className="ci-nav">
        <button
          type="button"
          className="ci-arrow"
          onClick={() => goTo(active - 1)}
          disabled={active === 0}
          aria-label="Previous testimonial"
        >
          <i className="fa-solid fa-arrow-left" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="ci-arrow"
          onClick={() => goTo(active + 1)}
          disabled={active === quotes.length - 1}
          aria-label="Next testimonial"
        >
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </button>
      </div>

      <div
        className="ci-rail"
        id={RAIL_ID}
        ref={railRef}
        role="region"
        aria-label="Client testimonials"
        tabIndex={0}
      >
        <div className="ci-track">
          {quotes.map((q, i) => (
            <figure
              key={q.name}
              className={`ci-item${i === active ? " is-active" : ""}`}
              aria-current={i === active ? "true" : undefined}
            >
              <div className="ci-card">
                <span className="ci-quote-mark" aria-hidden="true">
                  &ldquo;
                </span>
                <blockquote className="ci-quote">{q.quote}</blockquote>

                <figcaption className="ci-person">
                  <span className="ci-avatar" aria-hidden="true">
                    {q.image ? (
                      <img
                        src={q.image}
                        alt=""
                        width={96}
                        height={96}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      q.name.charAt(0)
                    )}
                  </span>
                  {/* Angled plate carrying the name, as in the reference. */}
                  <span className="ci-plate">
                    <span className="ci-name">{q.name}</span>
                    <span className="ci-role">{q.role}</span>
                    {q.location && (
                      <span className="ci-location">{q.location}</span>
                    )}
                  </span>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </div>

      {/* Runs while the parser is still in the body, so the rail is centred
          before the first paint rather than snapping there at hydration.
          Reads geometry the stylesheet has already resolved (it is in <head>),
          and does nothing if the markup is not what it expects. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){var r=document.getElementById(${JSON.stringify(RAIL_ID)});if(!r)return;var i=r.querySelectorAll('.ci-item')[${initial}];if(!i)return;r.scrollLeft=i.offsetLeft-(r.clientWidth-i.clientWidth)/2;})();`,
        }}
      />

      <div className="ci-dots" role="tablist" aria-label="Testimonial position">
        {quotes.map((q, i) => (
          <button
            key={q.name}
            type="button"
            role="tab"
            className={`ci-dot${i === active ? " is-active" : ""}`}
            aria-selected={i === active}
            aria-label={`Testimonial ${i + 1}: ${q.name}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </div>
  );
}
