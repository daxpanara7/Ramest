import Link from "next/link";
import SectionHeader from "@/components/sections/SectionHeader";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Career Overview",
  description:
    "Join Ramest Technolabs — explore career opportunities and grow with us.",
  path: "/careers",
});

export default function Page() {
  return (
    <section className="section" style={{ paddingTop: "8rem" }}>
      <div className="container">
        <SectionHeader
          title="Career Overview"
          subtitle="Grow with us and build rewarding careers"
        />
        <p className="careers-intro">
          At Ramest Technolabs, we believe great people build great products.
          We&apos;re always looking for passionate engineers, designers, and
          strategists who want to make an impact. Join a team that values
          creativity, collaboration, and continuous learning.
        </p>
        <div className="perks-grid">
          <div className="perk-card">
            <div className="perk-icon">
              <i className="fa-solid fa-rocket"></i>
            </div>
            <div className="perk-title">Fast Growth</div>
            <div className="perk-desc">
              Work on cutting-edge projects and grow your skills rapidly in a
              supportive environment.
            </div>
          </div>
          <div className="perk-card">
            <div className="perk-icon">
              <i className="fa-solid fa-people-group"></i>
            </div>
            <div className="perk-title">Great Culture</div>
            <div className="perk-desc">
              Collaborative, inclusive team culture where your ideas are heard
              and recognized.
            </div>
          </div>
          <div className="perk-card">
            <div className="perk-icon">
              <i className="fa-solid fa-laptop-house"></i>
            </div>
            <div className="perk-title">Flexible Work</div>
            <div className="perk-desc">
              Remote-friendly environment with flexible hours to support
              work-life balance.
            </div>
          </div>
          <div className="perk-card">
            <div className="perk-icon">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <div className="perk-title">Learning Budget</div>
            <div className="perk-desc">
              Annual budget for courses, certifications, and conferences to keep
              you ahead.
            </div>
          </div>
          <div className="perk-card">
            <div className="perk-icon">
              <i className="fa-solid fa-coins"></i>
            </div>
            <div className="perk-title">Competitive Pay</div>
            <div className="perk-desc">
              Market-competitive salaries reviewed regularly with performance
              bonuses.
            </div>
          </div>
          <div className="perk-card">
            <div className="perk-icon">
              <i className="fa-solid fa-star"></i>
            </div>
            <div className="perk-title">Work on Purpose</div>
            <div className="perk-desc">
              Build real products that solve real problems for clients across the
              globe.
            </div>
          </div>
        </div>
        <div className="careers-cta">
          <Link href="/contact" className="button button-primary">
            Get in Touch <i className="fa-solid fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </section>
  );
}
