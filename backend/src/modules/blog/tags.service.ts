import { Injectable, NotFoundException } from '@nestjs/common';
import { TagsRepository } from './tags.repository';
import { AuditService } from '../../common/audit/audit.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { ensureUniqueSlug, slugify } from './utils/slug.util';

type ReqMeta = { ip?: string };

@Injectable()
export class TagsService {
  constructor(
    private readonly repo: TagsRepository,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.repo.findMany();
  }

  async create(dto: CreateTagDto, userId: string, meta: ReqMeta) {
    const slugBase = slugify(dto.slug ?? dto.name);
    const slug = await ensureUniqueSlug(slugBase, (candidate) => this.repo.slugExists(candidate));

    const tag = await this.repo.create({ name: dto.name, slug });

    await this.audit.record({
      userId,
      action: 'tag.create',
      entity: 'Tag',
      entityId: tag.id,
      ip: meta.ip,
    });
    return tag;
  }

  async remove(id: string, userId: string, meta: ReqMeta) {
    const tag = await this.repo.findById(id);
    if (!tag) throw new NotFoundException('Tag not found');

    await this.repo.remove(id);
    await this.audit.record({
      userId,
      action: 'tag.delete',
      entity: 'Tag',
      entityId: id,
      ip: meta.ip,
    });
    return { ok: true };
  }
}
