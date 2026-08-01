import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import ClientEffects from "@/components/ClientEffects";
import JsonLd from "@/components/JsonLd";
import SiteFrame from "@/components/SiteFrame";
import { SITE } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body-face",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-title-face",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | Innovative IT Solutions`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  keywords: [
    "Ramest Technolabs",
    "web development",
    "app development",
    "UI/UX design",
    "AI ML solutions",
    "hire Python developers",
    "custom software",
    "Ahmedabad IT company",
  ],
  openGraph: {
    type: "website",
    locale: SITE.locale,
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.name} | Innovative IT Solutions`,
    description: SITE.description,
    images: [{ url: SITE.logo, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE.name} | Innovative IT Solutions`,
    description: SITE.description,
    images: [SITE.logo],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: [
      "cf2_ytGipaVAeIdqZGF6DskXw2uKAecpcHyix1xEhjI",
      "PGNU_Ziblb4UjMQLynA4OHwgA4K4kjMNyQ0A4-P7jYg",
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0357A8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${grotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        {/* Font Awesome is self-hosted (public/fa). It used to come from
            cdnjs, which cost a separate DNS + TLS handshake and put the icon
            font at the end of a 3-hop chain — 705ms and the longest path in
            the Lighthouse trace. Same-origin means it reuses the existing
            HTTP/2 connection, and the Brands/Regular faces (which nothing
            renders) are stripped out entirely.

            Preload so the font is fetched in parallel with the stylesheet
            rather than discovered through it. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="/fa/fa-solid-900.woff2"
        />
        {/* Non-render-blocking: script-inserted stylesheets never block first
            paint, and this lives outside React's tree so there is no
            hydration diff. <noscript> keeps icons working without JS. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='/fa/fa.min.css';document.head.appendChild(l);})();",
          }}
        />
        <noscript>
          <link rel="stylesheet" href="/fa/fa.min.css" />
        </noscript>
      </head>
      <body className={inter.className}>
        <SiteFrame>{children}</SiteFrame>
        <ClientEffects />
        <JsonLd />
      </body>
    </html>
  );
}
