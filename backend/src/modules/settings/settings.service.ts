import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SettingsRepository } from './settings.repository';
import { UpsertSettingDto } from './dto/upsert-setting.dto';

type SettingRow = { key: string; value: unknown; updatedAt: Date };

@Injectable()
export class SettingsService {
  constructor(private readonly repo: SettingsRepository) {}

  /**
   * Returns settings as a flat key/value map rather than an array — the
   * settings forms read by key, and a map spares every page writing its own
   * find() over an array.
   */
  private toMap(rows: SettingRow[]) {
    return rows.reduce<Record<string, unknown>>((acc, r) => {
      acc[r.key] = r.value;
      return acc;
    }, {});
  }

  async list(prefix?: string) {
    const rows = prefix
      ? await this.repo.findByPrefix(prefix)
      : await this.repo.findAll();
    return { items: rows, values: this.toMap(rows as SettingRow[]), total: rows.length };
  }

  async get(key: string) {
    const row = await this.repo.findOne(key);
    if (!row) throw new NotFoundException(`Setting "${key}" not found`);
    return row;
  }

  upsert(dto: UpsertSettingDto) {
    return this.repo.upsert(dto.key, dto.value as Prisma.InputJsonValue);
  }

  /**
   * Sequential, not Promise.all: these are upserts on the same table and a
   * partial failure should stop rather than leave half a form saved with no
   * indication which half.
   */
  async upsertMany(items: UpsertSettingDto[]) {
    const saved: Awaited<ReturnType<SettingsRepository['upsert']>>[] = [];
    for (const item of items) {
      saved.push(await this.repo.upsert(item.key, item.value as Prisma.InputJsonValue));
    }
    return { saved: saved.length, items: saved };
  }

  async remove(key: string) {
    await this.get(key); // 404 rather than Prisma's P2025
    await this.repo.delete(key);
    return { ok: true };
  }
}
