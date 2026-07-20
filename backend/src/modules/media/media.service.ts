import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { promises as fs } from 'fs';
import { MediaRepository } from './media.repository';
import { StorageService } from './storage.service';
import { UpdateMediaDto } from './dto/update-media.dto';

/** Only images may be uploaded to the media library. */
export const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const EXT_BY_MIME: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/svg+xml': '.svg',
};

export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB

@Injectable()
export class MediaService {
  constructor(
    private readonly repo: MediaRepository,
    private readonly storage: StorageService,
  ) {}

  /**
   * Validates the uploaded file (mime type + size — defense in depth on top
   * of the Multer interceptor limits), stores it, and persists the
   * MediaAsset row.
   */
  async upload(file: Express.Multer.File | undefined, uploadedById: string, alt?: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
      throw new BadRequestException(
        `Unsupported file type "${file.mimetype}". Allowed: ${[...ALLOWED_MIME_TYPES].join(', ')}`,
      );
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new BadRequestException('File exceeds the 5 MB limit');
    }

    const key = `${randomBytes(16).toString('hex')}${EXT_BY_MIME[file.mimetype]}`;
    const stored = await this.storage.save(file, key);
    const trimmedAlt = alt?.trim();

    return this.repo.create({
      url: stored.url,
      key: stored.key,
      mimeType: file.mimetype,
      bytes: file.size,
      alt: trimmedAlt ? trimmedAlt : null,
      uploadedBy: { connect: { id: uploadedById } },
    });
  }

  list(params: { skip?: number; take?: number; mimeType?: string }) {
    return this.repo.list(params);
  }

  async update(id: string, dto: UpdateMediaDto) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Media asset not found');
    return this.repo.update(id, { alt: dto.alt ?? null });
  }

  async remove(id: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Media asset not found');
    // Soft delete only — the physical file is left in place per spec.
    return this.repo.softDelete(id);
  }

  /**
   * Resolves an on-disk path + content type for GET /media/file/:key.
   * Only ever serves local storage; cloud-stored assets 404 here (they are
   * fetched directly from the bucket's public URL instead).
   */
  async resolveLocalFile(key: string): Promise<{ path: string; mimeType: string }> {
    if (this.storage.mode !== 'local') {
      throw new NotFoundException('File not found');
    }
    const asset = await this.repo.findByKey(key);
    if (!asset) throw new NotFoundException('File not found');

    const path = this.storage.localFilePath(key);
    try {
      await fs.access(path);
    } catch {
      throw new NotFoundException('File not found');
    }
    return { path, mimeType: asset.mimeType };
  }
}
