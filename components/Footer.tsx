"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE, SOCIAL_LINKS } from "@/lib/site";

export default function Footer() {
  const pathname = usePathname();
  // Preserve existing home behavior: hide Hire Developers on `/`.
  const includeHireDevelopers = pathname !== "/";

  return (
    <footer className="footer">
      <div className="container footer-container footer-container-4">
        <div className="footer-col">
          <Link href="/" className="logo footer-logo">
            Ramest <span className="highlight">Technolabs</span>
          </Link>
          <p className="footer-text">
            Empowering businesses with next-gen technology. We turn ideas into
            powerful digital products.
          </p>
          {/* Rendered only for profiles that actually exist — href="#" placeholders
              are dead links on every page and dilute crawl signals. */}
          {SOCIAL_LINKS.length > 0 && (
            <div className="social-links" style={{ marginTop: "1.25rem" }}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={`${SITE.name} on ${social.label}`}
                  target="_blank"
                  rel="noopener noreferrer me"
                >
                  <i className={social.icon} aria-hidden="true" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="footer-col">
          <h3 className="footer-title">Quick Links</h3>
          <ul className="footer-links">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            {includeHireDevelopers && (
              <li>
                <Link href="/hire-developers">Hire Developers</Link>
              </li>
            )}
            <li>
              <Link href="/company">Company</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-title">Company</h3>
          <ul className="footer-links">
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/team">Our Team</Link>
            </li>
            <li>
              <Link href="/certifications">Engineering Standards</Link>
            </li>
            <li>
              <Link href="/careers">Careers</Link>
            </li>
          </ul>
        </div>
        <div className="footer-col">
          <h3 className="footer-title">Contact</h3>
          <ul className="footer-links footer-contact">
            <li>
              <i className="fa-solid fa-envelope" aria-hidden="true" />{" "}
              <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
            </li>
            <li>
              <i className="fa-solid fa-phone" aria-hidden="true" />{" "}
              <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
            </li>
            <li>
              <i className="fa-solid fa-location-dot" aria-hidden="true" /> {SITE.address.street},{" "}
              {SITE.address.city}, {SITE.address.region}{" "}
              {SITE.address.postalCode}
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; 2026 {SITE.name}. All rights reserved. &nbsp;|&nbsp; Built
          with{" "}
          <i className="fa-solid fa-heart" style={{ color: "var(--first-color)" }} aria-hidden="true" />{" "}
          in India
        </p>
      </div>
    </footer>
  );
}
