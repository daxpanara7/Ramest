import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import { companyOverviewItems } from "@/lib/nav";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Company",
  description:
    "Ramest Technolabs is a software engineering company based in Ahmedabad, Gujarat, India, founded in 2019 — meet the team and explore what we do.",
  path: "/company",
});

/**
 * Keep these facts stable. Anything that changes as the company grows (head
 * count, project totals) goes stale the moment nobody remembers to edit it,
 * and a wrong number here contradicts the team page and our own schema.
 */
const glance = [
  { icon: "fa-calendar-day", label: "Founded 2019" },
  { icon: "fa-location-dot", label: "Ahmedabad, India" },
  { icon: "fa-key", label: "100% code & IP ownership" },
  { icon: "fa-diagram-project", label: "Web, mobile & AI" },
];

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Company", path: "/company" },
  ]);

  return (
    <>
      <JsonLdScript id="company-breadcrumb" data={breadcrumbs} />

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li aria-current="page">Company</li>
          </ol>
        </div>
      </nav>

      <PageHero
        badge="Company"
        style={{ paddingTop: "1.5rem", paddingBottom: "3rem" }}
        title={
          <>
            The company behind{" "}
            <span className="gradient-text">the code</span>
          </>
        }
        description="Ramest Technolabs is a small software engineering team based in Ahmedabad, India, working with clients worldwide. Here is what the company is, how it is structured, and where to go for more."
      />

      <section className="section">
        <div className="container">
          <h2 className="section-title">Who we are</h2>
          <p className="about-text">
            Ramest Technolabs is a software engineering company founded in
            2019 by Dax Panara. We design and build custom software, web and
            mobile applications, and applied AI and LLM systems — work that
            ranges from building a product&apos;s first working version to
            adding cloud infrastructure or AI capability to a system that is
            already live and cannot afford downtime.
          </p>
          <p className="about-text" style={{ marginTop: "1rem" }}>
            We are based in Ahmedabad, Gujarat, India, and that is where the
            team sits and where client work gets built. The clients
            themselves are not local by default — we work with founders and
            product teams across India and internationally, over video calls
            and shared tooling, the same way most software teams collaborate
            today regardless of where the desks are.
          </p>
          <p className="about-text" style={{ marginTop: "1rem" }}>
            The main difference between us and a larger outsourcing vendor
            is who you actually talk to. There is no account-management
            layer translating your requirements to a delivery team you never
            meet — the engineers in your kickoff call are the ones who write
            the code, and they are still reachable after launch. That keeps
            the team small on purpose: it is easier to stay accountable for
            a decision when you are the one who made it and will be the one
            explaining it later.
          </p>
          <p className="about-text" style={{ marginTop: "1rem" }}>
            Most engagements start with a scoping conversation rather than a
            sales pitch, and we would rather say no to a project that is not
            a good fit than take it on and stretch a senior team too thin to
            do it properly. Pricing and scope get agreed before work
            starts, progress stays visible sprint to sprint, and the
            standards we hold ourselves to — code review, security practice,
            and documented handover — are covered in detail on our{" "}
            <Link href="/certifications">engineering standards page</Link>.
          </p>
          <p className="about-text" style={{ marginTop: "1rem" }}>
            Day to day, that means software development, web and mobile
            applications, and cloud and AI infrastructure work for product
            teams that need a senior engineer rather than a large delivery
            organization. We also take on projects in manufacturing,
            fintech, ecommerce, logistics, retail, and healthcare, where
            reliability and compliance matter as much as shipping speed —
            see the full breakdown on our <Link href="/services">services page</Link>.
          </p>
          <p className="about-text" style={{ marginTop: "1rem" }}>
            The company is led by founder Dax Panara, who still works
            discovery calls and architecture decisions directly rather than
            handing them off once a project is underway — a habit that
            shapes how the rest of the team works too. You can read more
            about him and the rest of the team on the{" "}
            <Link href="/team">team page</Link>.
          </p>

          <div className="about-stats">
            {glance.map((fact) => (
              <div className="stat-item" key={fact.label}>
                <span className="stat-number">
                  <i className={`fa-solid ${fact.icon}`} aria-hidden="true" />
                </span>
                <span className="stat-Label">{fact.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="company">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Explore Ramest Technolabs</h2>
            <p className="section-subtitle">
              The team, infrastructure, engineering standards, and more
            </p>
          </div>

          <div className="company-overview-grid">
            {companyOverviewItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="company-overview-item"
              >
                <div className="company-overview-item-icon">
                  <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.sub}</p>
                <i
                  className="fa-solid fa-arrow-right item-arrow"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>

          <p className="contact-note">
            Looking for a specific capability rather than a company
            overview? Browse <Link href="/services">our services</Link>, see
            how to{" "}
            <Link href="/hire-developers">hire dedicated developers</Link>,
            or <Link href="/contact">start a conversation</Link> about your
            project.
          </p>
        </div>
      </section>
    </>
  );
}
