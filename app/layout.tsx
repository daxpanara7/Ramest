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
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="" />
        {/* Preload the only icon font actually used (fa-solid) so it isn't
            discovered late through the injected stylesheet. */}
        <link
          rel="preload"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2"
        />
        {/* Font Awesome loads NON-render-blocking: the stylesheet is
            script-injected (script-inserted styles never block first paint)
            and lives outside React's tree, so there is no hydration diff.
            <noscript> keeps icons working without JS. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){var B='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/';var l=document.createElement('link');l.rel='stylesheet';l.href=B+'css/all.min.css';document.head.appendChild(l);var f=function(n,w,u){return '@font-face{font-family:\\''+n+'\\';font-style:normal;font-weight:'+w+';font-display:swap;src:url('+B+'webfonts/'+u+') format(\\'woff2\\')}'};var s=document.createElement('style');s.textContent=f('Font Awesome 6 Free',900,'fa-solid-900.woff2')+f('Font Awesome 6 Free',400,'fa-regular-400.woff2')+f('Font Awesome 6 Brands',400,'fa-brands-400.woff2');document.head.appendChild(s);})();",
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          />
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
