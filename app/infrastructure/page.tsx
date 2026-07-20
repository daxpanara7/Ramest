import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Infrastructure & Tech Stack",
  description:
    "The cloud, security, DevOps, and data infrastructure Ramest Technolabs builds and runs for client projects — real tools we use, based in Ahmedabad, India.",
  path: "/infrastructure",
});

/** The stack we actually reach for, grouped by concern. */
const stackAreas = [
  {
    icon: "fa-cloud",
    title: "Cloud Infrastructure",
    body: "We provision on AWS, GCP, or Azure depending on what a client's stack already runs on — managed compute, object storage, and managed databases wherever they reduce operational risk. Environments are built to scale horizontally, with autoscaling and load balancing configured before a product needs them, not stitched together after a traffic spike breaks it.",
  },
  {
    icon: "fa-shield-halved",
    title: "Security & Compliance",
    body: "Every environment enforces TLS in transit, encryption at rest, and least-privilege IAM roles instead of shared credentials. Secrets are kept in a managed vault rather than in source control or CI logs, and dependency and container images are scanned automatically on every build. Access reviews and audit logging are standard practice, not something we add when a client's procurement team asks.",
  },
  {
    icon: "fa-code-branch",
    title: "DevOps & CI/CD",
    body: "Deployments run through GitHub Actions pipelines that build, test, and ship containerized services automatically on every merge to main. We package with Docker and orchestrate with Kubernetes or a managed container platform, with infrastructure defined in Terraform so environments are reproducible and a rollback is a git revert, not a weekend fire drill.",
  },
  {
    icon: "fa-chart-line",
    title: "Observability & Monitoring",
    body: "Logging, metrics, and distributed tracing are wired into every service from its first deployment, not bolted on before launch. We centralize logs, alert on error-rate and latency thresholds, and give client teams dashboards they can actually read — so an incident is caught by an alert, not by a support ticket from a frustrated user.",
  },
  {
    icon: "fa-database",
    title: "Data Platform",
    body: "We build on PostgreSQL and MySQL for transactional workloads, Redis for caching and queues, and warehouse patterns on BigQuery, Snowflake, or Postgres for analytics — chosen by access pattern, not habit. Backups run automatically and are restore-tested, and schema changes go through version-controlled migration tooling so data changes are reviewed like code, not run by hand.",
  },
  {
    icon: "fa-laptop-code",
    title: "Development Environment",
    body: "Every project ships with a documented local setup — Docker Compose for services, seed data, and environment variable templates — so a new engineer can be running the app within an hour, not a day. Linting, formatting, and type checks run in a pre-commit hook and again in CI, catching issues before they ever reach code review.",
  },
];

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Company", path: "/company" },
    { name: "Infrastructure", path: "/infrastructure" },
  ]);

  return (
    <>
      <JsonLdScript id="infrastructure-breadcrumb" data={breadcrumbs} />

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/company">Company</Link>
            </li>
            <li aria-current="page">Infrastructure</li>
          </ol>
        </div>
      </nav>

      <PageHero
        badge="Infrastructure"
        style={{ paddingTop: "1.5rem", paddingBottom: "3rem" }}
        title={
          <>
            The stack behind every{" "}
            <span className="gradient-text">Ramest build</span>
          </>
        }
        description="Ramest Technolabs runs on the same infrastructure principles for every engagement — reproducible environments, security built in from day one, and observability wired in before launch, not after an incident. This is the stack, not a sales pitch."
      />

      <section className="section" id="infrastructure">
        <div className="container">
          <h2 className="section-title">How we run infrastructure</h2>
          <p className="about-text">
            Infrastructure decisions get made project by project — the right
            cloud, the right database, the right deployment pipeline depends
            on what a client already runs and where the product needs to
            scale. What stays constant is the standard: infrastructure
            defined as code, security built in rather than retrofitted, and
            monitoring that tells us about a problem before a client&apos;s
            users do. We would rather spend an extra day wiring up a proper
            pipeline than leave a client with a system only we know how to
            operate. Here is what is actually in the stack we reach for, and
            why we reach for it.
          </p>

          <div className="services-grid" style={{ marginTop: "2.5rem" }}>
            {stackAreas.map((area) => (
              <div className="service-card" key={area.title}>
                <div className="service-icon">
                  <i className={`fa-solid ${area.icon}`} aria-hidden="true" />
                </div>
                <h3 className="service-title">{area.title}</h3>
                <p className="service-description">{area.body}</p>
              </div>
            ))}
          </div>

          <p className="contact-note">
            Want to see this stack applied to a real project? Explore our{" "}
            <Link href="/services/cloud-infrastructure">
              cloud &amp; infrastructure services
            </Link>
            , review the{" "}
            <Link href="/certifications">engineering standards</Link> we hold
            every build to, or <Link href="/contact">talk to us</Link> about
            what you are running today.
          </p>
        </div>
      </section>
    </>
  );
}
