import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PostStatus } from '@prisma/client';
import { PostsRepository } from './posts.repository';
import { AuditService } from '../../common/audit/audit.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PublishPostDto } from './dto/publish-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { QueryPublicPostsDto } from './dto/query-public-posts.dto';
import { ensureUniqueSlug, slugify } from './utils/slug.util';
import { computeReadingMinutes } from './utils/reading-time.util';

type ReqMeta = { ip?: string };

@Injectable()
export class PostsService {
  constructor(
    private readonly repo: PostsRepository,
    private readonly audit: AuditService,
  ) {}

  async list(query: QueryPostsDto) {
    const skip = query.skip ?? 0;
    const take = Math.min(query.take ?? 25, 100);

    const where: Prisma.BlogPostWhereInput = {
      deletedAt: null,
      ...(query.status ? { status: query.status } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.tag ? { tags: { some: { tag: { slug: query.tag } } } } : {}),
      ...(query.search
        ? { title: { contains: query.search, mode: Prisma.QueryMode.insensitive } }
        : {}),
    };

    return this.repo.findMany({ where, skip, take });
  }

  async getById(id: string) {
    const post = await this.repo.findById(id);
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  /** Admin preview pane: same lookup as getById — deleted-only rows are the
   * sole thing hidden, since admins may inspect a post in any status. */
  async preview(id: string) {
    return this.getById(id);
  }

  async create(dto: CreatePostDto, authorId: string, meta: ReqMeta) {
    const slugBase = slugify(dto.slug ?? dto.title);
    const slug = await ensureUniqueSlug(slugBase, (candidate) =>
      this.repo.slugExists(candidate),
    );
    const readingMinutes = computeReadingMinutes(dto.contentHtml, dto.contentJson);

    const data: Prisma.BlogPostCreateInput = {
      title: dto.title,
      slug,
      excerpt: dto.excerpt,
      contentJson: dto.contentJson as Prisma.InputJsonValue,
      contentHtml: dto.contentHtml,
      readingMinutes,
      metaTitle: dto.metaTitle,
      metaDescription: dto.metaDescription,
      canonicalUrl: dto.canonicalUrl,
      noindex: dto.noindex ?? false,
      status: PostStatus.DRAFT,
      author: { connect: { id: authorId } },
      ...(dto.coverImageId ? { coverImage: { connect: { id: dto.coverImageId } } } : {}),
      ...(dto.categoryId ? { category: { connect: { id: dto.categoryId } } } : {}),
      ...(dto.tagIds?.length
        ? { tags: { create: dto.tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) } }
        : {}),
    };

    const post = await this.repo.create(data);
    await this.audit.record({
      userId: authorId,
      action: 'post.create',
      entity: 'BlogPost',
      entityId: post.id,
      ip: meta.ip,
    });
    return post;
  }

