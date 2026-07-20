export type ServiceOffering = {
  icon: string;
  title: string;
  description: string;
};

export type ServiceBenefit = {
  icon: string;
  title: string;
  description: string;
};

export type ServiceProcessStep = {
  step: string;
  title: string;
  description: string;
};

export type ServiceStackGroup = {
  category: string;
  items: string[];
};

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceDetail = {
  /** Short line shown under the hero title. */
  heroTagline: string;
  /** Three short proof points shown as chips in the hero. */
  heroHighlights: string[];
  /** Overview section heading. */
  overviewTitle: string;
  /** Overview paragraphs. */
  intro: string[];
  offeringsTitle: string;
  offeringsSubtitle: string;
  offerings: ServiceOffering[];
  benefitsTitle: string;
  benefits: ServiceBenefit[];
  processTitle: string;
  processSubtitle: string;
  process: ServiceProcessStep[];
  stackTitle: string;
  stackSubtitle: string;
  techStack: ServiceStackGroup[];
  faqSubtitle: string;
  faqs: ServiceFaq[];
};

export const serviceDetails: Record<string, ServiceDetail> = {
  /* ------------------------------------------------------------------ */
  /* Software Development                                                */
  /* ------------------------------------------------------------------ */
  "software-development": {
    heroTagline:
      "Custom software engineered around the way your business actually works — not the other way around.",
    heroHighlights: [
      "MVP in 8–14 weeks",
      "100% code & IP ownership",
      "Senior engineers only",
    ],
    overviewTitle: "Software built around your business",
    intro: [
      "Off-the-shelf tools force your team to adapt to someone else's process. We build software that adapts to yours. From internal platforms that remove manual work to customer-facing products that generate revenue, we design, build, and operate systems that fit your workflows, your data, and your growth plans.",
      "Every engagement starts with understanding the business problem — not the feature list. We then translate that into clean architecture, an honest delivery plan, and working software you see improving sprint after sprint. When we hand over, you get documented, maintainable code your team can own — and we stay available for whatever comes next.",
    ],
    offeringsTitle: "What we build",
    offeringsSubtitle:
      "End-to-end software development services — from a first prototype to enterprise-grade platforms.",
    offerings: [
      {
        icon: "fa-laptop-code",
        title: "Custom Software Development",
        description:
          "Tailored platforms, internal tools, and business systems built from the ground up around your exact requirements and workflows.",
      },
      {
        icon: "fa-building",
        title: "Enterprise Software Solutions",
        description:
          "ERP-class systems for operations, finance, HR, and inventory — engineered for reliability, auditability, and role-based access at scale.",
      },
      {
        icon: "fa-rocket",
        title: "SaaS Product Development",
        description:
          "Multi-tenant SaaS products with subscription billing, usage analytics, and an architecture that keeps unit costs low as you grow.",
      },
      {
        icon: "fa-plug",
        title: "API Development & Integration",
        description:
          "Well-documented REST and GraphQL APIs, plus integrations that connect your CRM, payments, ERP, and third-party services into one flow.",
      },
      {
        icon: "fa-arrows-rotate",
        title: "Legacy Modernization",
        description:
          "Incremental re-engineering of ageing systems — migrating to modern stacks and cloud infrastructure without disrupting daily operations.",
      },
      {
        icon: "fa-screwdriver-wrench",
        title: "Support & Continuous Improvement",
        description:
          "Post-launch monitoring, bug fixes, performance tuning, and a roadmap of enhancements so your software keeps compounding value.",
      },
    ],
    benefitsTitle: "Why teams build with Ramest",
    processTitle: "From idea to production in five steps",
    processSubtitle:
      "A delivery rhythm that keeps stakeholders aligned and risk low.",
    stackTitle: "Our software engineering stack",
    stackSubtitle:
      "Proven technologies for backends, interfaces, data, and delivery.",
    faqSubtitle:
      "What founders and CTOs ask before starting a custom build.",
    benefits: [
      {
        icon: "fa-bullseye",
        title: "Business-first engineering",
        description:
          "We start from the outcome you need — hours saved, revenue unlocked, errors eliminated — and work backwards to the right technical solution.",
      },
      {
        icon: "fa-diagram-project",
        title: "Architecture that lasts",
        description:
          "Clean, modular codebases with automated tests and documentation, so adding features next year is as fast as it was in month one.",
      },
      {
        icon: "fa-eye",
        title: "Radical transparency",
        description:
          "Sprint demos, a shared backlog, and direct access to the engineers building your product. You always know what's shipping and when.",
      },
      {
        icon: "fa-shield-halved",
        title: "Security by default",
        description:
          "Secure authentication, encrypted data, least-privilege access, and dependency hygiene are built in from the first commit — not bolted on.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Discovery & Scoping",
        description:
          "Workshops to map your workflows, users, and constraints — ending in a clear scope, budget, and success metrics.",
      },
      {
        step: "02",
        title: "Architecture & Design",
        description:
          "System design, data modeling, and UX prototypes reviewed with you before a line of production code is written.",
      },
      {
        step: "03",
        title: "Agile Build",
        description:
          "Two-week sprints with working demos, automated testing, and code review on every change.",
      },
      {
        step: "04",
        title: "Hardening & Launch",
        description:
          "Load testing, security review, data migration, and a rollout plan that protects business continuity.",
      },
      {
        step: "05",
        title: "Operate & Evolve",
        description:
          "Monitoring, support SLAs, and an improvement roadmap driven by real usage data.",
      },
    ],
    techStack: [
      {
        category: "Backend",
        items: ["Node.js", "Python", "Java", ".NET", "Go"],
      },
      {
        category: "Frontend",
        items: ["React", "Next.js", "TypeScript", "Angular", "Vue"],
      },
      {
        category: "Data",
        items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch"],
      },
      {
        category: "Cloud & DevOps",
        items: ["AWS", "Azure", "Docker", "Kubernetes", "CI/CD"],
      },
    ],
    faqs: [
      {
        question: "How much does custom software development cost?",
        answer:
          "It depends on scope and complexity — a focused internal tool is a very different project from a multi-tenant SaaS platform. After a discovery call we provide a phased estimate, so you can start with a lean first release that proves value before committing to the full roadmap.",
      },
      {
        question: "How long does it take to build custom software?",
        answer:
          "A well-scoped MVP typically ships in 8–14 weeks. Larger platforms are delivered in phases, with usable software in production early and enhancements landing every sprint — you never wait until 'the end' to see results.",
      },
      {
        question: "Who owns the source code and IP?",
        answer:
          "You do — completely. All code, designs, documentation, and infrastructure configuration are delivered to your repositories and accounts, with full IP transfer written into our agreement.",
      },
      {
        question: "Can you take over or modernize our existing system?",
        answer:
          "Yes. We start with a technical audit of the current codebase and infrastructure, then propose an incremental modernization path — stabilise first, then migrate piece by piece, so the business never stops running.",
      },
      {
        question: "What happens after launch?",
        answer:
          "We offer flexible support retainers covering monitoring, fixes, security updates, and new features. Many clients keep the same team that built the product, so nothing is lost in handover.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Web Application Development                                         */
  /* ------------------------------------------------------------------ */
  "web-application-development": {
    heroTagline:
      "Fast, secure, search-friendly web applications that turn visitors into customers and workflows into products.",
    heroHighlights: [
      "Core Web Vitals in the green",
      "SEO-ready architecture",
      "Built to convert",
    ],
    overviewTitle: "Web applications that earn their traffic",
    intro: [
      "The web is where your customers form their first impression and where your teams do their daily work. We build web applications that excel at both — customer-facing products that load instantly, rank well, and convert, and internal platforms that make complex operations feel simple.",
      "Our web engineering combines modern frameworks like Next.js and React with disciplined attention to performance budgets, accessibility, and security. The result is a product that feels premium on day one and stays fast, stable, and easy to extend as traffic and features grow.",
    ],
    offeringsTitle: "Web development services",
    offeringsSubtitle:
      "From marketing sites that convert to complex platforms that run your business.",
    offerings: [
      {
        icon: "fa-window-maximize",
        title: "Custom Web Applications",
        description:
          "Bespoke web platforms — dashboards, portals, marketplaces, booking systems — built around your users and data.",
      },
      {
        icon: "fa-cloud",
        title: "SaaS Platform Development",
        description:
          "Subscription products with multi-tenancy, billing, onboarding, and analytics engineered in from the start.",
      },
      {
        icon: "fa-mobile-screen",
        title: "Progressive Web Apps",
        description:
          "App-like experiences that work offline, install to the home screen, and reach users without app-store friction.",
      },
      {
        icon: "fa-cart-shopping",
        title: "E-commerce & Customer Portals",
        description:
          "Storefronts, checkout flows, and self-service portals optimized for conversion, catalog complexity, and peak traffic.",
      },
      {
        icon: "fa-plug-circle-bolt",
        title: "API-First Backends",
        description:
          "Scalable REST and GraphQL backends that serve your web app today and your mobile apps and partners tomorrow.",
      },
      {
        icon: "fa-gauge-high",
        title: "Performance & SEO Engineering",
        description:
          "Core Web Vitals optimization, structured data, and rendering strategies that make pages fast for users and visible to search engines.",
      },
    ],
    benefitsTitle: "What sets our web apps apart",
    processTitle: "How your web app comes to life",
    processSubtitle:
      "From product discovery to a launch you can measure — with previews you can click at every step.",
    stackTitle: "The stack behind fast web apps",
    stackSubtitle:
      "Modern frameworks and infrastructure tuned for speed, SEO, and scale.",
    faqSubtitle:
      "Common questions before building — or rebuilding — a web product.",
    benefits: [
      {
        icon: "fa-bolt",
        title: "Speed as a feature",
        description:
          "Server-side rendering, smart caching, and optimized assets keep load times low — because every second of delay costs conversions.",
      },
      {
        icon: "fa-magnifying-glass-chart",
        title: "Built to be found",
        description:
          "Semantic markup, structured data, and clean URLs mean search engines understand your product as well as your users do.",
      },
      {
        icon: "fa-universal-access",
        title: "Accessible to everyone",
        description:
          "WCAG-aware interfaces that work with keyboards and screen readers — widening your audience and reducing compliance risk.",
      },
      {
        icon: "fa-lock",
        title: "Secure under pressure",
        description:
          "Hardened authentication, input validation, and OWASP-aligned practices protect your users' data and your reputation.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Product Discovery",
        description:
          "Define the users, journeys, and metrics that matter — and the smallest release that proves value.",
      },
      {
        step: "02",
        title: "UX & Architecture",
        description:
          "Wireframes, design system, data model, and rendering strategy agreed before build begins.",
      },
      {
        step: "03",
        title: "Iterative Build",
        description:
          "Sprint-based delivery with preview deployments you can click through and comment on from day one.",
      },
      {
        step: "04",
        title: "Quality & Performance",
        description:
          "Automated tests, cross-browser checks, Lighthouse budgets, and security review before release.",
      },
      {
        step: "05",
        title: "Launch & Grow",
        description:
          "Analytics, A/B-ready infrastructure, and continuous iteration informed by real user behaviour.",
      },
    ],
    techStack: [
      {
        category: "Frameworks",
        items: ["Next.js", "React", "Vue", "Nuxt", "Remix"],
      },
      {
        category: "Languages",
        items: ["TypeScript", "JavaScript", "Node.js", "Python"],
      },
      {
        category: "Data & APIs",
        items: ["PostgreSQL", "GraphQL", "REST", "Prisma", "Redis"],
      },
      {
        category: "Delivery",
        items: ["Vercel", "AWS", "Docker", "Cloudflare", "CI/CD"],
      },
    ],
    faqs: [
      {
        question: "Which framework do you recommend for web apps?",
        answer:
          "For most products we recommend Next.js with React and TypeScript — it delivers excellent performance, SEO, and developer velocity. But we choose per project: content-heavy sites, real-time dashboards, and heavy internal tools each have different optimal stacks.",
      },
      {
        question: "Will my web application work well on mobile?",
        answer:
          "Yes — every interface we ship is responsive by default and tested across devices. Where an installable, offline-capable experience matters, we build Progressive Web Apps that behave like native apps without app-store overhead.",
      },
      {
        question: "How do you make sure the app stays fast as it grows?",
        answer:
          "We set performance budgets at the start and enforce them in CI, use caching and code-splitting aggressively, and design the data layer for the query patterns you'll actually have at scale — not just the demo dataset.",
      },
      {
        question: "Can you redesign or rebuild our existing web app?",
        answer:
          "Absolutely. We audit the current product for performance, UX, and code health, then either modernize it incrementally or rebuild on a stronger foundation — whichever gets you to a better product with less risk.",
      },
      {
        question: "Do you handle hosting and deployment?",
        answer:
          "Yes. We set up cloud hosting, CI/CD pipelines, monitoring, and backups — and everything runs in accounts you own, so you're never locked in to us or to a vendor.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Cloud & Infrastructure                                              */
  /* ------------------------------------------------------------------ */
  "cloud-infrastructure": {
    heroTagline:
      "Cloud foundations that scale with your ambitions — secure, observable, and cost-efficient by design.",
    heroHighlights: [
      "Zero-downtime migrations",
      "Everything as code",
      "Costs you can explain",
    ],
    overviewTitle: "Infrastructure that accelerates delivery",
    intro: [
      "Your infrastructure is either an accelerator or a bottleneck. We design and operate cloud environments that let teams ship faster, sleep better, and spend less — combining solid architecture with the automation and observability that modern operations demand.",
      "Whether you're migrating from on-premise servers, taming an inherited cloud account, or building a platform for your next stage of growth, we bring DevOps maturity without enterprise bureaucracy: infrastructure as code, automated pipelines, real monitoring, and costs you can actually explain.",
    ],
    offeringsTitle: "Cloud & infrastructure services",
    offeringsSubtitle:
      "Everything between your code and your customers — architected, automated, and operated.",
    offerings: [
      {
        icon: "fa-compass-drafting",
        title: "Cloud Architecture & Strategy",
        description:
          "Right-sized cloud designs across IaaS, PaaS, and serverless models — matched to your workloads, compliance needs, and budget.",
      },
      {
        icon: "fa-cloud-arrow-up",
        title: "Cloud Migration",
        description:
          "Planned, phased migrations from on-premise or between clouds — with rollback paths and minimal downtime for the business.",
      },
      {
        icon: "fa-infinity",
        title: "DevOps & CI/CD Automation",
        description:
          "Automated build, test, and deployment pipelines that turn releases from risky events into routine, reversible pushes.",
      },
      {
        icon: "fa-cubes",
        title: "Containers & Kubernetes",
        description:
          "Dockerized workloads and Kubernetes platforms with autoscaling, zero-downtime deploys, and sane resource management.",
      },
      {
        icon: "fa-chart-line",
        title: "Observability & Reliability",
        description:
          "Metrics, logging, tracing, and alerting that surface problems before customers do — plus SLOs that keep reliability honest.",
      },
      {
        icon: "fa-coins",
        title: "Cloud Cost Optimization",
        description:
          "FinOps reviews that cut waste — right-sizing, reserved capacity, storage tiering — often paying for themselves within months.",
      },
    ],
    benefitsTitle: "The Ramest approach to infrastructure",
    processTitle: "Our path to a stable, scalable cloud",
    processSubtitle:
      "Assess, automate, migrate — with a rollback plan at every step.",
    stackTitle: "Platforms and tooling we operate",
    stackSubtitle:
      "The cloud providers, automation, runtimes, and observability we run every day.",
    faqSubtitle:
      "What engineering leaders ask about cloud and DevOps engagements.",
    benefits: [
      {
        icon: "fa-file-code",
        title: "Everything as code",
        description:
          "Infrastructure defined in Terraform and version control — reviewable, repeatable, and rebuildable in hours instead of weeks.",
      },
      {
        icon: "fa-shield-halved",
        title: "Security woven in",
        description:
          "Least-privilege IAM, network segmentation, encrypted data, and audit trails as defaults — aligned to compliance frameworks you need.",
      },
      {
        icon: "fa-arrows-up-down-left-right",
        title: "Scales both directions",
        description:
          "Architectures that handle traffic spikes gracefully and scale back down when quiet — so you pay for capacity you actually use.",
      },
      {
        icon: "fa-user-gear",
        title: "Your team, enabled",
        description:
          "We document, train, and hand over — leaving your engineers confident operating the platform, not dependent on us forever.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Assess",
        description:
          "Audit current infrastructure, costs, security posture, and pain points — producing a prioritized roadmap.",
      },
      {
        step: "02",
        title: "Architect",
        description:
          "Design the target environment: accounts, networking, compute, data, and the automation around it.",
      },
      {
        step: "03",
        title: "Automate",
        description:
          "Build infrastructure as code, CI/CD pipelines, and guardrails so every change is fast and reversible.",
      },
      {
        step: "04",
        title: "Migrate & Harden",
        description:
          "Move workloads in planned waves with monitoring, load testing, and security validation at each step.",
      },
      {
        step: "05",
        title: "Operate & Optimize",
        description:
          "Ongoing monitoring, incident response, cost reviews, and capacity planning as your platform grows.",
      },
    ],
    techStack: [
      {
        category: "Cloud Platforms",
        items: ["AWS", "Azure", "Google Cloud", "DigitalOcean"],
      },
      {
        category: "Automation",
        items: ["Terraform", "Ansible", "GitHub Actions", "GitLab CI"],
      },
      {
        category: "Runtime",
        items: ["Kubernetes", "Docker", "ECS", "Lambda", "Nginx"],
      },
      {
        category: "Observability",
        items: ["Grafana", "Prometheus", "CloudWatch", "Sentry"],
      },
    ],
    faqs: [
      {
        question: "Can you migrate us to the cloud without downtime?",
        answer:
          "For most systems, yes — we use phased migrations with parallel running, data replication, and tested rollback plans. Where a brief cutover window is unavoidable, it's scheduled, rehearsed, and measured in minutes, not days.",
      },
      {
        question: "Which cloud provider should we choose?",
        answer:
          "We're pragmatic: AWS is our most common recommendation for its breadth and maturity, but the right answer depends on your workloads, team skills, existing licensing, and data residency needs. We'll give you a clear comparison, not a default.",
      },
      {
        question: "Our cloud bill keeps growing — can you reduce it?",
        answer:
          "Usually significantly. Most unoptimized accounts carry 25–50% waste in oversized instances, unattached storage, and missing reservations. A cost review identifies the savings; automation keeps the bill from creeping back up.",
      },
      {
        question: "Do you provide ongoing infrastructure management?",
        answer:
          "Yes — from advisory retainers to fully managed operations with monitoring and incident response. We also happily build platforms that your in-house team operates, with documentation and training included.",
      },
      {
        question: "How do you handle security and compliance?",
        answer:
          "Security is designed in from the architecture stage: least-privilege access, encryption in transit and at rest, network isolation, and audit logging. We align environments to the frameworks that matter to you, from SOC 2 readiness to GDPR.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Mobile App Development                                              */
  /* ------------------------------------------------------------------ */
  "mobile-app-development": {
    heroTagline:
      "Mobile apps your users keep — polished, performant, and connected to everything your business runs on.",
    heroHighlights: [
      "iOS & Android from one team",
      "Store submission handled",
      "Offline-first when it matters",
    ],
    overviewTitle: "Apps users keep on their home screen",
    intro: [
      "A mobile app lives or dies in its first week on a user's phone. We build apps that earn their place — fast to open, intuitive to use, and reliable enough that users trust them with daily tasks. From consumer products to field-operations tools, we cover the full journey: strategy, design, engineering, launch, and growth.",
      "We're honest about the native-versus-cross-platform decision. Flutter and React Native get most products to both stores faster with one codebase; Swift and Kotlin win when you need deep platform integration or maximum performance. We'll recommend what's right for your product — and build it to feel native either way.",
    ],
    offeringsTitle: "Mobile development services",
    offeringsSubtitle:
      "One team for strategy, design, engineering, and everything after launch.",
    offerings: [
      {
        icon: "fa-mobile-screen-button",
        title: "iOS App Development",
        description:
          "Native Swift apps that follow Apple's design language, pass review smoothly, and take full advantage of the platform.",
      },
      {
        icon: "fa-robot",
        title: "Android App Development",
        description:
          "Kotlin apps engineered for the real Android world — thousands of devices, screen sizes, and OS versions.",
      },
      {
        icon: "fa-layer-group",
        title: "Cross-Platform Apps",
        description:
          "Flutter and React Native products that ship to both stores from one codebase — faster to build, cheaper to maintain.",
      },
      {
        icon: "fa-pen-ruler",
        title: "Mobile UX/UI Design",
        description:
          "Interfaces designed for thumbs, glances, and interruptions — prototyped and user-tested before development begins.",
      },
      {
        icon: "fa-server",
        title: "Backend & API Development",
        description:
          "The server side your app depends on: authentication, push notifications, offline sync, and APIs built for mobile realities.",
      },
      {
        icon: "fa-arrow-trend-up",
        title: "Launch, Analytics & Growth",
        description:
          "App Store and Play Store submission, crash monitoring, analytics, and release cycles that keep ratings high.",
      },
    ],
    benefitsTitle: "Why our apps perform",
    processTitle: "From concept to the app stores",
    processSubtitle:
      "Validate, design, build, launch — with beta builds in your hands throughout.",
    stackTitle: "Mobile technologies we ship with",
    stackSubtitle:
      "Native and cross-platform stacks chosen for your product — not our habit.",
    faqSubtitle:
      "What product owners ask before building a mobile app.",
    benefits: [
      {
        icon: "fa-gauge-high",
        title: "Native-quality feel",
        description:
          "Smooth animations, instant startup, and offline resilience — the details users can't name but always notice.",
      },
      {
        icon: "fa-plug",
        title: "Deeply integrated",
        description:
          "Clean connections to your backend, payments, CRM, and analytics — the app is part of your system, not an island.",
      },
      {
        icon: "fa-battery-three-quarters",
        title: "Respectful of devices",
        description:
          "Optimized battery, data, and memory usage — because resource-hungry apps get uninstalled, whatever their features.",
      },
      {
        icon: "fa-rotate",
        title: "Built for iteration",
        description:
          "Modular architecture, automated testing, and CI/CD for mobile — so shipping v1.1 is as smooth as shipping v1.0.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Strategy & Validation",
        description:
          "Define the core user journey, platform choice, and the leanest version worth launching.",
      },
      {
        step: "02",
        title: "Design & Prototype",
        description:
          "Clickable prototypes tested with real users before engineering investment begins.",
      },
      {
        step: "03",
        title: "Build & Integrate",
        description:
          "Sprint-based development with TestFlight and Play beta builds in your hands throughout.",
      },
      {
        step: "04",
        title: "Test & Launch",
        description:
          "Device-matrix QA, performance profiling, store submission, and a coordinated release.",
      },
      {
        step: "05",
        title: "Measure & Grow",
        description:
          "Crash and analytics monitoring, user feedback loops, and a release cadence that compounds quality.",
      },
    ],
    techStack: [
      {
        category: "Cross-Platform",
        items: ["Flutter", "React Native", "Expo", "Dart"],
      },
      {
        category: "Native",
        items: ["Swift", "SwiftUI", "Kotlin", "Jetpack Compose"],
      },
      {
        category: "Backend",
        items: ["Node.js", "Firebase", "PostgreSQL", "GraphQL"],
      },
      {
        category: "Delivery",
        items: ["App Store", "Play Store", "Fastlane", "Crashlytics"],
      },
    ],
    faqs: [
      {
        question: "Should we build native or cross-platform?",
        answer:
          "For most products, cross-platform (Flutter or React Native) is the right call — one codebase, both stores, 30–40% lower cost. Go native when you need heavy platform integration, demanding graphics, or the absolute best performance. We'll recommend based on your product, not our preference.",
      },
      {
        question: "How long does it take to launch a mobile app?",
        answer:
          "A focused MVP typically reaches the stores in 10–16 weeks including design, development, QA, and review. Complex products ship in phases — a solid core first, then features driven by real user feedback.",
      },
      {
        question: "Do you handle App Store and Play Store submission?",
        answer:
          "Yes — store listings, screenshots, review guidelines compliance, and release management are part of the service. We've been through review enough times to avoid the common rejection traps.",
      },
      {
        question: "Can the app work offline?",
        answer:
          "Yes. We design offline-first where it matters — local storage with background sync, conflict resolution, and clear UI states — so field teams and travelling users aren't blocked by patchy connectivity.",
      },
      {
        question: "What about maintenance after launch?",
        answer:
          "Mobile platforms move fast — new OS versions, new devices, evolving store policies. Our maintenance plans cover updates, monitoring, and improvements so your ratings and retention keep climbing after v1.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Front-End Development                                               */
  /* ------------------------------------------------------------------ */
  "front-end-development": {
    heroTagline:
      "The layer your users actually touch — engineered to feel effortless, load instantly, and scale with your product.",
    heroHighlights: [
      "Pixel-faithful to your designs",
      "WCAG-aware by default",
      "Performance budgets enforced",
    ],
    overviewTitle: "Interfaces your users can feel",
    intro: [
      "Users judge your product by its interface. Slow pages, janky interactions, and inconsistent components quietly erode trust and conversion — no matter how good the backend is. Our front-end engineering turns design intent into interfaces that feel premium: fast, fluid, accessible, and pixel-faithful.",
      "We also build for the developers who come after us. Design systems, typed components, and documented patterns mean your team ships new screens quickly and consistently, instead of reinventing buttons and fighting CSS. Good front-end work is felt by users and loved by engineers.",
    ],
    offeringsTitle: "Front-end services",
    offeringsSubtitle:
      "From design handoff to production interfaces — with quality you can measure.",
    offerings: [
      {
        icon: "fa-code",
        title: "React & Next.js Development",
        description:
          "Modern component-based interfaces with server-side rendering, type safety, and architecture that scales past the prototype.",
      },
      {
        icon: "fa-swatchbook",
        title: "Design Systems & Component Libraries",
        description:
          "Reusable, documented UI components that keep every screen consistent and make new features dramatically faster to build.",
      },
      {
        icon: "fa-object-group",
        title: "Figma-to-Production UI",
        description:
          "Faithful implementation of your designs — spacing, motion, and micro-interactions included — not an approximation of them.",
      },
      {
        icon: "fa-gauge-high",
        title: "Performance & Core Web Vitals",
        description:
          "Bundle discipline, image strategy, and rendering optimization that turn slow pages into instant ones — and keep them that way.",
      },
      {
        icon: "fa-universal-access",
        title: "Accessibility Engineering",
        description:
          "WCAG-aligned semantics, keyboard navigation, and screen-reader support — expanding your audience and meeting compliance.",
      },
      {
        icon: "fa-arrows-rotate",
        title: "Front-End Modernization",
        description:
          "Incremental migration of legacy jQuery, AngularJS, or template-based UIs to modern stacks — without a risky big-bang rewrite.",
      },
    ],
    benefitsTitle: "What quality front-end delivers",
    processTitle: "From design file to production UI",
    processSubtitle:
      "Foundation first, then features — with quality gates on every screen.",
    stackTitle: "Tools of the front-end craft",
    stackSubtitle:
      "Frameworks, styling systems, and testing tools for UI that lasts.",
    faqSubtitle:
      "What design and product teams ask about front-end engagements.",
    benefits: [
      {
        icon: "fa-bolt",
        title: "Interfaces that convert",
        description:
          "Fast load times and frictionless interactions directly improve sign-ups, checkouts, and retention — measurably.",
      },
      {
        icon: "fa-cubes-stacked",
        title: "Consistency at scale",
        description:
          "A design system means the fiftieth screen looks and behaves like the first — across teams, features, and years.",
      },
      {
        icon: "fa-vial-circle-check",
        title: "Confidence to change",
        description:
          "Typed components and automated tests let your team refactor and ship without fear of silently breaking the UI.",
      },
      {
        icon: "fa-mobile-screen",
        title: "Every device, every user",
        description:
          "Responsive layouts and accessibility built in — one interface that works for the full range of your audience.",
      },
    ],
    process: [
      {
        step: "01",
        title: "UI Audit & Planning",
        description:
          "Review designs, current code, and performance baselines — agreeing standards and budgets up front.",
      },
      {
        step: "02",
        title: "Foundation",
        description:
          "Design tokens, core components, and tooling that everything else builds on.",
      },
      {
        step: "03",
        title: "Feature Build",
        description:
          "Screen-by-screen implementation with preview deployments and design review on every change.",
      },
      {
        step: "04",
        title: "Quality Pass",
        description:
          "Cross-browser testing, accessibility checks, and Lighthouse validation against agreed budgets.",
      },
      {
        step: "05",
        title: "Handover & Support",
        description:
          "Documented components, contribution guides, and ongoing support as your product evolves.",
      },
    ],
    techStack: [
      {
        category: "Frameworks",
        items: ["React", "Next.js", "Vue", "Svelte"],
      },
      {
        category: "Languages & Styling",
        items: ["TypeScript", "Tailwind CSS", "CSS Modules", "Sass"],
      },
      {
        category: "Quality",
        items: ["Playwright", "Testing Library", "Storybook", "Lighthouse"],
      },
      {
        category: "Design",
        items: ["Figma", "Design Tokens", "Framer Motion", "WCAG 2.2"],
      },
    ],
    faqs: [
      {
        question: "Can you work with our existing designers?",
        answer:
          "Yes — that's our favourite setup. We plug into your design workflow, give engineering feedback early (before designs are final), and implement with the fidelity designers rarely get from development teams.",
      },
      {
        question: "Our web app feels slow. Can you fix the front end without a rewrite?",
        answer:
          "Usually, yes. Most performance problems come from a handful of causes — oversized bundles, unoptimized images, render-blocking scripts, chatty data fetching. We profile first, fix the biggest offenders, and set budgets so speed doesn't regress.",
      },
      {
        question: "Is a design system worth it for a small team?",
        answer:
          "Sooner than most teams think. Even a lean token-and-core-components system pays for itself once two people build UI in parallel — consistency stops being a meeting topic and becomes the default.",
      },
      {
        question: "How do you approach accessibility?",
        answer:
          "As an engineering standard, not an afterthought: semantic HTML, keyboard support, focus management, and contrast built into components from the start, then verified with automated and manual testing against WCAG.",
      },
      {
        question: "Can you migrate our legacy front end incrementally?",
        answer:
          "Yes — we run old and new side by side, migrating route by route or component by component. Users see steady improvement instead of a risky overnight switch, and the business never stops shipping.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Data Engineering                                                    */
  /* ------------------------------------------------------------------ */
  "data-engineering": {
    heroTagline:
      "Turn scattered data into a reliable asset — pipelines, platforms, and analytics your teams actually trust.",
    heroHighlights: [
      "One source of truth",
      "Pipelines monitored 24/7",
      "AI-ready data models",
    ],
    overviewTitle: "Data your whole company can trust",
    intro: [
      "Most companies don't have a data shortage — they have a trust shortage. Numbers that disagree between reports, pipelines that break silently, insights that arrive too late to act on. We build data platforms that fix this: reliable ingestion, clean modeling, and analytics foundations where the numbers are current, consistent, and explainable.",
      "From your first proper warehouse to real-time streaming and ML-ready feature pipelines, we design for the scale you'll have — not just the scale you have today. And because AI initiatives live or die on data quality, our platforms are built to feed models as well as dashboards.",
    ],
    offeringsTitle: "Data engineering services",
    offeringsSubtitle:
      "The full path from raw sources to trusted decisions.",
    offerings: [
      {
        icon: "fa-timeline",
        title: "Data Pipeline Development",
        description:
          "Automated ETL/ELT pipelines that ingest from your apps, SaaS tools, and databases — monitored, tested, and self-healing.",
      },
      {
        icon: "fa-warehouse",
        title: "Data Warehouse & Lakehouse",
        description:
          "Modern warehouse architectures on BigQuery, Snowflake, or Redshift — modeled so analysts query with confidence and speed.",
      },
      {
        icon: "fa-bolt",
        title: "Real-Time & Streaming Data",
        description:
          "Event streaming with Kafka and friends for use cases where yesterday's batch is too late — operations, fraud, personalization.",
      },
      {
        icon: "fa-clipboard-check",
        title: "Data Quality & Governance",
        description:
          "Validation, lineage, and access controls that keep data accurate, auditable, and compliant as more teams depend on it.",
      },
      {
        icon: "fa-chart-pie",
        title: "Analytics & BI Enablement",
        description:
          "Semantic layers and dashboards in tools like Metabase, Looker, or Power BI — one agreed version of the truth, self-served.",
      },
      {
        icon: "fa-brain",
        title: "ML & AI Data Foundations",
        description:
          "Feature pipelines, vector stores, and training datasets that make your AI initiatives possible — and repeatable.",
      },
    ],
    benefitsTitle: "The impact of solid data engineering",
    processTitle: "From raw data to trusted insight",
    processSubtitle:
      "Audit, design, build — then operate and extend as your ambitions grow.",
    stackTitle: "The modern data stack we deploy",
    stackSubtitle:
      "Warehouses, pipelines, streaming, and BI tools we build on daily.",
    faqSubtitle:
      "What teams ask before investing in a data platform.",
    benefits: [
      {
        icon: "fa-handshake",
        title: "Numbers everyone trusts",
        description:
          "One modeled source of truth ends the 'whose spreadsheet is right?' debate and puts decisions back on facts.",
      },
      {
        icon: "fa-clock",
        title: "Insight at business speed",
        description:
          "Automated pipelines replace manual exports and month-end scrambles — fresh data in hours or seconds, not weeks.",
      },
      {
        icon: "fa-coins",
        title: "Efficient by design",
        description:
          "Partitioning, incremental processing, and storage tiering keep warehouse bills proportional to value, not volume.",
      },
      {
        icon: "fa-rocket",
        title: "AI-ready from day one",
        description:
          "Clean, well-modeled data is the prerequisite for every ML and LLM initiative — we build it in from the start.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Data Audit",
        description:
          "Map your sources, current flows, quality issues, and the decisions your teams actually need data for.",
      },
      {
        step: "02",
        title: "Platform Design",
        description:
          "Choose the warehouse, tooling, and modeling approach that fits your scale, skills, and budget.",
      },
      {
        step: "03",
        title: "Pipeline Build",
        description:
          "Implement ingestion, transformation, and testing — with version control and CI for every model.",
      },
      {
        step: "04",
        title: "Analytics Layer",
        description:
          "Ship the metrics, dashboards, and self-serve tools that turn the platform into daily decisions.",
      },
      {
        step: "05",
        title: "Operate & Extend",
        description:
          "Monitoring, cost reviews, new sources, and ML enablement as your data ambitions grow.",
      },
    ],
    techStack: [
      {
        category: "Warehouses",
        items: ["BigQuery", "Snowflake", "Redshift", "PostgreSQL"],
      },
      {
        category: "Pipelines",
        items: ["dbt", "Airflow", "Airbyte", "Python", "Spark"],
      },
      {
        category: "Streaming",
        items: ["Kafka", "Kinesis", "Pub/Sub", "Flink"],
      },
      {
        category: "Analytics & ML",
        items: ["Metabase", "Power BI", "Looker", "MLflow"],
      },
    ],
    faqs: [
      {
        question: "We run on spreadsheets today. Where do we start?",
        answer:
          "With a focused audit: which decisions need better data, where that data lives, and what breaks today. From there, a first warehouse with a handful of trusted dashboards usually lands within weeks — value first, platform sophistication later.",
      },
      {
        question: "Do we need real-time data?",
        answer:
          "Only for some use cases. Operational monitoring, fraud detection, and personalization justify streaming; most reporting is perfectly served by hourly or daily batch at a fraction of the complexity. We'll tell you honestly which you need.",
      },
      {
        question: "How do you ensure data quality?",
        answer:
          "Tests on every transformation (with tools like dbt), freshness and volume monitoring on every pipeline, and alerting when anything drifts. Data problems get caught by the platform — not discovered in a board meeting.",
      },
      {
        question: "Can our existing data support AI features?",
        answer:
          "That's usually the first thing we assess. Most AI disappointments trace back to data problems — quality, access, or structure. We'll identify the gaps and build the pipelines and stores (including vector search) your AI roadmap needs.",
      },
      {
        question: "What does a data platform cost to run?",
        answer:
          "Less than most expect when designed well. Modern warehouses charge for what you use, and incremental processing keeps usage lean. We design with cost visibility from day one, so spend scales with value delivered.",
      },
    ],
  },
  /* ------------------------------------------------------------------ */
  /* AI Strategy & Consulting                                            */
  /* ------------------------------------------------------------------ */
  "ai-strategy-consulting": {
    heroTagline:
      "A clear, board-ready roadmap that turns AI ambition into prioritized use cases, realistic budgets, and measurable business outcomes.",
    heroHighlights: [
      "Roadmap in 3–4 weeks",
      "Use-case ROI scoring",
      "Governance built in",
    ],
    overviewTitle: "Strategy before spend",
    intro: [
      "Most organizations do not have an AI problem — they have a prioritization problem. Dozens of possible use cases, limited engineering capacity, and pressure to show results quickly can push teams toward pilots that never reach production. We work with leadership to cut through that noise: mapping where AI genuinely changes unit economics, customer experience, or operational risk, and where it is simply a distraction dressed up as innovation. The output is a short list of use cases worth funding, each with a stated hypothesis and success metric.",
      "Strategy only earns its keep if it survives contact with delivery. Our consulting engagements combine business analysis with technical feasibility assessment — data readiness, model options, integration complexity, and cost-to-serve — so recommendations are grounded in what can actually be built. We leave you with a prioritized roadmap, a governance approach for responsible use, and, where useful, a proof-of-concept plan that de-risks the highest-value use case before you commit engineering budget to it.",
    ],
    offeringsTitle: "What our AI strategy engagements cover",
    offeringsSubtitle:
      "Consulting services that take AI from boardroom conversation to funded roadmap.",
    offerings: [
      {
        icon: "fa-magnifying-glass-chart",
        title: "AI Opportunity Assessment",
        description:
          "A structured review of your operations and data to identify where AI can reduce cost, unlock revenue, or remove risk — ranked by impact and feasibility rather than hype.",
      },
      {
        icon: "fa-chess",
        title: "Use-Case Prioritization",
        description:
          "Scoring of candidate use cases against business value, data readiness, and delivery complexity, so investment goes to the ideas most likely to reach production and stick.",
      },
      {
        icon: "fa-calculator",
        title: "ROI & Business Case Modelling",
        description:
          "Cost and benefit modelling for shortlisted use cases, including build-versus-buy analysis and realistic timelines, to support internal funding and stakeholder sign-off.",
      },
      {
        icon: "fa-shield-halved",
        title: "AI Governance & Risk Frameworks",
        description:
          "Practical policies for data privacy, model risk, human oversight, and responsible use — sized to your organization rather than borrowed from enterprise boilerplate.",
      },
      {
        icon: "fa-route",
        title: "Delivery Roadmapping",
        description:
          "A phased roadmap sequencing quick wins against foundational investments in data and infrastructure, with clear owners, dependencies, and review checkpoints.",
      },
      {
        icon: "fa-flask",
        title: "Proof-of-Concept Planning",
        description:
          "Scoped, time-boxed proof-of-concept plans for the highest-priority use case, designed to validate feasibility and value before a full build commitment is made.",
      },
    ],
    benefitsTitle: "Why leadership teams trust our AI consulting",
    benefits: [
      {
        icon: "fa-scale-balanced",
        title: "Vendor-neutral advice",
        description:
          "We are not selling a model, platform, or licence — our recommendations are shaped by what solves your problem best, not what we have to sell.",
      },
      {
        icon: "fa-people-group",
        title: "Business and engineering fluency",
        description:
          "Our consultants speak both languages, translating ambiguous business goals into technically feasible, appropriately scoped AI initiatives leadership can commit to.",
      },
      {
        icon: "fa-gauge-high",
        title: "Speed without recklessness",
        description:
          "We move fast on assessment and planning, then insist on proof before scale — protecting budget from pilots that were never going to reach production.",
      },
      {
        icon: "fa-hand-holding-dollar",
        title: "Budget-conscious recommendations",
        description:
          "Every recommendation carries an honest cost estimate, so decisions are made with full visibility into what each use case will actually require.",
      },
    ],
    processTitle: "How an AI strategy engagement runs",
    processSubtitle:
      "A focused, time-boxed process built for executive decision-making.",
    process: [
      {
        step: "01",
        title: "Discovery & Data Audit",
        description:
          "Stakeholder interviews and a review of existing data, systems, and workflows to establish what is realistically possible today.",
      },
      {
        step: "02",
        title: "Opportunity Mapping",
        description:
          "Candidate use cases are identified, scored, and shortlisted against business value, feasibility, and risk.",
      },
      {
        step: "03",
        title: "Roadmap & Business Case",
        description:
          "A phased delivery roadmap and cost model are built for the shortlisted use cases, ready for internal sign-off.",
      },
      {
        step: "04",
        title: "Governance & Handover",
        description:
          "Governance guidelines and a proof-of-concept plan are handed over, with our team available to support delivery from here.",
      },
    ],
    stackTitle: "Frameworks and platforms we assess against",
    stackSubtitle:
      "We stay platform-neutral — recommendations are matched to your constraints, not our preferences.",
    techStack: [
      {
        category: "LLM Platforms",
        items: [
          "OpenAI",
          "Anthropic Claude",
          "Azure AI",
          "AWS Bedrock",
          "Google Vertex AI",
        ],
      },
      {
        category: "Data & Analytics",
        items: ["Snowflake", "BigQuery", "Databricks", "PostgreSQL"],
      },
      {
        category: "Governance & Evaluation",
        items: [
          "Model risk frameworks",
          "Data privacy audits",
          "Human-in-the-loop review",
          "Usage monitoring",
        ],
      },
      {
        category: "Delivery Planning",
        items: [
          "Roadmapping",
          "Cost modelling",
          "Proof-of-concept scoping",
          "Stakeholder workshops",
        ],
      },
    ],
    faqSubtitle: "What leadership teams ask before starting an AI roadmap.",
    faqs: [
      {
        question: "How much does AI strategy consulting cost?",
        answer:
          "Cost depends on scope — the number of business units involved, how many use cases you want assessed, and how much governance and framework design the roadmap requires. We tailor each engagement through a consultation-based scoping call, then agree a fixed quote before work begins, offered as either a fixed-scope engagement or a dedicated advisory team. We support organisations of every size, from a single-department opportunity assessment to a multi-department roadmap with full governance design, so a smaller, focused engagement is just as welcome as a large one.",
      },
      {
        question: "How long does an AI strategy engagement take?",
        answer:
          "A single-department opportunity assessment and roadmap typically takes 3–4 weeks. Broader, organization-wide engagements covering multiple business units, governance frameworks, and detailed business cases usually run 6–10 weeks, structured in phases so early findings are available well before the full report.",
      },
      {
        question: "What does AI strategy consulting actually involve?",
        answer:
          "AI strategy consulting is the process of identifying, prioritizing, and de-risking AI use cases before committing engineering budget to building them. It combines business analysis — where AI genuinely improves cost, revenue, or risk — with technical feasibility assessment of your data, systems, and delivery capacity, ending in a funded, sequenced roadmap rather than a list of ideas.",
      },
      {
        question:
          "Should we hire a strategy consultant or just let engineering experiment?",
        answer:
          "Unstructured experimentation is fine for learning but rarely produces a fundable roadmap, because engineering teams naturally gravitate toward technically interesting problems rather than the highest business value ones. A short strategy engagement upfront — even two to three weeks — usually pays for itself by preventing months of work on use cases that were never going to move the needle.",
      },
      {
        question: "Does the roadmap account for our existing systems and data?",
        answer:
          "Yes, feasibility assessment is built into every engagement, not treated as a separate step. We review your current data quality, system architecture, and integration constraints alongside the business case, so the resulting roadmap reflects what your organization can realistically deliver rather than a generic best-practice list.",
      },
      {
        question: "What happens after the roadmap is delivered?",
        answer:
          "You own the roadmap, business cases, and governance documents outright, and are free to run delivery internally or with any partner you choose. Many clients ask us to continue into proof-of-concept build and full delivery, since we already understand the context, but there is no obligation to do so.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* AI Chatbot Development                                              */
  /* ------------------------------------------------------------------ */
  "ai-chatbot-development": {
    heroTagline:
      "Conversational assistants grounded in your own knowledge base that resolve real requests, escalate cleanly, and prove their impact in numbers.",
    heroHighlights: [
      "Live bot in 6–10 weeks",
      "RAG-grounded accuracy",
      "Built-in escalation paths",
    ],
    overviewTitle: "Chatbots that actually resolve",
    intro: [
      "Most chatbot disappointments come from the same root cause: a bot that cannot answer questions outside a narrow script, and no clean way to hand a confused customer to a human. We build chatbots and assistants differently — grounded in retrieval over your actual documentation, policies, and product data, so answers are accurate and current rather than generic. Escalation paths are designed in from the start, not bolted on after launch, so the bot knows precisely when to step aside.",
      "Whether the goal is customer support deflection, sales qualification, or an internal assistant for your own team, we treat containment rate, resolution accuracy, and user satisfaction as the metrics that matter — not the novelty of having a chatbot at all. We instrument every deployment so you can see what the bot is being asked, where it succeeds, and where the knowledge base or flows need improvement, and we iterate against that data after launch.",
    ],
    offeringsTitle: "What we build",
    offeringsSubtitle:
      "Chatbot and conversational AI services across support, sales, and internal operations.",
    offerings: [
      {
        icon: "fa-headset",
        title: "Customer Support Chatbots",
        description:
          "Bots that resolve common support requests using your help centre, policies, and order data, with clean handoff to human agents when a query needs one.",
      },
      {
        icon: "fa-comments",
        title: "Sales & Lead Qualification Bots",
        description:
          "Conversational flows that qualify inbound leads, answer product questions, and route warm prospects to your sales team with full context attached.",
      },
      {
        icon: "fa-book-open",
        title: "Retrieval-Augmented (RAG) Assistants",
        description:
          "Assistants grounded in your documentation, wikis, and product data using RAG, so answers stay accurate and current without retraining a model.",
      },
      {
        icon: "fa-building-user",
        title: "Internal Knowledge Assistants",
        description:
          "Internal-facing bots that let employees query policies, procedures, and internal systems in natural language, reducing repeat tickets to HR and IT.",
      },
      {
        icon: "fa-arrows-turn-to-dots",
        title: "Omnichannel Deployment",
        description:
          "The same assistant deployed consistently across your website, WhatsApp, Slack, or Microsoft Teams, with shared context and conversation history.",
      },
      {
        icon: "fa-chart-line",
        title: "Analytics & Continuous Tuning",
        description:
          "Dashboards covering containment rate, escalation reasons, and unanswered questions, feeding a regular cycle of knowledge base and prompt improvements.",
      },
    ],
    benefitsTitle: "Why teams choose Ramest for conversational AI",
    benefits: [
      {
        icon: "fa-database",
        title: "Grounded in your data",
        description:
          "Answers are retrieved from your actual knowledge base rather than a model's general training, which keeps responses accurate, current, and on-brand.",
      },
      {
        icon: "fa-route",
        title: "Escalation designed in",
        description:
          "Every flow includes a clear point at which the bot hands off to a human, with full conversation context, so users are never stuck in a loop.",
      },
      {
        icon: "fa-chart-simple",
        title: "Measured, not assumed, success",
        description:
          "Containment rate, resolution accuracy, and satisfaction are tracked from day one, so improvements are driven by real usage rather than guesswork.",
      },
      {
        icon: "fa-lock",
        title: "Privacy-conscious by design",
        description:
          "Conversation data, retrieval sources, and access controls are handled with the same security discipline we apply to production applications.",
      },
    ],
    processTitle: "How we deliver a chatbot",
    processSubtitle: "A structured build that reaches production, not just a demo.",
    process: [
      {
        step: "01",
        title: "Discovery & Knowledge Audit",
        description:
          "We review your support tickets, documentation, and target use cases to define scope, success metrics, and escalation rules.",
      },
      {
        step: "02",
        title: "Design & Knowledge Base Build",
        description:
          "Conversation flows are designed and your knowledge base is structured and indexed for accurate retrieval.",
      },
      {
        step: "03",
        title: "Build & Integration",
        description:
          "The assistant is built, integrated with your channels and backend systems, and tested against real support queries.",
      },
      {
        step: "04",
        title: "Launch & Tune",
        description:
          "A phased rollout with monitoring in place, followed by ongoing tuning of prompts, retrieval, and flows based on live usage.",
      },
    ],
    stackTitle: "Our conversational AI stack",
    stackSubtitle: "Technologies we use to build accurate, well-grounded assistants.",
    techStack: [
      {
        category: "LLMs & NLP",
        items: ["OpenAI", "Anthropic Claude", "Azure AI", "spaCy"],
      },
      {
        category: "Retrieval & RAG",
        items: ["LangChain", "Pinecone", "pgvector", "Elasticsearch"],
      },
      {
        category: "Channels & Deployment",
        items: [
          "Website widgets",
          "WhatsApp Business API",
          "Slack",
          "Microsoft Teams",
        ],
      },
      {
        category: "Backend & Infra",
        items: ["Node.js", "Python", "PostgreSQL", "Docker"],
      },
    ],
    faqSubtitle: "What teams ask before building a chatbot or AI assistant.",
    faqs: [
      {
        question: "How much does AI chatbot development cost?",
        answer:
          "Cost depends on scope — the number of conversation flows, integrations, and channels the bot needs to support, plus how many languages or systems it must work across. Every build is scoped individually through a consultation call, then quoted at a fixed price before work begins, delivered either as a fixed-scope engagement or with a dedicated team. We build for businesses of every size, from a single-channel support bot to a multi-system, multi-language assistant, so a focused, smaller project is genuinely welcome.",
      },
      {
        question: "How long does it take to build a chatbot?",
        answer:
          "A single-channel support or sales bot with a well-organized knowledge base typically launches in 6–10 weeks. Multi-channel deployments, or assistants that need significant backend integration, usually take 10–16 weeks, delivered in phases so you can test with real users before full rollout.",
      },
      {
        question: "What is a RAG-based chatbot and how does it work?",
        answer:
          "A RAG, or retrieval-augmented generation, chatbot answers questions by first searching your own documents for relevant passages, then using a language model to compose an answer grounded in what it found, rather than relying purely on the model's general training. This keeps answers accurate, current, and traceable to a source, which matters for support and compliance use cases.",
      },
      {
        question: "Should we use a chatbot platform or build a custom assistant?",
        answer:
          "Off-the-shelf chatbot platforms are reasonable for simple, high-volume FAQ deflection with minimal customization needs. A custom-built assistant is worth the investment once you need deep integration with your own data and systems, specific escalation logic, or a conversation experience that reflects your brand rather than a generic template — which is where most support and sales bots end up.",
      },
      {
        question: "Can the chatbot connect to our CRM, helpdesk, or order system?",
        answer:
          "Yes, integration with systems such as your CRM, helpdesk, or order management platform is standard practice, allowing the bot to look up account status, order history, or ticket state rather than giving generic answers. We scope these integrations during discovery and build them with the same security controls as the rest of your application stack.",
      },
      {
        question:
          "Who maintains the chatbot after launch, and what if the knowledge base changes?",
        answer:
          "You own the deployment, and we set it up so your team can update the underlying knowledge base without needing engineering support for routine content changes. We also offer support retainers for monitoring, retrieval tuning, and adding new flows as your product or policies evolve.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* AI Integration                                                       */
  /* ------------------------------------------------------------------ */
  "ai-integration": {
    heroTagline:
      "Secure, well-monitored integration of LLMs and ML services into the products and workflows you already run — without a rebuild.",
    heroHighlights: [
      "Live integration in 4–8 weeks",
      "Cost & usage controls built in",
      "No rip-and-replace required",
    ],
    overviewTitle: "Intelligence added, not bolted on",
    intro: [
      "Most businesses do not need a new AI product — they need the AI capability inside the product they already have. We integrate large language models and machine learning services directly into your existing applications: enriching a support tool with summarization, adding semantic search to a content library, or embedding a recommendation model into a checkout flow. The work happens around your current architecture, not instead of it.",
      "Integration done well is mostly engineering discipline: clean API boundaries, authentication that respects your existing access model, monitoring that tells you what a model is doing in production, and cost controls that keep usage predictable as adoption grows. We treat the AI provider as one more dependency to manage carefully — with fallbacks, rate limits, and logging — rather than a black box bolted onto critical workflows.",
    ],
    offeringsTitle: "What we integrate",
    offeringsSubtitle:
      "Practical AI integration services for teams adding intelligence to live products.",
    offerings: [
      {
        icon: "fa-plug",
        title: "LLM API Integration",
        description:
          "Integration of providers such as OpenAI, Anthropic Claude, or Azure AI into your application, with prompt management, error handling, and fallback logic built in.",
      },
      {
        icon: "fa-magnifying-glass",
        title: "Semantic Search & Retrieval",
        description:
          "Vector search added to existing content, product, or document libraries so users can search by meaning rather than exact keyword match.",
      },
      {
        icon: "fa-diagram-project",
        title: "Workflow & Automation Integration",
        description:
          "AI steps embedded into existing business workflows — summarization, classification, extraction — wired into the systems that already run your operations.",
      },
      {
        icon: "fa-shield-halved",
        title: "Auth, Security & Access Control",
        description:
          "AI features integrated behind your existing authentication and role-based access model, so model access respects the same permissions as the rest of your product.",
      },
      {
        icon: "fa-gauge-high",
        title: "Monitoring, Logging & Evaluation",
        description:
          "Observability into model latency, output quality, and failure modes, with logging that lets you audit what was sent to a model and what came back.",
      },
      {
        icon: "fa-hand-holding-dollar",
        title: "Cost & Usage Controls",
        description:
          "Rate limiting, caching, and usage budgets so AI feature costs stay predictable and visible as usage scales across your user base.",
      },
    ],
    benefitsTitle: "Why teams integrate AI with Ramest",
    benefits: [
      {
        icon: "fa-puzzle-piece",
        title: "Fits your existing stack",
        description:
          "We work inside your current architecture and codebase rather than proposing a parallel system, so integration adds capability without adding fragility.",
      },
      {
        icon: "fa-eye",
        title: "Full visibility into model behaviour",
        description:
          "Logging and monitoring make it clear what data reaches a model, what it returns, and how that changes over time, rather than treating it as opaque.",
      },
      {
        icon: "fa-sack-dollar",
        title: "Predictable running costs",
        description:
          "Usage controls and caching are designed in from the start, so a successful feature does not translate into an unpredictable API bill.",
      },
      {
        icon: "fa-shield-halved",
        title: "Security-conscious integration",
        description:
          "Authentication, data handling, and access control are extended to cover AI features with the same rigour applied to the rest of your application.",
      },
    ],
    processTitle: "How we run an integration",
    processSubtitle:
      "A scoped process that adds AI capability without disrupting what already works.",
    process: [
      {
        step: "01",
        title: "Discovery & Feasibility",
        description:
          "We review your current architecture, data, and target workflow to confirm the integration is technically sound and worth the cost.",
      },
      {
        step: "02",
        title: "Design & Provider Selection",
        description:
          "Selection of the right model or provider, API design, and a plan for authentication, monitoring, and cost control.",
      },
      {
        step: "03",
        title: "Build & Integration",
        description:
          "The integration is built and connected to your existing systems, with automated tests and staged rollout to limit risk.",
      },
      {
        step: "04",
        title: "Launch & Monitor",
        description:
          "Production rollout with monitoring and usage controls active from day one, followed by tuning based on real traffic.",
      },
    ],
    stackTitle: "Our AI integration stack",
    stackSubtitle: "Providers and tools we use to connect intelligence to production systems.",
    techStack: [
      {
        category: "AI Providers",
        items: [
          "OpenAI",
          "Anthropic Claude",
          "Azure AI",
          "AWS Bedrock",
          "Google Vertex AI",
        ],
      },
      {
        category: "Retrieval & Data",
        items: ["LangChain", "Pinecone", "pgvector", "PostgreSQL"],
      },
      {
        category: "Backend & APIs",
        items: ["Node.js", "Python", "REST", "GraphQL"],
      },
      {
        category: "Monitoring & Ops",
        items: ["Datadog", "Grafana", "Docker", "CI/CD"],
      },
    ],
    faqSubtitle: "What technical teams ask before integrating AI into a live product.",
    faqs: [
      {
        question: "How much does AI integration cost?",
        answer:
          "Cost depends on scope — how many workflows the AI capability touches, the number of providers involved, and how strict your compliance requirements are. We scope every integration through a consultation call and review of your current architecture, then agree a fixed quote before work begins, offered as a fixed-scope engagement or a dedicated team. We work with businesses of every size, from adding one capability to a single workflow through to multi-system integrations, so smaller, focused projects are always welcome.",
      },
      {
        question: "How long does an AI integration take?",
        answer:
          "A single, well-defined integration into an existing application typically takes 4–8 weeks, covering design, build, testing, and a staged rollout. Integrations touching multiple systems or requiring new data pipelines usually take 8–14 weeks, delivered in phases so the first capability reaches production early.",
      },
      {
        question: "What does AI integration actually mean for an existing product?",
        answer:
          "AI integration means connecting a large language model or machine learning service to an application you already run, so it adds a capability such as summarization, search, or classification without replacing the surrounding system. The model becomes one more service your application calls, governed by the same authentication, monitoring, and access controls as everything else in the product.",
      },
      {
        question:
          "Should we integrate an existing AI provider or train our own model?",
        answer:
          "Integrating an established provider such as OpenAI or Anthropic Claude is the right starting point for almost every business, since it avoids the cost and time of training and maintaining a model, and general-purpose models now handle most business use cases well when grounded in your own data. Training a custom model only makes sense for narrow, high-volume problems where off-the-shelf accuracy genuinely falls short.",
      },
      {
        question: "Will this work with our current authentication and data setup?",
        answer:
          "Yes, that compatibility check is the first thing we assess during discovery, before any integration work begins. AI features are built to sit behind your existing authentication and role-based access model, and data sent to a model provider is scoped to what the feature genuinely needs, following the same data handling practices as the rest of your application.",
      },
      {
        question:
          "Who manages the integration once it's live, and what about ongoing model costs?",
        answer:
          "You own the integration code and its configuration outright, and usage dashboards give your team full visibility into ongoing provider costs. We offer support retainers covering monitoring, prompt and retrieval tuning, and provider updates, though many clients are comfortable handing routine maintenance to their own engineering team after handover.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* LLM Consulting & Solutions                                          */
  /* ------------------------------------------------------------------ */
  "llm-consulting-solutions": {
    heroTagline:
      "Independent LLM strategy, evaluation, and deployment engineering that turns promising pilots into reliable, production-grade AI features.",
    heroHighlights: [
      "Model-agnostic evaluations",
      "Guardrails before go-live",
      "Senior AI engineers only",
    ],
    overviewTitle: "LLM systems built for production, not demos",
    intro: [
      "Large language models are easy to prototype and hard to productionise. A slick demo can fall apart once it meets real users, messy data, and edge cases that were never in the test set. We help engineering and product teams close that gap — choosing the right model and architecture for the task, building evaluation harnesses that catch regressions before users do, and designing guardrails that keep outputs accurate, on-brand, and safe to ship.",
      "Our consultants work across the stack — from prompt and retrieval design to fine-tuning decisions and inference cost — so you are not locked into a single vendor's roadmap. We benchmark providers like OpenAI, Anthropic Claude, and open-weight models against your own tasks, then build the evaluation and monitoring infrastructure that lets you ship changes with confidence. The result is an LLM layer your team understands, can maintain, and can defend to auditors, security teams, and customers.",
    ],
    offeringsTitle: "What we deliver",
    offeringsSubtitle:
      "Consulting and engineering across the full LLM lifecycle — from model choice to production monitoring.",
    offerings: [
      {
        icon: "fa-magnifying-glass-chart",
        title: "Model Selection & Benchmarking",
        description:
          "Structured evaluation of proprietary and open-weight models against your real tasks and data, so you choose on evidence — cost, latency, and quality — not vendor marketing.",
      },
      {
        icon: "fa-comment-dots",
        title: "Prompt & Retrieval Engineering",
        description:
          "Prompt systems, context design, and RAG pipelines tuned to your domain — grounding responses in your own documents, policies, and data instead of model memory alone.",
      },
      {
        icon: "fa-code-branch",
        title: "Fine-Tuning & Adaptation",
        description:
          "Where prompting and retrieval are not enough, we scope, run, and evaluate fine-tuning jobs — and are equally direct when a lighter approach will do the job.",
      },
      {
        icon: "fa-shield-halved",
        title: "Evaluation Harnesses & Guardrails",
        description:
          "Automated test suites, structured red-teaming, and output guardrails that catch hallucination, prompt injection, and policy violations before they ever reach a customer or an auditor's desk.",
      },
      {
        icon: "fa-gauge-high",
        title: "Inference Cost & Performance Tuning",
        description:
          "Caching, request routing, batching, and model right-sizing that cut token spend and latency in production, without degrading the response quality your users actually notice day to day.",
      },
      {
        icon: "fa-people-arrows",
        title: "Governance & Team Enablement",
        description:
          "Usage policies, review workflows, and hands-on training so your own engineers can extend, monitor, and safely evolve the LLM systems we help you design and build.",
      },
    ],
    benefitsTitle: "Why teams trust Ramest with LLM work",
    processTitle: "How an LLM engagement runs",
    processSubtitle:
      "A structured path from problem definition to a monitored production system.",
    stackTitle: "Tools and models we work with",
    stackSubtitle:
      "A model-agnostic toolkit spanning proprietary APIs, open-weight models, and evaluation infrastructure.",
    faqSubtitle:
      "What technical and business leaders ask before starting an LLM engagement.",
    benefits: [
      {
        icon: "fa-scale-balanced",
        title: "Vendor-neutral advice",
        description:
          "We are not tied to a single model provider, so recommendations are based on your evaluation results and constraints, not a partnership agreement or reseller margin.",
      },
      {
        icon: "fa-flask",
        title: "Evidence over intuition",
        description:
          "Every model, prompt, and fine-tuning decision is backed by a measurable evaluation run against your own tasks, not a general leaderboard score or a demo that looked good once.",
      },
      {
        icon: "fa-shield-halved",
        title: "Safety built in, not bolted on",
        description:
          "Guardrails, red-teaming, and monitoring are part of the build from day one, so accuracy and safety issues surface in testing rather than in front of a customer.",
      },
      {
        icon: "fa-users-gear",
        title: "A small senior team",
        description:
          "You work directly with the engineers doing the evaluation and build work — no account layer, no junior hand-offs, and a team small enough to move fast.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Discovery & Feasibility",
        description:
          "We map the use case, data sources, and success metrics, then assess honestly whether an LLM is the right tool before any build begins.",
      },
      {
        step: "02",
        title: "Architecture & Model Selection",
        description:
          "Benchmarking candidate models and designing the prompt, retrieval, and fallback architecture that will carry the feature into production.",
      },
      {
        step: "03",
        title: "Build & Evaluate",
        description:
          "Iterative build with an evaluation harness running on every change, so regressions are caught before a release, not after.",
      },
      {
        step: "04",
        title: "Deploy & Monitor",
        description:
          "Production rollout with guardrails, logging, and cost dashboards, plus a plan for ongoing evaluation as models and usage evolve.",
      },
    ],
    techStack: [
      {
        category: "Models & APIs",
        items: ["OpenAI", "Anthropic Claude", "AWS Bedrock", "Llama", "Mistral"],
      },
      {
        category: "Orchestration & Retrieval",
        items: ["LangChain", "LangGraph", "LlamaIndex", "Pinecone", "pgvector"],
      },
      {
        category: "Evaluation & Monitoring",
        items: ["Weights & Biases", "LangSmith", "Ragas", "PromptLayer"],
      },
      {
        category: "Infrastructure",
        items: ["Python", "Docker", "AWS", "PostgreSQL"],
      },
    ],
    faqs: [
      {
        question: "How much does LLM consulting cost?",
        answer:
          "Cost depends on scope — how many use cases you need covered, how ready your data is, and how much evaluation and guardrail work your risk profile demands. We scope every engagement through a consultation call, then agree a fixed quote before work begins, delivered as a fixed-scope project or a dedicated team. We build for businesses of every size, from a single scoped feature such as a RAG assistant to a larger multi-model programme, so a smaller, focused engagement is just as welcome as an enterprise one.",
      },
      {
        question: "How long does an LLM consulting engagement take?",
        answer:
          "A focused engagement — model selection, a working prototype, and an initial evaluation harness — typically takes 4–8 weeks. Larger programmes covering fine-tuning, multi-model routing, and full guardrail and monitoring infrastructure run 10–16 weeks, usually delivered in phases so you have a working feature in production well before the roadmap is complete.",
      },
      {
        question: "What does LLM consulting actually involve?",
        answer:
          "LLM consulting is the work of turning a large language model into a reliable product feature — choosing the right model, designing prompts and retrieval, and building the evaluation and guardrail systems that keep outputs accurate and safe. It sits between AI strategy and hands-on engineering, and typically ends with a production-ready implementation, not just a recommendation document.",
      },
      {
        question:
          "Do we need fine-tuning, or is retrieval-augmented generation (RAG) enough?",
        answer:
          "Most business use cases are solved with RAG and good prompt engineering alone — fine-tuning is the exception, not the default. We recommend fine-tuning only when a task needs a consistent style, format, or domain behaviour that retrieval and prompting cannot reliably produce, and we always test the cheaper option first before proposing the more expensive one.",
      },
      {
        question:
          "How do you prevent hallucination and inaccurate answers in production?",
        answer:
          "We reduce hallucination through grounding — retrieval over your verified data, structured prompts, and citations back to source documents — combined with an evaluation harness that scores accuracy on real examples before every release. Guardrails add a final check, catching unsupported claims or out-of-policy responses and routing uncertain cases to a human instead of guessing.",
      },
      {
        question: "What happens after the LLM system is deployed?",
        answer:
          "You own the code, prompts, evaluation datasets, and infrastructure configuration outright. We typically stay engaged through a support retainer covering monitoring, model updates, and evaluation re-runs as providers release new versions, since an LLM feature that is not re-tested against model updates tends to drift in quality over time.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* AI Agents Development                                               */
  /* ------------------------------------------------------------------ */
  "ai-agents-development": {
    heroTagline:
      "Agentic AI systems that plan, call tools, and complete real business workflows — with human checkpoints exactly where they matter.",
    heroHighlights: [
      "Human-in-the-loop by design",
      "Tool-calling built on your APIs",
      "Production monitoring included",
    ],
    overviewTitle: "Agents that finish the workflow, not just chat",
    intro: [
      "A chatbot answers questions; an agent gets work done. We design and build agentic systems that plan a sequence of steps, call the tools and APIs your business already runs on, and carry a task through to completion — raising a ticket, updating a record, drafting a document, or triggering a downstream process. The goal is not novelty, it is hours removed from a real workflow, with clear boundaries on what the agent is allowed to decide on its own.",
      "Every agent we ship is built on frameworks like LangGraph and orchestration patterns proven in production — not a single giant prompt. We define the tools an agent can call, the data it can see, and the points where a human must approve before anything irreversible happens. Combined with logging, retries, and evaluation on real task outcomes, this gives you an agent that is auditable, debuggable, and safe enough to trust with work that matters.",
    ],
    offeringsTitle: "What we build",
    offeringsSubtitle:
      "Agentic systems engineered for real operational workflows, not demo scripts.",
    offerings: [
      {
        icon: "fa-sitemap",
        title: "Workflow & Task Agents",
        description:
          "Agents that plan and execute multi-step business processes — triage, data entry, reconciliation, research — end to end, with clear exit conditions and error handling.",
      },
      {
        icon: "fa-plug",
        title: "Tool & API Integration",
        description:
          "Secure connections between your agent and the systems it needs to act on — CRMs, databases, internal APIs, and third-party services — each scoped to least privilege.",
      },
      {
        icon: "fa-users-gear",
        title: "Multi-Agent Orchestration",
        description:
          "Coordinated systems of specialised agents — a planner, researchers, and executors — that divide complex work and hand off cleanly rather than one agent doing everything badly.",
      },
      {
        icon: "fa-user-shield",
        title: "Human-in-the-Loop Controls",
        description:
          "Approval steps, confidence thresholds, and escalation paths built into the agent's logic, so high-stakes or ambiguous decisions are routed to a person before they execute.",
      },
      {
        icon: "fa-gauge-high",
        title: "Agent Evaluation & Observability",
        description:
          "Logging, tracing, and task-level evaluation that show exactly what an agent did and why, so failures are diagnosable and performance improves with real usage data.",
      },
      {
        icon: "fa-screwdriver-wrench",
        title: "Deployment & Ongoing Tuning",
        description:
          "Production rollout alongside your existing systems, plus continuous tuning of prompts, tools, and guardrails as workflows change and the agent gradually takes on new responsibility.",
      },
    ],
    benefitsTitle: "Why teams build agents with Ramest",
    processTitle: "How we build an agent",
    processSubtitle:
      "A staged path from workflow mapping to a supervised, then trusted, production agent.",
    stackTitle: "Tools and frameworks we build with",
    stackSubtitle:
      "Proven agent orchestration, tool-calling, and monitoring infrastructure.",
    faqSubtitle:
      "What operations and engineering leaders ask before building an agent.",
    benefits: [
      {
        icon: "fa-user-shield",
        title: "Control where it counts",
        description:
          "You decide which decisions an agent can make autonomously and which require human approval, so automation scales without handing over judgement calls it should not make.",
      },
      {
        icon: "fa-plug",
        title: "Built on your real systems",
        description:
          "Agents call your actual APIs, databases, and internal tools from day one, so what you see in testing is what runs in production, not a sandbox demo.",
      },
      {
        icon: "fa-magnifying-glass-chart",
        title: "Full observability",
        description:
          "Every plan, tool call, and decision an agent makes is logged and traceable, so when something goes wrong you can see exactly why and fix it fast.",
      },
      {
        icon: "fa-scale-balanced",
        title: "Right-sized automation",
        description:
          "We start with the narrowest agent that solves the problem and expand its autonomy only as evaluation results earn that trust, not the other way round.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Workflow Mapping",
        description:
          "We map the target workflow step by step, identifying which decisions can be automated safely and which must stay with a person.",
      },
      {
        step: "02",
        title: "Tool & Guardrail Design",
        description:
          "Defining the tools the agent can call, the data it can access, and the approval points that keep risky actions supervised.",
      },
      {
        step: "03",
        title: "Build & Simulate",
        description:
          "Building the agent against real tools in a sandboxed environment, testing it on real task scenarios before anything touches production.",
      },
      {
        step: "04",
        title: "Deploy & Expand Autonomy",
        description:
          "Supervised production rollout, followed by a gradual increase in autonomy as monitored performance earns more trust.",
      },
    ],
    techStack: [
      {
        category: "Agent Frameworks",
        items: ["LangGraph", "LangChain", "CrewAI", "AutoGen"],
      },
      {
        category: "Models & APIs",
        items: ["OpenAI GPT", "Anthropic Claude", "AWS Bedrock", "Azure OpenAI"],
      },
      {
        category: "Memory & Retrieval",
        items: ["Pinecone", "pgvector", "Redis", "PostgreSQL"],
      },
      {
        category: "Observability & Infra",
        items: ["LangSmith", "Weights & Biases", "Docker", "AWS"],
      },
    ],
    faqs: [
      {
        question: "How much does building an AI agent cost?",
        answer:
          "Cost depends on scope — how many tools and systems the agent must integrate with, how many workflows it spans, and how much evaluation rigour the use case demands. We scope every build through a consultation call, then agree a fixed quote before work begins, delivered as a fixed-scope engagement or a dedicated team. We build for businesses of every size, from a single-workflow agent through to a multi-agent system spanning several processes, so a focused, smaller build is genuinely welcome.",
      },
      {
        question: "How long does it take to build an AI agent?",
        answer:
          "A focused single-workflow agent typically takes 6–10 weeks from workflow mapping to supervised production. Multi-agent systems, or agents needing deep integration with several internal systems, usually take 12–20 weeks, delivered in phases so a narrow, supervised version is live and earning trust well before full autonomy is granted.",
      },
      {
        question:
          "What is an AI agent, and how is it different from a chatbot?",
        answer:
          "An AI agent is a system that plans a sequence of steps, calls tools or APIs, and carries a task through to completion with minimal supervision — unlike a chatbot, which mainly generates a conversational reply. Agents act on your systems: updating records, triggering processes, or completing multi-step tasks, whereas a chatbot's job typically ends at answering a question.",
      },
      {
        question: "Should we build AI agents in-house or with a partner?",
        answer:
          "Most teams get further, faster, with an experienced partner for the first agent, then bring capability in-house once the pattern is proven. Agent development involves orchestration frameworks, tool-calling design, and evaluation practices that take time to learn from scratch, and mistakes made on a live workflow are expensive. A partner can also train your engineers during the build so you are not dependent long-term.",
      },
      {
        question: "How do you stop an agent from taking the wrong action?",
        answer:
          "We constrain agents with scoped tool permissions, confidence thresholds, and mandatory approval steps for anything irreversible or high-value, so the agent physically cannot take actions outside its defined boundaries. Every action is logged, and evaluation on real scenarios during the build surfaces failure modes before the agent is trusted with live data or systems.",
      },
      {
        question: "Who manages the agent after it goes live?",
        answer:
          "You own the agent's code, prompts, and configuration outright, and many clients run it independently once it is stable. We typically stay engaged through a support retainer covering monitoring, tool updates as your internal APIs change, and gradual autonomy increases as the agent's track record justifies handing it more responsibility.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Custom AI Development                                               */
  /* ------------------------------------------------------------------ */
  "custom-ai-development": {
    heroTagline:
      "Bespoke machine learning models and data pipelines built around your domain data — from computer vision to forecasting to proprietary intelligence layers.",
    heroHighlights: [
      "Models trained on your data",
      "MLOps from day one",
      "Built to run in production",
    ],
    overviewTitle: "AI built on your data, not a generic API",
    intro: [
      "Off-the-shelf AI APIs are a good starting point, but they hit a ceiling when your problem depends on proprietary data, domain-specific patterns, or accuracy the general-purpose models were never trained for. We build custom AI — computer vision models, forecasting systems, recommendation engines, and other proprietary intelligence layers — trained and evaluated on your own data, then engineered into the products and operational systems your team already runs every day.",
      "Our approach follows disciplined ML engineering, not one-off notebooks. We define the metric that actually matters to the business, build a data pipeline you can trust, and put MLOps in place — versioning, monitoring, and retraining triggers — so the model keeps performing as your data changes. You end up with a model your team can retrain, explain, and maintain long after we hand it over, not a black box only we understand.",
    ],
    offeringsTitle: "What we build",
    offeringsSubtitle:
      "Custom machine learning systems designed around your data, domain, and production constraints.",
    offerings: [
      {
        icon: "fa-eye",
        title: "Computer Vision Models",
        description:
          "Detection, classification, and quality-inspection models trained on your own image data — built for manufacturing lines, retail shelves, healthcare imaging, or field operations use cases.",
      },
      {
        icon: "fa-chart-line",
        title: "Forecasting & Predictive Models",
        description:
          "Demand, revenue, churn, and risk forecasting models built on your own historical data, with confidence intervals and drift monitoring so accuracy stays visible, not assumed.",
      },
      {
        icon: "fa-magnifying-glass-chart",
        title: "Recommendation & Personalisation Engines",
        description:
          "Ranking and recommendation systems tuned to your catalogue, data, and user behaviour — balancing relevance, diversity, and business rules rather than a generic collaborative filter.",
      },
      {
        icon: "fa-microchip",
        title: "Proprietary Intelligence Layers",
        description:
          "Domain-specific scoring, classification, or decisioning models embedded directly into your product as an API or internal service — a defensible capability competitors cannot simply buy.",
      },
      {
        icon: "fa-database",
        title: "Data Pipelines & Feature Engineering",
        description:
          "Reliable pipelines that clean, label, and transform your raw data into the features a model needs — the unglamorous work that ultimately determines model quality.",
      },
      {
        icon: "fa-server",
        title: "MLOps & Model Operations",
        description:
          "Versioning, monitoring, drift detection, and automated retraining pipelines so your models keep performing well in production instead of quietly degrading after the very first deployment.",
      },
    ],
    benefitsTitle: "Why teams build custom AI with Ramest",
    processTitle: "How we build custom AI",
    processSubtitle:
      "A disciplined path from problem framing to a monitored model in production.",
    stackTitle: "Tools and frameworks we build with",
    stackSubtitle:
      "A modern ML stack spanning modelling, data pipelines, and production operations.",
    faqSubtitle:
      "What technical and product leaders ask before starting a custom AI build.",
    benefits: [
      {
        icon: "fa-bullseye",
        title: "Built for your metric",
        description:
          "We optimise for the business outcome that matters — accuracy on your edge cases, forecast error on your product lines — not a generic benchmark score.",
      },
      {
        icon: "fa-database",
        title: "Rigour on the data, not just the model",
        description:
          "Most model performance problems trace back to data quality. We invest early in pipelines, labelling, and validation so the model has something worth learning from.",
      },
      {
        icon: "fa-server",
        title: "Production-grade MLOps",
        description:
          "Versioning, monitoring, and retraining are designed in from the start, so the model you see performing well in evaluation keeps performing well six months later.",
      },
      {
        icon: "fa-lock",
        title: "A defensible asset",
        description:
          "A model trained on your proprietary data is a capability competitors cannot license or copy — you own the weights, the pipeline, and the advantage they create.",
      },
    ],
    process: [
      {
        step: "01",
        title: "Problem & Data Framing",
        description:
          "Defining the metric that matters, auditing available data, and confirming a custom model is justified before committing to a build.",
      },
      {
        step: "02",
        title: "Data Pipeline & Baseline",
        description:
          "Building the data pipeline and a simple baseline model first, to prove the approach and set a performance bar to beat.",
      },
      {
        step: "03",
        title: "Model Development & Evaluation",
        description:
          "Iterating on model architecture and features, with rigorous offline evaluation against the agreed metric before anything reaches production.",
      },
      {
        step: "04",
        title: "Deploy & Operate",
        description:
          "Production deployment with monitoring, drift detection, and a retraining plan so performance holds as your real-world data evolves.",
      },
    ],
    techStack: [
      {
        category: "Modelling",
        items: ["PyTorch", "TensorFlow", "scikit-learn", "XGBoost"],
      },
      {
        category: "Data & Pipelines",
        items: ["Python", "Apache Airflow", "Pandas", "PostgreSQL"],
      },
      {
        category: "MLOps & Monitoring",
        items: ["Weights & Biases", "MLflow", "Docker", "Kubernetes"],
      },
      {
        category: "Cloud & Deployment",
        items: ["AWS", "AWS SageMaker", "Azure", "Google Cloud"],
      },
    ],
    faqs: [
      {
        question: "How much does custom AI model development cost?",
        answer:
          "Cost depends on scope — how ready your data is, how demanding your accuracy requirements are, and how much labelling or how many model versions the project needs. We scope every build through a consultation call, then agree a fixed quote before work begins, delivered as a fixed-scope engagement or a dedicated team. We build for businesses of every size, from a narrow proof of concept on existing data to a full production model with MLOps, so a smaller, focused project is genuinely welcome.",
      },
      {
        question: "How long does custom AI development take?",
        answer:
          "A focused proof of concept on data you already have typically takes 4–6 weeks. A production-ready custom model — including data pipeline work, evaluation, and MLOps — usually takes 10–18 weeks, and projects requiring significant data collection or labelling can run longer, since data readiness is usually the biggest driver of timeline, not the modelling itself.",
      },
      {
        question:
          "What is custom AI development, and when do we need it over an off-the-shelf API?",
        answer:
          "Custom AI development means training or building a model on your own data and domain, rather than calling a general-purpose API. It becomes necessary when your problem depends on proprietary data patterns, needs accuracy an off-the-shelf model cannot reach, or must become a defensible capability embedded in your product, rather than something any competitor can access through the same public API.",
      },
      {
        question:
          "Should we use a general-purpose AI API or build a custom model?",
        answer:
          "Start with a general-purpose API wherever it meets your accuracy and cost bar — it is faster and cheaper than building a custom model. Custom development earns its cost when accuracy plateaus on your specific data, when per-call API costs become expensive at your volume, or when the model itself needs to be a proprietary asset rather than a shared utility every competitor can also call.",
      },
      {
        question: "How do you ensure the model stays accurate after deployment?",
        answer:
          "We treat deployment as the start of monitoring, not the end of the project. Every model ships with drift detection comparing live predictions against ground truth as it becomes available, alerting thresholds, and a retraining pipeline, so accuracy degradation is caught and corrected automatically rather than discovered months later through a business metric quietly getting worse.",
      },
      {
        question: "Who owns the model and what happens after deployment?",
        answer:
          "You own the trained model, weights, pipeline code, and documentation outright. We typically stay engaged through a support retainer covering monitoring, scheduled retraining, and performance reviews, since real-world data drifts over time and a model left untouched after launch gradually loses the accuracy it had on day one.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Manufacturing                                                       */
  /* ------------------------------------------------------------------ */
  "manufacturing": {
    heroTagline:
      "Manufacturing software that connects shop-floor equipment, quality data, and supply chains into one accurate operating picture.",
    heroHighlights: [
      "MES & ERP integration",
      "Real-time shop-floor visibility",
      "Built around OT/IT realities",
    ],
    overviewTitle: "Software built for the realities of the plant floor",
    intro: [
      "Most manufacturers run on a patchwork of PLCs, SCADA systems, spreadsheets, and an ERP that never quite talks to the shop floor. Quality data lives in paper logs or disconnected forms. Maintenance is reactive because nobody has a reliable signal on machine health until a line stops. Supply visibility ends at the four walls of the plant, so a supplier delay is discovered only when the line runs out of parts. These gaps cost real money in downtime, scrap, and expedited freight — and they compound as plants add lines, shifts, and suppliers.",
      "We build the connective layer plants are missing — integrations between MES, ERP, and shop-floor sensors, plus purpose-built systems for quality tracking, maintenance, and supplier visibility. Work happens alongside your operations and IT teams, respecting the separation between OT and IT networks rather than forcing a rip-and-replace. The result is software that gives plant managers and planners a live, accurate picture of production, quality, and inventory — so decisions are based on what is actually happening on the line, not what a spreadsheet said yesterday.",
    ],
    offeringsTitle: "What we build for manufacturers",
    offeringsSubtitle:
      "Systems that connect equipment, quality, and supply data into one operating picture.",
    offerings: [
      {
        icon: "fa-industry",
        title: "MES Integration",
        description:
          "Connect your manufacturing execution system to ERP, quality, and maintenance tools so production data flows automatically instead of being re-keyed between disconnected systems on the plant floor.",
      },
      {
        icon: "fa-clipboard-check",
        title: "Quality Tracking & Traceability",
        description:
          "Digital inspection, non-conformance logging, and batch or lot traceability that replaces paper checklists — so defects are caught earlier and issues can be traced to a specific run.",
      },
      {
        icon: "fa-satellite-dish",
        title: "IoT & Shop-Floor Telemetry",
        description:
          "Sensor and PLC data captured from machines and lines, streamed into dashboards that show throughput, downtime, and OEE in near real time for supervisors and plant managers.",
      },
      {
        icon: "fa-wrench",
        title: "Maintenance Scheduling",
        description:
          "Preventive and condition-based maintenance systems that turn machine telemetry and service history into schedules, work orders, and alerts before a breakdown stops the line.",
      },
      {
        icon: "fa-boxes-stacked",
        title: "Supply Chain Visibility",
        description:
          "Dashboards and integrations that track supplier lead times, inbound materials, and inventory levels, giving planners advance warning of shortages instead of discovering them at the line.",
      },
      {
        icon: "fa-building",
        title: "ERP Integration",
        description:
          "Reliable, well-documented integrations between your ERP and shop-floor or quality systems, keeping production, inventory, and finance data consistent across departments without manual reconciliation or duplicate data entry.",
      },
    ],
    benefitsTitle: "Why plants build with Ramest",
    process: [
      {
        step: "01",
        title: "Plant & Systems Discovery",
        description:
          "Walkthroughs of your lines, existing systems, and data sources to map what exists today and where the real operational gaps are.",
      },
      {
        step: "02",
        title: "Architecture & Integration Design",
        description:
          "A technical plan for connecting MES, ERP, and shop-floor data sources, reviewed with your operations and IT teams before build begins.",
      },
      {
        step: "03",
        title: "Build & Pilot",
        description:
          "Incremental delivery starting with one line or process, validated against real production data before wider rollout.",
      },
      {
        step: "04",
        title: "Rollout & Operate",
        description:
          "Phased rollout across additional lines or plants, with monitoring and support so the system stays reliable as operations scale.",
      },
    ],
    processTitle: "From plant floor to production system in four steps",
    processSubtitle:
      "A delivery rhythm built around operations schedules, not just sprint calendars.",
    stackTitle: "Our manufacturing technology stack",
    stackSubtitle:
      "Proven tools for industrial integration, data, and cloud or edge delivery.",
    techStack: [
      {
        category: "Industrial Integration",
        items: ["OPC-UA", "Modbus", "MQTT", "REST APIs"],
      },
      {
        category: "Backend",
        items: ["Node.js", "Python", "Java", "PostgreSQL"],
      },
      {
        category: "Data & Analytics",
        items: ["TimescaleDB", "Apache Kafka", "Grafana", "Power BI"],
      },
      {
        category: "Cloud & Edge",
        items: ["AWS IoT", "Azure IoT Hub", "Docker", "Kubernetes"],
      },
    ],
    benefits: [
      {
        icon: "fa-chart-line",
        title: "Fewer surprises on the line",
        description:
          "Real-time visibility into machine status, quality, and inventory means problems surface while they are still small, not after a shift's worth of scrap has piled up.",
      },
      {
        icon: "fa-plug",
        title: "Systems that finally talk to each other",
        description:
          "We connect MES, ERP, SCADA, and quality tools that were never designed to share data, so your teams stop reconciling spreadsheets and start trusting one shared picture.",
      },
      {
        icon: "fa-shield-halved",
        title: "Respect for OT/IT boundaries",
        description:
          "We design integrations that respect the separation between operational and IT networks, so plant security and uptime are never put at risk for the sake of a dashboard.",
      },
      {
        icon: "fa-gauge-high",
        title: "Built to scale across plants",
        description:
          "Architecture that starts with one line or facility and extends cleanly to additional plants and suppliers as your operation grows, without a rebuild each time you scale.",
      },
    ],
    faqSubtitle:
      "What plant and operations leaders ask before starting a manufacturing software project.",
    faqs: [
      {
        question: "How much does a manufacturing software project cost?",
        answer:
          "Cost depends on scope — the number of systems being connected, how many legacy protocols are involved, and whether the rollout spans one plant or several. We scope every project through a consultation call, then agree a fixed quote before work begins, delivered as a fixed-scope engagement or a dedicated team. We build for manufacturers of every size, from a single-line integration or quality-tracking system to a multi-plant MES and ERP programme, so a smaller, focused project is genuinely welcome.",
      },
      {
        question:
          "How long does it take to deliver a manufacturing integration project?",
        answer:
          "A focused project — one MES-to-ERP integration or a quality-tracking module — usually takes 8–14 weeks. Multi-system programmes spanning several plants or legacy PLC integrations typically run 4–9 months, delivered in phases so one line or facility goes live and proves value before the rollout extends further.",
      },
      {
        question:
          "Should our manufacturing data stay on-premises or move to the cloud?",
        answer:
          "Many plants keep operational technology — PLCs, SCADA, and safety systems — on isolated on-premises networks, while sending aggregated production and quality data to the cloud for reporting and analytics. We design integrations that respect that OT/IT separation rather than forcing everything onto one network. The right split depends on your plant's security policies and any sector-specific regulations, so we recommend confirming the approach with your own IT and compliance team.",
      },
      {
        question:
          "Can you integrate with our existing ERP, MES, or PLC systems?",
        answer:
          "Yes. We regularly integrate with ERP platforms such as SAP and Microsoft Dynamics, MES and SCADA systems, and PLCs communicating over OPC-UA, Modbus, or MQTT. Where a system is older or poorly documented, we start with an audit of its data and interfaces before designing the integration, so legacy equipment does not become a blocker.",
      },
      {
        question:
          "Should we build custom software or buy an off-the-shelf MES/ERP platform?",
        answer:
          "Off-the-shelf MES and ERP platforms are a reasonable starting point for standard workflows and offer faster initial setup. A custom build makes more sense when your processes, equipment mix, or reporting needs do not fit the platform's assumptions, or when you need it to integrate cleanly with systems the vendor does not support. Many clients combine both — a standard platform extended with custom integrations.",
      },
      {
        question: "What support do we get after the system goes live?",
        answer:
          "We offer ongoing support retainers covering monitoring, integration maintenance, and enhancements as your plant's systems or processes change. All code, documentation, and integration configuration are handed over to your team, and you are free to maintain the system independently or keep working with us — the choice is yours.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* FinTech                                                             */
  /* ------------------------------------------------------------------ */
  "fintech": {
    heroTagline:
      "Payment, lending, and financial platforms engineered for security, auditability, and the scrutiny that regulated money movement demands.",
    heroHighlights: [
      "Security-first architecture",
      "Built for audit trails",
      "Payment & KYC integrations",
    ],
    overviewTitle: "Financial software built for trust and scrutiny",
    intro: [
      "Financial products live or die on trust. A lending platform with slow underwriting loses borrowers to competitors; a payments flow with unclear error handling loses transactions and support hours; a reconciliation process built on spreadsheets creates risk nobody notices until an audit. Meanwhile every feature has to survive scrutiny from regulators, auditors, and payment partners, not just users — so shortcuts that would be fine in a typical product become liabilities here.",
      "We build financial software with that scrutiny assumed from day one — clear audit trails, sound reconciliation logic, and integrations with payment gateways, KYC providers, and core banking systems designed to fail safely rather than silently. The goal is a platform your engineering, risk, and compliance teams can all stand behind, not just one that works in a demo. We stay involved after launch, because financial systems keep needing careful, well-tested change.",
    ],
    offeringsTitle: "What we build for financial platforms",
    offeringsSubtitle:
      "Systems for payments, onboarding, lending, and the audit trails that hold them together.",
    offerings: [
      {
        icon: "fa-credit-card",
        title: "Payment Gateway Integration",
        description:
          "Secure integrations with payment gateways and processors for cards, UPI, and bank transfers, with clear handling of failures, retries, and reconciliation between your ledger and the provider.",
      },
      {
        icon: "fa-user-shield",
        title: "KYC & AML Workflow Systems",
        description:
          "Onboarding flows that connect to KYC and identity verification providers, with configurable risk rules, document checks, and audit-ready records of every decision made during onboarding.",
      },
      {
        icon: "fa-scale-balanced",
        title: "Core Ledger & Reconciliation",
        description:
          "Double-entry ledger systems and automated reconciliation between internal records, bank statements, and payment processors, replacing manual spreadsheet matching with a system that flags discrepancies immediately.",
      },
      {
        icon: "fa-file-invoice-dollar",
        title: "Lending & Underwriting Platforms",
        description:
          "Loan origination and underwriting systems that combine credit data, business rules, and manual review steps into a workflow lenders can explain, audit, and adjust as policy changes.",
      },
      {
        icon: "fa-shield-halved",
        title: "Fraud Detection & Risk Monitoring",
        description:
          "Transaction monitoring and rules-based risk scoring that flag suspicious activity for review in real time, tuned to your product's specific risk appetite rather than a generic threshold.",
      },
      {
        icon: "fa-clipboard-list",
        title: "Regulatory Reporting & Audit Trails",
        description:
          "Structured logging and reporting built into the platform from the start, so producing the records auditors and regulators ask for is a query, not a scramble.",
      },
    ],
    benefitsTitle: "Why financial teams build with Ramest",
    process: [
      {
        step: "01",
        title: "Discovery & Risk Mapping",
        description:
          "Workshops to understand your product, transaction flows, and regulatory context, ending in a clear scope and an honest risk assessment.",
      },
      {
        step: "02",
        title: "Architecture & Security Design",
        description:
          "System and data architecture reviewed for security, auditability, and integration points before any production code is written.",
      },
      {
        step: "03",
        title: "Agile Build with Security Reviews",
        description:
          "Two-week sprints with working demos, automated testing, and security review built into the process rather than added at the end.",
      },
      {
        step: "04",
        title: "Hardening, Launch & Support",
        description:
          "Penetration-testing-ready hardening, staged rollout, and ongoing support so the platform stays reliable as transaction volume grows.",
      },
    ],
    processTitle: "From discovery to a production-ready platform in four steps",
    processSubtitle:
      "A delivery rhythm that treats security and auditability as first-class requirements.",
    stackTitle: "Our fintech technology stack",
    stackSubtitle:
      "Proven tools for payments, identity, security, and cloud delivery.",
    techStack: [
      {
        category: "Payments & Identity",
        items: ["Razorpay", "Stripe", "Plaid", "Signzy"],
      },
      {
        category: "Backend",
        items: ["Node.js", "Java", "Python", "PostgreSQL"],
      },
      {
        category: "Security & Data",
        items: ["HashiCorp Vault", "AWS KMS", "Redis", "Kafka"],
      },
      {
        category: "Cloud & DevOps",
        items: ["AWS", "Azure", "Docker", "Kubernetes"],
      },
    ],
    benefits: [
      {
        icon: "fa-shield-halved",
        title: "Security built in, not bolted on",
        description:
          "Encryption, least-privilege access, and secure handling of sensitive financial and personal data are part of the architecture from the first commit, not a pre-launch checklist item.",
      },
      {
        icon: "fa-magnifying-glass",
        title: "Every transaction is traceable",
        description:
          "Ledger and audit-trail design that lets you reconstruct exactly what happened to any transaction, which matters when a customer, partner, or regulator asks questions.",
      },
      {
        icon: "fa-plug",
        title: "Integrations that fail safely",
        description:
          "Payment, KYC, and banking integrations are built to handle timeouts and partial failures gracefully, instead of leaving transactions in an unclear or unrecoverable state.",
      },
      {
        icon: "fa-gauge-high",
        title: "Performance under real transaction load",
        description:
          "Systems designed and tested for the concurrency and latency demands of live payment and lending traffic, not just for a clean demo environment.",
      },
    ],
    faqSubtitle:
      "What founders and risk leaders ask before starting a fintech build.",
    faqs: [
      {
        question: "How much does it cost to build a fintech platform?",
        answer:
          "Cost depends on scope — the security review required, the number of external integrations, and how demanding your audit and reporting requirements are. We scope every build through a consultation call, then agree a fixed quote before work begins, delivered as a fixed-scope engagement or a dedicated team. We build for businesses of every size, from a single payments or onboarding module to a full lending or core platform with multiple integrations, so a smaller, focused build is genuinely welcome.",
      },
      {
        question: "How long does it take to build a fintech product?",
        answer:
          "A focused module such as a payment flow or KYC onboarding journey typically takes 10–16 weeks. Larger platforms covering lending, ledger, and reporting are delivered in phases over 5–9 months, with each phase moving into production so you are validating with real users well before the full roadmap is complete.",
      },
      {
        question: "Do you build platforms that are PCI DSS or RBI compliant?",
        answer:
          "We design with security and auditability practices that support compliance — encryption, access control, logging, and clean audit trails — but we are not a certification body and do not claim PCI DSS certification or formal regulatory accreditation on your behalf. For PCI DSS scope, RBI guidelines, or data localisation requirements, we recommend involving your compliance counsel or a qualified auditor alongside our engineering work.",
      },
      {
        question:
          "Can you integrate with our existing payment gateway or core banking system?",
        answer:
          "Yes. We regularly integrate with payment gateways such as Razorpay and Stripe, identity and KYC providers, and core banking or ledger systems, including older platforms with limited documentation. Each integration starts with mapping the provider's API, failure modes, and reconciliation requirements before we design how your platform will depend on it.",
      },
      {
        question:
          "Should we build a custom platform or use an off-the-shelf fintech solution?",
        answer:
          "Off-the-shelf banking-as-a-service and lending platforms can be the faster route for standard products with limited customisation needs. A custom build is usually the better fit once your pricing, risk rules, or workflow diverge from what the platform supports, or when you need tight integration with systems it was not built for. We are happy to advise honestly on which path fits your stage.",
      },
      {
        question: "What happens after the platform goes live?",
        answer:
          "We offer support retainers covering monitoring, incident response, and continued feature development as your product and regulatory obligations evolve. All code, infrastructure configuration, and documentation are handed over to your team, and you retain full ownership — whether you keep working with us or bring the system fully in-house.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Ecommerce                                                           */
  /* ------------------------------------------------------------------ */
  "ecommerce": {
    heroTagline:
      "Storefronts, checkout, and commerce backends engineered for conversion, catalog complexity, and peak-season traffic.",
    heroHighlights: [
      "Built for peak-traffic load",
      "Checkout tuned to convert",
      "Unified catalog & inventory",
    ],
    overviewTitle: "Commerce systems built to convert and scale",
    intro: [
      "Most ecommerce problems show up at the worst possible time — a checkout that adds friction and loses sales, a catalog that goes out of sync across channels, or a storefront that buckles during a sale event. Off-the-shelf platforms solve the easy 80% quickly but start to fight you once your catalog, promotions, or fulfilment logic get specific. The result is workarounds layered on workarounds, and a storefront that gets harder to change exactly when you need it to move fastest.",
      "We build storefronts, checkout flows, and commerce backends that fit your catalog and operations instead of forcing you into a platform's defaults — often headless, so the storefront can evolve independently of inventory, pricing, and fulfilment systems underneath. Integrations with payment gateways, ERPs, and warehouse systems keep stock and orders accurate across channels. And because sales spikes are predictable in this business, we build and test for peak load, not just steady-state traffic.",
    ],
    offeringsTitle: "What we build for commerce teams",
    offeringsSubtitle:
      "Systems that connect storefront, catalog, and fulfilment into one reliable operation.",
    offerings: [
      {
        icon: "fa-shop",
        title: "Headless Storefront Development",
        description:
          "Fast, SEO-friendly storefronts decoupled from the commerce backend, so design, content, and campaign changes ship quickly without ever touching inventory, pricing, or order logic underneath.",
      },
      {
        icon: "fa-credit-card",
        title: "Checkout & Payment Optimization",
        description:
          "Streamlined checkout flows with multiple payment methods, saved details, and clear error handling, built to reduce abandonment at the exact step where most revenue is lost.",
      },
      {
        icon: "fa-boxes-stacked",
        title: "Catalog & Inventory Management",
        description:
          "Systems that keep product data, pricing, and stock levels consistent across storefront, marketplaces, and physical locations, so customers never see an item that is actually out of stock.",
      },
      {
        icon: "fa-store",
        title: "Marketplace & Multi-Channel Integration",
        description:
          "Integrations that publish and sync listings across your own storefront and third-party marketplaces, keeping pricing, inventory, and order fulfilment aligned without any manual double-entry between systems.",
      },
      {
        icon: "fa-warehouse",
        title: "ERP & WMS Integration",
        description:
          "Connections between your storefront and ERP or warehouse management systems, so orders, stock levels, and fulfilment status stay accurate all the way from checkout through to delivery.",
      },
      {
        icon: "fa-magnifying-glass",
        title: "Search & Personalization",
        description:
          "Fast, relevant on-site search and merchandising logic that surfaces the right products by intent and behaviour, instead of leaving customers to dig through categories.",
      },
    ],
    benefitsTitle: "Why commerce teams build with Ramest",
    process: [
      {
        step: "01",
        title: "Commerce Discovery",
        description:
          "Review of your catalog, channels, and current platform to identify where growth is being held back and what to fix first.",
      },
      {
        step: "02",
        title: "Architecture & UX Design",
        description:
          "Storefront, checkout, and integration architecture designed and reviewed with you before any production build begins.",
      },
      {
        step: "03",
        title: "Agile Build & Testing",
        description:
          "Two-week sprints with working demos, plus load testing against expected peak-traffic scenarios before launch.",
      },
      {
        step: "04",
        title: "Launch & Peak-Season Support",
        description:
          "Phased rollout with monitoring and hands-on support through your first major sale event or traffic spike.",
      },
    ],
    processTitle: "From storefront audit to peak-ready launch in four steps",
    processSubtitle:
      "A delivery rhythm built around conversion, catalog complexity, and seasonal load.",
    stackTitle: "Our ecommerce technology stack",
    stackSubtitle:
      "Proven platforms and tools for storefronts, payments, and peak-load delivery.",
    techStack: [
      {
        category: "Commerce Platforms",
        items: ["Shopify", "commercetools", "Medusa", "Saleor"],
      },
      {
        category: "Backend & Frontend",
        items: ["Node.js", "Next.js", "React", "TypeScript"],
      },
      {
        category: "Payments & Search",
        items: ["Stripe", "Razorpay", "PayPal", "Algolia"],
      },
      {
        category: "Cloud & DevOps",
        items: ["AWS", "Docker", "Kubernetes", "CI/CD"],
      },
    ],
    benefits: [
      {
        icon: "fa-bolt",
        title: "Checkout built to convert",
        description:
          "Every step of the purchase flow is designed to remove friction, from guest checkout to payment method choice, because small drop-offs there compound into real lost revenue.",
      },
      {
        icon: "fa-server",
        title: "Ready for peak-season traffic",
        description:
          "Storefronts and checkout paths are load-tested for sale-event traffic, not just everyday volume, so the biggest revenue days are not the ones that break the site.",
      },
      {
        icon: "fa-boxes-stacked",
        title: "One accurate view of inventory",
        description:
          "Catalog and stock data stay consistent across your storefront, marketplaces, and physical locations, so overselling and out-of-sync listings stop costing you cancelled orders.",
      },
      {
        icon: "fa-code-branch",
        title: "Freedom from platform limitations",
        description:
          "A headless, custom-built architecture means your roadmap is not capped by what a template or plugin ecosystem happens to support this quarter.",
      },
    ],
    faqSubtitle:
      "What ecommerce founders and operators ask before starting a build.",
    faqs: [
      {
        question: "How much does an ecommerce platform build cost?",
        answer:
          "Cost depends on scope — catalog complexity and the number of systems you need connected, such as ERP, WMS, or marketplace integrations. We scope every build through a consultation call, then agree a fixed quote before work begins, delivered as a fixed-scope engagement or a dedicated team. We build for businesses of every size, from a headless storefront layered on an existing platform to a fully custom storefront with deep system integrations, so a smaller, focused build is genuinely welcome.",
      },
      {
        question: "How long does an ecommerce project take to launch?",
        answer:
          "A storefront rebuild or checkout optimisation project typically takes 8–14 weeks. Larger builds involving custom catalog, multi-channel, or ERP integration usually run 4–7 months, phased so a working storefront is live well before every integration is finished, rather than launching everything at once.",
      },
      {
        question: "How do you handle payment security and PCI DSS?",
        answer:
          "We build checkout and payment flows using tokenisation and hosted payment fields from providers such as Stripe and Razorpay, which keeps raw card data off your servers and reduces PCI DSS scope. We are not a PCI DSS certification body, so for formal compliance validation we recommend working with your payment provider and a qualified assessor alongside our engineering.",
      },
      {
        question: "Can you integrate with our ERP, POS, or warehouse system?",
        answer:
          "Yes. We regularly integrate storefronts with ERP platforms such as SAP or Microsoft Dynamics, POS systems, and warehouse management software, so orders, stock, and fulfilment stay in sync. Where a system is older or has limited documentation, we start with an integration audit before committing to a build approach.",
      },
      {
        question:
          "Should we build custom or stay on Shopify or another off-the-shelf platform?",
        answer:
          "Platforms such as Shopify are a strong choice for standard catalogs and faster time to market. A custom or headless build makes more sense once your catalog, promotions, or fulfilment logic outgrow the platform's defaults, or once page speed and design flexibility start affecting conversion. Many clients run a hybrid — a platform backend with a custom storefront in front.",
      },
      {
        question: "What support is available after our store launches?",
        answer:
          "We offer support retainers covering monitoring, bug fixes, and feature development, including hands-on availability around major sale events when traffic is highest. All code and integration configuration are handed over to your team, and ownership is fully yours whether or not you continue working with us.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Logistics                                                           */
  /* ------------------------------------------------------------------ */
  "logistics": {
    heroTagline:
      "Software that gives logistics operators real-time shipment visibility, smarter routing, and far fewer costly delivery exceptions.",
    heroHighlights: [
      "Live shipment tracking",
      "TMS, WMS & carrier integrations",
      "Fewer delivery exceptions",
    ],
    overviewTitle: "Software built for the realities of logistics",
    intro: [
      "Logistics teams run on visibility, and most still don't have it. Shipment status lives in a carrier's portal, dispatch decisions happen over phone calls, and proof of delivery arrives as a photo in a messaging thread hours after the fact. Add multiple carriers, regional depots, and manual exception handling, and small delays compound into missed SLAs, disputed invoices, and customers who find out about a problem before your own team does.",
      "We build the systems that close that gap — shipment tracking that pulls from every carrier into one dashboard, routing engines that account for real operational constraints, and integrations into the TMS and WMS you already run. Partner and carrier portals give third parties a controlled way to update status without email chains, while structured proof-of-delivery and exception alerts turn 'where is it' into a question your system answers automatically, before a customer has to ask.",
    ],
    offeringsTitle: "What we build for logistics operations",
    offeringsSubtitle:
      "Systems that connect carriers, warehouses, and partners into one operational picture.",
    offerings: [
      {
        icon: "fa-location-dot",
        title: "Shipment Tracking & Visibility",
        description:
          "A unified tracking layer that pulls status updates from multiple carriers and depots into one live view, replacing manual check-calls and spreadsheet trackers with a dashboard your ops team can trust.",
      },
      {
        icon: "fa-route",
        title: "Route & Fleet Optimization",
        description:
          "Routing engines that factor in delivery windows, vehicle capacity, driver hours, and live traffic conditions, cutting fuel and time costs while keeping dispatchers in control of exceptions.",
      },
      {
        icon: "fa-warehouse",
        title: "TMS & WMS Integration",
        description:
          "Two-way integration between your transportation and warehouse management systems, so orders, inventory movements, and shipment status stay consistent everywhere without duplicate manual data entry or reconciliation work.",
      },
      {
        icon: "fa-handshake",
        title: "Carrier & Partner Portals",
        description:
          "Self-service portals for carriers, 3PLs, and partners to accept loads, update status, and upload documents directly — removing the email and phone-call overhead of coordinating with your network.",
      },
      {
        icon: "fa-file-signature",
        title: "Proof-of-Delivery & Digital Documentation",
        description:
          "Digital capture of signatures, photos, and delivery timestamps that attach automatically to the shipment record, giving you defensible documentation for disputes, claims, and customer service.",
      },
      {
        icon: "fa-triangle-exclamation",
        title: "Exception Management & Alerting",
        description:
          "Automated detection of delays, failed deliveries, and route deviations, with alerts routed to the right team so exceptions get resolved before they become a customer complaint or a lost SLA.",
      },
    ],
    benefitsTitle: "Why logistics teams build with Ramest",
    benefits: [
      {
        icon: "fa-gauge-high",
        title: "Fewer manual touchpoints",
        description:
          "Automated status updates and integrations remove the check-calls, spreadsheets, and re-keyed data that slow logistics teams down, freeing dispatchers to manage exceptions instead of chasing information.",
      },
      {
        icon: "fa-chart-line",
        title: "Decisions made on live data",
        description:
          "Dashboards built from real-time carrier and fleet data give operations leaders an accurate picture of what is moving, what is delayed, and where to intervene next.",
      },
      {
        icon: "fa-handshake-angle",
        title: "Stronger accountability with partners",
        description:
          "Structured portals and digital proof-of-delivery create a shared, timestamped record with carriers and 3PLs, reducing disputed invoices and making service-level conversations fact-based rather than anecdotal.",
      },
      {
        icon: "fa-boxes-stacked",
        title: "Built to handle peak volume",
        description:
          "Architecture designed for seasonal spikes and multi-region scale, so a surge in shipment volume degrades gracefully instead of taking tracking and dispatch systems offline.",
      },
    ],
    processTitle: "From audit to network-wide rollout",
    processSubtitle:
      "A delivery rhythm built around proving value on a subset of routes before scaling.",
    process: [
      {
        step: "01",
        title: "Discovery & Systems Audit",
        description:
          "Mapping your current carriers, routes, and systems — including the TMS, WMS, and spreadsheets already in use — to define scope, integration points, and success metrics.",
      },
      {
        step: "02",
        title: "Integration Architecture",
        description:
          "Designing how tracking, routing, and partner data will flow between systems, reviewed with your operations team before any integration work begins.",
      },
      {
        step: "03",
        title: "Agile Build & Pilot",
        description:
          "Building in two-week sprints with a working pilot on a subset of routes or carriers, so the system is proven under real operating conditions before full rollout.",
      },
      {
        step: "04",
        title: "Rollout & Scale-Up",
        description:
          "Phased rollout across the rest of your network, with monitoring, support, and a roadmap for the next set of carriers, regions, or automation.",
      },
    ],
    stackTitle: "Our logistics engineering stack",
    stackSubtitle:
      "Proven technologies for tracking, routing, and system-to-system integration.",
    techStack: [
      {
        category: "Backend & Integration",
        items: ["Node.js", "Python", "REST & SOAP APIs", "Kafka", "EDI"],
      },
      {
        category: "Mapping & Routing",
        items: ["Google Maps Platform", "Mapbox", "OR-Tools", "GraphHopper"],
      },
      {
        category: "Data & Infrastructure",
        items: ["PostgreSQL", "Redis", "AWS", "Docker"],
      },
      {
        category: "Logistics Integrations",
        items: [
          "TMS platforms",
          "WMS platforms",
          "Carrier APIs (FedEx, UPS, DHL)",
          "EDI/ASN gateways",
        ],
      },
    ],
    faqSubtitle:
      "What operations leaders ask before starting a logistics software project.",
    faqs: [
      {
        question: "How much does a logistics software project cost?",
        answer:
          "Cost depends on scope — the number of carrier and system integrations, real-time tracking requirements, and how many regions or depots are involved. We scope every project through a consultation call, then agree a fixed quote before work begins, delivered as a fixed-scope engagement or a dedicated team. We build for businesses of every size, from a single shipment-tracking dashboard or carrier portal to a full multi-carrier TMS and WMS integration platform, so a smaller, focused project is genuinely welcome.",
      },
      {
        question: "How long does it take to build a logistics platform?",
        answer:
          "A tracking dashboard or single-carrier integration typically ships in 8–12 weeks. A platform integrating multiple carriers, a TMS, and a WMS usually takes 4–7 months, delivered in phases so a working pilot is live on a subset of routes well before the full network rollout begins.",
      },
      {
        question:
          "Does the software need to handle customs, EDI, or e-way bill compliance?",
        answer:
          "Where relevant, yes. For domestic Indian freight we build in e-way bill and GST-compliant documentation flows; for cross-border shipments we integrate standard EDI formats used by carriers and customs systems. Regulatory requirements vary by lane and cargo type, so we recommend your compliance or logistics counsel review the specific documentation flows before go-live.",
      },
      {
        question:
          "Which systems can you integrate with — our TMS, WMS, or carrier accounts?",
        answer:
          "All three. We integrate with existing transportation management and warehouse management systems, connect directly to carrier APIs and EDI feeds for tracking and rate data, and build custom adapters where a partner only offers a portal or file-based interface. The goal is one consistent data layer, not another disconnected tool.",
      },
      {
        question:
          "Should we build custom software or use an off-the-shelf TMS?",
        answer:
          "Off-the-shelf TMS platforms are a reasonable starting point if your workflows are standard and your carrier mix is small. Custom software makes sense once you are integrating multiple carriers, warehouses, or partner portals with rules specific to your operation — that is where the licensing and customization limits of packaged platforms tend to show up.",
      },
      {
        question: "What happens after the logistics platform goes live?",
        answer:
          "You own the code, integrations, and infrastructure outright. We offer support retainers covering monitoring, carrier API changes, and new integrations as your network grows, and most clients keep the same engineering team so operational knowledge of your routes and partners is not lost at handover.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Retail                                                              */
  /* ------------------------------------------------------------------ */
  "retail": {
    heroTagline:
      "Retail software that keeps inventory, POS, and online channels in sync so every customer sees one accurate store.",
    heroHighlights: [
      "Real-time inventory sync",
      "POS, ERP & storefront integration",
      "Built for peak-season traffic",
    ],
    overviewTitle: "Software built for how retail actually operates",
    intro: [
      "Retail breaks down at the seams between systems. A sale rings up in-store before the website knows the item is gone, a promotion applies at checkout but not in the loyalty app, and a stock count in the ERP never quite matches what is on the shelf. Customers notice these gaps immediately — an item marked available that cannot be fulfilled, a discount that will not apply, a loyalty point that never lands. Each one erodes trust a little further, and most retailers are patching symptoms rather than fixing the underlying data flow.",
      "We build the integration layer that keeps POS, inventory, ERP, and storefront in agreement, along with the loyalty, promotions, and analytics systems retail teams need to compete. That means real-time stock sync across channels, checkout flows that hold up during peak traffic, and a single source of truth your merchandising and store teams can actually rely on — instead of reconciling spreadsheets after the fact.",
    ],
    offeringsTitle: "What we build for retail operations",
    offeringsSubtitle:
      "Systems that connect stores, warehouses, and digital channels into one operating model.",
    offerings: [
      {
        icon: "fa-cash-register",
        title: "POS & Checkout Integration",
        description:
          "Connecting in-store point-of-sale, online checkout, and payment processing into one transaction flow, so pricing, promotions, and inventory deductions stay consistent across every channel a customer buys through.",
      },
      {
        icon: "fa-boxes-stacked",
        title: "Inventory & Stock Synchronization",
        description:
          "Real-time stock levels shared across stores, warehouses, and the online storefront, eliminating the overselling and phantom-stock problems that come from systems updating on different schedules.",
      },
      {
        icon: "fa-store",
        title: "Omnichannel Storefronts",
        description:
          "Web and app storefronts built to reflect accurate stock, pricing, and promotions from the same backend that runs your physical stores, so the brand experience is consistent everywhere.",
      },
      {
        icon: "fa-gift",
        title: "Loyalty & Promotions Engines",
        description:
          "Rules-based loyalty and promotion systems that apply consistently at checkout, in-store, and online, with the reporting merchandising teams need to see what campaigns are actually driving sales.",
      },
      {
        icon: "fa-network-wired",
        title: "ERP & Order Management Integration",
        description:
          "Integration between your ERP, order management, and fulfillment systems so orders, returns, and stock adjustments flow through automatically instead of being re-entered by hand across departments.",
      },
      {
        icon: "fa-chart-line",
        title: "Retail Analytics & Demand Forecasting",
        description:
          "Dashboards and forecasting models built on unified sales and inventory data, giving buying and merchandising teams a clearer read on demand ahead of promotions and seasonal peaks.",
      },
    ],
    benefitsTitle: "Why retail brands build with Ramest",
    benefits: [
      {
        icon: "fa-warehouse",
        title: "One accurate view of stock",
        description:
          "A single source of truth for inventory across every channel removes the overselling, cancelled orders, and manual reconciliation that come from systems that do not talk to each other.",
      },
      {
        icon: "fa-shop",
        title: "Consistent experience across channels",
        description:
          "Customers see the same pricing, promotions, and stock availability whether they are in-store, on the app, or on the website, which builds trust and reduces support tickets.",
      },
      {
        icon: "fa-bolt",
        title: "Built to survive peak traffic",
        description:
          "Checkout and inventory systems architected to hold up under seasonal and campaign-driven spikes, so a good sales day never becomes a site outage or an overselling problem.",
      },
      {
        icon: "fa-tags",
        title: "Faster promotions to market",
        description:
          "A flexible promotions and loyalty layer means new campaigns launch in days rather than weeks, without engineering re-work every time merchandising wants to run something new.",
      },
    ],
    processTitle: "From systems audit to peak-ready rollout",
    processSubtitle:
      "A delivery rhythm built around proving integrations before a full-channel launch.",
    process: [
      {
        step: "01",
        title: "Discovery & Systems Mapping",
        description:
          "Auditing your current POS, ERP, inventory, and storefront setup to understand where data breaks down, and defining the scope and integration points for the project.",
      },
      {
        step: "02",
        title: "Integration & Architecture Design",
        description:
          "Designing the data flow between systems and the storefront experience, reviewed with merchandising and operations stakeholders before build begins.",
      },
      {
        step: "03",
        title: "Agile Build & Pilot",
        description:
          "Two-week sprints with a working pilot — often a single store or product category — so the integration is proven under real transaction volume before wider rollout.",
      },
      {
        step: "04",
        title: "Launch & Peak Readiness",
        description:
          "Full rollout with load testing ahead of peak seasons, monitoring, and an improvement roadmap driven by real sales and inventory data.",
      },
    ],
    stackTitle: "Our retail engineering stack",
    stackSubtitle:
      "Proven technologies for commerce, storefronts, and system-to-system integration.",
    techStack: [
      {
        category: "Backend & Commerce",
        items: ["Node.js", "Python", "Headless Commerce APIs", "GraphQL"],
      },
      {
        category: "Frontend",
        items: ["Next.js", "React", "TypeScript"],
      },
      {
        category: "Retail Systems",
        items: [
          "POS integrations",
          "ERP (SAP, NetSuite)",
          "Inventory/WMS",
          "Payment gateways",
        ],
      },
      {
        category: "Cloud & Data",
        items: ["AWS", "PostgreSQL", "Redis", "Elasticsearch"],
      },
    ],
    faqSubtitle:
      "What retail operators ask before starting an integration or platform build.",
    faqs: [
      {
        question: "How much does retail software integration cost?",
        answer:
          "Cost depends on scope — the number of store locations, how many systems need connecting, and the overall integration complexity involved. We scope every project through a consultation call, then agree a fixed quote before work begins, delivered as a fixed-scope engagement or a dedicated team. We build for retailers of every size, from a single project such as syncing POS and online inventory to a full omnichannel platform across POS, ERP, and storefront, so a smaller, focused project is genuinely welcome.",
      },
      {
        question: "How long does a retail integration take to build?",
        answer:
          "A single integration, such as connecting POS to your online store, typically ships in 6–10 weeks. A full omnichannel platform spanning POS, ERP, and storefront is usually delivered in 4–8 months, phased so each integration goes live and is validated before the next one begins.",
      },
      {
        question: "Does the platform need to be PCI DSS compliant?",
        answer:
          "Any system handling card payments needs to meet PCI DSS requirements, and we design checkout and payment flows to keep card data within compliant processors rather than your own systems wherever possible. For customer data more broadly, we build with India's DPDP Act 2023 in mind, but formal compliance sign-off should sit with your own security and legal counsel.",
      },
      {
        question:
          "Which retail systems can you integrate — our POS, ERP, or inventory tools?",
        answer:
          "All of them. We connect point-of-sale systems, ERP platforms such as SAP or NetSuite, warehouse and inventory management tools, and payment gateways into one consistent data layer, along with storefront, loyalty, and analytics systems. Where a vendor only exposes a file export or limited API, we build the adapter to bridge it.",
      },
      {
        question:
          "Should we customize an existing platform like Shopify or build custom retail software?",
        answer:
          "Platforms such as Shopify are a strong starting point for straightforward storefronts and smaller catalogs. Custom software becomes the better option once you are integrating multiple systems — POS, ERP, loyalty, multi-location inventory — in ways the platform was not built for, or once transaction volume and customization needs outgrow what a packaged plan allows.",
      },
      {
        question: "What support do we get after the retail platform launches?",
        answer:
          "You own the code and integrations outright. We offer support retainers for monitoring, seasonal load testing, and new integrations as your channel mix grows, and most clients retain the same team that built the platform so institutional knowledge of your systems is not lost after handover.",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Healthcare                                                          */
  /* ------------------------------------------------------------------ */
  "healthcare": {
    heroTagline:
      "Health-tech software engineered for accurate patient data, interoperable records, and dependable clinical workflows.",
    heroHighlights: [
      "HL7 FHIR-ready integrations",
      "Built to HIPAA & DPDP requirements",
      "Secure-by-design architecture",
    ],
    overviewTitle: "Software for healthcare, where data accuracy is not optional",
    intro: [
      "Healthcare runs on records that have to be accurate, available, and auditable at the same time — and most organizations are held back by systems that do not talk to each other. Patient data sits in one EHR, referrals move by fax or email, intake forms get re-entered by hand, and a telehealth visit generates a note that never makes it back into the primary record. The result is duplicated work for staff, delayed information for care teams, and a growing compliance burden that manual processes cannot keep up with.",
      "We build the software layer that connects these pieces without compromising on privacy or reliability — patient portals, telehealth platforms, and data pipelines that speak HL7 FHIR to your EHR/EMR rather than working around it. Every system is designed with access control, audit logging, and encryption from the first architecture decision, so the platform holds up to the scrutiny healthcare data demands, not just at launch but as it scales.",
    ],
    offeringsTitle: "What we build for healthcare organizations",
    offeringsSubtitle:
      "Software that connects care teams, patients, and clinical systems securely.",
    offerings: [
      {
        icon: "fa-hospital-user",
        title: "Patient Portals & Intake",
        description:
          "Self-service portals for scheduling, intake forms, and record access that reduce front-desk workload and give patients a single, secure place to manage their own information.",
      },
      {
        icon: "fa-video",
        title: "Telehealth Platforms",
        description:
          "Video consultation platforms with secure scheduling, waiting rooms, and session notes that flow back into the patient record instead of living in a separate system.",
      },
      {
        icon: "fa-file-medical",
        title: "EHR/EMR Integration (HL7 FHIR)",
        description:
          "Integration with existing EHR and EMR systems using HL7 FHIR and HL7 v2 messaging, so new applications exchange data with clinical systems instead of duplicating them.",
      },
      {
        icon: "fa-network-wired",
        title: "Clinical Data Pipelines & Interoperability",
        description:
          "Data pipelines that move lab results, referrals, and clinical documents between systems reliably, with the mapping and validation needed to keep records consistent across sources.",
      },
      {
        icon: "fa-calendar-check",
        title: "Appointment & Care Coordination Systems",
        description:
          "Scheduling and coordination tools that connect providers, patients, and care teams, cutting down on missed appointments and the manual follow-up that comes with fragmented calendars.",
      },
      {
        icon: "fa-shield-halved",
        title: "Secure Health Data Infrastructure",
        description:
          "Encrypted storage, role-based access control, and detailed audit logging built into the infrastructure layer from day one, so sensitive health data stays protected and every access remains traceable.",
      },
    ],
    benefitsTitle: "Why healthcare teams build with Ramest",
    benefits: [
      {
        icon: "fa-network-wired",
        title: "Interoperability by design",
        description:
          "Systems built on HL7 FHIR from the start exchange data with your existing EHR and lab systems cleanly, instead of needing a rebuild every time a new integration is required.",
      },
      {
        icon: "fa-lock",
        title: "Privacy-first architecture",
        description:
          "Access control, encryption, and audit logging are part of the initial architecture, not an afterthought, reducing the risk of the data exposure incidents that damage patient trust.",
      },
      {
        icon: "fa-heart-pulse",
        title: "Built for operational reliability",
        description:
          "Care teams depend on systems being available when a patient is in front of them, so we engineer for uptime, data consistency, and graceful handling of system failures.",
      },
      {
        icon: "fa-user-nurse",
        title: "Faster workflows for care teams",
        description:
          "Reducing duplicate data entry and manual reconciliation between systems gives clinical and administrative staff more time for patient-facing work instead of chasing information across tools.",
      },
    ],
    processTitle: "From compliance mapping to continuous support",
    processSubtitle:
      "A delivery rhythm that treats security and interoperability as first-class requirements.",
    process: [
      {
        step: "01",
        title: "Discovery & Compliance Mapping",
        description:
          "Understanding your current systems, data flows, and regulatory obligations — including which HIPAA or DPDP requirements apply — to define scope before any build work starts.",
      },
      {
        step: "02",
        title: "Architecture & Data Design",
        description:
          "Designing how patient data moves between systems, including HL7 FHIR mappings and access control models, reviewed with your team and compliance stakeholders.",
      },
      {
        step: "03",
        title: "Agile Build & Review",
        description:
          "Two-week sprints with working demos, automated testing, and security review built into every release rather than left until the end.",
      },
      {
        step: "04",
        title: "Launch & Continuous Support",
        description:
          "Phased rollout with monitoring, audit logging verification, and an ongoing support plan for updates, new integrations, and evolving compliance needs.",
      },
    ],
    stackTitle: "Our healthcare engineering stack",
    stackSubtitle:
      "Proven technologies for interoperability, security, and clinical-grade reliability.",
    techStack: [
      {
        category: "Backend",
        items: ["Node.js", "Python", "Java", "HL7 FHIR APIs"],
      },
      {
        category: "Frontend",
        items: ["React", "Next.js", "TypeScript"],
      },
      {
        category: "Data & Interoperability",
        items: [
          "HL7 v2 & FHIR",
          "PostgreSQL",
          "Encrypted storage",
          "ABDM-aligned APIs",
        ],
      },
      {
        category: "Cloud & Security",
        items: ["AWS", "Azure", "Docker", "Kubernetes", "Audit logging"],
      },
    ],
    faqSubtitle:
      "What healthcare leaders ask before starting a software or integration project.",
    faqs: [
      {
        question: "How much does healthcare software development cost?",
        answer:
          "Cost depends on scope — integration complexity, the number of EHR and EMR systems involved, and how demanding your compliance requirements are. We scope every project through a consultation call, then agree a fixed quote before work begins, delivered as a fixed-scope engagement or a dedicated team. We build for organisations of every size, from a focused patient portal or telehealth scheduling module to a full platform with EHR integration and multi-role access control, so a smaller, focused build is genuinely welcome.",
      },
      {
        question: "How long does a healthcare software project take?",
        answer:
          "A patient portal or telehealth module typically ships in 10–14 weeks. A platform involving EHR integration and clinical data pipelines usually takes 5–9 months, delivered in phases with security and compliance review built into each stage rather than left until the very end.",
      },
      {
        question: "Is the software HIPAA compliant?",
        answer:
          "We build applications to meet HIPAA requirements for US-based covered entities and business associates — access controls, encryption, and audit logging are standard practice in every build. Note that HIPAA is a compliance obligation, not a certification, so there is no such thing as being 'HIPAA certified'. For India, we design to the DPDP Act 2023 and ABDM standards where applicable. Your own compliance and legal counsel should review and sign off on the final implementation.",
      },
      {
        question: "Can you integrate with our EHR or EMR system?",
        answer:
          "In most cases, yes. We work with HL7 FHIR and HL7 v2 messaging to integrate with existing EHR and EMR platforms, lab systems, and pharmacy systems, and build custom adapters where a vendor only exposes a limited API. The specific integration path depends on what your current system supports.",
      },
      {
        question:
          "Should we buy an off-the-shelf EHR platform or build custom software?",
        answer:
          "Established EHR platforms make sense for core clinical record-keeping, where reinventing the wheel adds risk without benefit. Custom software fits better around that core — patient portals, telehealth, referral workflows, or analytics — where your processes do not match what a packaged system offers, and where FHIR-based integration lets the two coexist rather than compete.",
      },
      {
        question: "What happens after the healthcare platform goes live?",
        answer:
          "You own the code, data architecture, and infrastructure outright. We offer support retainers covering monitoring, security patching, and new integrations as your compliance and clinical needs evolve, and most clients keep the same team so institutional knowledge of the system and its data flows is not lost.",
      },
    ],
  },
};

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return serviceDetails[slug];
}
