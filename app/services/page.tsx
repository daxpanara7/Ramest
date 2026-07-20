import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import CtaBanner from "@/components/sections/CtaBanner";
import PageHero from "@/components/sections/PageHero";
import {
  deliveryProcess,
  serviceCategories,
  servicesItemListJsonLd,
} from "@/lib/services";
import { SITE, createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "IT Services & AI Solutions",
  description:
    "Enterprise software development, cloud infrastructure, AI solutions, and industry-focused digital engineering from Ramest Technolabs. Explore our services across products, AI, and industries.",
  path: "/services",
});

export default function ServicesPage() {
  const schema = servicesItemListJsonLd(SITE.url);

  return (
    <>
      <JsonLdScript id="services-itemlist-jsonld" data={schema} />

      <PageHero
        className="page-hero section svc-hero"
        badge="IT Services"
        centered
        style={{ paddingTop: "8rem", paddingBottom: "3rem" }}
        title={
          <>
            Engineering products that{" "}
            <span className="gradient-text">perform at enterprise scale</span>
          </>
        }
        description="Software, cloud, and AI delivery with the discipline of a consulting firm and the speed of a product team. Explore our capabilities across core engineering, artificial intelligence, and industry solutions."
      >
        <div className="svc-hero-actions svc-hero-actions--center">
          <Link href="#our-services" className="button button-primary svc-hero-btn">
            Explore services
            <i className="fa-solid fa-arrow-down" aria-hidden="true" />
          </Link>
          <Link href="/contact" className="button button-secondary svc-hero-btn">
            Book a consultation
          </Link>
        </div>
        <nav
          className="svc-hero-jump svc-hero-jump--center"
          aria-label="Service categories"
        >
          {serviceCategories.map((category) => (
            <a key={category.id} href={`#${category.id}`} className="svc-hero-jump-link">
              <i className={`fa-solid ${category.icon}`} aria-hidden="true" />
              {category.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <section className="section svc-trust" aria-label="Engagement highlights">
        <div className="container">
          <ul className="svc-trust-grid">
            <li className="svc-trust-item reveal">
              <span className="svc-trust-value">Full-stack</span>
              <span className="svc-trust-label">Product engineering</span>
            </li>
            <li className="svc-trust-item reveal">
              <span className="svc-trust-value">AI-ready</span>
              <span className="svc-trust-label">Strategy to agents</span>
            </li>
            <li className="svc-trust-item reveal">
              <span className="svc-trust-value">Cloud-native</span>
              <span className="svc-trust-label">Secure infrastructure</span>
            </li>
            <li className="svc-trust-item reveal">
              <span className="svc-trust-value">Industry-aware</span>
              <span className="svc-trust-label">Domain delivery</span>
            </li>
          </ul>
        </div>
      </section>

      {serviceCategories.map((category, categoryIndex) => (
        <section
          key={category.id}
          id={category.id}
          className={`section svc-category${categoryIndex % 2 === 1 ? " svc-category--alt" : ""}`}
          aria-labelledby={`${category.id}-heading`}
        >
          <div className="container">
            <header className="svc-category-header svc-category-header--center reveal">
              <div className="svc-category-badge">
                <i className={`fa-solid ${category.icon}`} aria-hidden="true" />
                <span>{category.shortTitle}</span>
              </div>
              <h2 id={`${category.id}-heading`} className="svc-category-title">
                {category.title}
              </h2>
              <p className="svc-category-desc">{category.description}</p>
            </header>

            <div className="svc-card-grid">
              {category.items.map((service, index) => (
                <article
                  key={service.slug}
                  id={service.slug}
                  className={`svc-card reveal${index % 2 === 1 ? " reveal-delayed" : ""}`}
                >
                  <div className="svc-card-top">
                    <span className="svc-card-icon" aria-hidden="true">
                      <i className={`fa-solid ${service.icon}`} aria-hidden="true" />
                    </span>
                    <Link
                      href={service.href}
                      className="svc-card-open"
                      aria-label={`Learn more about ${service.title}`}
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
                    </Link>
                  </div>
                  <h3 className="svc-card-title">
                    <Link href={service.href}>{service.title}</Link>
                  </h3>
                  <p className="svc-card-desc">{service.shortDescription}</p>
                  <ul className="svc-card-tags">
                    {service.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  <Link href={service.href} className="svc-card-link">
                    Learn more
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="section svc-process" aria-labelledby="delivery-process-heading">
        <div className="container">
          <header className="svc-category-header svc-category-header--center reveal">
            <div className="svc-category-badge">
              <i className="fa-solid fa-route" aria-hidden="true" />
              <span>Delivery</span>
            </div>
            <h2 id="delivery-process-heading" className="svc-category-title">
              How we deliver
            </h2>
            <p className="svc-category-desc">
              A clear engagement path designed for executive visibility and engineering excellence.
            </p>
          </header>

          <ol className="svc-timeline svc-timeline--four reveal">
            {deliveryProcess.map((step) => (
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

      <section className="section svc-related" aria-labelledby="related-paths-heading">
        <div className="container">
          <header className="svc-category-header svc-category-header--center reveal">
            <h2 id="related-paths-heading" className="svc-category-title">
              Continue exploring
            </h2>
            <p className="svc-category-desc">
              Pair our services with dedicated teams or learn how we build and operate technology.
            </p>
          </header>
          <div className="svc-related-grid">
            <Link href="/hire-developers" className="svc-related-card reveal">
              <i className="fa-solid fa-user-group" aria-hidden="true" />
              <div>
                <h3>Hire Developers</h3>
                <p>Augment your team with specialists who ship.</p>
              </div>
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
            <Link href="/infrastructure" className="svc-related-card reveal">
              <i className="fa-solid fa-server" aria-hidden="true" />
              <div>
                <h3>Infrastructure</h3>
                <p>See how we run secure, scalable environments.</p>
              </div>
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
            <Link href="/contact" className="svc-related-card reveal">
              <i className="fa-solid fa-handshake" aria-hidden="true" />
              <div>
                <h3>Contact Us</h3>
                <p>Tell us about your roadmap — we&apos;ll respond quickly.</p>
              </div>
              <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to modernize your technology stack?"
        description="Share your goals — we'll recommend an engagement path across software, cloud, and AI."
        buttonLabel="Start a conversation"
        href="/contact"
      />
    </>
  );
}
