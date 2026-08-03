import { API_BASE } from "@/lib/api-base";

/**
 * Server-side reader for the public blog endpoints.
 *
 * Fetched on the server so posts are in the HTML for crawlers — a
 * client-side fetch would leave Google an empty page. `revalidate` keeps it
 * cached for a minute rather than hitting the API on every request, which
 * also means a cold Render instance cannot stall a page render.
 */

export type PublicMedia = {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
};

export type PublicPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImage: PublicMedia | null;
  contentHtml: string | null;
  publishedAt: string | null;
  readingMinutes: number | null;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  category: { id: string; name: string; slug: string } | null;
  tags: { tag: { id: string; name: string; slug: string } }[];
};

export type PublicPostList = { items: PublicPost[]; total: number };

const REVALIDATE = 60;

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // API unreachable (cold start, network) — the page renders its empty
    // state rather than throwing a 500 at a visitor.
    return null;
  }
}

export function getPublicPosts(params: { take?: number; skip?: number; search?: string } = {}) {
  const sp = new URLSearchParams();
  if (params.take) sp.set("take", String(params.take));
  if (params.skip) sp.set("skip", String(params.skip));
  if (params.search) sp.set("search", params.search);
  const q = sp.toString();
  return get<PublicPostList>(`/blog/public/posts${q ? `?${q}` : ""}`);
}

export function getPublicPost(slug: string) {
  return get<PublicPost>(`/blog/public/posts/${encodeURIComponent(slug)}`);
}

/**
 * Absolute URL for a media asset.
 *
 * The API stores cover URLs as origin-relative paths (`/api/media/file/<key>`)
 * so the same row works across environments. Those resolve against the *site*
 * origin, not the API's — on Vercel that is a 404. API_BASE already carries
 * the `/api` prefix, so strip it to get the backend origin and prefix that.
 * Absolute URLs (a CDN, once storage moves off the box) pass through
 * untouched.
 */
export function mediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const origin = API_BASE.replace(/\/api\/?$/, "");
  return `${origin}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** "3 Aug 2026" — matches the date style used elsewhere on the site. */
export function formatPostDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}
