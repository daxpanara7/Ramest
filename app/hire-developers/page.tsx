import Link from "next/link";
import CtaBanner from "@/components/sections/CtaBanner";
import PageHero from "@/components/sections/PageHero";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Hire Python Developers",
  description:
    "Hire Python Developers with No Hassle. Get an exceptional Python developer backed with rich expertise and extensive knowledge of frameworks and libraries.",
  path: "/hire-developers",
});

export default function Page() {
  return (
    <div style={{ paddingTop: "var(--header-height)" }}>
      <PageHero
        badge="Talent On Demand"
        title={
          <>
            Hire <span className="gradient-text">Python Developers</span> <br />{" "}
            with No Hassle
          </>
        }
        description="Get an exceptional Python developer backed with rich expertise and extensive knowledge of frameworks and libraries. Our experienced Python developers for hire have in-depth knowledge of building feature-rich and user-centric applications."
        className="section page-hero"
        style={undefined}
        centered
      >
        <Link href="/contact" className="button button-primary">
          Onboard a Python Expert Within 3-5 Days{" "}
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </Link>
      </PageHero>

      {/* STATS BAR */}
      <section className="stats-section">
        <div className="container stats-container">
          <div className="stat-bar-item">
            <span className="stat-bar-number">40%</span>
            <span className="stat-bar-label">Faster Development</span>
          </div>
          <div className="stat-bar-divider"></div>
          <div className="stat-bar-item">
            <span className="stat-bar-number">Vetted</span>
            <span className="stat-bar-label">Top 5% Talent</span>
          </div>
          <div className="stat-bar-divider"></div>
          <div className="stat-bar-item">
            <span className="stat-bar-number">0</span>
            <span className="stat-bar-label">Hiring Costs</span>
          </div>
          <div className="stat-bar-divider"></div>
          <div className="stat-bar-item">
            <span className="stat-bar-number">100%</span>
            <span className="stat-bar-label">Agile Alignment</span>
          </div>
        </div>
      </section>

      {/* SERVICES / WHAT WE CAN DO */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              What Our Skilled Python Developers Can Do for You
            </h2>
          </div>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-comments" aria-hidden="true" />
              </div>
              <h3 className="service-title">Python Consulting</h3>
              <p className="service-description">
                From web app development to data science, we help you decode the
                roadmap of successful mission-critical apps. Hire Python
                developers to help you outline ifs and buts and bring a fail-proof
                lifecycle to build scalable, high-performing apps.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-laptop-code" aria-hidden="true" />
              </div>
              <h3 className="service-title">Python Web App Development</h3>
              <p className="service-description">
                Hire our Python developers to create best-in-class dynamic web
                apps using advanced frameworks such as Flask and Django. Our
                dedicated coders employ a result-oriented approach and have
                extensive experience ensuring efficient and effective solutions.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-network-wired" aria-hidden="true" />
              </div>
              <h3 className="service-title">IoT Development</h3>
              <p className="service-description">
                Accelerate your IoT development with our experts. Hire Python
                developers to create innovative, tailored, and consumer-grade
                products. With a strong track record and transparent pricing,
                develop and optimize end-to-end IoT products for startups and
                SMBs.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-database" aria-hidden="true" />
              </div>
              <h3 className="service-title">Big Data Development</h3>
              <p className="service-description">
                Hire dedicated Python developers ready to bring transformation
                and long-awaited benefits for business. Get a cross-functional
                team or dedicated developers to integrate or leverage the latest
                technologies and data to maximize your investment.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-shuffle" aria-hidden="true" />
              </div>
              <h3 className="service-title">Python Migration and Integration</h3>
              <p className="service-description">
                Hire Python developers to accelerate and scale data migration in
                digital space. Our senior developers help you create, upgrade, or
                migrate scalable, secure, innovative, and AI-driven solutions with
                the latest versions of Python.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-building" aria-hidden="true" />
              </div>
              <h3 className="service-title">Enterprise Python Applications</h3>
              <p className="service-description">
                Quickly build, test, and deploy cost-effective enterprise
                applications with handpicked Python developers with extensive
                experience crafting high-quality, scalable, and impactful
                projects, leveraging the cutting-edge technology stack.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-cloud" aria-hidden="true" />
              </div>
              <h3 className="service-title">Cloud-Based Development</h3>
              <p className="service-description">
                Ingraining AWS, GCP, Microsoft Azure, Heroku, and Python anywhere,
                our Python developers ensure elasticity, scalability, and
                efficiency. Combining Python with the cloud enables streamlining
                operations and innovation and empowers data to unlock its full
                potential.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-layer-group" aria-hidden="true" />
              </div>
              <h3 className="service-title">Python Front-End Developer</h3>
              <p className="service-description">
                Looking for development or modernization with contemporary,
                responsive interfaces that are cost-effective and delivered with a
                quick turnaround? Hire our dedicated Python front-end developer to
                create eye-catching interfaces that engage, entertain, and
                convert.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fa-solid fa-server" aria-hidden="true" />
              </div>
              <h3 className="service-title">Python Back End Developer</h3>
              <p className="service-description">
                Hire our backend developer with a proven track record in your
                business niche. Whether you aim to strengthen security and
                efficiency or develop high-performance server solutions for web or
                IoT apps, our developers are ready.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ENGAGEMENT MODELS SECTION */}
      <section
        className="section"
        style={{
          backgroundColor: "var(--container-color)",
          borderTop: "1px solid var(--border-color)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Flexible Engagement Models</h2>
            <p className="section-subtitle">
              Get custom-fit engagement models to meet your business requirements
            </p>
          </div>
          <div className="services-grid services-grid-2">
            <div className="service-card" style={{ backgroundColor: "transparent" }}>
              <h3
                className="service-title"
                style={{
                  color: "var(--first-color)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                Dedicated Team
              </h3>
              <p className="service-description">
                Hire a complete, cross-functional team of developers, QA, and
                project managers dedicated solely to your project. Ideal for
                long-term development where requirements evolve over time.
              </p>
              <ul style={{ listStyleType: "none", marginBottom: "1.5rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <i className="fa-solid fa-check"
                    style={{ color: "var(--first-color)", marginRight: "0.5rem" }} aria-hidden="true" />{" "}
                  Full control over team and processes
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <i className="fa-solid fa-check"
                    style={{ color: "var(--first-color)", marginRight: "0.5rem" }} aria-hidden="true" />{" "}
                  Transparent monthly billing
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <i className="fa-solid fa-check"
                    style={{ color: "var(--first-color)", marginRight: "0.5rem" }} aria-hidden="true" />{" "}
                  Seamless scaling of resources
                </li>
              </ul>
            </div>
            <div className="service-card" style={{ backgroundColor: "transparent" }}>
              <h3
                className="service-title"
                style={{
                  color: "var(--first-color)",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                Staff Augmentation
              </h3>
              <p className="service-description">
                Quickly scale your existing in-house team with specialized Python
                developers to bridge skill gaps and meet aggressive project
                deadlines without long-term hiring commitments.
              </p>
              <ul style={{ listStyleType: "none", marginBottom: "1.5rem" }}>
                <li style={{ marginBottom: "0.5rem" }}>
                  <i className="fa-solid fa-check"
                    style={{ color: "var(--first-color)", marginRight: "0.5rem" }} aria-hidden="true" />{" "}
                  Skip recruitment hassles
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <i className="fa-solid fa-check"
                    style={{ color: "var(--first-color)", marginRight: "0.5rem" }} aria-hidden="true" />{" "}
                  Direct integration with your team
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <i className="fa-solid fa-check"
                    style={{ color: "var(--first-color)", marginRight: "0.5rem" }} aria-hidden="true" />{" "}
                  Flexible engagement duration
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US GRID */}
      <section
        className="section why-section"
        style={{ backgroundColor: "transparent", border: "none" }}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why Hire With Us?</h2>
            <p className="section-subtitle">The Ramest Technolabs Advantage</p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-user-check" aria-hidden="true" />
              </div>
              <h3 className="why-title">Pre-Vetted Experts</h3>
              <p className="why-desc">
                Skip the interview fatigue. We deploy only proven, experienced
                engineers ready to code.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-bolt" aria-hidden="true" />
              </div>
              <h3 className="why-title">Fast Onboarding</h3>
              <p className="why-desc">
                Scale your team in days. Seamless integration into your existing
                workflows and tools.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-shield-halved" aria-hidden="true" />
              </div>
              <h3 className="why-title">Zero Risk</h3>
              <p className="why-desc">
                No long-term hiring risks, hidden fees, or retention headaches.
                Scale up or down easily.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="fa-solid fa-comments" aria-hidden="true" />
              </div>
              <h3 className="why-title">Direct Communication</h3>
              <p className="why-desc">
                Work directly with developers via Slack, Jira, and Zoom. Absolute
                transparency.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Ready to Expand Your Technical Bandwidth?"
        description="Let's discuss your project requirements and align the perfect engineering talent for your goals."
        buttonLabel="Let's Talk"
      />
    </div>
  );
}
