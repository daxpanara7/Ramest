import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import ClientEffects from "@/components/ClientEffects";
import JsonLd from "@/components/JsonLd";
import SiteFrame from "@/components/SiteFrame";
import { REVEAL_BOOTSTRAP } from "@/lib/reveal-bootstrap";
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

            Preloaded at normal (High) priority, and it has to stay that way.

            This font is 16 KB in an opening burst of ~130 KB — two text
            faces, both stylesheets, the logo — all contending for a 1.6 Mbps
            link, which is what delays the real LCP element behind it.
            Removing the preload is worth ~300ms of LCP, so it is tempting.

            It was measured, twice, and rejected both times. Without the
            preload (and equally with fetchPriority="low") the glyphs arrive
            AFTER first paint, the icons widen from nothing to their real
            advance, and one element jumps ~2.6px. That is a real layout shift
            — small, but this site is specifically not supposed to have any,
            and 1 Lighthouse point is not worth reintroducing one.

            The bandwidth was recovered from the header logo instead, which
            was shipping a 528px-wide asset into a 174px-wide slot. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="/fa/fa-solid-900.woff2"
        />
        {/* A normal render-blocking <link>, deliberately.

            It used to be inserted by a script, which meant it did not block
            first paint — but it also did not ARRIVE by first paint, so every
            `<i class="fa-solid …">` was an unstyled zero-width element when
            the page was first laid out, and every button holding one reflowed
            once the sheet landed. That pop is a real layout shift on a cold
            load.

            Inlining it into <head> fixed the pop but cost more than it saved:
            the subset adds ~9 KB to every HTML response, and on a small page
            that is a 60% larger render-blocking document — measured as ~900ms
            of extra LCP on /team and /about.

            Linking gets both. The file is ~4 KB over the wire, same-origin,
            and is fetched in parallel with the main stylesheet on the same
            connection — so the render-blocking window is still set by the
            28 KB app CSS, not by this. It is also cached once and reused on
            every subsequent page, which an inline copy can never be. */}
        <link rel="stylesheet" href="/fa/fa.min.css" />
        {/* Scroll-reveal bootstrap. Must run before first paint and before
            hydration — see lib/reveal-bootstrap.ts for why this cannot be a
            React effect. */}
        <script dangerouslySetInnerHTML={{ __html: REVEAL_BOOTSTRAP }} />
      </head>
      <body className={inter.className}>
        <SiteFrame>{children}</SiteFrame>
        <ClientEffects />
        <JsonLd />
      </body>
    </html>
  );
}
