import Link from "next/link";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
import { serviceCategories } from "@/lib/services";

/**
 * Blue footer: brand mark + positioning line on the left, four link columns
 * on the right, and a bottom bar with the copyright and legal link.
 *
 * The left column deliberately carries no call to action — the CtaBanner
 * section immediately above the footer already asks "Ready to Build
 * Something Great?" and links the identical "Start a Project" → /contact
 * button, so repeating it here read as duplication rather than emphasis.
 *
 * Link columns are generated from the real nav/service data rather than
 * hard-coded, so they cannot drift out of sync with the site.
 */

/**
 * Icons are inline SVG, not Font Awesome brand classes. Two `fa-brands`
 * glyphs pulled the 106 KB fa-brands-400.woff2 onto the critical path of
 * every page — it was the single slowest request in the Lighthouse trace at
 * 911 ms. Inlining two paths costs about 1 KB and downloads nothing.
 *
 * Icon row shown until the real profile URLs land in SOCIAL_LINKS
 * (lib/site.ts). Rendered as inert <span>s, not <a href="#">, so nothing is
 * focusable or clickable while it has nowhere to go — a dead link is worse
 * than a plain glyph. The moment SOCIAL_LINKS is populated these are
 * replaced automatically by the real anchors below.
 */
const SOCIAL_PLACEHOLDERS = [
  {
    label: "LinkedIn",
    path: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z",
    viewBox: "0 0 448 512",
  },
  {
    label: "Instagram",
    path: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
    viewBox: "0 0 448 512",
  },
];

/**
 * The column that replaced Contact.
 *
 * Chosen for what the footer was actually missing, not to fill space: before
 * this, the only hrefs in the whole footer were "/" and "/legal" plus the
 * service and company items. /blog, /services, /hire-developers and /contact
 * had NO sitewide link anywhere in the footer.
 *
 * That matters because the footer is the one block on every page. A link here
 * gives every crawl of any page a one-hop path to the blog — which is the
 * part of the site that gains new URLs — and spreads internal link equity to
 * the two pages that actually convert. All four are static internal routes,
 * so this costs one <ul> of markup and zero runtime work.
 *
 * Only routes that really exist are listed; a footer link to a 404 is worse
 * for SEO than no link at all.
 */
const EXPLORE_LINKS = [
  { href: "/blog", label: "Blog & Insights" },
  { href: "/services", label: "All Services" },
  { href: "/hire-developers", label: "Hire Developers" },
  { href: "/contact", label: "Contact Us" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About Us" },
  { href: "/team", label: "Our Team" },
  { href: "/infrastructure", label: "Infrastructure" },
  { href: "/certifications", label: "Engineering Standards" },
  { href: "/careers", label: "Careers" },
];

export default function Footer() {
  // Service categories drive two of the columns (Services / Industries).
  const productCategory = serviceCategories[0];
  const industriesCategory = serviceCategories[serviceCategories.length - 1];

  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        {/* ---------- Brand wordmark + positioning line ---------- */}
        <div className="footer-brand-col">
          {/* Text branding, per the brief: "Ramest" white, "Technolabs" in
              the light-blue accent gradient. */}
          <Link href="/" aria-label={`${SITE.name} home`} className="footer-brand">
            Ramest <em>Technolabs</em>
          </Link>

          <p className="footer-tagline">
            Engineering reliable web, mobile, and AI software for teams that
            ship — from {SITE.address.city}, India.
          </p>

          {/* NAP (name / address / phone) sits directly under the wordmark
              rather than in a far-right column. Keeping the business name and
              its address in one block is what local search wants to see, and
              it matches the Organization schema in lib/site.ts — same values,
              so the page and the structured data can never disagree.

              <address> is the correct element for an organisation's own
              contact details and costs nothing; the italic default is reset
              in footer.css. */}
          <address className="footer-contact">
            <ul className="footer-contact-list">
              <li className="footer-contact-item">
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li className="footer-contact-item">
                <i className="fa-solid fa-phone" aria-hidden="true" />
                <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
              </li>
              <li className="footer-contact-item">
                <i className="fa-solid fa-location-dot" aria-hidden="true" />
                {/* Linked to Maps: the address is the one footer line people
                    actually act on, and a plain <span> made them copy it by
                    hand. Opens a search rather than a hard-coded place ID so
                    it cannot rot if the listing changes. */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${SITE.name}, ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}`,
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SITE.address.street}, {SITE.address.city},{" "}
                  {SITE.address.region} {SITE.address.postalCode}
                </a>
              </li>
            </ul>
          </address>
        </div>

        {/* ---------- Link columns ----------
            One <nav> around the whole block, not one per column: four
            landmarks all called something different is noise in a screen
            reader's landmark list, where one clearly-labelled "Footer" is
            what people actually navigate by. */}
        <nav aria-label="Footer">
          <div className="footer-columns">
            <div>
              <h3 className="footer-col-title">Services</h3>
              <ul className="footer-col-list">
                {productCategory?.items.slice(0, 6).map((item) => (
                  <li key={item.slug}>
                    <Link href={item.href}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="footer-col-title">Industries</h3>
              <ul className="footer-col-list">
                {industriesCategory?.items.slice(0, 6).map((item) => (
                  <li key={item.slug}>
                    <Link href={item.href}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="footer-col-title">Company</h3>
              <ul className="footer-col-list">
                {COMPANY_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="footer-col-title">Explore</h3>
              <ul className="footer-col-list">
                {EXPLORE_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </div>

      {/* ---------- Bottom bar: copyright and legal link left, social icons
                     pushed to the right edge of the same line ---------- */}
      <div className="container">
        <div className="footer-bottom-bar">
          <span>© 2026 {SITE.name}. All rights reserved.</span>
          <nav className="footer-legal-links" aria-label="Legal">
            <Link href="/legal">Terms &amp; Conditions</Link>
          </nav>

          {/* Real anchors once profiles exist — SOCIAL_LINKS is the same
              array Organization.sameAs is derived from — otherwise the inert
              placeholder glyphs. */}
          <div className="footer-social">
            {SOCIAL_LINKS.length > 0
              ? SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    target="_blank"
                    rel="noopener noreferrer me"
                  >
                    <i className={s.icon} aria-hidden="true" />
                  </a>
                ))
              : SOCIAL_PLACEHOLDERS.map((s) => (
                  <span key={s.label} className="footer-social-placeholder">
                    <svg
                      viewBox={s.viewBox}
                      width="16"
                      height="16"
                      fill="currentColor"
                      aria-hidden="true"
                      focusable="false"
                    >
                      <path d={s.path} />
                    </svg>
                  </span>
                ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
