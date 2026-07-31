import type { Metadata } from "next";
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
  type LegalSection,
  type LegalTabKey,
} from "@/lib/legal";
import { SITE, breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

type SearchParams = { tab?: string };

/**
 * One route serves both documents, switched by ?tab= — the tabs are real
 * links, so each document is independently shareable, crawlable, and works
 * without JavaScript. Metadata is generated per tab so search engines see a
 * distinct title/description/canonical for each.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { tab } = await searchParams;
  const isPrivacy = tab === "privacy";

  return createPageMetadata(
    isPrivacy
      ? {
          title: "Privacy Policy",
          description: `How ${SITE.name} collects, uses, stores, and protects your personal information, and the rights you have over your data.`,
          path: "/legal?tab=privacy",
        }
      : {
          title: "Terms & Conditions",
          description: `The terms that govern your use of the ${SITE.name} website, including intellectual property, user content, and liability.`,
          path: "/legal",
        },
  );
}

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

export default async function LegalPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { tab } = await searchParams;
  const active: LegalTabKey = tab === "privacy" ? "privacy" : "terms";
  const isPrivacy = active === "privacy";

  const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;
  const intro = isPrivacy ? PRIVACY_INTRO : TERMS_INTRO;
  const updated = isPrivacy ? PRIVACY_UPDATED : TERMS_UPDATED;
  const heading = isPrivacy ? "Privacy Policy" : "Terms and Conditions";

  const path = isPrivacy ? "/legal?tab=privacy" : "/legal";

  // Same copy the tab's <meta name="description"> uses, so the structured
  // data and the head never describe the page differently.
  const description = isPrivacy
    ? `How ${SITE.name} collects, uses, stores, and protects your personal information, and the rights you have over your data.`
    : `The terms that govern your use of the ${SITE.name} website, including intellectual property, user content, and liability.`;

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
                const isActive = t.key === active;
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
                href={isPrivacy ? "/legal" : "/legal?tab=privacy"}
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
