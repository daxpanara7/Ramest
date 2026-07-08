import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import Script from "next/script";
import ClientEffects from "@/components/ClientEffects";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ramesttechnolabs.com"),
  title: {
    default: "Ramest Technolabs | Innovative IT Solutions",
    template: "%s | Ramest Technolabs",
  },
  description:
    "Ramest Technolabs - Leading IT company providing Web Development, App Development, UI/UX Design, and AI/ML Solutions to transform your business.",
};

export const viewport: Viewport = {
  themeColor: "#191716",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${inter.variable} ${dmSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <div className="bg-grid" />
        {children}
        <ClientEffects />
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function(){try{var t=localStorage.getItem('selected-theme');if(t){document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');}}catch(e){}})();`}
        </Script>
      </body>
    </html>
  );
}
