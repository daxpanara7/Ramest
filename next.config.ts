import type { NextConfig } from "next";

const htmlRedirects = [
  "index",
  "services",
  "hire-developers",
  "company",
  "about",
  "team",
  "infrastructure",
  "certifications",
  "careers",
  "contact",
].map((page) => ({
  source: `/${page}.html`,
  destination: page === "index" ? "/" : `/${page}`,
  permanent: true,
}));


/**
 * Security headers.
 *
 * CSP is deliberately absent: Next.js App Router injects inline hydration
 * scripts, so any CSP without per-request nonces needs 'unsafe-inline' for
 * script-src — which Lighthouse scores as ineffective anyway. A wrong CSP
 * silently blocks reCAPTCHA and Font Awesome on a live site, so the trade is
 * bad. Everything below is zero-risk and genuinely useful.
 */
const securityHeaders = [
  // Clickjacking. frame-ancestors is the modern equivalent and is honoured
  // by browsers that ignore XFO, so both are sent.
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  // Stop MIME sniffing turning an upload into executable script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the origin cross-site, full URL same-site — keeps analytics useful
  // without leaking paths to third parties.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Nothing here needs these; denying them removes the permission prompts
  // entirely as an attack surface.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // Origin isolation. same-origin-allow-popups rather than same-origin so
  // OAuth/social popups still work.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  // 2 years + subdomains + preload-eligible. Vercel sets max-age but not
  // these directives, which is why the audit flagged it as not "strong".
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Build output directory. Overridable so a throwaway dev server can run
   * alongside the `next start` on :3000 without clobbering its build — both
   * default to `.next`, and a dev server writing there leaves the running
   * production server serving a build that no longer exists on disk.
   * Unset in CI and on Vercel, so production is always plain `.next`.
   */
  distDir: process.env.NEXT_DIST_DIR || ".next",
  // Image optimization ON: Next/Vercel serves each <Image> as an optimized
  // responsive srcset (right size per device, modern formats) — required for
  // the responsive-images audit and crisp retina rendering at once.
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
    // Blog covers are uploaded to the backend and served from its origin, so
    // it has to be whitelisted or <Image> refuses the src outright. Derived
    // from the same env var the API client uses, so staging/prod need no
    // second place to update. Narrowed to the media path — a whitelisted host
    // otherwise lets anyone use the optimizer as an open image proxy.
    remotePatterns: [
      ...(() => {
        const raw = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
        try {
          const u = new URL(raw);
          return [
            {
              protocol: u.protocol.replace(":", "") as "http" | "https",
              hostname: u.hostname,
              port: u.port || undefined,
              pathname: "/api/media/**",
            },
          ];
        } catch {
          return [];
        }
      })(),
    ],
  },
  // Hide the Next.js "N" badge — only appears in development
  devIndicators: false,
  async redirects() {
    return [
      ...htmlRedirects,
      /* The privacy policy used to be a query-string tab on /legal. That kept
         the whole route dynamic, which made Next stream its metadata into the
         body instead of the head — see components/legal/LegalDocument.tsx.
         Both documents are static routes now; this keeps every link, bookmark
         and previously-indexed URL pointing at the right one. */
      {
        source: "/legal",
        has: [{ type: "query" as const, key: "tab", value: "privacy" }],
        destination: "/legal/privacy",
        permanent: true,
      },
      /* No matching rule for `?tab=terms`: it was never a generated link, and
         redirecting /legal?tab=terms to /legal would loop, because Next
         carries the query string through to a destination that has none. */
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
