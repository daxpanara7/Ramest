import CtaBanner from "@/components/sections/CtaBanner";
import PageHero from "@/components/sections/PageHero";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Services",
  description:
    "Explore our services: Custom Software Development, Mobile & Web Apps, and AI/ML Solutions.",
  path: "/services",
});

export default function Page() {
  return (
    <>
      <PageHero
        badge="What We Offer"
        title={
          <>
            Our <span className="gradient-text">Services</span>
          </>
        }
        description="From idea to launch — we build, scale, and maintain digital products that your users love."
      />

      {/* SERVICES SECTION */}
      <section className="section" id="services">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Expertise</h2>
            <p className="section-subtitle">
              Delivering precision and quality across all digital domains.
            </p>
          </div>
          <div className="services-grid services-grid-2">
            <div className="service-card reveal">
              <div className="service-icon">
                <i className="fa-solid fa-laptop-code"></i>
              </div>
              <h3 className="service-title">Custom Software Development</h3>
              <p className="service-description">
                Tailor-made software solutions designed to meet your specific
                business requirements. We own the full lifecycle from architecture
                to deployment.
              </p>
              <div className="service-tags">
                <span>Node.js</span>
                <span>Python</span>
                <span>PostgreSQL</span>
              </div>
            </div>
            <div className="service-card reveal-delayed">
              <div className="service-icon">
                <i className="fa-solid fa-mobile-button"></i>
              </div>
              <h3 className="service-title">Mobile & Web Applications</h3>
              <p className="service-description">
                Scalable mobile and web applications that drive user engagement
                and business growth, designed for performance at any scale.
              </p>
              <div className="service-tags">
                <span>React</span>
                <span>Flutter</span>
                <span>Next.js</span>
              </div>
            </div>
            <div className="service-card reveal">
              <div className="service-icon">
                <i className="fa-solid fa-brain"></i>
              </div>
              <h3 className="service-title">AI / ML Solutions</h3>
              <p className="service-description">
                Leveraging AI and Machine Learning to automate processes, extract
                insights, and build intelligent features into your product.
              </p>
              <div className="service-tags">
                <span>TensorFlow</span>
                <span>OpenAI</span>
                <span>Python</span>
              </div>
            </div>
            <div className="service-card reveal-delayed">
              <div className="service-icon">
                <i className="fa-solid fa-palette"></i>
              </div>
              <h3 className="service-title">UI / UX Design</h3>
              <p className="service-description">
                Beautiful, intuitive interfaces that convert users. We combine
                design thinking and user research to create experiences people
                love.
              </p>
              <div className="service-tags">
                <span>Figma</span>
                <span>Prototyping</span>
                <span>Research</span>
              </div>
            </div>
            <div className="service-card reveal">
              <div className="service-icon">
                <i className="fa-solid fa-cloud"></i>
              </div>
              <h3 className="service-title">Cloud & DevOps</h3>
              <p className="service-description">
                Reliable, scalable cloud infrastructure with automated CI/CD
                pipelines and 24/7 monitoring to keep your product always-on.
              </p>
              <div className="service-tags">
                <span>AWS</span>
                <span>Docker</span>
                <span>Kubernetes</span>
              </div>
            </div>
            <div className="service-card reveal-delayed">
              <div className="service-icon">
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <h3 className="service-title">Security & Compliance</h3>
              <p className="service-description">
                Enterprise-grade security audits, penetration testing, and
                compliance reviews to protect your data and meet industry
                standards.
              </p>
              <div className="service-tags">
                <span>ISO 27001</span>
                <span>OWASP</span>
                <span>GDPR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="section why-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How We Work</h2>
            <p className="section-subtitle">
              A streamlined process built for speed and quality
            </p>
          </div>
          <div className="why-grid">
            <div className="why-card reveal">
              <div className="why-icon why-step">01</div>
              <h3 className="why-title">Discover</h3>
              <p className="why-desc">
                We understand your business, goals, and users before writing a
                single line of code.
              </p>
            </div>
            <div className="why-card reveal">
              <div className="why-icon why-step">02</div>
              <h3 className="why-title">Design</h3>
              <p className="why-desc">
                Wireframes and interactive prototypes let you see and refine the
                product before development begins.
              </p>
            </div>
            <div className="why-card reveal">
              <div className="why-icon why-step">03</div>
              <h3 className="why-title">Build</h3>
              <p className="why-desc">
                Agile sprints with weekly demos keep you in the loop while we
                build a rock-solid product.
              </p>
            </div>
            <div className="why-card reveal">
              <div className="why-icon why-step">04</div>
              <h3 className="why-title">Launch & Grow</h3>
              <p className="why-desc">
                Smooth deployment and post-launch support ensure your product
                thrives in the real world.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner
        title="Have a Project in Mind?"
        description="Let's talk about how we can help build and grow your digital product."
        buttonLabel="Let's Talk"
      />
    </>
  );
}
