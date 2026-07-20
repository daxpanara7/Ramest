import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/JsonLd";
import CtaBanner from "@/components/sections/CtaBanner";
import PageHero from "@/components/sections/PageHero";
import {
  allServiceItems,
  getCategoryForSlug,
  getServiceBySlug,
  serviceJsonLd,
} from "@/lib/services";
import { getServiceDetail } from "@/lib/service-details";
import { SITE, breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/** Only the 18 known service slugs exist — anything else 404s immediately. */
export const dynamicParams = false;

export function generateStaticParams() {
  return allServiceItems.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) {
    return createPageMetadata({
      title: "Service Not Found",
      description: "The requested service could not be found.",
      path: `/services/${slug}`,
      noindex: true,
    });
  }

  const detail = getServiceDetail(slug);
  return createPageMetadata({
    title: `${service.title} Services`,
    description: (detail?.heroTagline ?? service.description).slice(0, 155),
    path: service.href,
  });
}

function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const category = getCategoryForSlug(slug);
  const detail = getServiceDetail(slug);
  const related =
    category?.items.filter((item) => item.slug !== service.slug).slice(0, 3) ??
    [];
  const schema = serviceJsonLd(service, SITE.url, SITE.name);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: service.title, path: service.href },
  ]);

  return (
    <>
      <JsonLdScript id={`service-jsonld-${service.slug}`} data={schema} />
      <JsonLdScript
        id={`service-breadcrumb-${service.slug}`}
        data={breadcrumbs}
      />
      {detail?.faqs?.length ? (
        <JsonLdScript
          id={`service-faq-jsonld-${service.slug}`}
          data={faqJsonLd(detail.faqs)}
        />
      ) : null}

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/services">Services</Link>
            </li>
            <li aria-current="page">{service.title}</li>
          </ol>
        </div>
      </nav>

      <PageHero
        className="page-hero section svc-hero svc-detail-hero"
        badge={category?.title ?? "Services"}
        centered
        style={{ paddingTop: "1.5rem", paddingBottom: "3rem" }}
        title={
          <>
            {service.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="gradient-text">
              {service.title.split(" ").slice(-1)}
            </span>
          </>
        }
        description={detail?.heroTagline ?? service.description}
      >
        <div className="svc-hero-actions svc-hero-actions--center">
          <Link href="/contact" className="button button-primary svc-hero-btn">
            Discuss this capability
            <i className="fa-solid fa-arrow-right" aria-hidden="true" />
          </Link>
          <Link
            href={category?.href ?? "/services"}
            className="button button-secondary svc-hero-btn"
          >
            Back to {category?.shortTitle ?? "services"}
          </Link>
        </div>
        {detail?.heroHighlights?.length ? (
          <ul className="svc-chips svc-chips--hero">
            {detail.heroHighlights.map((highlight) => (
              <li key={highlight}>
                <i className="fa-solid fa-circle-check" aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
        ) : null}
      </PageHero>

      <section className="section svc-detail-body">
        <div className="container svc-detail-layout">
          <article className="svc-detail-main reveal">
            <div className="svc-category-badge">
              <i className="fa-solid fa-circle-info" aria-hidden="true" />
              <span>Overview</span>
            </div>
            <h2 className="svc-detail-heading">
              {detail?.overviewTitle ?? "What you get"}
            </h2>
            {detail ? (
              detail.intro.map((paragraph, index) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className={`svc-detail-copy${index === 0 ? " svc-detail-lead" : ""}`}
                >
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="svc-detail-copy">
                {service.description} Our team partners with product,
                engineering, and business stakeholders to define outcomes, ship
                iterative releases, and leave behind systems your organization
                can own.
              </p>
            )}

            <h3 className="svc-detail-subheading">Capability focus</h3>
            <ul className="svc-chips">
              {service.tags.map((tag) => (
                <li key={tag}>
                  <i className="fa-solid fa-check" aria-hidden="true" />
                  {tag}
                </li>
              ))}
              <li>
                <i className="fa-solid fa-check" aria-hidden="true" />
                Discovery workshops
              </li>
              <li>
                <i className="fa-solid fa-check" aria-hidden="true" />
                Architecture &amp; documentation
              </li>
              <li>
                <i className="fa-solid fa-check" aria-hidden="true" />
                Post-launch support
              </li>
            </ul>
          </article>

          <aside className="svc-detail-aside reveal">
            <div className="svc-detail-card">
              <span className="svc-card-icon" aria-hidden="true">
                <i className={`fa-solid ${service.icon}`} aria-hidden="true" />
              </span>
              {/* Not a heading: it repeats the H1 and would pollute the outline. */}
              <p className="svc-detail-card-title">{service.title}</p>
              <p className="svc-detail-card-desc">{service.shortDescription}</p>
              <ul className="svc-card-tags">
                {service.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <Link href="/contact" className="button button-primary svc-detail-cta">
                Request a proposal
              </Link>
              <Link href="/hire-developers" className="svc-detail-secondary">
                Or hire developers for this work →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {detail ? (
        <>
          <section
            className="section svc-category svc-category--alt"
            aria-labelledby="offerings-heading"
          >
            <div className="container">
              <header className="svc-category-header svc-category-header--center reveal">
                <div className="svc-category-badge">
                  <i className={`fa-solid ${service.icon}`} aria-hidden="true" />
                  <span>Offerings</span>
                </div>
                <h2 id="offerings-heading" className="svc-category-title">
                  {detail.offeringsTitle}
                </h2>
                <p className="svc-category-desc">{detail.offeringsSubtitle}</p>
              </header>
              <div className="svc-card-grid">
                {detail.offerings.map((offering, index) => (
                  <article
                    key={offering.title}
                    className={`svc-card svc-offer-card reveal${index % 2 === 1 ? " reveal-delayed" : ""}`}
                  >
                    <div className="svc-offer-head">
                      <span className="svc-card-icon" aria-hidden="true">
                        <i className={`fa-solid ${offering.icon}`} aria-hidden="true" />
                      </span>
                      <h3 className="svc-card-title">{offering.title}</h3>
                    </div>
                    <p className="svc-card-desc">{offering.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            className="section svc-process"
            aria-labelledby="service-process-heading"
          >
            <div className="container">
              <header className="svc-category-header svc-category-header--center reveal">
                <div className="svc-category-badge">
                  <i className="fa-solid fa-route" aria-hidden="true" />
                  <span>Process</span>
                </div>
                <h2 id="service-process-heading" className="svc-category-title">
                  {detail.processTitle}
                </h2>
                <p className="svc-category-desc">{detail.processSubtitle}</p>
              </header>
              <ol className="svc-timeline reveal">
                {detail.process.map((step) => (
                  <li key={step.step} className="svc-timeline-step">
                    <span className="svc-timeline-dot" aria-hidden="true">
                      {step.step}
                    </span>
                    <h3 className="svc-timeline-title">{step.title}</h3>
                    <p className="svc-timeline-desc">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section
            className="section svc-category svc-category--alt"
            aria-labelledby="benefits-heading"
          >
            <div className="container">
              <header className="svc-category-header svc-category-header--center reveal">
                <div className="svc-category-badge">
                  <i className="fa-solid fa-medal" aria-hidden="true" />
                  <span>Why Ramest</span>
                </div>
                <h2 id="benefits-heading" className="svc-category-title">
                  {detail.benefitsTitle}
                </h2>
              </header>
              <div className="svc-why-grid">
                {detail.benefits.map((benefit) => (
                  <article key={benefit.title} className="svc-why-card reveal">
                    <span className="svc-card-icon" aria-hidden="true">
                      <i className={`fa-solid ${benefit.icon}`} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="svc-card-title">{benefit.title}</h3>
                      <p className="svc-card-desc">{benefit.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section
            className="section svc-stack"
            aria-labelledby="stack-heading"
          >
            <div className="container">
              <header className="svc-category-header svc-category-header--center reveal">
                <div className="svc-category-badge">
                  <i className="fa-solid fa-layer-group" aria-hidden="true" />
                  <span>Stack</span>
                </div>
                <h2 id="stack-heading" className="svc-category-title">
                  {detail.stackTitle}
                </h2>
                <p className="svc-category-desc">{detail.stackSubtitle}</p>
              </header>
              <div className="svc-stack-grid reveal">
                {detail.techStack.map((group, index) => (
                  <div key={group.category} className="svc-stack-card">
                    <div className="svc-stack-head">
                      <span className="svc-stack-index" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="svc-stack-category">
                        {group.category}
                      </span>
                    </div>
                    <ul className="svc-stack-list">
                      {group.items.map((item) => (
                        <li key={item}>
                          <i
                            className="fa-solid fa-angle-right"
                            aria-hidden="true"
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section
            className="section svc-faq svc-category--alt"
            aria-labelledby="faq-heading"
          >
            <div className="container">
              <header className="svc-category-header svc-category-header--center reveal">
                <div className="svc-category-badge">
                  <i className="fa-solid fa-circle-question" aria-hidden="true" />
                  <span>FAQ</span>
                </div>
                <h2 id="faq-heading" className="svc-category-title">
                  Frequently asked questions
                </h2>
                <p className="svc-category-desc">{detail.faqSubtitle}</p>
              </header>
              <div className="svc-faq-list reveal">
                {detail.faqs.map((faq, index) => (
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
                        <i className="fa-solid fa-plus" aria-hidden="true" />
                      </span>
                    </summary>
                    <p className="svc-faq-answer">{faq.answer}</p>
                  </details>
                ))}
              </div>
              <div className="svc-faq-banner reveal">
                <div>
                  <h3>Still have questions?</h3>
                  <p>
                    Tell us about your project — we&apos;ll respond within one
                    business day.
                  </p>
                </div>
                <Link href="/contact" className="button button-primary">
                  Talk to our team
                  <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </section>
        </>
      ) : null}

      {related.length > 0 ? (
        <section
          className="section svc-related"
          aria-labelledby="related-services-heading"
        >
          <div className="container">
            <header className="svc-category-header svc-category-header--center reveal">
              <h2 id="related-services-heading" className="svc-category-title">
                Related capabilities
              </h2>
              <p className="svc-category-desc">
                Explore more from {category?.title ?? "our services portfolio"}.
              </p>
            </header>
            <div className="svc-card-grid svc-card-grid--compact">
              {related.map((item) => (
                <article key={item.slug} className="svc-card reveal">
                  <div className="svc-card-top">
                    <span className="svc-card-icon" aria-hidden="true">
                      <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                    </span>
                  </div>
                  <h3 className="svc-card-title">
                    <Link href={item.href}>{item.title}</Link>
                  </h3>
                  <p className="svc-card-desc">{item.shortDescription}</p>
                  <Link href={item.href} className="svc-card-link">
                    Learn more
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaBanner
        title={`Let's build your ${service.title.toLowerCase()} initiative`}
        description="Tell us about timelines, constraints, and success criteria — we'll respond with a clear next step."
        buttonLabel="Contact Ramest"
        href="/contact"
      />
    </>
  );
}
