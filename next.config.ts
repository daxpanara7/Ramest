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
  images: {
    unoptimized: true,
  },
  // Hide the Next.js "N" badge — only appears in development
  devIndicators: false,
  async redirects() {
    return htmlRedirects;
  },
};

export default nextConfig;
