import type { MetadataRoute } from "next";
import { sitemapRoutes } from "@/lib/nav";
import { allServiceItems } from "@/lib/services";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const baseRoutes = sitemapRoutes.map((path) => ({
    url: path === "/" ? SITE.url : `${SITE.url}${path}`,
    lastModified,
    changeFrequency: (path === "/" ? "weekly" : "monthly") as
      | "weekly"
      | "monthly",
    priority:
      path === "/"
        ? 1
        : path === "/contact" || path === "/services"
          ? 0.9
          : 0.7,
  }));

  const serviceRoutes = allServiceItems.map((service) => ({
    url: `${SITE.url}${service.href}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...baseRoutes, ...serviceRoutes];
}
