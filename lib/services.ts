export type ServiceCategoryId =
  | "our-services"
  | "artificial-intelligence"
  | "industries";

export type ServiceItem = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  icon: string;
  tags: string[];
  href: string;
};

export type ServiceCategory = {
  id: ServiceCategoryId;
  title: string;
  shortTitle: string;
  description: string;
  icon: string;
  href: string;
  items: ServiceItem[];
};

function item(
  slug: string,
  title: string,
  shortDescription: string,
  description: string,
  icon: string,
  tags: string[]
): ServiceItem {
  return {
    slug,
    title,
    shortDescription,
    description,
    icon,
    tags,
    href: `/services/${slug}`,
  };
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "our-services",
    title: "Our Services",
    shortTitle: "Services",
    description:
      "End-to-end product engineering — from architecture to cloud — built for scale and reliability.",
    icon: "fa-diagram-project",
    href: "/services#our-services",
    items: [
      item(
        "software-development",
        "Software Development",
        "Custom systems engineered around your workflows.",
        "We design and build tailored software platforms — from internal tools to customer-facing products — with clean architecture, maintainable codebases, and a delivery model that keeps stakeholders aligned from discovery through launch.",
        "fa-laptop-code",
        ["Node.js", "Python", "PostgreSQL", "Microservices"]
      ),
      item(
        "web-application-development",
        "Web Application Development",
        "Fast, secure, conversion-focused web products.",
        "Modern web applications built with performance, accessibility, and SEO in mind. We ship responsive experiences that scale under load and stay easy to evolve as your product roadmap grows.",
        "fa-globe",
        ["Next.js", "React", "TypeScript", "API Design"]
      ),
      item(
        "cloud-infrastructure",
        "Cloud & Infrastructure",
        "Reliable cloud foundations with DevOps maturity.",
        "Cloud architecture, CI/CD, observability, and infrastructure automation so your platforms stay secure, cost-efficient, and ready for growth — across AWS and modern container workflows.",
        "fa-cloud",
        ["AWS", "Docker", "Kubernetes", "CI/CD"]
      ),
      item(
        "mobile-app-development",
        "Mobile App Development",
        "Native-quality apps for iOS and Android.",
        "Cross-platform and native mobile products that feel polished, perform well, and integrate cleanly with your backend and analytics stack — from MVP to production rollout.",
        "fa-mobile-screen-button",
        ["Flutter", "React Native", "iOS", "Android"]
      ),
      item(
        "front-end-development",
        "Front-End Development",
        "Interfaces that feel effortless and premium.",
        "Front-end engineering focused on design systems, interaction quality, and core web vitals. We turn product and brand intent into fast, accessible UI that teams can maintain.",
        "fa-code",
        ["React", "Next.js", "Design Systems", "Accessibility"]
      ),
      item(
        "data-engineering",
        "Data Engineering",
        "Pipelines and platforms that turn data into decisions.",
        "We build trustworthy data pipelines, warehousing patterns, and analytics foundations so product and business teams can act on accurate, timely insight.",
        "fa-database",
        ["ETL", "Warehousing", "Python", "Analytics"]
      ),
    ],
  },
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence",
    shortTitle: "AI",
    description:
      "Practical AI systems — strategy, integration, and agents that create measurable business value.",
    icon: "fa-brain",
    href: "/services#artificial-intelligence",
    items: [
      item(
        "ai-strategy-consulting",
        "AI Strategy & Consulting",
        "Roadmaps that connect AI to real business outcomes.",
        "We help leadership define where AI creates advantage — use-case prioritization, feasibility, governance, and a delivery roadmap that balances speed with risk.",
        "fa-chess",
        ["Use Cases", "ROI", "Governance", "Roadmaps"]
      ),
      item(
        "ai-chatbot-development",
        "AI Chatbot Development",
        "Conversational experiences that resolve, not frustrate.",
        "Production-grade chatbots and assistants for support, sales, and internal ops — grounded in your knowledge base, with escalation paths and measurable containment rates.",
        "fa-comments",
        ["NLP", "RAG", "Customer Support", "Omnichannel"]
      ),
      item(
        "ai-integration",
        "AI Integration",
        "Embed intelligence into products you already run.",
        "Integrate LLMs and ML services into existing applications securely — APIs, workflows, auth, monitoring, and cost controls included.",
        "fa-plug",
        ["APIs", "OpenAI", "Azure AI", "Workflows"]
      ),
      item(
        "llm-consulting-solutions",
        "LLM Consulting & Solutions",
        "LLM architecture, evaluation, and safe deployment.",
        "From model selection and prompt systems to evaluation harnesses and production guardrails — we help teams ship LLM features that are useful, measurable, and compliant.",
        "fa-robot",
        ["LLMs", "Evaluation", "Guardrails", "Fine-tuning"]
      ),
      item(
        "ai-agents-development",
        "AI Agents Development",
        "Autonomous agents that execute multi-step work.",
        "Design and build agentic systems that plan, tool-call, and complete business workflows with human-in-the-loop controls where it matters.",
        "fa-sitemap",
        ["Agents", "Tooling", "Orchestration", "Automation"]
      ),
      item(
        "custom-ai-development",
        "Custom AI Development",
        "Bespoke models and pipelines for your domain.",
        "Custom AI products tailored to your data and domain — from computer vision and forecasting to proprietary intelligence layers embedded in your platform.",
        "fa-microchip",
        ["ML Pipelines", "CV", "Forecasting", "MLOps"]
      ),
    ],
  },
  {
    id: "industries",
    title: "Industries",
    shortTitle: "Industries",
    description:
      "Domain-aware delivery for sectors where reliability, compliance, and scale are non-negotiable.",
    icon: "fa-industry",
    href: "/services#industries",
    items: [
      item(
        "manufacturing",
        "Manufacturing",
        "Digital systems for operations and supply visibility.",
        "Software and data platforms that modernize production workflows, quality tracking, and supply visibility — built for the realities of plant and field operations.",
        "fa-gears",
        ["IoT", "Ops", "Quality", "Supply Chain"]
      ),
      item(
        "fintech",
        "FinTech",
        "Secure, compliant products for financial services.",
        "Trusted engineering for payments, lending, and financial platforms — with security, auditability, and performance designed in from day one.",
        "fa-building-columns",
        ["Payments", "Security", "Compliance", "APIs"]
      ),
      item(
        "ecommerce",
        "Ecommerce",
        "Commerce experiences that convert and scale.",
        "Storefronts, marketplaces, and commerce backends engineered for conversion, catalog complexity, and peak-season reliability.",
        "fa-cart-shopping",
        ["Storefronts", "Checkout", "Integrations", "Growth"]
      ),
      item(
        "logistics",
        "Logistics",
        "Tracking, routing, and operational clarity.",
        "Systems for shipment visibility, routing intelligence, and partner coordination — helping logistics teams move faster with fewer exceptions.",
        "fa-truck-fast",
        ["Tracking", "Routing", "TMS", "Visibility"]
      ),
      item(
        "retail",
        "Retail",
        "Omnichannel experiences for modern retail brands.",
        "Retail platforms that connect inventory, customer experience, and store/digital channels into one coherent operating model.",
        "fa-store",
        ["Omnichannel", "POS", "Loyalty", "Inventory"]
      ),
    ],
  },
];

