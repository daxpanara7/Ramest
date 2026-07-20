import Image from "next/image";
import Link from "next/link";
import { JsonLdScript } from "@/components/JsonLd";
import PageHero from "@/components/sections/PageHero";
import { teamMembers } from "@/lib/team";
import {
  ENTITY,
  SITE,
  breadcrumbJsonLd,
  createPageMetadata,
} from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Our Team",
  description:
    "Meet the engineers behind Ramest Technolabs — the founder, AI, backend, and front-end specialists who work directly on your project in Ahmedabad, Gujarat.",
  path: "/team",
});

/** Slug used as the anchor + Person @id fragment for each member. */
function anchorFor(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function Page() {
  const peopleGraph = {
    "@context": "https://schema.org",
    "@graph": teamMembers.map((member) => ({
      "@type": "Person",
      "@id": `${SITE.url}/team#${anchorFor(member.name)}`,
      name: member.name,
      jobTitle: member.role,
      description: member.bio,
      image: `${SITE.url}${member.image}`,
      knowsAbout: member.expertise,
      worksFor: { "@id": ENTITY.organization },
      url: `${SITE.url}/team#${anchorFor(member.name)}`,
    })),
  };

  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Company", path: "/company" },
    { name: "Our Team", path: "/team" },
  ]);

  return (
    <>
      <JsonLdScript id="team-people-jsonld" data={peopleGraph} />
      <JsonLdScript id="team-breadcrumb" data={breadcrumbs} />

      <nav aria-label="Breadcrumb" className="breadcrumb">
        <div className="container">
          <ol className="breadcrumb-list">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/company">Company</Link>
            </li>
            <li aria-current="page">Our Team</li>
          </ol>
        </div>
      </nav>

      <PageHero
        badge="Our Team"
        style={{ paddingTop: "1.5rem", paddingBottom: "3rem" }}
        title={
          <>
            The people who will actually{" "}
            <span className="gradient-text">do the work</span>
          </>
        }
        description="Ramest Technolabs is a small, senior team by design. The engineers you meet during discovery are the ones who write the code — there is no handover to an unnamed delivery pool after you sign."
      />

      <section className="team section" id="team">
        <div className="container">
          <h2 className="section-title">Meet the team</h2>

          <div className="team-grid">
            {teamMembers.map((member) => (
              <article
                className="team-card"
                key={member.name}
                id={anchorFor(member.name)}
              >
                <div className="team-img-box">
                  <Image
                    src={member.image}
                    alt={member.alt}
                    className="team-img"
                    width={320}
                    height={320}
                    sizes="(max-width: 768px) 45vw, 220px"
                  />
                </div>
                <h3 className="team-name">{member.name}</h3>
                <span className="team-role">{member.role}</span>
                <p className="team-bio">{member.bio}</p>
                <ul className="team-expertise">
                  {member.expertise.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <p className="contact-note">
            Want to work with them? See{" "}
            <Link href="/services">what we build</Link> or{" "}
            <Link href="/contact">start a conversation</Link>. Looking to join?
            We are usually hiring — <Link href="/careers">see careers</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
