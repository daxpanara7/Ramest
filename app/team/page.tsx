import SectionHeader from "@/components/sections/SectionHeader";
import { teamMembers } from "@/lib/team";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Our Team",
  description: "Meet the expert team behind Ramest Technolabs.",
  path: "/team",
});

export default function Page() {
  return (
    <section className="team section" id="team" style={{ paddingTop: "8rem" }}>
      <div className="container">
        <SectionHeader
          title="Meet Our Team"
          subtitle="The innovative minds behind our success."
        />

        <div className="team-grid">
          {teamMembers.map((member) => (
            <div className="team-card" key={member.name}>
              <div className="team-img-box">
                <img
                  src={member.image}
                  alt={member.alt}
                  className="team-img"
                />
              </div>
              <h3 className="team-name">{member.name}</h3>
              <span className="team-role">{member.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
