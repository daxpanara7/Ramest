import Image from "next/image";
import { mediaUrl, type PublicPost } from "@/lib/blog";

/**
 * The cover strip on a blog card.
 *
 * Shared by /blog and the homepage rail so the image handling can't drift
 * between them. Posts without a cover keep the brand gradient that was there
 * before — the image is an enhancement, never a requirement, so a card is
 * never a broken-image box.
 *
 * `fill` + `sizes` is what keeps this cheap: the browser picks the smallest
 * candidate that covers the rendered box (~380px on a 3-up desktop grid, not
 * the 2000px original), and Next serves it as AVIF/WebP. Without `sizes` it
 * would assume 100vw and download a desktop-width file for a phone.
 */
export function BlogCardCover({
  post,
  priority = false,
  sizes = "(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw",
}: {
  post: Pick<PublicPost, "coverImage" | "category">;
  /** Only for covers above the fold — a lazy LCP image delays the paint. */
  priority?: boolean;
  sizes?: string;
}) {
  const src = mediaUrl(post.coverImage?.url);

  return (
    <div className={`blog-card-cover${src ? " has-img" : ""}`}>
      {src && (
        <Image
          src={src}
          alt={post.coverImage?.alt ?? ""}
          fill
          sizes={sizes}
          quality={75}
          priority={priority}
          // Everything below the first row is lazy; `priority` already implies
          // eager, so this only applies to the rest.
          loading={priority ? undefined : "lazy"}
        />
      )}
      {post.category && <span className="blog-card-cat">{post.category.name}</span>}
    </div>
  );
}