export const allServiceItems: ServiceItem[] = serviceCategories.flatMap(
  (category) => category.items
);

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return allServiceItems.find((item) => item.slug === slug);
}

export function getCategoryForSlug(
  slug: string
): ServiceCategory | undefined {
  return serviceCategories.find((category) =>
    category.items.some((item) => item.slug === slug)
  );
}

export function getCategoryById(
  id: ServiceCategoryId
): ServiceCategory | undefined {
  return serviceCategories.find((category) => category.id === id);
}

/** Process steps shown on the services hub. */
export const deliveryProcess = [
  {
    step: "01",
    title: "Discover",
    description:
      "Workshops and technical discovery to align on goals, constraints, and success metrics.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Architecture, UX, and delivery planning so scope is clear before build begins.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Agile engineering with demos, quality gates, and transparent progress every sprint.",
  },
  {
    step: "04",
    title: "Launch & Scale",
    description:
      "Production rollout, observability, and iteration so your product keeps compounding value.",
  },
] as const;

/** JSON-LD ItemList for the services hub. */
export function servicesItemListJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ramest Technolabs Services",
    itemListElement: allServiceItems.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.title,
      url: `${baseUrl}${service.href}`,
      description: service.shortDescription,
    })),
  };
}

/** JSON-LD Service entity for detail pages. */
export function serviceJsonLd(
  service: ServiceItem,
  baseUrl: string,
  organizationName: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    url: `${baseUrl}${service.href}`,
    provider: {
      "@type": "Organization",
      name: organizationName,
      url: baseUrl,
    },
    areaServed: "Worldwide",
    serviceType: service.title,
  };
}
