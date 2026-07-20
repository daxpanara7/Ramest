import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/** Tag has no deletedAt column in the schema — deletion here is a hard delete.
 * The PostTag join rows cascade-delete (onDelete: Cascade in schema.prisma). */
@Injectable()
export class TagsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany() {
    return this.prisma.tag.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: string) {
    return this.prisma.tag.findUnique({ where: { id } });
  }

  findBySlugs(slugs: string[]) {
    return this.prisma.tag.findMany({ where: { slug: { in: slugs } } });
  }

  async slugExists(slug: string): Promise<boolean> {
    const found = await this.prisma.tag.findUnique({
      where: { slug },
      select: { id: true },
    });
    return found !== null;
  }

  create(data: Prisma.TagCreateInput) {
    return this.prisma.tag.create({ data });
  }

  remove(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
