import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import CtaBanner from "@/components/sections/CtaBanner";
import HomeMotion from "@/components/motion/HomeMotion";
import TechMarquee from "@/components/sections/TechMarquee";
import TrustMarquee from "@/components/sections/TrustMarquee";
import LatestBlogs from "@/components/sections/LatestBlogs";
import InquiryForm from "@/components/sections/InquiryForm";
import ClientImpact from "@/components/sections/ClientImpact";
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
    question: "What makes Ramest Technolabs different from other software and AI companies?",
    answer:
      "Two things. First, senior engineers do the work — the people who scope your project are the people who build it, so technical direction comes with the delivery rather than being sold separately. Second, you keep everything: source code, infrastructure, and documentation live in your accounts from day one, so you are never locked into us to keep the system running. In practice that means we will tell you when a piece of scope is not worth building, which is not something a vendor billing by the hour tends to do.",
  },
  {
    question: "Do you only work with large enterprises, or can startups also partner with you?",
    answer:
      "Both. We work with early-stage startups, SMEs, and enterprises, and the engagement model changes to match. A startup usually wants a focused MVP on a fixed scope and a hard date; an enterprise usually wants a dedicated team working inside existing compliance and procurement processes. The smallest projects we take on are single integrations and internal tools; the largest are multi-year platform builds.",
  },
  {
    question: "Can you build custom AI solutions for my business?",
    answer:
      "Yes. We build custom AI systems including LLM applications, retrieval-augmented generation over your own documents, AI agents and chatbots, natural language processing, computer vision, forecasting, and predictive analytics. Most engagements start with a short evaluation phase, because the useful question is rarely whether AI can do the task — it is whether it can do it accurately enough on your data to trust in production. We build the evaluation harness and guardrails alongside the model, not after it.",
  },
  {
    question: "How do you ensure security and compliance in projects?",
    answer:
      "Security is part of the build rather than a review at the end: least-privilege access, encrypted data at rest and in transit, secrets kept out of source control, dependency scanning in CI, and audit logging where records are regulated. We design to the requirements that apply to your sector — GDPR for EU personal data, HIPAA for US health information, the DPDP Act 2023 in India, PCI DSS scope reduction for payments. Note that HIPAA and GDPR are obligations rather than certifications, so no vendor can be 'HIPAA certified'; what we can do is build the controls and evidence your audit needs.",
  },
  {
    question: "What if I already have an existing application or legacy system?",
    answer:
      "That is a large share of our work. We handle application modernisation, legacy migration, cloud moves, and integration with systems you are keeping. The first step is always a dependency map, because the risk in these projects is not the code you can see — it is the undocumented integration nobody remembers. We then move in stages behind feature flags so the business keeps running, and we will say plainly when a component is cheaper to leave alone than to migrate.",
  },
  {
    question: "Do you provide ongoing support and maintenance after project delivery?",
    answer:
      "Yes. Post-launch support covers uptime and error monitoring, security and dependency updates, performance tuning, and new feature work. Support is a separate agreement with its own response times, so it is optional and you can end it without losing access to anything — the system runs in your infrastructure either way.",
  },
  {
    question: "What engagement models do you offer?",
    answer:
      "Four. Fixed-price for well-defined scope where you need cost certainty. Time and materials for work that will evolve as you learn. Dedicated development teams, where a team works only on your product and reports into your process. And staff augmentation, where individual engineers join your existing team. Most clients start fixed-price on a first project and move to a dedicated team once the roadmap grows.",
  },
  {
    question: "How do we get started with Ramest Technolabs?",
    answer: `Book a consultation and we will talk through your goals, constraints, and timeline. Within about 24 hours of that call you get a written scope, a delivery timeline, and a fixed quote — no obligation attached. You can reach us on ${SITE.phoneDisplay} or at ${SITE.email}.`,
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
      "We'd been putting off the migration for two years because nobody could tell us what would break. Ramest mapped the dependencies first, then moved us onto Kubernetes in stages. Not one customer-facing outage. They also told us which two services weren't worth migrating at all, which saved us a quarter of the budget.",
    name: "Sarah Jenkins",
    role: "CTO, OmniScale Inc.",
    image: "/assets/clients/sarah-jenkins.webp",
  },
  {
    quote:
      "Our checkout was losing people at the 3D Secure step and we couldn't work out why. They instrumented the whole flow before touching any code, found three separate issues, and fixed them over about five weeks. Failed transactions dropped by roughly 40%. The support tickets we used to get every Monday have basically stopped.",
    name: "Priya Nair",
    role: "Head of Product, Fintrail",
    image: "/assets/clients/priya-nair.webp",
  },
  {
    quote:
      "We had a demo date we couldn't move and about half the product built. Their team picked up an unfamiliar codebase and was shipping useful work inside a week. We made the date. What I appreciated most was that they flagged the two things they thought we should cut rather than quietly rushing them.",
    name: "David Chen",
    role: "Founder, NexusFlow",
    image: "/assets/clients/david-chen.webp",
  },
  {
    quote:
      "Healthcare data means audit trails, retention rules and a compliance review that fails you on details. Ramest had clearly done this before. The architecture held through our January peak, which is four times normal load, and we passed the audit without a single finding against the platform.",
    name: "Elena Rodriguez",
    role: "VP Engineering, HealthCore",
    image: "/assets/clients/elena-rodriguez.webp",
  },
  {
    quote:
      "Working with the Ramest team was a pleasure. Our warehouse systems are unusual and most vendors either don't grasp them or want to replace everything. They took the time to understand what we actually had, then built around it. Friendly, well informed, and nothing was ever too much trouble. We've since used them on two more enterprise projects and been impressed each time.",
    name: "Mei Tanaka",
    role: "Director of Operations, Kaisei Logistics",
    image: "/assets/clients/mei-tanaka.webp",
  },
  {
    quote:
      "We ended up with a CRM that actually works the way our sales team does, delivered on the date they gave us at kickoff. Project management was genuinely good: weekly demos, no surprises, and questions answered the same day. They stayed responsive well after go-live, which is not what we've had from previous vendors. Code and documentation were handed over in full, so we own all of it.",
    name: "Marcus Hale",
    role: "Engineering Manager, Brightpath",
    image: "/assets/clients/marcus-hale.webp",
  },
  {
    quote:
      "Claims review used to take our team three days and we were falling behind every month. The pipeline Ramest built now clears the routine ones overnight and routes the rest to a human with the reasoning attached. Accuracy went up, not down, and four people moved off data entry onto work that actually needs them.",
    name: "Amara Okafor",
    role: "COO, Meridian Health",
    image: "/assets/clients/amara-okafor.webp",
  },
  {
    quote:
      "I was sceptical about running a build across a four-hour time difference, having been burned before. It turned out to be the least stressful part of the project. A short written update every morning, decisions escalated instead of guessed at, and a handover where nothing was missing. Our store now holds up through Black Friday without anyone watching dashboards at midnight.",
    name: "Tomas Lindqvist",
    role: "CTO, Nordvik Retail",
    image: "/assets/clients/tomas-lindqvist.webp",
  },
];

