import Link from "next/link";
import { SITE, createPageMetadata } from "@/lib/site";

/**
 * Conversion page — the contact form redirects here after a successful
 * submit, so ad and analytics platforms can count a visit to this URL as a
 * lead (Google Ads "page visited" conversion).
 *
 * noindex on purpose: a thank-you page in search results lets people land on
 * the confirmation without ever submitting, which both looks broken and
 * inflates conversion counts. It is also excluded from the sitemap.
 */
export const metadata = createPageMetadata({
  title: "Thank You",
  description: `Your message to ${SITE.name} has been received — we reply within one business day.`,
  path: "/thank-you",
  noindex: true,
});

export default function ThankYouPage() {
  return (
    <main className="ty-page" id="main-content">
      <div className="container">
        <div className="ty-badge" aria-hidden="true">
          <i className="fa-solid fa-check" />
        </div>

        <p className="ty-eyebrow">Message received</p>
        <h1 className="ty-title">Thank you — we&apos;ve got it.</h1>
        <p className="ty-lede">
          Your message is with our engineering team. We read every enquiry
          ourselves and reply within one business day.
        </p>

        <section className="ty-steps" aria-labelledby="ty-steps-title">
          <h2 className="ty-steps-title" id="ty-steps-title">
            What happens next
          </h2>
          <ol>
            <li>We review your project details and match them against our current capacity.</li>
            <li>You get a reply from an engineer — not a sales layer — usually within one business day.</li>
            <li>If it&apos;s a fit, we set up a short call to talk approach, timeline, and an indicative budget.</li>
          </ol>
        </section>

        <div className="ty-actions">
          <Link href="/" className="button button-primary">
            Back to Home
          </Link>
          <Link href="/services" className="button button-secondary">
            Explore Services
          </Link>
        </div>

        <p className="ty-contact">
          Need us sooner? Email{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or call{" "}
          <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>.
        </p>
      </div>
    </main>
  );
}
