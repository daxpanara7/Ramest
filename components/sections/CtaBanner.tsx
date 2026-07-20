import Link from "next/link";

type CtaBannerProps = {
  title: string;
  description: string;
  buttonLabel: string;
  href?: string;
};

/** Shared bottom CTA used across marketing pages. */
export default function CtaBanner({
  title,
  description,
  buttonLabel,
  href = "/contact",
}: CtaBannerProps) {
  return (
    <section className="cta-section">
      <div className="container cta-container">
        <div className="cta-content">
          <h2 className="cta-title">{title}</h2>
          <p className="cta-desc">{description}</p>
        </div>
        <Link href={href} className="button button-cta">
          {buttonLabel} <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
