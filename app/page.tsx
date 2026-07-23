import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import HomeMotion from "@/components/motion/HomeMotion";
import TechMarquee from "@/components/sections/TechMarquee";
import TrustMarquee from "@/components/sections/TrustMarquee";
import { SITE, createPageMetadata } from "@/lib/site";
import {
  deliveryProcess,
  serviceCategories,
  servicesItemListJsonLd,
} from "@/lib/services";

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

/* The h1 keeps the exact sentence search engines already index for us; it is
   pre-split into word spans so the motion engine can mask-reveal it without
   touching the DOM (SSR-stable, no layout shift). */
const HERO_LINE_1 = ["We", "Build", "Digital"];
const HERO_LINE_2 = ["Products", "That", "Scale"];

const SERVICES = [
  {
    href: "/services/software-development",
    icon: "fa-code",
    title: "Custom Software",
    desc: "Enterprise-grade software tailored to your specific business workflows and scaling requirements.",
  },
  {
    href: "/services/mobile-app-development",
    icon: "fa-mobile-screen-button",
    title: "Mobile Apps",
    desc: "Native and cross-platform mobile experiences that delight users and drive engagement.",
  },
  {
    href: "/services/web-application-development",
    icon: "fa-globe",
    title: "Web Applications",
    desc: "High-performance, scalable web applications built with modern JavaScript frameworks.",
  },
  {
    href: "/services/custom-ai-development",
    icon: "fa-brain",
    title: "AI & ML Solutions",
    desc: "Intelligent systems that automate processes, uncover insights, and create competitive advantages.",
  },
  {
    href: "/services/cloud-infrastructure",
    icon: "fa-cloud",
    title: "Cloud Infrastructure",
    desc: "Resilient, secure, and scalable cloud architectures on AWS, Azure, and Google Cloud.",
  },
  {
    href: "/services/front-end-development",
    icon: "fa-pen-ruler",
    title: "UI/UX Design",
    desc: "User-centric design systems that ensure your products are as intuitive as they are powerful.",
  },
];

const VALUES = [
  { icon: "fa-bolt", label: "Fast, predictable delivery" },
  { icon: "fa-lock", label: "Secure by default" },
  { icon: "fa-headset", label: "24/7 monitoring & support" },
  { icon: "fa-chart-line", label: "Built to scale with you" },
];

const QUOTES = [
  {
    quote:
      "Ramest completely transformed our legacy infrastructure. Their engineers don't just take orders; they provide strategic technical direction that saved us months of rework.",
    name: "Sarah Jenkins",
    role: "CTO, OmniScale Inc.",
  },
  {
    quote:
      "The speed and quality of delivery were unprecedented. We launched our MVP in half the expected time, and it was rock-solid. A truly exceptional technology partner.",
    name: "David Chen",
    role: "Founder, NexusFlow",
  },
  {
    quote:
      "What sets Ramest apart is their deep understanding of enterprise scale. The architecture they designed handles our peak loads effortlessly.",
    name: "Elena Rodriguez",
    role: "VP Engineering, HealthCore",
  },
];

const STATS = [
  { value: "7", suffix: "+", label: "Years of Experience" },
  { value: "30", suffix: "+", label: "Projects Delivered" },
  { value: "98", suffix: "%", label: "Client Satisfaction" },
  { value: "7", suffix: "+", label: "Countries Served" },
];

