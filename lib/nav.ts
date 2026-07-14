export type NavPage =
  | "home"
  | "services"
  | "hire-developers"
  | "company"
  | "about"
  | "team"
  | "infrastructure"
  | "certifications"
  | "careers"
  | "contact";

const PATH_TO_PAGE: Record<string, NavPage> = {
  "/": "home",
  "/services": "services",
  "/hire-developers": "hire-developers",
  "/company": "company",
  "/about": "about",
  "/team": "team",
  "/infrastructure": "infrastructure",
  "/certifications": "certifications",
  "/careers": "careers",
  "/contact": "contact",
};

/** Map the current URL to a nav active-page key. */
export function getNavPageFromPath(pathname: string): NavPage {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  return PATH_TO_PAGE[normalized] ?? "home";
}

export const companyDropdown = [
  {
    href: "/about",
    icon: "fa-building-columns",
    title: "About Us",
    sub: "Transforming challenges into opportunities with tech.",
  },
  {
    href: "/infrastructure",
    icon: "fa-server",
    title: "Our Infrastructure",
    sub: "Tech capabilities for scalable and reliable solutions.",
  },
  {
    href: "/team",
    icon: "fa-people-group",
    title: "Our Team",
    sub: "Dedicated experts transforming ideas into powerful digital solutions.",
  },
  {
    href: "/certifications",
    icon: "fa-award",
    title: "Certifications",
    sub: "Industry-recognized certifications backing our quality.",
  },
  {
    href: "/careers",
    icon: "fa-briefcase",
    title: "Career Overview",
    sub: "Grow with us and build rewarding careers.",
  },
  {
    href: "/contact",
    icon: "fa-envelope-open-text",
    title: "Contact Us",
    sub: "Connect with Ramest to bring your tech ideas to life.",
  },
] as const;

/** Icons used on the company overview grid (page uses slightly different FA icons). */
export const companyOverviewItems = [
  {
    href: "/about",
    icon: "fa-building",
    title: "About Us",
    sub: "Transforming challenges into opportunities with tech.",
  },
  {
    href: "/infrastructure",
    icon: "fa-server",
    title: "Our Infrastructure",
    sub: "Tech capabilities for scalable and reliable solutions.",
  },
  {
    href: "/team",
    icon: "fa-users",
    title: "Our Team",
    sub: "Dedicated experts transforming ideas into powerful digital solutions.",
  },
  {
    href: "/certifications",
    icon: "fa-certificate",
    title: "Certifications",
    sub: "Industry-recognized certifications backing our commitment to quality.",
  },
  {
    href: "/careers",
    icon: "fa-briefcase",
    title: "Career Overview",
    sub: "Grow with us and build rewarding careers with creative cohorts.",
  },
  {
    href: "/contact",
    icon: "fa-envelope",
    title: "Contact Us",
    sub: "Connect with Ramest Technolabs to bring your tech ideas to life.",
  },
] as const;

export const companyPages: NavPage[] = [
  "company",
  "about",
  "team",
  "infrastructure",
  "certifications",
  "careers",
  "contact",
];

export function isCompanyActive(page: NavPage) {
  return companyPages.includes(page);
}

/** Routes included in sitemap / crawl surface. */
export const sitemapRoutes = [
  "/",
  "/services",
  "/hire-developers",
  "/company",
  "/about",
  "/team",
  "/infrastructure",
  "/certifications",
  "/careers",
  "/contact",
] as const;
