import type { Metadata } from "next";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "Company",
  description: "Learn about Ramest Technolabs — our team, infrastructure, certifications, alliances, and development methodology.",
};

export default function Page() {
  return (
    <SiteLayout activePage="company" includeHireInFooter={true}>
      <section className="section" id="company" style={{ paddingTop: "8rem" }}>
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Company Overview</h2>
                    <p className="section-subtitle">Everything about Ramest Technolabs</p>
                </div>

                <div className="company-overview-grid">
                    {/* About Us */}
                    <Link href="/about" className="company-overview-item">
                        <div className="company-overview-item-icon"><i className="fa-solid fa-building"></i></div>
                        <h3>About Us</h3>
                        <p>Transforming challenges into opportunities with tech.</p>
                        <i className="fa-solid fa-arrow-right item-arrow"></i>
                    </Link>

                    {/* Our Infrastructure */}
                    <Link href="/infrastructure" className="company-overview-item">
                        <div className="company-overview-item-icon"><i className="fa-solid fa-server"></i></div>
                        <h3>Our Infrastructure</h3>
                        <p>Tech capabilities for scalable and reliable solutions.</p>
                        <i className="fa-solid fa-arrow-right item-arrow"></i>
                    </Link>

                    {/* Our Team */}
                    <Link href="/team" className="company-overview-item">
                        <div className="company-overview-item-icon"><i className="fa-solid fa-users"></i></div>
                        <h3>Our Team</h3>
                        <p>Dedicated experts transforming ideas into powerful digital solutions.</p>
                        <i className="fa-solid fa-arrow-right item-arrow"></i>
                    </Link>

                    {/* Certifications */}
                    <Link href="/certifications" className="company-overview-item">
                        <div className="company-overview-item-icon"><i className="fa-solid fa-certificate"></i></div>
                        <h3>Certifications</h3>
                        <p>Industry-recognized certifications backing our commitment to quality.</p>
                        <i className="fa-solid fa-arrow-right item-arrow"></i>
                    </Link>

                    {/* Career Overview */}
                    <Link href="/careers" className="company-overview-item">
                        <div className="company-overview-item-icon"><i className="fa-solid fa-briefcase"></i></div>
                        <h3>Career Overview</h3>
                        <p>Grow with us and build rewarding careers with creative cohorts.</p>
                        <i className="fa-solid fa-arrow-right item-arrow"></i>
                    </Link>

                    {/* Contact Us */}
                    <Link href="/contact" className="company-overview-item">
                        <div className="company-overview-item-icon"><i className="fa-solid fa-envelope"></i></div>
                        <h3>Contact Us</h3>
                        <p>Connect with Ramest Technolabs to bring your tech ideas to life.</p>
                        <i className="fa-solid fa-arrow-right item-arrow"></i>
                    </Link>
                </div>
            </div>
        </section>
    </SiteLayout>
  );
}
