import type { Metadata } from "next";

export const SITE = {
  name: "Ramest Technolabs",
  legalName: "Ramest Technolabs",
  url: "https://www.ramesttechnolabs.com",
  email: "hr@ramesttechnolabs.com",
  phone: "+919510903725",
  phoneDisplay: "+91 9510903725",
  address: {
    street: "RE11 - 2nd Floor, Iscon, Ambli Rd",
    city: "Ahmedabad",
    region: "Gujarat",
    postalCode: "380058",
    country: "IN",
  },
  description:
    "Ramest Technolabs - Leading IT company providing Web Development, App Development, UI/UX Design, and AI/ML Solutions to transform your business.",
  logo: "/assets/logo_final.png",
  locale: "en_IN",
} as const;

type PageMetaInput = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  /** When true, use title as-is (no template suffix). Default false. */
  absoluteTitle?: boolean;
};

/** Consistent Metadata for every page — titles, OG, Twitter, canonical. */
export function createPageMetadata({
  title,
  description,
  path = "/",
  image = SITE.logo,
  absoluteTitle = false,
}: PageMetaInput): Metadata {
  const url = path === "/" ? SITE.url : `${SITE.url}${path}`;
  const ogTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: SITE.locale,
      url,
      siteName: SITE.name,
      title: ogTitle,
      description,
      images: [{ url: image, alt: SITE.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}${SITE.logo}`,
    email: SITE.email,
    telephone: SITE.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    sameAs: [] as string[],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phoneDisplay,
      contactType: "customer service",
      email: SITE.email,
      areaServed: "Worldwide",
      availableLanguage: ["English", "Hindi"],
    },
  };
}
