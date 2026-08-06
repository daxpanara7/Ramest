/* Route-scoped styles. Imported here rather than in globals.css so
   other pages do not download and parse them before they can paint —
   see the note at the top of app/globals.css. */
import "../../../styles/blog.css";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLdScript } from "@/components/JsonLd";
import { getPublicPost, getPublicPosts, formatPostDate, mediaUrl } from "@/lib/blog";
import { SITE, breadcrumbJsonLd, createPageMetadata } from "@/lib/site";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPost(slug);
  if (!post) {
    return createPageMetadata({
      title: "Post not found",
      description: "This article is no longer available.",
      path: `/blog/${slug}`,
      noindex: true,
    });
  }
  return createPageMetadata({
    title: post.metaTitle || post.title,
    description:
      post.metaDescription || post.excerpt || `${post.title} — ${SITE.name}`,
    path: `/blog/${post.slug}`,
    // Share cards use the post's own cover when it has one, falling back to
    // the site OG image. Absolute by construction — relative OG URLs are
    // ignored by every scraper.
    image: mediaUrl(post.coverImage?.url) ?? undefined,
  });
}

/** Pre-render the published set at build time; new posts stream in via ISR. */
export async function generateStaticParams() {
  const data = await getPublicPosts({ take: 100 });
  return (data?.items ?? []).map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPublicPost(slug);
  if (!post) notFound();

  const coverSrc = mediaUrl(post.coverImage?.url);

  return (
    <>
      <JsonLdScript
        id="post-breadcrumb-jsonld"
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
      <JsonLdScript
        id="post-jsonld"
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.metaDescription || post.excerpt || undefined,
          // Google's article rich result needs an image; without it the post
          // is ineligible for the card treatment in search.
          image: coverSrc ? [coverSrc] : undefined,
          url: `${SITE.url}/blog/${post.slug}`,
          datePublished: post.publishedAt,
          dateModified: post.publishedAt,
          inLanguage: "en",
          author: { "@type": "Organization", name: SITE.name, url: SITE.url },
          publisher: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
            logo: { "@type": "ImageObject", url: `${SITE.url}${SITE.logo}` },
          },
          mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE.url}/blog/${post.slug}` },
        }}
      />

      <main className="post-page" id="main-content">
        <div className="container">
          <header className="post-head">
            <p className="blog-eyebrow">
              {post.category ? post.category.name : "Article"}
            </p>
            <h1 className="post-title">{post.title}</h1>
            <div className="post-meta">
              {post.publishedAt && <span>{formatPostDate(post.publishedAt)}</span>}
              {post.readingMinutes ? <span>{post.readingMinutes} min read</span> : null}
            </div>
          </header>

          {coverSrc && (
            <figure className="post-cover">
              <Image
                src={coverSrc}
                alt={post.coverImage?.alt ?? post.title}
                fill
                sizes="(max-width: 860px) 94vw, 820px"
                quality={85}
                /* The article hero IS the LCP element — eager, and preloaded
                   ahead of the body copy. fetchPriority is what actually gets
                   it fetched first: `priority` only emits a preload, and that
                   preload queues behind the head's font preloads and the
                   header logo, because browsers rank fonts above images.
                   Marking the one image that decides LCP moved the equivalent
                   request on /about from 1293ms to 588ms. */
                priority
                fetchPriority="high"
              />
            </figure>
          )}

          <article className="post-body">
            {post.contentHtml ? (
              /* Content is authored in our own admin by authenticated staff,
                 so it is trusted HTML. If external authors are ever added
                 this must be sanitised server-side before rendering. */
              <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
            ) : (
              <p>{post.excerpt}</p>
            )}
          </article>

          {post.tags.length > 0 && (
            <div className="post-tags">
              {post.tags.map((t) => (
                <span key={t.tag.id} className="post-tag">#{t.tag.slug}</span>
              ))}
            </div>
          )}

          <div className="post-back-wrap">
            <Link href="/blog" className="post-back">
              <i className="fa-solid fa-arrow-left" aria-hidden="true" /> All articles
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
