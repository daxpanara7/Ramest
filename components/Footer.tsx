import Link from "next/link";

type FooterProps = {
  includeHireDevelopers?: boolean;
};

export default function Footer({ includeHireDevelopers = true }: FooterProps) {
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
          <div className="social-links" style={{ marginTop: "1.25rem" }}>
            <a href="#" aria-label="LinkedIn">
              <i className="fa-brands fa-linkedin-in" />
            </a>
            <a href="#" aria-label="Twitter">
              <i className="fa-brands fa-twitter" />
            </a>
            <a href="#" aria-label="Instagram">
              <i className="fa-brands fa-instagram" />
            </a>
            <a href="#" aria-label="GitHub">
              <i className="fa-brands fa-github" />
            </a>
          </div>
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
              <Link href="/certifications">Certifications</Link>
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
              <i className="fa-solid fa-envelope" />{" "}
              <a href="mailto:hr@ramesttechnolabs.com">hr@ramesttechnolabs.com</a>
            </li>
            <li>
              <i className="fa-solid fa-phone" />{" "}
              <a href="tel:+919510903725">+91 9510903725</a>
            </li>
            <li>
              <i className="fa-solid fa-location-dot" /> RE11 - 2nd Floor, Iscon,
              Ambli Rd, Ahmedabad, Gujarat 380058
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>
          &copy; 2026 Ramest Technolabs. All rights reserved. &nbsp;|&nbsp; Built
          with{" "}
          <i className="fa-solid fa-heart" style={{ color: "var(--first-color)" }} />{" "}
          in India
        </p>
      </div>
    </footer>
  );
}
