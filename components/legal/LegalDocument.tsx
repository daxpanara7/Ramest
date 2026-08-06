import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import {
  LEGAL_TABS,
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
  PRIVACY_UPDATED,
  TERMS_INTRO,
  TERMS_SECTIONS,
  TERMS_UPDATED,
  formatLegalDate,
  legalDescription,
  legalHeading,
  legalPath,
  type LegalSection,
  type LegalTabKey,
} from "@/lib/legal";
import { SITE, breadcrumbJsonLd } from "@/lib/site";

/**
 * Heading levels are fixed by the page outline, not by styling: the hero owns
 * the single h1, the active document is h2, its sections h3, and any subhead
 * h4 — no skipped levels, which is what crawlers and screen readers read as
 * the document structure.
 */
function SectionBody({ section, index }: { section: LegalSection; index: number }) {
  return (
    <section className="legal-section" id={section.id} aria-labelledby={`${section.id}-title`}>
      <h3 className="legal-section-title" id={`${section.id}-title`}>
        <span className="legal-section-num" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="legal-section-label">{section.title}</span>
      </h3>

      {section.blocks.map((block, i) => {
        if (block.kind === "subhead") {
          return (
            <h4 className="legal-subhead" key={i}>
              {block.body}
            </h4>
          );
        }
        if (block.kind === "list") {
          return (
            <ul className="legal-list" key={i}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return (
          <p className="legal-text" key={i}>
            {block.body}
          </p>
        );
      })}
    </section>
  );
}

/**
 * Renders one legal document. Both documents used to live on a single route
 * switched by `?tab=`, which forced the route to be dynamic: reading
 * searchParams in generateMetadata opts the page out of static rendering, and
 * Next then STREAMS the metadata into the body instead of emitting it in
 * <head>. The description, canonical and OG tags were only relocated into the
 * head by React once the page hydrated, so anything reading the raw HTML
 * without running JavaScript saw a page with no description at all.
 *
 * Each document now has its own static route, so the metadata is in <head>
 * for every consumer, and both URLs are independently cacheable and
 * canonical. `/legal?tab=privacy` is redirected to /legal/privacy in
 * next.config.ts so existing links keep working.
 */
export default function LegalDocument({ doc }: { doc: LegalTabKey }) {
  const isPrivacy = doc === "privacy";

  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;
  const intro = isPrivacy ? PRIVACY_INTRO : TERMS_INTRO;
  const updated = isPrivacy ? PRIVACY_UPDATED : TERMS_UPDATED;
  const heading = legalHeading(doc);
  const path = legalPath(doc);
  // Same copy the document's <meta name="description"> uses, so the structured
  // data and the head never describe the page differently.
  const description = legalDescription(doc);

  return (
    <>
      <JsonLdScript
        id="legal-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: heading, path },
        ])}
      />
      <JsonLdScript
        id="legal-page-jsonld"
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: heading,
          description,
          url: `${SITE.url}${path}`,
          dateModified: updated,
          datePublished: updated,
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          inLanguage: "en",
        }}
      />

      <main className="legal-page" id="main-content">
        <div className="container">
          {/* Centred hero: everything above the document is one stacked,
              centre-aligned column. */}
          <header className="legal-head">
            <p className="legal-eyebrow">Legal</p>
            <h1 className="legal-title">Terms and Privacy Details</h1>
            <p className="legal-lede">
              The agreements that govern your use of this website and how we
              handle your data. Written in plain language — if anything is
              unclear, {" "}
              <a href={`mailto:${SITE.email}`}>ask us</a>.
            </p>

            {/* Real links, not JS toggles: each document has its own URL. */}
            <nav className="legal-tabs" aria-label="Legal documents">
              {LEGAL_TABS.map((t) => {
                const isActive = t.key === doc;
                return (
                  <Link
                    key={t.key}
                    href={t.href}
                    className={`legal-tab${isActive ? " is-active" : ""}`}
                    aria-current={isActive ? "page" : undefined}
                    scroll={false}
                  >
                    {t.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <article className="legal-doc" aria-labelledby="legal-doc-title">
            <div className="legal-doc-head">
              <h2 className="legal-doc-title" id="legal-doc-title">
                {heading}
              </h2>
              <p className="legal-updated">
                <span className="legal-updated-dot" aria-hidden="true" />
                Last updated{" "}
                <time dateTime={updated}>{formatLegalDate(updated)}</time>
              </p>
              <p className="legal-intro">{intro}</p>
            </div>

            {sections.map((section, i) => (
              <SectionBody key={section.id} section={section} index={i} />
            ))}

            <div className="legal-footnote">
              <p className="legal-footnote-text">
                Questions about {isPrivacy ? "your data" : "these terms"}? Email{" "}
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call{" "}
                <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>.
              </p>
              <Link
                href={legalPath(isPrivacy ? "terms" : "privacy")}
                className="legal-crosslink"
                scroll={false}
              >
                <span>
                  Read our{" "}
                  {isPrivacy ? "Terms & Conditions" : "Privacy Policy"}
                </span>
                <i className="fa-solid fa-arrow-right" aria-hidden="true" />
              </Link>
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
