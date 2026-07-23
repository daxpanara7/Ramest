import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import CtaBanner from "@/components/sections/CtaBanner";
import TechMarquee from "@/components/sections/TechMarquee";
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
      "Cost depends on scope, so we price each project to what it actually needs rather than a fixed package. The main drivers are the number of integrations, compliance requirements, and how many user roles the system supports — a focused MVP or single integration sits well below a multi-role platform. We work with businesses of every size, agree a clear scope and a fixed quote in a short consultation before any work begins, and keep engagement flexible, from fixed-scope delivery to a dedicated team.",
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
            <span className="stat-num">98%</span>
            <span className="stat-lbl">Client Satisfaction</span>
          </div>
          <div className="stat-sep"></div>
          <div className="stat-item">
            <span className="stat-num">7+</span>
            <span className="stat-lbl">Countries Served</span>
          </div>
        </div>
      </section>

      {/* ===== SERVICES PREVIEW — "Engineering Excellence" grid =====
          Six equal cards, whole card is the link (keeps every service page
          one click from the homepage for internal-link SEO). */}
      <section className="section reveal" id="services-preview">
        <div className="container">
          <div className="eng-header">
            <h2 className="eng-title">
              Engineering <span className="highlight">Excellence</span>
            </h2>
            <p className="eng-subtitle">
              We deliver end-to-end technology solutions. From concept to
              deployment, our expert teams build systems that drive growth.
            </p>
          </div>

          <div className="eng-grid">
            <Link href="/services/software-development" className="eng-card">
              <span className="eng-card-icon">
                <i className="fa-solid fa-code" aria-hidden="true" />
              </span>
              <h3 className="eng-card-title">Custom Software</h3>
              <p className="eng-card-desc">
                Enterprise-grade software tailored to your specific business
                workflows and scaling requirements.
              </p>
            </Link>

            <Link href="/services/mobile-app-development" className="eng-card">
              <span className="eng-card-icon">
                <i className="fa-solid fa-mobile-screen-button" aria-hidden="true" />
              </span>
              <h3 className="eng-card-title">Mobile Apps</h3>
              <p className="eng-card-desc">
                Native and cross-platform mobile experiences that delight users
                and drive engagement.
              </p>
            </Link>

            <Link href="/services/web-application-development" className="eng-card">
              <span className="eng-card-icon">
                <i className="fa-solid fa-globe" aria-hidden="true" />
              </span>
              <h3 className="eng-card-title">Web Applications</h3>
              <p className="eng-card-desc">
                High-performance, scalable web applications built with modern
                JavaScript frameworks.
              </p>
            </Link>

            <Link href="/services/custom-ai-development" className="eng-card">
              <span className="eng-card-icon">
                <i className="fa-solid fa-brain" aria-hidden="true" />
              </span>
              <h3 className="eng-card-title">AI &amp; ML Solutions</h3>
              <p className="eng-card-desc">
                Intelligent systems that automate processes, uncover insights,
                and create competitive advantages.
              </p>
            </Link>

            <Link href="/services/cloud-infrastructure" className="eng-card">
              <span className="eng-card-icon">
                <i className="fa-solid fa-cloud" aria-hidden="true" />
              </span>
              <h3 className="eng-card-title">Cloud Infrastructure</h3>
              <p className="eng-card-desc">
                Resilient, secure, and scalable cloud architectures on AWS,
                Azure, and Google Cloud.
              </p>
            </Link>

            <Link href="/services/front-end-development" className="eng-card">
              <span className="eng-card-icon">
                <i className="fa-solid fa-pen-ruler" aria-hidden="true" />
              </span>
              <h3 className="eng-card-title">UI/UX Design</h3>
              <p className="eng-card-desc">
                User-centric design systems that ensure your products are as
                intuitive as they are powerful.
              </p>
            </Link>
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
      <TechMarquee />

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
