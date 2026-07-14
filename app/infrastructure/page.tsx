import SectionHeader from "@/components/sections/SectionHeader";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Our Infrastructure",
  description:
    "Discover the technology infrastructure powering Ramest Technolabs — our tools, platforms, and capabilities.",
  path: "/infrastructure",
});

export default function Page() {
  return (
    <section className="section" style={{ paddingTop: "8rem" }}>
      <div className="container">
        <SectionHeader
          title="Our Infrastructure"
          subtitle="Tech capabilities for scalable and reliable solutions"
        />
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">
              <i className="fa-solid fa-cloud"></i>
            </div>
            <h3 className="service-title">Cloud Infrastructure</h3>
            <p className="service-description">
              Leveraging AWS, GCP, and Azure to build scalable, secure, and
              high-availability systems for every client project.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <h3 className="service-title">Security & Compliance</h3>
            <p className="service-description">
              Enterprise-grade security practices, data encryption, and
              compliance protocols built into every layer of our infrastructure.
            </p>
          </div>
          <div className="service-card">
            <div className="service-icon">
              <i className="fa-solid fa-network-wired"></i>
            </div>
            <h3 className="service-title">DevOps & CI/CD</h3>
            <p className="service-description">
              Automated pipelines, containerization with Docker & Kubernetes, and
              continuous delivery for rapid, reliable deployments.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
