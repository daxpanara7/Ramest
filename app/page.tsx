import Link from "next/link";
import CtaBanner from "@/components/sections/CtaBanner";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Ramest Technolabs | Innovative IT Solutions",
  description:
    "Ramest Technolabs - Leading IT company providing Web Development, App Development, UI/UX Design, and AI/ML Solutions to transform your business.",
  path: "/",
  absoluteTitle: true,
});

export default function Page() {
  return (
    <>
      {/* ===== HERO SECTION ===== */}
      <section className="hero-section" id="home">
        {/* Giant watermark background text */}
        <div className="hero-watermark" aria-hidden="true">
          RAMEST
        </div>

        {/* Animated orbital rings (like Hidden Brains) */}
        <div className="hero-orb-container" aria-hidden="true">
          <div className="hero-orb hero-orb-1"></div>
          <div className="hero-orb hero-orb-2"></div>
          <div className="hero-orb hero-orb-3"></div>
        </div>

        {/* Mesh gradient glow */}
        <div className="hero-glow hero-glow-1"></div>
        <div className="hero-glow hero-glow-2"></div>

        <div className="container hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            Results-Driven Technology Partner
          </div>

          <h1 className="hero-title">
            We Build Digital
            <br />
            <span className="hero-title-accent">Products That Scale</span>
          </h1>

          <p className="hero-desc">
            Custom Software, Mobile & Web Apps, and AI/ML Solutions — engineered
            for businesses that refuse to settle for ordinary.
          </p>

          <div className="hero-actions">
            <Link href="/contact" className="hero-btn-primary">
              <span className="hero-btn-icon">
                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
              </span>
              Schedule a Call
            </Link>
            <Link href="/services" className="hero-btn-secondary">
              Explore Services <i className="fa-solid fa-chevron-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="stats-band reveal">
        <div className="container stats-band-inner">
          <div className="stat-item">
            <span className="stat-num">5+</span>
            <span className="stat-lbl">Years of Experience</span>
          </div>
          <div className="stat-sep"></div>
          <div className="stat-item">
            <span className="stat-num">100+</span>
            <span className="stat-lbl">Projects Delivered</span>
          </div>
          <div className="stat-sep"></div>
          <div className="stat-item">
            <span className="stat-num">50+</span>
            <span className="stat-lbl">Happy Clients</span>
          </div>
          <div className="stat-sep"></div>
          <div className="stat-item">
            <span className="stat-num">24/7</span>
            <span className="stat-lbl">Dedicated Support</span>
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW ===== */}
      <section className="section reveal" id="services-preview">
        <div className="container">
          <div
            className="section-header"
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <span className="section-eyebrow">WHAT WE BUILD</span>
            <h2
              className="section-title"
              style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
            >
              End-to-End Digital Solutions
            </h2>
            <p
              className="section-subtitle"
              style={{
                fontSize: "1.1rem",
                color: "var(--text-color)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Tailored for real business impact — from idea to launch and beyond.
            </p>
          </div>
          <div className="services-grid">
            <div className="service-card" style={{ marginTop: "3rem" }}>
              <div className="service-icon">
                <i className="fa-solid fa-laptop-code" aria-hidden="true" />
              </div>
              <h3 className="service-title">Custom Software Dev</h3>
              <p className="service-description">
                Tailor-made software solutions designed to meet your specific
                business requirements and overcome complex challenges.
              </p>
              <Link href="/services" className="service-link">
                Learn More{" "}
                <i className="fa-solid fa-arrow-right"
                  style={{ fontSize: "0.8rem" }} aria-hidden="true" />
              </Link>
            </div>
            <div className="service-card" style={{ marginTop: "-1rem" }}>
              <div className="service-icon">
                <i className="fa-solid fa-mobile-button" aria-hidden="true" />
              </div>
              <h3 className="service-title">Mobile & Web Apps</h3>
              <p className="service-description">
                Scalable and robust mobile and web applications that drive user
                engagement and fuel your business growth.
              </p>
              <Link href="/services" className="service-link">
                Learn More{" "}
                <i className="fa-solid fa-arrow-right"
                  style={{ fontSize: "0.8rem" }} aria-hidden="true" />
              </Link>
            </div>
            <div className="service-card" style={{ marginTop: "3rem" }}>
              <div className="service-icon">
                <i className="fa-solid fa-brain" aria-hidden="true" />
              </div>
              <h3 className="service-title">AI/ML Solutions</h3>
              <p className="service-description">
                Leveraging modern AI and Machine Learning to automate processes
                and provide smart, actionable business insights.
              </p>
              <Link href="/services" className="service-link">
                Learn More{" "}
                <i className="fa-solid fa-arrow-right"
                  style={{ fontSize: "0.8rem" }} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="section why-section reveal">
        <div className="container">
          <div
            className="section-header"
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <span className="section-eyebrow">WHY RAMEST</span>
            <h2
              className="section-title"
              style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
            >
              What Sets Us Apart
            </h2>
            <p
              className="section-subtitle"
              style={{
                fontSize: "1.1rem",
                color: "var(--text-color)",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              We don&apos;t just write code — we build partnerships that last.
            </p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-bolt" aria-hidden="true" />
              </div>
              <h3 className="why-title">Fast Delivery</h3>
              <p className="why-desc">
                Agile sprints and CI/CD pipelines ensure your product ships on
                time, every time.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-lock" aria-hidden="true" />
              </div>
              <h3 className="why-title">Secure by Default</h3>
              <p className="why-desc">
                Security-first architecture and regular audits protect your data
                at every layer.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-headset" aria-hidden="true" />
              </div>
              <h3 className="why-title">24/7 Support</h3>
              <p className="why-desc">
                Our team is always on call — monitoring, maintaining, and
                improving your product.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-chart-line" aria-hidden="true" />
              </div>
              <h3 className="why-title">Scalable Solutions</h3>
              <p className="why-desc">
                Built to grow with your business — from startup MVP to
                enterprise-scale platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Build Something Great?"
        description="Tell us about your project and we'll get back to you within 24 hours."
        buttonLabel="Start a Project"
      />
    </>
  );
}