export default function Page() {
  const industries =
    serviceCategories[serviceCategories.length - 1]?.items ?? [];

  return (
    <>
      <JsonLdScript id="home-faq-jsonld" data={homeFaqJsonLd()} />
      <JsonLdScript
        id="home-services-jsonld"
        data={servicesItemListJsonLd(SITE.url)}
      />
      <HomeMotion />

      {/* ===== HERO ===== */}
      <section className="hx-hero" id="home">
        <div className="hx-hero-bg" aria-hidden="true">
          <span className="hx-glow hx-glow-a" />
          <span className="hx-glow hx-glow-b" />
          <span className="hx-ring" />
          <span className="hx-ring hx-ring-2" />
        </div>

        {/* Decorative build console filling the right column (desktop) */}
        <div className="hx-hero-visual" aria-hidden="true">
          <div className="hx-console">
            <div className="hx-console-bar">
              <i />
              <i />
              <i />
              <span>ramest · deploy</span>
            </div>
            <div className="hx-console-body">
              <div>
                <b>$</b> ramest build --production
              </div>
              <div>Compiling 214 modules…</div>
              <div>
                Tests <span className="ok">312 passed</span>
              </div>
              <div>
                Deploy <span className="ok">✓ live in 42s</span>
              </div>
              <div>
                Uptime <span className="ok">99.98%</span> · monitored 24/7
              </div>
            </div>
          </div>
          <span className="hx-float-chip hx-float-chip-a">
            <i className="fa-solid fa-brain" /> AI/ML in production
          </span>
          <span className="hx-float-chip hx-float-chip-b">
            <i className="fa-solid fa-cloud" /> Cloud-native
          </span>
        </div>

        <div className="container hx-hero-inner">
          <p className="hx-chip">
            <span className="hx-chip-dot" aria-hidden="true" />
            Enterprise Software · AI · Cloud
          </p>

          <h1 className="hx-hero-title">
            {HERO_LINE_1.map((w) => (
              <span key={w} className="hx-w">
                {w}&nbsp;
              </span>
            ))}
            <br />
            <em>
              {HERO_LINE_2.map((w) => (
                <span key={w} className="hx-w">
                  {w}&nbsp;
                </span>
              ))}
            </em>
          </h1>

          <p className="hx-hero-sub">
            Custom software, mobile &amp; web applications, and AI/ML systems —
            engineered end to end by senior teams, owned 100% by you.
          </p>

          <div className="hx-hero-actions">
            <Link
              href="/contact"
              className="hx-btn hx-btn-primary hx-magnetic"
            >
              Schedule a Call
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
            <Link href="/services" className="hx-btn hx-btn-ghost">
              Explore Services
            </Link>
          </div>

          <dl className="hx-hero-stats">
            {STATS.map((s) => (
              <div className="hx-stat" key={s.label}>
                <dt>
                  <span data-countup>{s.value}</span>
                  <em>{s.suffix}</em>
                </dt>
                <dd>{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===== TRUSTED INDUSTRIES STRIP ===== */}
      <TrustMarquee />

      {/* Stacked-section parallax: each .stack-card is position:sticky with a
          per-card offset from the motion engine, so sections layer over each
          other like cards. Pure CSS fallback; content never hidden by JS. */}
      <div className="stack">
        {/* ---------- CARD 1 · SERVICES ---------- */}
        <div className="stack-card">
          <section className="hx-section reveal" id="services-preview">
            <div className="container">
              <div className="hx-section-head">
                <div>
                  <span className="hx-eyebrow">What we engineer</span>
                  <h2 className="hx-title">
                    Capabilities that <em>compound</em>
                  </h2>
                  <p className="hx-lede">
                    End-to-end product engineering — every discipline your
                    roadmap needs, under one senior team.
                  </p>
                </div>
                <Link href="/services" className="hx-head-link">
                  All services
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              </div>

              <div className="hx-grid-3">
                {SERVICES.map((s, i) => (
                  <Link
                    key={s.href + s.title}
                    href={s.href}
                    className="hx-card hx-rise"
                    style={{ "--rise": i } as React.CSSProperties}
                  >
                    <span className="hx-card-icon">
                      <i className={`fa-solid ${s.icon}`} aria-hidden="true" />
                    </span>
                    <span className="hx-card-arrow" aria-hidden="true">
                      <i className="fa-solid fa-arrow-up-right-from-square" />
                    </span>
                    <h3 className="hx-card-title">{s.title}</h3>
                    <p className="hx-card-desc">{s.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ---------- CARD 2 · APPROACH ---------- */}
        <div className="stack-card">
          <section className="hx-section reveal" aria-labelledby="approach-heading">
            <div className="container">
              <div className="hx-approach-grid">
                <div>
                  <span className="hx-eyebrow">How we work</span>
                  <h2 className="hx-title" id="approach-heading">
                    A process built on <em>proof</em>, not promises
                  </h2>
                  <p className="hx-lede">
                    We don&apos;t just write code — we build partnerships that
                    last. Working software every sprint, transparent progress,
                    and architecture decisions you can audit.
                  </p>

                  <div className="hx-values">
                    {VALUES.map((v, i) => (
                      <span
                        className="hx-value hx-rise"
                        style={{ "--rise": i } as React.CSSProperties}
                        key={v.label}
                      >
                        <i className={`fa-solid ${v.icon}`} aria-hidden="true" />
                        {v.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  {deliveryProcess.map((p, i) => (
                    <div
                      className="hx-step hx-rise"
                      style={{ "--rise": i } as React.CSSProperties}
                      key={p.step}
                    >
                      <span className="hx-step-num">{p.step}</span>
                      <div>
                        <h3 className="hx-step-title">{p.title}</h3>
                        <p className="hx-step-desc">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* ---------- CARD 3 · TECHNOLOGY, INDUSTRIES, CLIENT IMPACT ---------- */}
        <div className="stack-card">
          <TechMarquee />

          <section className="hx-section reveal" aria-labelledby="industries-heading">
            <div className="container">
              <span className="hx-eyebrow">Where we operate</span>
              <h2 className="hx-title" id="industries-heading">
                Deep context in <em>mission-critical</em> industries
              </h2>
              <div className="hx-industries">
                {industries.map((ind, i) => (
                  <Link
                    key={ind.slug}
                    href={ind.href}
                    className="hx-industry hx-rise"
                    style={{ "--rise": i } as React.CSSProperties}
                  >
                    <i className={`fa-solid ${ind.icon}`} aria-hidden="true" />
                    {ind.title}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* NOTE: quotes carried over from the previous version at the
              owner's direction. No Review/AggregateRating schema. */}
          <section className="hx-section reveal" aria-labelledby="client-impact-heading">
            <div className="container">
              <div className="hx-section-head">
                <div>
                  <span className="hx-eyebrow">Client impact</span>
                  <h2 className="hx-title" id="client-impact-heading">
                    Results our partners <em>talk about</em>
                  </h2>
                </div>
              </div>
              <div className="hx-grid-3">
                {QUOTES.map((q, i) => (
                  <figure
                    className="hx-quote hx-rise"
                    style={{ "--rise": i } as React.CSSProperties}
                    key={q.name}
                  >
                    <span className="hx-quote-mark" aria-hidden="true">
                      &ldquo;
                    </span>
                    <blockquote>{q.quote}</blockquote>
                    <figcaption>
                      <span className="hx-quote-avatar" aria-hidden="true">
                        {q.name[0]}
                      </span>
                      <span>
                        <span className="hx-quote-name">{q.name}</span>
                        <span className="hx-quote-role">{q.role}</span>
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* ---------- CARD 4 · FAQ ---------- */}
        <div className="stack-card">
          <section
            className="hx-section svc-faq reveal"
            aria-labelledby="home-faq-heading"
          >
            <div className="container">
              <div className="hx-section-head">
                <div>
                  <span className="hx-eyebrow">Common questions</span>
                  <h2 className="hx-title" id="home-faq-heading">
                    Answers before you <em>ask</em>
                  </h2>
                </div>
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
                      <span className="svc-faq-question-text">
                        {faq.question}
                      </span>
                      <span className="svc-faq-toggle" aria-hidden="true">
                        <i className="fa-solid fa-plus" />
                      </span>
                    </summary>
                    <p className="svc-faq-answer">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ===== CTA ===== */}
      <section className="hx-cta reveal">
        <div className="container">
          <div className="hx-cta-panel">
            <h2 className="hx-cta-title">Ready to build something great?</h2>
            <p className="hx-cta-sub">
              Tell us about your project and we&apos;ll get back to you within
              24 hours.
            </p>
            <Link
              href="/contact"
              className="hx-btn hx-btn-light hx-magnetic"
            >
              Start a Project
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
