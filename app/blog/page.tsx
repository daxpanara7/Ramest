import Link from "next/link";
import { BlogCardCover } from "@/components/blog/BlogCardCover";
import { JsonLdScript } from "@/components/JsonLd";
import { getPublicPosts, formatPostDate } from "@/lib/blog";
import { SITE, breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata({
  title: "Blog",
  description: `Engineering notes from ${SITE.name} — custom software, AI systems, cloud architecture, and the decisions behind them.`,
  path: "/blog",
});

/** 3 rows of 3 on desktop. */
const PAGE_SIZE = 9;

/**
 * Page numbers to render: always first + last, the current page and its
 * neighbours, and an ellipsis marker (0) for whatever the window skips — so
 * the control stays a fixed width no matter how many posts exist.
 */
function pageWindow(current: number, total: number): number[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set([1, total, current, current - 1, current + 1]);
  if (current <= 3) [2, 3, 4].forEach((n) => keep.add(n));
  if (current >= total - 2) [total - 3, total - 2, total - 1].forEach((n) => keep.add(n));
  const pages = [...keep].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: number[] = [];
  pages.forEach((n, i) => {
    if (i > 0 && n - pages[i - 1] > 1) out.push(0);
    out.push(n);
  });
  return out;
}

const hrefFor = (n: number) => (n <= 1 ? "/blog" : `/blog?page=${n}`);

/**
 * Server-rendered so posts are in the HTML for crawlers. Revalidated every
 * 60s by lib/blog, which also means publishing in the admin panel shows up
 * here within a minute without a redeploy.
 *
 * Pagination is server-side (`?page=N`), not client-side slicing: only the
 * nine posts on screen are fetched and shipped, so the HTML stays small and
 * every page is a real crawlable, shareable URL.
 */
export default async function BlogIndex({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const sp = await searchParams;
  const requested = Number.parseInt(sp?.page ?? "1", 10);
  const page = Number.isFinite(requested) && requested > 0 ? requested : 1;

  const data = await getPublicPosts({ take: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE });
  const posts = data?.items ?? [];
  const total = data?.total ?? posts.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const current = Math.min(page, totalPages);

  return (
    <>
      <JsonLdScript
        id="blog-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ])}
      />
      {posts.length > 0 && (
        <JsonLdScript
          id="blog-list-jsonld"
          data={{
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${SITE.name} Blog`,
            url: `${SITE.url}/blog`,
            blogPost: posts.slice(0, 10).map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `${SITE.url}/blog/${p.slug}`,
              datePublished: p.publishedAt,
              description: p.excerpt ?? undefined,
            })),
          }}
        />
      )}

      <main className="blog-page" id="main-content">
        <div className="container">
          <header className="blog-head">
            <p className="blog-eyebrow">Insights</p>
            <h1 className="blog-title">Our Latest Blogs</h1>
            <p className="blog-lede">
              Engineering notes on custom software, AI systems, and cloud
              architecture — written by the people who build them.
            </p>
          </header>

          <div className="blog-grid">
            {posts.length === 0 ? (
              <div className="blog-empty">
                <p>No posts published yet. Check back shortly.</p>
              </div>
            ) : posts.map((p, i) => (
              <article key={p.id} className="blog-card">
                <Link href={`/blog/${p.slug}`} aria-label={p.title}>
                  {/* Top row only is eager — it is the LCP candidate; the
                      other six load lazily as they scroll in. */}
                  <BlogCardCover post={p} priority={i < 3} />
                </Link>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    {p.publishedAt && <span>{formatPostDate(p.publishedAt)}</span>}
                    {p.readingMinutes ? <span>{p.readingMinutes} min read</span> : null}
                  </div>
                  <h2>
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                  </h2>
                  {p.excerpt && <p>{p.excerpt}</p>}
                  {/* Title carried inside the link, visually hidden — nine
                      identical "Read more" labels is exactly what the SEO
                      "descriptive link text" audit flags, and what a screen
                      reader's link list would show. */}
                  <Link href={`/blog/${p.slug}`} className="blog-card-more">
                    Read more<span className="sr-only">: {p.title}</span>{" "}
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="blog-pager" aria-label="Blog pagination">
              <p className="blog-pager-count">
                Page <strong>{current}</strong> of <strong>{totalPages}</strong>
                <span className="blog-pager-dot" aria-hidden="true" />
                {total} {total === 1 ? "article" : "articles"}
              </p>

              <ul className="blog-pager-list">
                <li>
                  {current > 1 ? (
                    <Link href={hrefFor(current - 1)} className="blog-pager-arrow" rel="prev" aria-label="Previous page" prefetch>
                      <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                      <span>Prev</span>
                    </Link>
                  ) : (
                    <span className="blog-pager-arrow is-off" aria-disabled="true">
                      <i className="fa-solid fa-arrow-left" aria-hidden="true" />
                      <span>Prev</span>
                    </span>
                  )}
                </li>

                {pageWindow(current, totalPages).map((n, i) =>
                  n === 0 ? (
                    <li key={`gap-${i}`} className="blog-pager-gap" aria-hidden="true">&hellip;</li>
                  ) : (
                    <li key={n}>
                      {n === current ? (
                        <span className="blog-pager-num is-current" aria-current="page">{n}</span>
                      ) : (
                        <Link href={hrefFor(n)} className="blog-pager-num" aria-label={`Page ${n}`}>{n}</Link>
                      )}
                    </li>
                  )
                )}

                <li>
                  {current < totalPages ? (
                    <Link href={hrefFor(current + 1)} className="blog-pager-arrow" rel="next" aria-label="Next page" prefetch>
                      <span>Next</span>
                      <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className="blog-pager-arrow is-off" aria-disabled="true">
                      <span>Next</span>
                      <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                    </span>
                  )}
                </li>
              </ul>
            </nav>
          )}
        </div>
      </main>
    </>
  );
}