  async update(id: string, dto: UpdatePostDto, userId: string, meta: ReqMeta) {
    await this.getById(id); // 404s if missing/deleted

    let slug: string | undefined;
    if (dto.slug !== undefined) {
      const slugBase = slugify(dto.slug);
      slug = await ensureUniqueSlug(slugBase, (candidate) =>
        this.repo.slugExists(candidate, id),
      );
    }

    const readingMinutes =
      dto.contentHtml !== undefined || dto.contentJson !== undefined
        ? computeReadingMinutes(dto.contentHtml, dto.contentJson)
        : undefined;

    const data: Prisma.BlogPostUpdateInput = {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(dto.excerpt !== undefined ? { excerpt: dto.excerpt } : {}),
      ...(dto.contentJson !== undefined
        ? { contentJson: dto.contentJson as Prisma.InputJsonValue }
        : {}),
      ...(dto.contentHtml !== undefined ? { contentHtml: dto.contentHtml } : {}),
      ...(readingMinutes !== undefined ? { readingMinutes } : {}),
      ...(dto.metaTitle !== undefined ? { metaTitle: dto.metaTitle } : {}),
      ...(dto.metaDescription !== undefined ? { metaDescription: dto.metaDescription } : {}),
      ...(dto.canonicalUrl !== undefined ? { canonicalUrl: dto.canonicalUrl } : {}),
      ...(dto.noindex !== undefined ? { noindex: dto.noindex } : {}),
      ...(dto.coverImageId !== undefined
        ? dto.coverImageId
          ? { coverImage: { connect: { id: dto.coverImageId } } }
          : { coverImage: { disconnect: true } }
        : {}),
      ...(dto.categoryId !== undefined
        ? dto.categoryId
          ? { category: { connect: { id: dto.categoryId } } }
          : { category: { disconnect: true } }
        : {}),
      ...(dto.tagIds !== undefined
        ? {
            tags: {
              deleteMany: {},
              create: dto.tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })),
            },
          }
        : {}),
    };

    const post = await this.repo.update(id, data);
    await this.audit.record({
      userId,
      action: 'post.update',
      entity: 'BlogPost',
      entityId: id,
      ip: meta.ip,
    });
    return post;
  }

  async publish(id: string, dto: PublishPostDto, userId: string, meta: ReqMeta) {
    await this.getById(id);

    const now = new Date();
    const publishAt = dto.publishAt ? new Date(dto.publishAt) : now;
    const isFuture = publishAt.getTime() > now.getTime();

    const post = await this.repo.update(id, {
      status: isFuture ? PostStatus.SCHEDULED : PostStatus.PUBLISHED,
      publishedAt: publishAt,
    });

    await this.audit.record({
      userId,
      action: 'post.publish',
      entity: 'BlogPost',
      entityId: id,
      metadata: { status: post.status, publishedAt: publishAt.toISOString() },
      ip: meta.ip,
    });
    return post;
  }

  async unpublish(id: string, userId: string, meta: ReqMeta) {
    await this.getById(id);
    const post = await this.repo.update(id, { status: PostStatus.DRAFT });
    await this.audit.record({
      userId,
      action: 'post.unpublish',
      entity: 'BlogPost',
      entityId: id,
      ip: meta.ip,
    });
    return post;
  }

  async remove(id: string, userId: string, meta: ReqMeta) {
    await this.getById(id);
    await this.repo.softDelete(id);
    await this.audit.record({
      userId,
      action: 'post.delete',
      entity: 'BlogPost',
      entityId: id,
      ip: meta.ip,
    });
    return { ok: true };
  }

  // ---------------------------------------------------------------------
  // Public (Next.js frontend) reads — no auth required.
  // ---------------------------------------------------------------------

  async listPublic(query: QueryPublicPostsDto) {
    const skip = query.skip ?? 0;
    const take = Math.min(query.take ?? 25, 100);
    const now = new Date();

    const where: Prisma.BlogPostWhereInput = {
      deletedAt: null,
      OR: [
        { status: PostStatus.PUBLISHED },
        { status: PostStatus.SCHEDULED, publishedAt: { lte: now } },
      ],
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.tag ? { tags: { some: { tag: { slug: query.tag } } } } : {}),
    };

    const { items, total } = await this.repo.findMany({ where, skip, take });
    return { items: items.map((post) => this.toPublicShape(post)), total };
  }

  async getPublicBySlug(slug: string) {
    const post = await this.repo.findBySlugPublic(slug, new Date());
    if (!post) throw new NotFoundException('Post not found');
    return this.toPublicShape(post);
  }

  /** Strips internal-only fields before handing a post to the public site. */
  private toPublicShape<
    T extends {
      id: string;
      slug: string;
      title: string;
      excerpt: string | null;
      contentJson: unknown;
      contentHtml: string | null;
      coverImageId: string | null;
      status: PostStatus;
      publishedAt: Date | null;
      readingMinutes: number | null;
      metaTitle: string | null;
      metaDescription: string | null;
      canonicalUrl: string | null;
      noindex: boolean;
      categoryId: string | null;
      category: unknown;
      tags: unknown;
      createdAt: Date;
    },
  >(post: T) {
    return {
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      contentJson: post.contentJson,
      contentHtml: post.contentHtml,
      coverImageId: post.coverImageId,
      status: post.status,
      publishedAt: post.publishedAt,
      readingMinutes: post.readingMinutes,
      metaTitle: post.metaTitle,
      metaDescription: post.metaDescription,
      canonicalUrl: post.canonicalUrl,
      noindex: post.noindex,
      categoryId: post.categoryId,
      category: post.category,
      tags: post.tags,
      createdAt: post.createdAt,
    };
  }
}
