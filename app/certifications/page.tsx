import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Engineering Standards & Practices",
  description:
    "The security, quality, and delivery standards we hold ourselves to on every engagement — peer code review, encryption, CI/CD gates, and documented handover.",
  path: "/certifications",
});

/**
 * Standards we actually practise and can demonstrate on request. Deliberately
 * no certification badges: claiming credentials we do not hold is an EEAT and
 * legal risk, and buyers verify them.
 */
const standards = [
  {
    icon: "fa-shield-halved",
    title: "Security practices",
    body: "Encryption in transit and at rest, least-privilege access, secrets kept out of source control, and dependency scanning in CI. Security review is part of the definition of done, not a pre-launch afterthought.",
    points: [
      "TLS everywhere, encrypted data at rest",
      "Role-based access and audited credentials",
      "Automated dependency and secret scanning",
    ],
  },
  {
    icon: "fa-code-branch",
    title: "Code quality standards",
    body: "Every change goes through peer review and an automated gate. We keep test coverage on business-critical paths and treat static analysis failures as build failures, so quality does not depend on who is on call.",
    points: [
      "Mandatory peer review before merge",
      "Automated tests and static analysis in CI",
      "Trunk-based delivery with reversible releases",
    ],
  },
  {
    icon: "fa-cloud",
    title: "Cloud and DevOps",
    body: "Infrastructure defined as code, reproducible environments, and observability wired in from day one. Deployments are automated and rollback is a routine operation rather than an incident.",
    points: [
      "Infrastructure as code, versioned with the app",
      "Containerized builds, automated deployment",
      "Logging, metrics, and alerting from launch",
    ],
  },
  {
    icon: "fa-file-signature",
    title: "Delivery and handover",
    body: "You own what we build. Architecture decisions, runbooks, and environment setup are documented as we go, so your team can operate and extend the system without depending on us.",
    points: [
      "Written architecture and decision records",
      "Runbooks and environment documentation",
      "Knowledge transfer sessions before handover",
    ],
  },
];

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Company", path: "/company" },
    { name: "Engineering Standards", path: "/certifications" },
  ]);

  return (
    <>
      <JsonLdScript id="certifications-breadcrumb" data={breadcrumbs} />

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/company">Company</Link>
            </li>
            <li aria-current="page">Engineering Standards</li>
          </ol>
        </div>
      </nav>

      <PageHero
        badge="Standards"
        style={{ paddingTop: "1.5rem", paddingBottom: "3rem" }}
        title={
          <>
            How we hold ourselves <span className="gradient-text">accountable</span>
          </>
        }
        description="We would rather show you the standards we work to than display badges. These are the practices applied on every engagement — auditable, and open to review before you sign anything."
      />

      <section className="section">
        <div className="container">
          <h2 className="section-title">Our engineering standards</h2>
          <div className="cert-grid">
            {standards.map((standard) => (
              <article className="cert-card" key={standard.title}>
                <div className="cert-icon" aria-hidden="true">
                  <i className={`fa-solid ${standard.icon}`} aria-hidden="true" />
                </div>
                <h3 className="cert-name">{standard.title}</h3>
                <p className="cert-body">{standard.body}</p>
                <ul className="svc-chips">
                  {standard.points.map((point) => (
                    <li key={point}>
                      <i className="fa-solid fa-check" aria-hidden="true" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="contact-note">
            Need evidence for a procurement or vendor-security review? Ask us
            during <Link href="/contact">your first call</Link> and we will walk
            you through our process, or see the{" "}
            <Link href="/infrastructure">infrastructure we run on</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
