import Link from "next/link";
import { SITE, SOCIAL_LINKS } from "@/lib/site";
import { serviceCategories } from "@/lib/services";

/**
 * Blue footer, rebuilt against the sdipresence.com reference: brand +
 * newsletter on the left, four link columns on the right, and a translucent
 * rounded bar along the bottom.
 *
 * Link columns are generated from the real nav/service data rather than
 * hard-coded, so they cannot drift out of sync with the site.
 */

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
        {/* ---------- Brand + newsletter ---------- */}
        <div>
          <Link href="/" aria-label={`${SITE.name} home`} className="footer-brand">
            Ramest <em>Technolabs</em>
          </Link>

          <h2 className="footer-connect-title">
            Have an idea? Let&apos;s build it together.
          </h2>

          <div className="footer-actions">
            <Link href="/contact" className="footer-news-btn">
              Start a Project{" "}
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
            <Link href="/services" className="footer-ghost-btn">
              Explore Services
            </Link>
          </div>
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

          {/* Rendered only for profiles that actually exist. */}
          {SOCIAL_LINKS.length > 0 && (
            <div className="footer-social">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer me"
                >
                  {s.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className="container">
        <div className="footer-bottom-bar">
          <span>© 2026 {SITE.name}. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
