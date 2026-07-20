import { Injectable } from '@nestjs/common';
import { PostStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface PostStatusCounts {
  total: number;
  published: number;
  draft: number;
  scheduled: number;
  archived: number;
}

export interface PublishedGapCounts {
  missingMetaTitleOrDescription: number;
  missingExcerpt: number;
  missingCoverImage: number;
}

export interface PublishedMetadataRow {
  id: string;
  slug: string;
  title: string;
  metaTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImageId: string | null;
}

const NOT_DELETED: Prisma.BlogPostWhereInput = { deletedAt: null };

/** A text field counts as "missing" if it was never set or was cleared to blank. */
const missingText = (
  field: 'metaTitle' | 'metaDescription' | 'excerpt',
): Prisma.BlogPostWhereInput[] => [{ [field]: null }, { [field]: '' }];

/**
 * Data access for the SEO command center. Everything here reads real rows
 * from BlogPost — the only tables this module ever touches. No writes.
 */
@Injectable()
export class SeoRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** Post counts by lifecycle status, computed in a single grouped query. */
  async countsByStatus(): Promise<PostStatusCounts> {
    const groups = await this.prisma.blogPost.groupBy({
      by: ['status'],
      where: NOT_DELETED,
      _count: { _all: true },
    });
    const byStatus = new Map(groups.map((g) => [g.status, g._count._all]));
    const published = byStatus.get(PostStatus.PUBLISHED) ?? 0;
    const draft = byStatus.get(PostStatus.DRAFT) ?? 0;
    const scheduled = byStatus.get(PostStatus.SCHEDULED) ?? 0;
    const archived = byStatus.get(PostStatus.ARCHIVED) ?? 0;
    return {
      total: published + draft + scheduled + archived,
      published,
      draft,
      scheduled,
      archived,
    };
  }

  /**
   * Coverage gaps among PUBLISHED posts only — those are the pages actually
   * exposed to search engines, so they're what "SEO coverage" means here.
   */
  async publishedGapCounts(): Promise<PublishedGapCounts> {
    const [missingMetaTitleOrDescription, missingExcerpt, missingCoverImage] = await Promise.all([
      this.prisma.blogPost.count({
        where: {
          ...NOT_DELETED,
          status: PostStatus.PUBLISHED,
          OR: [...missingText('metaTitle'), ...missingText('metaDescription')],
        },
      }),
      this.prisma.blogPost.count({
        where: { ...NOT_DELETED, status: PostStatus.PUBLISHED, OR: missingText('excerpt') },
      }),
      this.prisma.blogPost.count({
        where: { ...NOT_DELETED, status: PostStatus.PUBLISHED, coverImageId: null },
      }),
    ]);
    return { missingMetaTitleOrDescription, missingExcerpt, missingCoverImage };
  }

  /** Raw per-post fields needed for the metadata coverage breakdown. */
  publishedMetadataRows(): Promise<PublishedMetadataRow[]> {
    return this.prisma.blogPost.findMany({
      where: { ...NOT_DELETED, status: PostStatus.PUBLISHED },
      select: {
        id: true,
        slug: true,
        title: true,
        metaTitle: true,
        metaDescription: true,
        canonicalUrl: true,
        ogImageId: true,
      },
      orderBy: { publishedAt: 'desc' },
    });
  }

  countPublished(): Promise<number> {
    return this.prisma.blogPost.count({
      where: { ...NOT_DELETED, status: PostStatus.PUBLISHED },
    });
  }
}
