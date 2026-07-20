import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

/** ALL Prisma queries for the media module live here. */
@Injectable()
export class MediaRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.MediaAssetCreateInput) {
    return this.prisma.mediaAsset.create({ data });
  }

  findById(id: string) {
    return this.prisma.mediaAsset.findFirst({ where: { id, deletedAt: null } });
  }

  findByKey(key: string) {
    return this.prisma.mediaAsset.findFirst({ where: { key, deletedAt: null } });
  }

  async list(params: { skip?: number; take?: number; mimeType?: string }) {
    const where: Prisma.MediaAssetWhereInput = {
      deletedAt: null,
      ...(params.mimeType ? { mimeType: params.mimeType } : {}),
    };
    const [items, total] = await Promise.all([
      this.prisma.mediaAsset.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip ?? 0,
        take: Math.min(params.take ?? 25, 100),
      }),
      this.prisma.mediaAsset.count({ where }),
    ]);
    return { items, total };
  }

  update(id: string, data: Prisma.MediaAssetUpdateInput) {
    return this.prisma.mediaAsset.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return this.prisma.mediaAsset.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
