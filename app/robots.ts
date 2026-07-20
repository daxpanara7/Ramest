import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

/**
 * Answer engines are explicitly allowed: being cited in ChatGPT, Claude,
 * Perplexity, and Google AI Overviews is a primary acquisition channel, and
 * several of these crawlers are opt-in by convention. Listing them makes the
 * intent unambiguous rather than relying on the wildcard rule.
 */
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — ChatGPT browsing and training
  "OAI-SearchBot", // OpenAI — ChatGPT search index
  "ChatGPT-User", // OpenAI — user-initiated fetches
  "ClaudeBot", // Anthropic — Claude
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot", // Perplexity
  "Perplexity-User",
  "Google-Extended", // Gemini / AI Overviews grounding
  "Applebot-Extended", // Apple Intelligence
  "CCBot", // Common Crawl — feeds many downstream models
  "meta-externalagent", // Meta AI
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Admin panel + build artefacts / API internals carry no ranking value.
        disallow: ["/admin", "/_next/static/chunks/", "/api/"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
