import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import { JsonLdScript } from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import {
  SITE,
  breadcrumbJsonLd,
  createPageMetadata,
  localBusinessJsonLd,
} from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Contact Us",
  description:
    "Talk to Ramest Technolabs about your software, AI, or cloud project. Based in Ahmedabad, Gujarat — working with clients across India and worldwide. Reply within one business day.",
  path: "/contact",
});

const enquiryTypes = [
  {
    icon: "fa-code",
    title: "Start a project",
    body: "Custom software, web and mobile applications, AI systems, or cloud modernization. Share your goals and we will come back with an approach, a rough timeline, and an indicative budget.",
  },
  {
    icon: "fa-user-plus",
    title: "Hire developers",
    body: "Need to scale an existing team? We provide vetted engineers on dedicated or extended-team models, with direct communication and no interview overhead.",
  },
  {
    icon: "fa-briefcase",
    title: "Careers",
    body: "Engineers, designers, and analysts who want to work on production systems rather than tickets. Send your profile and what you want to build next.",
  },
];

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Contact", path: "/contact" },
  ]);

  return (
    <>
      <JsonLdScript id="contact-localbusiness" data={localBusinessJsonLd()} />
      <JsonLdScript id="contact-breadcrumb" data={breadcrumbs} />

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">Contact</li>
          </ol>
        </div>
      </nav>

      <PageHero
        badge="Contact"
        style={{ paddingTop: "1.5rem", paddingBottom: "3rem" }}
        title={
          <>
            Talk to the team who will <span className="gradient-text">build it</span>
          </>
        }
        description="No sales gatekeeping — your first conversation is with the engineers who would run the project. Tell us what you are trying to ship and we will tell you honestly whether we are the right fit."
      />

      <section className="section" id="contact">
        <div className="container contact-layout">
          <div className="contact-details">
            <h2 className="section-title">Reach us directly</h2>

            <address className="contact-nap">
              <p className="contact-nap-line">
                <i className="fa-solid fa-location-dot" aria-hidden="true" />
                <span>
                  <strong>{SITE.name}</strong>
                  <br />
                  {SITE.address.street}
                  <br />
                  {SITE.address.city}, {SITE.address.region} {SITE.address.postalCode}
                  <br />
                  India
                </span>
              </p>
              <p className="contact-nap-line">
                <i className="fa-solid fa-phone" aria-hidden="true" />
                <a href={`tel:${SITE.phone}`}>{SITE.phoneDisplay}</a>
              </p>
              <p className="contact-nap-line">
                <i className="fa-solid fa-envelope" aria-hidden="true" />
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </p>
              <p className="contact-nap-line">
                <i className="fa-solid fa-clock" aria-hidden="true" />
                <span>Monday to Saturday, 9:30 AM – 7:00 PM IST</span>
              </p>
            </address>

            <h3 className="svc-detail-subheading">What can we help with?</h3>
            <ul className="contact-enquiry-list">
              {enquiryTypes.map((enquiry) => (
                <li key={enquiry.title}>
                  <i className={`fa-solid ${enquiry.icon}`} aria-hidden="true" />
                  <div>
                    <strong>{enquiry.title}</strong>
                    <p>{enquiry.body}</p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="contact-note">
              Prefer to see our work first? Browse{" "}
              <Link href="/services">what we build</Link>, read about{" "}
              <Link href="/about">how the company started</Link>, or look at{" "}
              <Link href="/hire-developers">our engagement models</Link>.
            </p>
          </div>

          <div className="contact-container">
            <h2 className="section-title">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
