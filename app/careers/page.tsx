/* Route-scoped styles. Imported here rather than in globals.css so
   other pages do not download and parse them before they can paint —
   see the note at the top of app/globals.css. */
import "../../styles/careers.css";

import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import HiringSection from "@/components/careers/HiringSection";
import { breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Careers",
  description:
    "Join Ramest Technolabs — a senior software team in Ahmedabad, India. See how we work, the areas we hire for, our hiring process, and how to apply.",
  path: "/careers",
});

/** How we work — value cards shown before the roles list. */
const values = [
  {
    icon: "fa-bullseye",
    title: "Own real outcomes",
    desc: "You scope the work, build it, and answer for it — from the first discovery call to a production issue at 11pm. Your decisions ship and matter.",
  },
  {
    icon: "fa-comments",
    title: "Talk to clients directly",
    desc: "You are in the room, or on the call, when decisions get made — not receiving requirements secondhand through a project manager.",
  },
  {
    icon: "fa-layer-group",
    title: "More scope than your title",
    desc: "A backend engineer here reviews infrastructure calls; a front-end engineer sits in on discovery. You own more than a narrow slice.",
  },
  {
    icon: "fa-code-branch",
    title: "Build things people keep",
    desc: "We hand systems over to client teams and stay reachable after launch. Code that only its author understands is a liability, not cleverness.",
  },
];

const perks = [
  {
    icon: "fa-rocket",
    title: "Fast Growth",
    desc: "Work on cutting-edge projects and grow your skills rapidly in a supportive environment.",
  },
  {
    icon: "fa-people-group",
    title: "Great Culture",
    desc: "Collaborative, inclusive culture where your ideas are heard and recognized.",
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

/** The four stages of our hiring process — reuses the services timeline. */
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
            <span className="gradient-text">senior team</span>
          </>
        }
        description="We hire selectively for engineers and designers who want to own real products end to end — scoping, building, and standing behind what ships, with direct access to the people they build for."
      />

      {/* ---------- Open roles, page body, then the apply form last ----------
          HiringSection owns the roles board and the form (they share the
          selected position), so the sections that sit between them are passed
          through as children rather than rendered as siblings. */}
      <HiringSection>
        {/* ---------- How we work (after open roles) ---------- */}
        <section className="section" aria-labelledby="how-we-work">
          <div className="container">
            <div className="careers-head">
              <span className="careers-eyebrow">Life at Ramest</span>
              <h2 className="section-title" id="how-we-work">
                How we work
              </h2>
              <p className="careers-head-lead">
                If you want a narrowly scoped seat inside a large organization,
                this is not that. If you want your work to reach real users and
                your decisions to carry weight, read on.
              </p>
            </div>
            <div className="careers-values">
              {values.map((v) => (
                <div className="value-card" key={v.title}>
                  <span className="value-icon" aria-hidden="true">
                    <i className={`fa-solid ${v.icon}`} />
                  </span>
                  <div>
                    <h3 className="value-title">{v.title}</h3>
                    <p className="value-desc">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- What you get ---------- */}
        <section className="section" aria-labelledby="what-you-get">
          <div className="container">
            <div className="careers-head">
              <span className="careers-eyebrow">Benefits</span>
              <h2 className="section-title" id="what-you-get">
                What you get
              </h2>
              <p className="careers-head-lead">
                Great people build great products. Alongside interesting work,
                we back you with the support, flexibility, and growth to do your
                best.
              </p>
            </div>
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

        {/* ---------- How we hire ---------- */}
        <section className="section" aria-labelledby="how-we-hire">
          <div className="container">
            <div className="careers-head">
              <span className="careers-eyebrow">Process</span>
              <h2 className="section-title" id="how-we-hire">
                How we hire
              </h2>
              <p className="careers-head-lead">
                Four stages, usually finished within two to three weeks — we try
                not to let a good candidate sit in limbo.
              </p>
            </div>
            <ol
              className="svc-timeline"
              data-steps={hiringSteps.length}
              style={{ marginTop: "1rem" }}
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

            <p
              className="contact-note"
              style={{ marginTop: "2.5rem", textAlign: "center" }}
            >
              Curious who you would be working with? Meet{" "}
              <Link href="/team">the team</Link>, see{" "}
              <Link href="/services">the kind of work we do</Link>, or learn
              more <Link href="/company">about the company</Link> before you
              write to us.
            </p>
          </div>
        </section>
      </HiringSection>
    </>
  );
}
