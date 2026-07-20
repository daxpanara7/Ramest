export type TeamMember = {
  name: string;
  role: string;
  /** Empty string renders an initials avatar until a real photo is supplied. */
  image: string;
  /** Describes the photo — never just the name, which the adjacent heading already gives. */
  alt: string;
  /** Short bio: EEAT signal and the substance AI answer engines quote. */
  bio: string;
  expertise: string[];
};

export const teamMembers: TeamMember[] = [
  {
    name: "Dax Panara",
    role: "Founder & CEO",
    image: "/assets/dax-panara.webp",
    alt: "Portrait of Dax Panara, Founder and CEO of Ramest Technolabs",
    bio: "Dax founded Ramest Technolabs to build software teams that stay accountable for outcomes rather than hours. He leads technical direction and works directly with clients during discovery and architecture.",
    expertise: ["Product Architecture", "Technical Strategy", "Client Delivery"],
  },
  {
    name: "Het Gadhiya",
    role: "AI Engineer",
    image: "/assets/het-gadhiya.webp",
    alt: "Portrait of Het Gadhiya, AI Engineer at Ramest Technolabs",
    bio: "Het builds the LLM and machine learning systems behind our AI work — retrieval pipelines, evaluation harnesses, and the guardrails that make generative features safe to ship.",
    expertise: ["LLMs & RAG", "ML Pipelines", "Model Evaluation"],
  },
  {
    name: "Jay Gohel",
    role: "Senior Backend Developer",
    image: "/assets/jay-gohel.webp",
    alt: "Portrait of Jay Gohel, Senior Backend Developer at Ramest Technolabs",
    bio: "Jay designs the APIs and data layers our platforms run on, with a focus on systems that stay predictable under load and remain straightforward for client teams to maintain.",
    expertise: ["API Design", "Databases", "Cloud Infrastructure"],
  },
  {
    name: "Jay Manek",
    role: "Senior Frontend Developer",
    image: "/assets/jay-manek.webp",
    alt: "Portrait of Jay Manek, Senior Frontend Developer at Ramest Technolabs",
    bio: "Jay turns product and brand intent into fast, accessible interfaces, and owns the design systems that keep our front-end work consistent across a client's product surface.",
    expertise: ["React & Next.js", "Design Systems", "Web Performance"],
  },
  {
    name: "Deep Radaliya",
    role: "Sales Associate",
    image: "/assets/deep-radaliya.webp",
    alt: "Portrait of Deep Radaliya, Sales Associate at Ramest Technolabs",
    bio: "Deep is usually the first person you speak to. He scopes incoming projects and makes sure conversations reach the right engineers quickly instead of sitting in a pipeline.",
    expertise: ["Client Discovery", "Project Scoping", "Partnerships"],
  },
  {
    name: "Param Suthar",
    role: "Graphic & Motion Designer",
    // TODO: swap for "/assets/param-suthar.webp" once the photo is added.
    image: "",
    alt: "Portrait of Param Suthar, Graphic & Motion Designer at Ramest Technolabs",
    bio: "Param shapes how our work looks and moves — brand systems, product visuals, and the motion design that makes an interface feel considered rather than decorated.",
    expertise: ["Brand Identity", "Motion Graphics", "Visual Design"],
  },
];
