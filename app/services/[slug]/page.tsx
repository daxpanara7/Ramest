import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import CtaBanner from "@/components/sections/CtaBanner";
import PageHero from "@/components/sections/PageHero";
import {
  allServiceItems,
  getCategoryForSlug,
  getServiceBySlug,
  serviceJsonLd,
} from "@/lib/services";
import { SITE, createPageMetadata } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

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
    });
  }

  return createPageMetadata({
    title: `${service.title} Services`,
    description: service.description.slice(0, 155),
    path: service.href,
  });
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const category = getCategoryForSlug(slug);
  const related =
    category?.items.filter((item) => item.slug !== service.slug).slice(0, 3) ??
    [];
  const schema = serviceJsonLd(service, SITE.url, SITE.name);

  return (
    <>
      <Script
        id={`service-jsonld-${service.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <PageHero
        className="page-hero section svc-hero svc-detail-hero"
        badge={category?.title ?? "Services"}
        title={
          <>
            {service.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="gradient-text">
              {service.title.split(" ").slice(-1)}
            </span>
          </>
        }
        description={service.description}
      >
        <div className="svc-hero-actions">
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
      </PageHero>

      <section className="section svc-detail-body">
        <div className="container svc-detail-layout">
          <article className="svc-detail-main reveal">
            <h2 className="svc-detail-heading">What you get</h2>
            <p className="svc-detail-copy">
              {service.description} Our team partners with product, engineering,
              and business stakeholders to define outcomes, ship iterative
              releases, and leave behind systems your organization can own.
            </p>

            <h3 className="svc-detail-subheading">Capability focus</h3>
            <ul className="svc-detail-list">
              {service.tags.map((tag) => (
                <li key={tag}>
                  <i className="fa-solid fa-check" aria-hidden="true" />
                  {tag}
                </li>
              ))}
              <li>
                <i className="fa-solid fa-check" aria-hidden="true" />
                Discovery workshops and technical assessments
              </li>
              <li>
                <i className="fa-solid fa-check" aria-hidden="true" />
                Architecture, implementation, and handover documentation
              </li>
              <li>
                <i className="fa-solid fa-check" aria-hidden="true" />
                Post-launch support and continuous improvement
              </li>
            </ul>
          </article>

          <aside className="svc-detail-aside reveal">
            <div className="svc-detail-card">
              <span className="svc-card-icon" aria-hidden="true">
                <i className={`fa-solid ${service.icon}`} />
              </span>
              <h2 className="svc-detail-card-title">{service.title}</h2>
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

      {related.length > 0 ? (
        <section
          className="section svc-related"
          aria-labelledby="related-services-heading"
        >
          <div className="container">
            <header className="svc-category-header reveal">
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
                      <i className={`fa-solid ${item.icon}`} />
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
