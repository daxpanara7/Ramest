/**
 * Open roles shown on /careers.
 *
 * Single source of truth for the roles board, the category counts beside it,
 * and the "Position applied for" dropdown on the apply form — so a role can
 * never appear in the list but be un-selectable in the form.
 *
 * To change what is hiring, edit this array only. `openings` drives the badge
 * on each card; set it to the real headcount you are recruiting for, and drop
 * the whole entry when a role closes.
 */
export type Role = {
  /** Stable id — used as the React key and the apply-form value. */
  slug: string;
  category: string;
  title: string;
  /** Headcount open for this role. Rendered as "N Opening(s)". */
  openings: number;
  /** Human range, shown as a pill: "2 - 5 Years", "0 Year" for freshers. */
  experience: string;
  type: string;
  location: string;
  /** One-paragraph pitch, revealed by "View details". */
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

export const ROLES: Role[] = [
  {
    slug: "frontend-engineer",
    category: "Engineering",
    title: "Frontend Engineer — React & Next.js",
    openings: 2,
    experience: "2 - 5 Years",
    type: "Full Time",
    location: "Ahmedabad · Remote-friendly",
    summary:
      "Build the interfaces our clients' customers actually touch — production React and Next.js work, from the first component to Core Web Vitals on a live site.",
    responsibilities: [
      "Ship features end to end in React / Next.js, including the API contract you need from the backend team.",
      "Own performance and accessibility for the screens you build — Lighthouse and axe results are part of the definition of done.",
      "Review teammates' pull requests and keep the design system honest as it grows.",
    ],
    requirements: [
      "Two or more years writing production React, with real Next.js App Router experience.",
      "Comfortable with TypeScript, modern CSS, and reading a Figma file without a spec meeting.",
      "You can explain a rendering or bundle-size decision to a non-engineer.",
    ],
  },
  {
    slug: "backend-engineer",
    category: "Engineering",
    title: "Backend Engineer — Node.js & Python",
    openings: 2,
    experience: "2 - 6 Years",
    type: "Full Time",
    location: "Ahmedabad · Remote-friendly",
    summary:
      "Design and run the services behind our client products — APIs, data models, background jobs, and the operational reality of keeping them up.",
    responsibilities: [
      "Model the domain and build the APIs, with the tests and migrations that make them safe to change later.",
      "Instrument what you ship: logs, metrics and alerts that tell you something broke before a client does.",
      "Take part in architecture calls — including the infrastructure ones, not just the code.",
    ],
    requirements: [
      "Two or more years on production Node.js or Python services with a relational database.",
      "You know why an index, a queue or a transaction is the right answer, and when it is not.",
      "Experience carrying something you built through a real incident.",
    ],
  },
  {
    slug: "ai-ml-engineer",
    category: "AI & Data",
    title: "AI / ML Engineer — LLMs & Automation",
    openings: 1,
    experience: "2 - 5 Years",
    type: "Full Time",
    location: "Ahmedabad · Remote-friendly",
    summary:
      "Take language models from a promising demo to something a business can rely on — retrieval, evaluation, cost control and the plumbing in between.",
    responsibilities: [
      "Build retrieval and agent workflows on top of modern LLM APIs, and the evaluation harness that proves they work.",
      "Own the unglamorous half: latency, token cost, failure modes, and what happens when the model is confidently wrong.",
      "Work directly with clients to separate what AI genuinely solves from what it only appears to.",
    ],
    requirements: [
      "Shipped at least one LLM-backed feature that real users touched.",
      "Strong Python, and a working grasp of embeddings, retrieval and prompt evaluation.",
      "Healthy scepticism about benchmark numbers.",
    ],
  },
  {
    slug: "ui-ux-designer",
    category: "Design",
    title: "UI/UX Designer — Product & Design Systems",
    openings: 1,
    experience: "3 - 6 Years",
    type: "Full Time",
    location: "Ahmedabad · Remote-friendly",
    summary:
      "Design product interfaces that survive contact with engineering — systems and flows, not just screens that look good in a portfolio shot.",
    responsibilities: [
      "Run discovery with clients and turn what you learn into flows, wireframes and a testable prototype.",
      "Build and maintain the design system alongside the engineers who implement it.",
      "Sit in on implementation reviews so the shipped screen matches the intent.",
    ],
    requirements: [
      "Three or more years designing software products, with a portfolio showing shipped work.",
      "Fluent in Figma, components and tokens; comfortable talking through constraints with developers.",
      "You design for accessibility by default, not as a final audit.",
    ],
  },
  {
    slug: "cloud-devops-engineer",
    category: "Cloud & DevOps",
    title: "Cloud & DevOps Engineer — AWS",
    openings: 1,
    experience: "3 - 7 Years",
    type: "Full Time",
    location: "Ahmedabad · Remote-friendly",
    summary:
      "Own how our work reaches production: infrastructure as code, pipelines that people trust, and cost that does not surprise the client at month end.",
    responsibilities: [
      "Build and maintain AWS infrastructure through Terraform or CDK — no console-only changes.",
      "Keep CI/CD fast and boring, with rollbacks that work when someone actually needs them.",
      "Set up monitoring and on-call practice proportionate to what the system is worth.",
    ],
    requirements: [
      "Three or more years running production workloads on AWS.",
      "Solid with containers, IaC and at least one CI system you have configured from scratch.",
      "You treat a security group or an IAM policy as code that gets reviewed.",
    ],
  },
  {
    slug: "qa-automation-engineer",
    category: "Quality",
    title: "QA & Automation Engineer",
    openings: 1,
    experience: "2 - 5 Years",
    type: "Full Time",
    location: "Ahmedabad · Remote-friendly",
    summary:
      "Be the reason a release is calm. Build the automated coverage that lets a small team ship weekly without holding its breath.",
    responsibilities: [
      "Own the end-to-end suite — Playwright or Cypress — and keep it fast and free of flakes.",
      "Test the API layer directly, not only through the UI.",
      "Work with engineers on what should be a unit test instead of an E2E one.",
    ],
    requirements: [
      "Two or more years in test automation on a web product.",
      "You can read the application code you are testing and file a bug report an engineer can act on immediately.",
      "Experience wiring tests into a CI pipeline.",
    ],
  },
];

/** Ordered category list with counts, for the board's filter rail. */
export function roleCategories(roles: Role[] = ROLES) {
  const counts = new Map<string, number>();
  for (const role of roles) {
    counts.set(role.category, (counts.get(role.category) ?? 0) + 1);
  }
  return [
    { name: "All Positions", count: roles.length },
    ...Array.from(counts, ([name, count]) => ({ name, count })),
  ];
}
