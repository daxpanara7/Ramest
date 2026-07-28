import Link from "next/link";

type CtaBannerProps = {
  title: string;
  description: string;
  buttonLabel: string;
  href?: string;
};

/**
 * Bottom CTA card, styled after the sdipresence.com reference: a white card
 * with a blue bloom rising from its base, a gradient headline, and a pill
 * button. It sits immediately above the footer on every marketing page.
 *
 * Props are unchanged from the previous version, so no page needed editing.
 */
export default function CtaBanner({
  title,
  description,
  buttonLabel,
  href = "/contact",
}: CtaBannerProps) {
  return (
    // Full-bleed white card: it spans the viewport and the page shell's rounded
    // bottom supplies the curve, exactly as the reference does.
    //
    // Deliberately NOT using the site's `reveal` class — that starts at
    // opacity:0 and depends on an IntersectionObserver that did not fire for
    // this element, leaving the CTA invisible. The spring is a scroll-driven
    // CSS animation instead, so the card is visible even if JS never runs.
    <section className="cta-section">
      <div className="cta-card">
        <div className="cta-lines" aria-hidden="true" />
        <div className="container cta-card-inner">
          {(() => {
            const words = title.split(" ");
            const split = Math.ceil(words.length / 2);
            return (
              <h2 className="cta-title">
                {words.slice(0, split).join(" ")}
                <br />
                <em>{words.slice(split).join(" ")}</em>
              </h2>
            );
          })()}
          <p className="cta-desc">{description}</p>
          <Link href={href} className="cta-button">
            {buttonLabel}
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
