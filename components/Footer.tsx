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

          {/* SOCIAL_LINKS is the same array Organization.sameAs is derived
              from (lib/site.ts), so the visible profile links and the
              structured data can never disagree — which is the pairing Google
              cross-checks when tying the site to the company entity.

              rel="me" is the identity half of that: it marks the profile as
              another presence of this same entity rather than an ordinary
              outbound link.

              Icons are inline SVG (about 1 KB, no request), never `fa-brands`
              classes — see the note in lib/site.ts. */}
          <div className="footer-social">
            {SOCIAL_LINKS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={`${SITE.name} on ${s.label}`}
                target="_blank"
                rel="noopener noreferrer me"
              >
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
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
