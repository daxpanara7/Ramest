import SectionHeader from "@/components/sections/SectionHeader";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Certifications",
  description:
    "Ramest Technolabs' industry-recognized certifications backing our commitment to quality and excellence.",
  path: "/certifications",
});

export default function Page() {
  return (
    <section className="section" style={{ paddingTop: "8rem" }}>
      <div className="container">
        <SectionHeader
          title="Certifications"
          subtitle="Industry-recognized credentials backing our quality"
        />
        <div className="cert-grid">
          <div className="cert-card">
            <div className="cert-icon">
              <i className="fa-brands fa-aws"></i>
            </div>
            <div className="cert-name">AWS Certified</div>
            <div className="cert-body">
              Amazon Web Services Cloud Practitioner & Solutions Architect
              certifications.
            </div>
          </div>
          <div className="cert-card">
            <div className="cert-icon">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div className="cert-name">ISO 27001</div>
            <div className="cert-body">
              Information security management best practices certified and
              compliant.
            </div>
          </div>
          <div className="cert-card">
            <div className="cert-icon">
              <i className="fa-brands fa-google"></i>
            </div>
            <div className="cert-name">Google Cloud Certified</div>
            <div className="cert-body">
              Professional Cloud Architect and Data Engineer certified partner.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
