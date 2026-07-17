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
};

export function getServiceDetail(slug: string): ServiceDetail | undefined {
  return serviceDetails[slug];
}
