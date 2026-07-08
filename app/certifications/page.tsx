import type { Metadata } from "next";
import SiteLayout from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Certifications",
  description: "Ramest Technolabs' industry-recognized certifications backing our commitment to quality and excellence.",
};

export default function Page() {
  return (
    <SiteLayout activePage="certifications" includeHireInFooter={true}>
      <section className="section" style={{ paddingTop: "8rem" }}>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Certifications</h2>
                    <p className="section-subtitle">Industry-recognized credentials backing our quality</p>
                </div>
                <div className="cert-grid">
                    <div className="cert-card">
                        <div className="cert-icon"><i className="fa-brands fa-aws"></i></div>
                        <div className="cert-name">AWS Certified</div>
                        <div className="cert-body">Amazon Web Services Cloud Practitioner & Solutions Architect
                            certifications.</div>
                    </div>
                    <div className="cert-card">
                        <div className="cert-icon"><i className="fa-solid fa-shield-halved"></i></div>
                        <div className="cert-name">ISO 27001</div>
                        <div className="cert-body">Information security management best practices certified and compliant.
                        </div>
                    </div>
                    <div className="cert-card">
                        <div className="cert-icon"><i className="fa-brands fa-google"></i></div>
                        <div className="cert-name">Google Cloud Certified</div>
                        <div className="cert-body">Professional Cloud Architect and Data Engineer certified partner.</div>
                    </div>
                </div>
            </div>
        </section>
    </SiteLayout>
  );
}
