import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/** Shared include shape so list/detail/preview/public queries stay consistent. */
const detailInclude = {
  category: true,
  tags: { include: { tag: true } },
} satisfies Prisma.BlogPostInclude;

/**
 * All Prisma access for blog posts. Business rules (slugging, status
 * transitions, permission checks) live in PostsService.
 */
@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(params: {
    where: Prisma.BlogPostWhereInput;
    skip: number;
    take: number;
  }) {
    const [items, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where: params.where,
        include: detailInclude,
        orderBy: { createdAt: 'desc' },
        skip: params.skip,
        take: params.take,
      }),
      this.prisma.blogPost.count({ where: params.where }),
    ]);
    return { items, total };
  }

  findById(id: string) {
    return this.prisma.blogPost.findFirst({
      where: { id, deletedAt: null },
      include: detailInclude,
    });
  }

  findBySlugPublic(slug: string, now: Date) {
    return this.prisma.blogPost.findFirst({
      where: {
        slug,
        deletedAt: null,
        OR: [
          { status: 'PUBLISHED' },
          { status: 'SCHEDULED', publishedAt: { lte: now } },
        ],
      },
      include: detailInclude,
    });
  }

  /** Used by the unique-slug generator; excludes soft-deleted rows only for
   * cosmetic reasons — a slug must stay globally unique regardless, since the
   * DB column has a hard unique constraint. */
  async slugExists(slug: string, excludeId?: string): Promise<boolean> {
    const found = await this.prisma.blogPost.findFirst({
      where: { slug, ...(excludeId ? { id: { not: excludeId } } : {}) },
      select: { id: true },
    });
    return found !== null;
  }

  create(data: Prisma.BlogPostCreateInput) {
    return this.prisma.blogPost.create({ data, include: detailInclude });
  }

  update(id: string, data: Prisma.BlogPostUpdateInput) {
    return this.prisma.blogPost.update({
      where: { id },
      data,
      include: detailInclude,
    });
  }

  softDelete(id: string) {
    return this.prisma.blogPost.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
