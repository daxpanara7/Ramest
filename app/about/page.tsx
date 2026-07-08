import type { Metadata } from "next";
import Link from "next/link";
import SiteLayout from "@/components/SiteLayout";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn more about Ramest Technolabs and our mission.",
};

export default function Page() {
  return (
    <SiteLayout activePage="about" includeHireInFooter={true}>
      {/* PAGE HERO */}
        <section className="page-hero section" style={{ paddingTop: "8rem", paddingBottom: "3rem" }}>
            <div className="container">
                <div className="page-hero-badge">Our Story</div>
                <h1 className="page-hero-title">About <span className="gradient-text">Ramest Technolabs</span></h1>
                <p className="page-hero-desc">A team of passionate engineers, designers, and thinkers on a mission to turn
                    great ideas into world-class digital products.</p>
            </div>
        </section>

        {/* WHO WE ARE */}
        <section className="section">
            <div className="container about-container">
                <div className="about-image">
                    <div className="img-box">
                        <img src="/assets/image (8).png" alt="Dax Panara - Founder, Ramest Technolabs" className="about-img" />
                    </div>
                </div>
                <div className="about-content">
                    <h2 className="section-title">Who We Are</h2>
                    <p className="about-text">
                        Ramest Technolabs is a next-generation IT company founded by <strong>Dax Panara</strong> in
                        Surat, India. We specialize in delivering scalable software solutions — from custom web and
                        mobile apps to AI/ML-powered products — for clients across the globe.
                    </p>
                    <p className="about-text" style={{ marginTop: "1rem" }}>
                        We blend technical precision with creative thinking to build products that don't just work —
                        they <em>delight</em>. Our team is our greatest asset, and we invest continuously in their
                        growth, tools, and well-being.
                    </p>
                    <div className="about-stats">
                        <div className="stat-item">
                            <span className="stat-number"><i className="fa-solid fa-map-marker-alt"></i></span>
                            <span className="stat-Label">Ahmedabad, India</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number"><i className="fa-solid fa-globe"></i></span>
                            <span className="stat-Label">Global Clients</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number"><i className="fa-solid fa-code-branch"></i></span>
                            <span className="stat-Label">Agile Delivery</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number"><i className="fa-solid fa-shield-halved"></i></span>
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
                        <div className="mv-icon"><i className="fa-solid fa-rocket"></i></div>
                        <h3 className="mv-title">Our Mission</h3>
                        <p className="mv-text">To empower businesses of all sizes with cutting-edge technology that
                            accelerates growth, drives efficiency, and creates lasting impact.</p>
                    </div>
                    <div className="mv-card">
                        <div className="mv-icon"><i className="fa-solid fa-eye"></i></div>
                        <h3 className="mv-title">Our Vision</h3>
                        <p className="mv-text">To be the most trusted technology partner for startups and enterprises
                            worldwide — known for innovation, quality, and unwavering commitment.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* CORE VALUES */}
        <section className="section why-section">
            <div className="container">
                <div className="section-header">
                    <h2 className="section-title">Our Core Values</h2>
                    <p className="section-subtitle">Principles that guide every decision we make</p>
                </div>
                <div className="why-grid">
                    <div className="why-card">
                        <div className="why-icon"><i className="fa-solid fa-star"></i></div>
                        <h3 className="why-title">Excellence</h3>
                        <p className="why-desc">We refuse to ship mediocre work. Every line of code, every pixel, every
                            feature is crafted to the highest standard.</p>
                    </div>
                    <div className="why-card">
                        <div className="why-icon"><i className="fa-solid fa-handshake"></i></div>
                        <h3 className="why-title">Integrity</h3>
                        <p className="why-desc">Honest communication, transparent pricing, and clear expectations — always.
                            No surprises, no shortcuts.</p>
                    </div>
                    <div className="why-card">
                        <div className="why-icon"><i className="fa-solid fa-lightbulb"></i></div>
                        <h3 className="why-title">Innovation</h3>
                        <p className="why-desc">We stay ahead of the curve, continuously exploring new technologies and
                            approaches to solve problems better.</p>
                    </div>
                    <div className="why-card">
                        <div className="why-icon"><i className="fa-solid fa-people-group"></i></div>
                        <h3 className="why-title">Collaboration</h3>
                        <p className="why-desc">Your team + our team = one team. We work closely with clients as true
                            partners, not just vendors.</p>
                    </div>
                </div>
            </div>
        </section>

        {/* CTA */}
        <section className="cta-section">
            <div className="container cta-container">
                <div className="cta-content">
                    <h2 className="cta-title">Let's Build Together</h2>
                    <p className="cta-desc">Partner with Ramest Technolabs and turn your vision into reality.</p>
                </div>
                <Link href="/contact" className="button button-cta">Get In Touch <i
                        className="fa-solid fa-arrow-right"></i></Link>
            </div>
        </section>
    </SiteLayout>
  );
}
