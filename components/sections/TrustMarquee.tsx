import { serviceCategories } from "@/lib/services";

/**
 * Slow uppercase text marquee below the hero, styled after the reference's
 * "trusted by mission-critical organizations" strip.
 *
 * Items are the industries we actually serve (from the shared services
 * data), NOT invented client names — the reference site's list is that
 * company's real client roster, which isn't ours to copy. Swap in real
 * client names here whenever they're available.
 *
 * Same seamless-loop technique as TechMarquee: the list renders twice and
 * CSS slides the track by -50%; the copy is aria-hidden.
 */
export default function TrustMarquee() {
  const industries =
    serviceCategories[serviceCategories.length - 1]?.items.map(
      (i) => i.title,
    ) ?? [];

  if (!industries.length) return null;

  return (
    <section className="trust-band" aria-label="Industries we serve">
      <p className="trust-band-eyebrow">
        Trusted across mission-critical industries
      </p>
      <div className="trust-marquee">
        <div className="trust-track">
          {[0, 1].map((copy) =>
            industries.map((name) => (
              <span
                key={`${copy}-${name}`}
                className="trust-item"
                aria-hidden={copy === 1}
              >
                {name}
              </span>
            )),
          )}
        </div>
      </div>
    </section>
  );
}
