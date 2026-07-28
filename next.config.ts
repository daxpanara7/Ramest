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

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Image optimization ON: Next/Vercel serves each <Image> as an optimized
  // responsive srcset (right size per device, modern formats) — required for
  // the responsive-images audit and crisp retina rendering at once.
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  // Hide the Next.js "N" badge — only appears in development
  devIndicators: false,
  async redirects() {
    return htmlRedirects;
  },
};

export default nextConfig;
