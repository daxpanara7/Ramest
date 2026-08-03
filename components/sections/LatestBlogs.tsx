import Link from "next/link";
import { BlogCardCover } from "@/components/blog/BlogCardCover";
import { getPublicPosts, formatPostDate } from "@/lib/blog";

/**
 * Homepage blog carousel — one of the stacked section cards.
 *
 * A CSS scroll-snap rail rather than a JS carousel library: it stays a server
 * component (no client bundle), keyboard and touch scrolling work natively,
 * and it degrades to a plain scrollable row if anything fails.
 *
 * The rail lives INSIDE .container, deliberately not full-bleed. This section
 * renders inside a .stack-card, and .stack-card sets `overflow: clip` — a
 * full-bleed child extends past the card's box and gets cut off, which is
 * exactly why the cards vanished.
 *
 * Renders nothing when nothing is published; an empty "Latest Blogs" heading
 * looks broken.
 */
export default async function LatestBlogs() {
  const data = await getPublicPosts({ take: 9 });
  const posts = data?.items ?? [];
  if (posts.length === 0) return null;

  return (
    <section className="hx-section home-blogs" aria-labelledby="home-blog-heading">
      <div className="container">
        <div className="home-blogs-head">
          <div>
            <span className="hx-eyebrow">Insights</span>
            <h2 className="hx-title" id="home-blog-heading">
              Our Latest Blogs
            </h2>
            <p className="home-blogs-sub">
              We share what we learn building software — architecture calls,
              AI systems, and the trade-offs behind them.
            </p>
          </div>
          <Link href="/blog" className="button button-secondary home-blogs-all">
            View all blogs
          </Link>
        </div>

        <div className="blog-rail" role="region" aria-label="Latest articles" tabIndex={0}>
          <div className="blog-rail-track">
            {posts.map((p) => (
              <article key={p.id} className="blog-card blog-rail-item">
                <Link href={`/blog/${p.slug}`} aria-label={p.title}>
                  {/* The rail sits far down the homepage, so every cover here
                      stays lazy — none of them can be the LCP. Fixed-width
                      rail items, hence a fixed `sizes` rather than vw units. */}
                  <BlogCardCover
                    post={p}
                    sizes="(max-width: 640px) 82vw, 360px"
                  />
                </Link>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    {p.publishedAt && <span>{formatPostDate(p.publishedAt)}</span>}
                    {p.readingMinutes ? <span>{p.readingMinutes} min read</span> : null}
                  </div>
                  <h3 className="blog-card-title">
                    <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                  </h3>
                  {p.excerpt && <p>{p.excerpt}</p>}
                  {/* The post title is inside the link, visually hidden. A bare
                      "Read more" is the one thing Lighthouse SEO fails this
                      page on ("Links do not have descriptive text"), and it is
                      a real crawler/screen-reader problem: nine identical link
                      labels pointing at nine different articles. */}
                  <Link href={`/blog/${p.slug}`} className="blog-card-more">
                    Read more<span className="sr-only">: {p.title}</span>{" "}
                    <i className="fa-solid fa-arrow-right" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="blog-rail-hint">Scroll for more →</p>
      </div>
    </section>
  );
}
