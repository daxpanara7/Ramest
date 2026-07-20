import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import { SITE, breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Careers",
  description:
    "Ramest Technolabs is a small, senior software team in Ahmedabad, India. See how we hire, who we look for, and how to send a speculative application.",
  path: "/careers",
});

const perks = [
  {
    icon: "fa-rocket",
    title: "Fast Growth",
    desc: "Work on cutting-edge projects and grow your skills rapidly in a supportive environment.",
  },
  {
    icon: "fa-people-group",
    title: "Great Culture",
    desc: "Collaborative, inclusive team culture where your ideas are heard and recognized.",
  },
  {
    icon: "fa-laptop-house",
    title: "Flexible Work",
    desc: "Remote-friendly environment with flexible hours to support work-life balance.",
  },
  {
    icon: "fa-graduation-cap",
    title: "Learning Budget",
    desc: "Annual budget for courses, certifications, and conferences to keep you ahead.",
  },
  {
    icon: "fa-coins",
    title: "Competitive Pay",
    desc: "Market-competitive salaries reviewed regularly with performance bonuses.",
  },
  {
    icon: "fa-star",
    title: "Work on Purpose",
    desc: "Build real products that solve real problems for clients across the globe.",
  },
];

/** The four stages of our hiring process — reuses the services timeline pattern. */
const hiringSteps = [
  {
    step: "01",
    title: "Application",
    description:
      "Send your resume, GitHub or portfolio links, and a short note on what you would want to work on. No cover-letter theater required.",
  },
  {
    step: "02",
    title: "Technical conversation",
    description:
      "A conversation with an engineer, not HR — about problems you have solved and how you think through trade-offs. No whiteboard trivia.",
  },
  {
    step: "03",
    title: "Paid exercise or portfolio review",
    description:
      "A small, paid piece of realistic work, or a deep walkthrough of something you have already shipped — whichever fits the role better.",
  },
  {
    step: "04",
    title: "Offer",
    description:
      "If it's a match on both sides, we make an offer directly — no fourth-round panel, no waiting weeks on a hiring committee.",
  },
];

const traits = [
  {
    icon: "fa-comments",
    title: "Comfortable close to the client",
    desc: "You will be in the room, or the call, when decisions get made — not receiving requirements secondhand after the fact.",
  },
  {
    icon: "fa-scale-balanced",
    title: "Can explain the trade-off, not just the code",
    desc: "We care as much about whether you can tell a non-technical client why a decision matters as whether the code is correct.",
  },
  {
    icon: "fa-compass",
    title: "Comfortable with ambiguity",
    desc: "There is no ten-person hierarchy to route decisions through. Sometimes you decide, ship, and answer for the result.",
  },
  {
    icon: "fa-code-compare",
    title: "Cares who reads the code next",
    desc: "We hand systems over to client teams. Code only the author understands is a liability, not a clever solution.",
  },
];

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Company", path: "/company" },
    { name: "Careers", path: "/careers" },
  ]);

  return (
    <>
      <JsonLdScript id="careers-breadcrumb" data={breadcrumbs} />

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/company">Company</Link>
            </li>
            <li aria-current="page">Careers</li>
          </ol>
        </div>
      </nav>

      <PageHero
        badge="Careers"
        style={{ paddingTop: "1.5rem", paddingBottom: "3rem" }}
        title={
          <>
            Build software with a{" "}
            <span className="gradient-text">small, senior team</span>
          </>
        }
        description="Ramest Technolabs is five people, not five hundred. Everyone who works here writes code, talks to clients, and owns outcomes — there is no layer of management standing between you and the product."
      />

      <section className="section">
        <div className="container">
          <h2 className="section-title">What it&apos;s actually like</h2>
          <p className="about-text">
            There is no bench, no unnamed delivery pool, and no account
            manager standing between you and the client. When you join
            Ramest Technolabs, you are one of a handful of engineers who
            scope the work, build it, and answer for it — from the first
            discovery call to a production issue at 11pm. That is
            deliberate: small teams move faster and take the work more
            personally when there is nowhere to hide.
          </p>
          <p className="about-text" style={{ marginTop: "1rem" }}>
            You will talk to clients directly, in planning calls and in
            Slack threads, not through a project manager relaying
            requirements secondhand. You will also own more than your job
            title suggests — a backend engineer here reviews infrastructure
            decisions, a front-end engineer sits in on discovery. If you
            want a narrowly scoped role inside a large organization, this is
            not that. If you want to see your decisions ship and matter, it
            might be.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">What you get</h2>
          <p className="careers-intro">
            At Ramest Technolabs, we believe great people build great
            products. We&apos;re looking for engineers who want to make an
            impact and value creativity, collaboration, and continuous
            learning.
          </p>
          <div className="perks-grid">
            {perks.map((perk) => (
              <div className="perk-card" key={perk.title}>
                <div className="perk-icon">
                  <i className={`fa-solid ${perk.icon}`} aria-hidden="true" />
                </div>
                <div className="perk-title">{perk.title}</div>
                <div className="perk-desc">{perk.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">How we hire</h2>
          <p className="about-text">
            Four stages, usually finished within two to three weeks — we try
            not to let a good candidate sit in limbo.
          </p>
          <ol
            className="svc-timeline svc-timeline--four"
            style={{ marginTop: "2.5rem" }}
          >
            {hiringSteps.map((step) => (
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

      <section className="section">
        <div className="container">
          <h2 className="section-title">Who we look for</h2>
          <div className="why-grid">
            {traits.map((trait) => (
              <div className="why-card" key={trait.title}>
                <div className="why-icon">
                  <i className={`fa-solid ${trait.icon}`} aria-hidden="true" />
                </div>
                <h3 className="why-title">{trait.title}</h3>
                <p className="why-desc">{trait.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Open roles right now</h2>
          <p className="about-text">
            Honestly — we do not have an open position listed today. We are
            a small team and we hire rarely, only when the work genuinely
            requires another person. When that changes, we will list the
            role here. If you think you would be a strong fit for a future
            engineering position at Ramest Technolabs, send your resume and
            a short note about something you have built to{" "}
            <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We do read
            speculative applications, and we keep them on file for when a
            role opens.
          </p>
          <div className="careers-cta">
            <a href={`mailto:${SITE.email}`} className="button button-primary">
              Email your resume <i className="fa-solid fa-arrow-right" aria-hidden="true" />
            </a>
          </div>

          <p className="contact-note">
            Curious who you would be working with? Meet{" "}
            <Link href="/team">the team</Link>, see{" "}
            <Link href="/services">the kind of work we do</Link>, or learn
            more <Link href="/company">about the company</Link> before you
            write to us.
          </p>
        </div>
      </section>
    </>
  );
}
