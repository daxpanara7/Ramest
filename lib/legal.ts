import { SITE } from "@/lib/site";

/**
 * Terms and Privacy content lives here (not inside the page components) so
 * both routes, the tab UI, and the JSON-LD all read the same source and can
 * never drift apart.
 */

export type LegalBlock =
  | { kind: "text"; body: string }
  | { kind: "list"; items: string[] }
  | { kind: "subhead"; body: string };

export type LegalSection = {
  /** Stable slug — used for the in-page anchor and the "on this page" nav. */
  id: string;
  title: string;
  blocks: LegalBlock[];
};

export const LEGAL_TABS = [
  { key: "terms", label: "Terms & Conditions", href: "/legal" },
  { key: "privacy", label: "Privacy Policy", href: "/legal/privacy" },
] as const;

export type LegalTabKey = (typeof LEGAL_TABS)[number]["key"];

/** Canonical path for a legal document. Each has its own static route — see
 *  components/legal/LegalDocument.tsx for why they are not one `?tab=` page. */
export function legalPath(doc: LegalTabKey): string {
  return doc === "privacy" ? "/legal/privacy" : "/legal";
}

export function legalHeading(doc: LegalTabKey): string {
  return doc === "privacy" ? "Privacy Policy" : "Terms and Conditions";
}

/** Single source for the description used by both <head> and the JSON-LD, so
 *  the two can never drift apart. */
export function legalDescription(doc: LegalTabKey): string {
  return doc === "privacy"
    ? `How ${SITE.name} collects, uses, stores, and protects your personal information, and the rights you have over your data.`
    : `The terms that govern your use of the ${SITE.name} website, including intellectual property, user content, and liability.`;
}

const FULL_ADDRESS = `${SITE.address.street}, ${SITE.address.city}, ${SITE.address.region} ${SITE.address.postalCode}, India`;

export const TERMS_UPDATED = "2026-07-30";
export const PRIVACY_UPDATED = "2026-07-30";

export const TERMS_INTRO = `Welcome to ${SITE.name}. By accessing or using our website, you agree to these Terms and Conditions.`;

export const TERMS_SECTIONS: LegalSection[] = [
  {
    id: "use-of-website",
    title: "Use of Website",
    blocks: [
      {
        kind: "text",
        body: "You agree to use this website only for lawful purposes and not to misuse or disrupt our services.",
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    blocks: [
      {
        kind: "text",
        body: `All content on this website (text, images, logos) is the property of ${SITE.name} and may not be used without permission.`,
      },
    ],
  },
  {
    id: "user-content",
    title: "User Content",
    blocks: [
      {
        kind: "text",
        body: "If you submit any content, you grant us the right to use, modify, and display it as needed.",
      },
    ],
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    blocks: [
      {
        kind: "text",
        body: "We are not responsible for any damages resulting from your use of our website.",
      },
    ],
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    blocks: [
      {
        kind: "text",
        body: "Our website may contain links to third-party sites. We are not responsible for their content or practices.",
      },
    ],
  },
  {
    id: "termination",
    title: "Termination",
    blocks: [
      {
        kind: "text",
        body: "We may suspend or terminate access to our website at any time without notice.",
      },
    ],
  },
  {
    id: "changes-to-terms",
    title: "Changes to Terms",
    blocks: [
      {
        kind: "text",
        body: "We may update these Terms from time to time. Continued use of the website means you accept the changes.",
      },
    ],
  },
  {
    id: "terms-contact",
    title: "Contact Us",
    blocks: [
      {
        kind: "text",
        body: `If you have any questions, contact us at ${SITE.email}.`,
      },
    ],
  },
];

export const PRIVACY_INTRO = `Welcome to ${SITE.name}. We respect your privacy and are committed to protecting your personal information.`;

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    id: "information-we-collect",
    title: "Information We Collect",
    blocks: [
      { kind: "subhead", body: "a. Personal Information" },
      {
        kind: "list",
        items: [
          "Name",
          "Email address",
          "Phone number",
          "Billing and shipping address",
        ],
      },
      { kind: "subhead", body: "b. Usage Data" },
      {
        kind: "list",
        items: [
          "IP address",
          "Browser type and version",
          "Pages visited",
          "Time and date visited",
          "Device information",
        ],
      },
      { kind: "subhead", body: "c. Cookies and Tracking Technologies" },
      {
        kind: "text",
        body: "We use cookies and similar tracking technologies to track activity on our website and store certain information.",
      },
    ],
  },
  {
    id: "how-we-use-your-information",
    title: "How We Use Your Information",
    blocks: [
      {
        kind: "list",
        items: [
          "To provide and maintain our service",
          "To improve user experience",
          "To communicate with you (emails, notifications)",
          "To process transactions",
          "To detect and prevent fraud",
        ],
      },
    ],
  },
  {
    id: "sharing-your-information",
    title: "Sharing Your Information",
    blocks: [
      {
        kind: "list",
        items: [
          "With service providers (hosting, analytics, payment processing)",
          "To comply with legal obligations",
          "In case of business transfers (merger, acquisition, etc.)",
        ],
      },
      { kind: "text", body: "We do not sell your personal data." },
    ],
  },
  {
    id: "data-retention",
    title: "Data Retention",
    blocks: [
      {
        kind: "text",
        body: "We retain your personal information only for as long as necessary for the purposes outlined in this policy.",
      },
    ],
  },
  {
    id: "data-security",
    title: "Data Security",
    blocks: [
      {
        kind: "text",
        body: "We implement reasonable security measures to protect your data. However, no method of transmission over the internet is 100% secure.",
      },
    ],
  },
  {
    id: "your-rights",
    title: "Your Rights",
    blocks: [
      {
        kind: "list",
        items: [
          "Access your personal data",
          "Correct inaccurate data",
          "Request deletion of your data",
          "Withdraw consent",
        ],
      },
      {
        kind: "text",
        body: `To exercise these rights, contact us at ${SITE.email}.`,
      },
    ],
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    blocks: [
      {
        kind: "text",
        body: "Our website may contain links to third-party websites. We are not responsible for their privacy practices.",
      },
    ],
  },
  {
    id: "childrens-privacy",
    title: "Children’s Privacy",
    blocks: [
      {
        kind: "text",
        body: "Our service is not intended for children under the age of 13. We do not knowingly collect personal data from children.",
      },
    ],
  },
  {
    id: "changes-to-this-policy",
    title: "Changes to This Privacy Policy",
    blocks: [
      {
        kind: "text",
        body: "We may update our Privacy Policy from time to time. Changes will be posted on this page with an updated date.",
      },
    ],
  },
  {
    id: "privacy-contact",
    title: "Contact Us",
    blocks: [
      { kind: "text", body: `Email: ${SITE.email}` },
      { kind: "text", body: `Address: ${FULL_ADDRESS}` },
    ],
  },
];

/** Human-readable date for display, ISO for <time dateTime>. */
export function formatLegalDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
