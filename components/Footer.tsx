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
 * Icon row shown until the real profile URLs land in SOCIAL_LINKS
 * (lib/site.ts). Rendered as inert <span>s, not <a href="#">, so nothing is
 * focusable or clickable while it has nowhere to go — a dead link is worse
 * than a plain glyph. The moment SOCIAL_LINKS is populated these are
 * replaced automatically by the real anchors below.
 */
const SOCIAL_PLACEHOLDERS = [
  { label: "LinkedIn", icon: "fa-brands fa-linkedin-in" },
  { label: "Instagram", icon: "fa-brands fa-instagram" },
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
        </div>

        {/* ---------- Link columns ---------- */}
        <div>
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
              <h3 className="footer-col-title">Contact</h3>
              <ul className="footer-col-list">
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
                  <span>
                    {SITE.address.street}, {SITE.address.city},{" "}
                    {SITE.address.region} {SITE.address.postalCode}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
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
                    <i className={s.icon} aria-hidden="true" />
                  </span>
                ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
