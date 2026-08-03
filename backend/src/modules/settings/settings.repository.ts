import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SettingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.setting.findMany({ orderBy: { key: 'asc' } });
  }

  /** Settings are grouped by a dotted prefix, e.g. "company.name". */
  findByPrefix(prefix: string) {
    return this.prisma.setting.findMany({
      where: { key: { startsWith: `${prefix}.` } },
      orderBy: { key: 'asc' },
    });
  }

  findOne(key: string) {
    return this.prisma.setting.findUnique({ where: { key } });
  }

  /** Upsert so a first write does not need a separate create call. */
  upsert(key: string, value: Prisma.InputJsonValue) {
    return this.prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  delete(key: string) {
    return this.prisma.setting.delete({ where: { key } });
  }
}
