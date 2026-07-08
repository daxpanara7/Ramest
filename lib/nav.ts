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
