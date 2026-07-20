import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { AuditService } from '../../common/audit/audit.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ensureUniqueSlug, slugify } from './utils/slug.util';

type ReqMeta = { ip?: string };

@Injectable()
export class CategoriesService {
  constructor(
    private readonly repo: CategoriesRepository,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.repo.findMany();
  }

  async getById(id: string) {
    const category = await this.repo.findById(id);
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(dto: CreateCategoryDto, userId: string, meta: ReqMeta) {
    const slugBase = slugify(dto.slug ?? dto.name);
    const slug = await ensureUniqueSlug(slugBase, (candidate) =>
      this.repo.slugExists(candidate),
    );

    const category = await this.repo.create({
      name: dto.name,
      slug,
      description: dto.description,
    });

    await this.audit.record({
      userId,
      action: 'category.create',
      entity: 'Category',
      entityId: category.id,
      ip: meta.ip,
    });
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto, userId: string, meta: ReqMeta) {
    await this.getById(id);

    let slug: string | undefined;
    if (dto.slug !== undefined) {
      const slugBase = slugify(dto.slug);
      slug = await ensureUniqueSlug(slugBase, (candidate) =>
        this.repo.slugExists(candidate, id),
      );
    }

    const category = await this.repo.update(id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
    });

    await this.audit.record({
      userId,
      action: 'category.update',
      entity: 'Category',
      entityId: id,
      ip: meta.ip,
    });
    return category;
  }

  async remove(id: string, userId: string, meta: ReqMeta) {
    await this.getById(id);
    await this.repo.softDelete(id);
    await this.audit.record({
      userId,
      action: 'category.delete',
      entity: 'Category',
      entityId: id,
      ip: meta.ip,
    });
    return { ok: true };
  }
}
