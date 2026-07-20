import Link from "next/link";
import type { Metadata } from "next";
import PageHero from "@/components/sections/PageHero";
import { serviceCategories } from "@/lib/services";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Page Not Found",
  description: "The page you are looking for does not exist. Explore our services or get in touch.",
  path: "/404",
  noindex: true,
});

/**
 * Custom 404 — keeps the site chrome and routes crawlers and users back into
 * the main hubs instead of dead-ending.
 */
export default function NotFound() {
  return (
    <>
      <PageHero
        centered
        style={{ paddingTop: "9rem", paddingBottom: "3rem" }}
        badge="404"
        title={
          <>
            This page has <span className="gradient-text">moved on</span>
          </>
        }
        description="The page you were looking for doesn't exist or has been relocated. Here's where to go next."
      >
        <div className="svc-hero-actions svc-hero-actions--center">
          <Link href="/" className="button button-primary svc-hero-btn">
            Back to home
          </Link>
          <Link href="/contact" className="button button-secondary svc-hero-btn">
            Talk to our team
          </Link>
        </div>
      </PageHero>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Explore our capabilities</h2>
          <div className="grid-3">
            {serviceCategories.map((category) => (
              <Link key={category.id} href={category.href} className="card">
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
