import Image from "next/image";
import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import CtaBanner from "@/components/sections/CtaBanner";
import PageHero from "@/components/sections/PageHero";
import { SITE, breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "About Us",
  description:
    "Ramest Technolabs is an IT company in Ahmedabad, Gujarat, founded in 2024 by Dax Panara — building custom software, mobile apps, and AI systems for clients worldwide.",
  path: "/about",
});

export default function Page() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Company", path: "/company" },
    { name: "About Us", path: "/about" },
  ]);

  return (
    <>
      <JsonLdScript id="about-breadcrumb" data={breadcrumbs} />

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/company">Company</Link>
            </li>
            <li aria-current="page">About Us</li>
          </ol>
        </div>
      </nav>

      <PageHero
        style={{ paddingTop: "1.5rem", paddingBottom: "3rem" }}
        badge="Our Story"
        title={
          <>
            About <span className="gradient-text">Ramest Technolabs</span>
          </>
        }
        description="A team of passionate engineers, designers, and thinkers on a mission to turn great ideas into world-class digital products."
      />

      {/* WHO WE ARE */}
      <section className="section">
        <div className="container about-container">
          <div className="about-image">
            <div className="img-box">
              <Image
                src="/assets/dax-panara.webp"
                alt="Dax Panara, Founder and CEO of Ramest Technolabs"
                className="about-img"
                width={480}
                height={480}
                priority
                sizes="(max-width: 768px) 90vw, 420px"
              />
            </div>
          </div>
          <div className="about-content">
            <h2 className="section-title">Who We Are</h2>
            <p className="about-text">
              Ramest Technolabs is an IT company founded in {SITE.foundingYear}{" "}
              by <strong>Dax Panara</strong> and based in{" "}
              {SITE.address.city}, {SITE.address.region}, India. We build
              scalable software — from{" "}
              <Link href="/services/web-application-development">
                custom web applications
              </Link>{" "}
              and{" "}
              <Link href="/services/mobile-app-development">mobile apps</Link>{" "}
              to{" "}
              <Link href="/services/custom-ai-development">
                AI and machine learning products
              </Link>{" "}
              — for clients across India and worldwide.
            </p>
            <p className="about-text" style={{ marginTop: "1rem" }}>
              We are deliberately small and senior. The engineers who scope your
              project are the ones who write the code, which means fewer
              handovers, faster decisions, and direct accountability for what
              ships. You can{" "}
              <Link href="/team">meet the whole team</Link> — there is no
              anonymous delivery pool behind them.
            </p>
            <p className="about-text" style={{ marginTop: "1rem" }}>
              Our work spans{" "}
              <Link href="/services">six core engineering capabilities</Link> and
              six industries, backed by the{" "}
              <Link href="/certifications">engineering standards</Link> we hold
              ourselves to on every engagement.
            </p>
            <div className="about-stats">
              <div className="stat-item">
                <span className="stat-number">
                  <i className="fa-solid fa-map-marker-alt" aria-hidden="true" />
                </span>
                <span className="stat-Label">Ahmedabad, India</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  <i className="fa-solid fa-globe" aria-hidden="true" />
                </span>
                <span className="stat-Label">Global Clients</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  <i className="fa-solid fa-code-branch" aria-hidden="true" />
                </span>
                <span className="stat-Label">Agile Delivery</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  <i className="fa-solid fa-shield-halved" aria-hidden="true" />
                </span>
                <span className="stat-Label">Security First</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & VISION */}
      <section className="section">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon">
                <i className="fa-solid fa-rocket" aria-hidden="true" />
              </div>
              <h3 className="mv-title">Our Mission</h3>
              <p className="mv-text">
                To empower businesses of all sizes with cutting-edge technology
                that accelerates growth, drives efficiency, and creates lasting
                impact.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">
                <i className="fa-solid fa-eye" aria-hidden="true" />
              </div>
              <h3 className="mv-title">Our Vision</h3>
              <p className="mv-text">
                To be the most trusted technology partner for startups and
                enterprises worldwide — known for innovation, quality, and
                unwavering commitment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section why-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Core Values</h2>
            <p className="section-subtitle">
              Principles that guide every decision we make
            </p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-star" aria-hidden="true" />
              </div>
              <h3 className="why-title">Excellence</h3>
              <p className="why-desc">
                We refuse to ship mediocre work. Every line of code, every
                pixel, every feature is crafted to the highest standard.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-handshake" aria-hidden="true" />
              </div>
              <h3 className="why-title">Integrity</h3>
              <p className="why-desc">
                Honest communication, transparent pricing, and clear expectations
                — always. No surprises, no shortcuts.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-lightbulb" aria-hidden="true" />
              </div>
              <h3 className="why-title">Innovation</h3>
              <p className="why-desc">
                We stay ahead of the curve, continuously exploring new
                technologies and approaches to solve problems better.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-people-group" aria-hidden="true" />
              </div>
              <h3 className="why-title">Collaboration</h3>
              <p className="why-desc">
                Your team + our team = one team. We work closely with clients as
                true partners, not just vendors.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Let's Build Together"
        description="Partner with Ramest Technolabs and turn your vision into reality."
        buttonLabel="Get In Touch"
      />
    </>
  );
}
