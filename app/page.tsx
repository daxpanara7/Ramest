import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import CtaBanner from "@/components/sections/CtaBanner";
import { SITE, createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Ramest Technolabs | Innovative IT Solutions",
  description:
    "IT company in Ahmedabad building custom software, web and mobile apps, and AI/ML solutions. Senior engineers, full code ownership, clients across India and worldwide.",
  path: "/",
  absoluteTitle: true,
});

/**
 * Buyer-intent questions answered directly on the page. These drive the
 * FAQPage rich result and are the passages answer engines quote when someone
 * asks about the company.
 */
const homeFaqs = [
  {
    question: "What does Ramest Technolabs do?",
    answer:
      "Ramest Technolabs is a software engineering company based in Ahmedabad, Gujarat, India. We build custom software, web and mobile applications, AI and LLM systems, cloud infrastructure, and data platforms for clients in India and worldwide. We work across manufacturing, fintech, ecommerce, logistics, retail, and healthcare.",
  },
  {
    question: "Where is Ramest Technolabs located?",
    answer: `Our office is at ${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}, India. We work remotely with clients across India, the United States, Europe, and the Middle East, and are reachable on ${SITE.phoneDisplay} or at ${SITE.email}.`,
  },
  {
    question: "How much does a custom software project cost?",
    answer:
      "A focused build — an MVP, an internal tool, or a single integration — typically runs $15,000–$60,000 (roughly ₹12.5 lakh–₹50 lakh). A larger platform with multiple user roles, third-party integrations, and compliance requirements usually runs $80,000–$300,000 (roughly ₹66 lakh–₹2.5 crore). The main cost drivers are integration count, compliance scope, and how many user roles the system supports. We give an indicative range after a discovery call and a fixed scope before work begins.",
  },
  {
    question: "How long does it take to build a product?",
    answer:
      "A working MVP typically takes 8 to 14 weeks from kickoff. Smaller internal tools and integrations often ship in 4 to 8 weeks, while larger platforms with several user roles and third-party systems usually run 4 to 8 months. You see working software every sprint rather than waiting until the end.",
  },
  {
    question: "Do we own the code you write?",
    answer:
      "Yes. You own 100% of the source code and intellectual property, and it lives in your repositories from day one. We hand over documented architecture, runbooks, and environment setup so your team can operate and extend the system independently, with or without us.",
  },
  {
    question: "Can you work with our existing development team?",
    answer:
      "Yes. Alongside full project delivery we provide engineers on dedicated and extended-team models, where our developers work directly inside your process, tools, and standups. This suits teams that need specific expertise or extra capacity without a long hiring cycle.",
  },
];

function homeFaqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export default function Page() {
  return (
    <>
      <JsonLdScript id="home-faq-jsonld" data={homeFaqJsonLd()} />
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

      {/* ===== STATS BAR =====
          Keep these consistent with SITE.foundingYear (2019) — Organization
          schema publishes foundingDate, so a years-in-business figure that
          disagrees with it is a contradiction in our own markup. */}
      <section className="stats-band reveal">
        <div className="container stats-band-inner">
          <div className="stat-item">
            <span className="stat-num">7+</span>
            <span className="stat-lbl">Years of Experience</span>
          </div>
          <div className="stat-sep"></div>
          <div className="stat-item">
            <span className="stat-num">30+</span>
            <span className="stat-lbl">Projects Delivered</span>
          </div>
          <div className="stat-sep"></div>
          <div className="stat-item">
            <span className="stat-num">100%</span>
            <span className="stat-lbl">Code &amp; IP Ownership</span>
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
              <Link href="/services/software-development" className="service-link">
                Explore software development{" "}
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
              <Link href="/services/mobile-app-development" className="service-link">
                Explore app development{" "}
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
              <Link href="/services/custom-ai-development" className="service-link">
                Explore AI &amp; ML solutions{" "}
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

      {/* ===== FAQ ===== */}
      <section className="section svc-faq reveal" aria-labelledby="home-faq-heading">
        <div className="container">
          <div
            className="section-header"
            style={{ textAlign: "center", marginBottom: "4rem" }}
          >
            <span className="section-eyebrow">COMMON QUESTIONS</span>
            <h2
              id="home-faq-heading"
              className="section-title"
              style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
            >
              Answers Before You Ask
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
              Cost, timelines, ownership, and how we work — answered plainly.
            </p>
          </div>

          <div className="svc-faq-list">
            {homeFaqs.map((faq, index) => (
              <details
                key={faq.question}
                className="svc-faq-item"
                {...(index === 0 ? { open: true } : {})}
              >
                <summary className="svc-faq-question">
                  <span className="svc-faq-num" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="svc-faq-question-text">{faq.question}</span>
                  <span className="svc-faq-toggle" aria-hidden="true">
                    <i className="fa-solid fa-plus" aria-hidden="true" />
                  </span>
                </summary>
                <p className="svc-faq-answer">{faq.answer}</p>
              </details>
            ))}
          </div>

          <p className="contact-note" style={{ textAlign: "center" }}>
            More detail on <Link href="/services">what we build</Link>, how we{" "}
            <Link href="/hire-developers">provide developers</Link>, and the{" "}
            <Link href="/certifications">standards we work to</Link>.
          </p>
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
