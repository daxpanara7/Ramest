import type { Metadata } from "next";
import SiteLayout from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the expert team behind Ramest Technolabs.",
};

export default function Page() {
  return (
    <SiteLayout activePage="team" includeHireInFooter={true}>
      {/* TEAM SECTION */}
        <section className="team section" id="team" style={{ paddingTop: "8rem" }}>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Meet Our Team</h2>
                    <p className="section-subtitle">The innovative minds behind our success.</p>
                </div>

                <div className="team-grid">
                    <div className="team-card">
                        <div className="team-img-box">
                            <img src="/assets/image (8).png" alt="Founder" className="team-img" />
                        </div>
                        <h3 className="team-name">Dax Panara</h3>
                        <span className="team-role">Founder & CEO</span>
                    </div>

                    <div className="team-card">
                        <div className="team-img-box">
                            <img src="/assets/image.png" alt="Deep Radaliya" className="team-img" />
                        </div>
                        <h3 className="team-name">Deep Radaliya</h3>
                        <span className="team-role">Co-Founder</span>
                    </div>

                    <div className="team-card">
                        <div className="team-img-box">
                            <img src="/assets/Gemini_Generated_Image_ehgr7mehgr7mehgr.png" alt="Het Gadhiya" className="team-img" />
                        </div>
                        <h3 className="team-name">Het Gadhiya</h3>
                        <span className="team-role">Full Stack Developer</span>
                    </div>

                </div>
            </div>
        </section>
    </SiteLayout>
  );
}