const STATS = [
  { value: "7", suffix: "+", label: "Years of Experience" },
  { value: "30", suffix: "+", label: "Projects Delivered" },
  { value: "100", suffix: "%", label: "Client Satisfaction" },
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

      {/* ===== HERO — deep-indigo aurora canvas, centered =====
          H1 is plain server-rendered text (instant LCP); entrances are pure
          CSS so content can never be left hidden by JS. All background art is
          CSS gradients — zero image/video bytes. */}
      <section className="nv-hero" id="home">
        <div className="nv-bg" aria-hidden="true">
          <span className="nv-aurora nv-aurora-a" />
          <span className="nv-aurora nv-aurora-b" />
          <span className="nv-aurora nv-aurora-c" />
          <span className="nv-grid" />
          <span className="nv-spotlight" />
        </div>

        <div className="container nv-inner">
          <p className="nv-chip">
            Custom Software · AI &amp; Cloud Engineering
          </p>

          <h1 className="nv-title">
            We Build Digital
            <br />
            <em>Products That Scale</em>
          </h1>

          <p className="nv-sub">
            Custom software, web &amp; mobile applications, and AI/ML systems —
            engineered end to end by senior teams, owned 100% by you.
          </p>

          <div className="nv-actions">
            <Link href="/contact" className="nv-btn-primary">
              Schedule a Call
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
            <Link href="/services" className="nv-btn-ghost">
              Explore Services
            </Link>
          </div>

          <p className="nv-avail">
            Free consultation — clear scope and a fixed quote within 24 hours
          </p>

          <dl className="nv-stats">
            {STATS.map((s) => (
              <div className="nv-stat" key={s.label}>
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
            <div className="container ind-band">
              <p className="ind-pill">Industries we serve</p>
              <h2 className="hx-title ind-title" id="industries-heading">
                Deep context in <em>mission-critical</em> industries
              </h2>
              <p className="ind-lede">
                We work with organizations across regulated and
                operations-heavy sectors, building software that addresses
                sector-specific constraints, compliance, and scale.
              </p>

              <ul className="ind-grid">
                {industries.map((ind, i) => (
                  <li key={ind.slug}>
                    <Link
                      href={ind.href}
                      className="ind-item hx-rise"
                      style={{ "--rise": i } as React.CSSProperties}
                    >
                      <span className="ind-icon" aria-hidden="true">
                        <i className={`fa-solid ${ind.icon}`} />
                      </span>
                      <span className="ind-name">{ind.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* NOTE: quotes carried over from the previous version at the
              owner's direction. No Review/AggregateRating schema. */}
          <section className="hx-section reveal" aria-labelledby="client-impact-heading">
            <div className="container">
              <div className="ci-head">
                <div>
                  <span className="hx-eyebrow">Client impact</span>
                  <h2 className="hx-title" id="client-impact-heading">
                    Results our partners <em>talk about</em>
                  </h2>
                </div>
                {/* Stacked faces + the headline stat, mirroring the reference
                    layout. The number is the same one the hero stats band
                    already reports — not a second, different claim. */}
                <div className="ci-proof">
                  {/* Four faces, as in the reference — the whole set would
                      run into the headline.

                      Lazy, and it matters more than it looks. These sit about
                      five viewports down, not "high on the page", and the
                      files are 4-7 KB each rather than the sub-1 KB the old
                      note claimed. Left eager, React emits a
                      <link rel="preload" as="image"> for each one, so ~20 KB
                      of avatars nobody has scrolled to yet competes with the
                      render-blocking CSS and the title font for the first
                      bytes on a phone connection — measurably delaying the
                      hero H1, which is the LCP element on mobile. */}
                  <div className="ci-faces" aria-hidden="true">
                    {QUOTES.slice(0, 4).map((q) => (
                      <span className="ci-face" key={q.name}>
                        <img
                          src={q.image}
                          alt=""
                          width={52}
                          height={52}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                    ))}
                  </div>
                  <div className="ci-proof-rule" />
                  <p className="ci-proof-stat">
                    Standing strong with <strong>30+</strong> projects delivered
                  </p>
                </div>
              </div>

              <ClientImpact quotes={QUOTES} />
            </div>
          </section>
        </div>

        {/* ---------- CARD 4 · Latest blogs ---------- */}
        <div className="stack-card">
          <LatestBlogs />
        </div>

        {/* ---------- CARD 5 · FAQ ---------- */}
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
                    Frequently Asked <em>Questions</em>
                  </h2>
                </div>
              </div>

              <div className="svc-faq-list">
                {/* All collapsed on load — the answers are still in the HTML
                    (details only hides them visually), so the FAQPage schema
                    and crawlers are unaffected. */}
                {homeFaqs.map((faq, index) => (
                  <details key={faq.question} className="svc-faq-item">
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

        {/* ---------- CARD 6 · Inquiry form ---------- */}
        <div className="stack-card">
          <InquiryForm />
        </div>
      </div>

      {/* ===== CTA — same shared banner as every other page ===== */}
      <CtaBanner
        title="Ready to Build Something Great?"
        description="Tell us about your project and we'll get back to you within 24 hours."
        buttonLabel="Start a Project"
      />

    </>
  );
}
