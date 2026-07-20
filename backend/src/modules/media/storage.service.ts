import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface StoredFile {
  key: string;
  url: string;
}

export type StorageMode = 'cloud' | 'local';

/**
 * Storage abstraction used by MediaService.
 *
 * - "cloud" mode is selected when STORAGE_BUCKET + STORAGE_ACCESS_KEY are both
 *   set (intended for S3 / Cloudflare R2). The AWS SDK is intentionally NOT a
 *   dependency of this project yet, so cloud writes are a documented stub that
 *   throws instead of silently doing nothing — see saveToCloud() below.
 * - "local" mode (the default for local/dev) writes to backend/uploads/ and
 *   serves files back via GET /api/media/file/:key. This mode is fully
 *   functional.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadsDir = join(process.cwd(), 'uploads');
  readonly mode: StorageMode;

  constructor(private readonly config: ConfigService) {
    const bucket = this.config.get<string>('STORAGE_BUCKET');
    const accessKey = this.config.get<string>('STORAGE_ACCESS_KEY');
    this.mode = bucket && accessKey ? 'cloud' : 'local';
    this.logger.log(`Media storage mode: ${this.mode}`);
  }

  async save(file: Express.Multer.File, key: string): Promise<StoredFile> {
    return this.mode === 'cloud' ? this.saveToCloud(file, key) : this.saveToLocal(file, key);
  }

  /**
   * Best-effort physical delete. Callers soft-delete the MediaAsset row
   * regardless of whether this succeeds — the DB record is the source of
   * truth, this just reclaims disk/bucket space.
   */
  async remove(key: string): Promise<void> {
    if (this.mode === 'cloud') {
      this.logger.warn(`remove(${key}) skipped — cloud storage not configured`);
      return;
    }
    try {
      await fs.unlink(this.localFilePath(key));
    } catch {
      // Missing file is fine — nothing to clean up.
    }
  }

  /** Absolute path on disk for a locally stored key. Only valid in "local" mode. */
  localFilePath(key: string): string {
    return join(this.uploadsDir, key);
  }

  private async saveToLocal(file: Express.Multer.File, key: string): Promise<StoredFile> {
    await fs.mkdir(this.uploadsDir, { recursive: true });
    await fs.writeFile(this.localFilePath(key), file.buffer);
    return { key, url: `/api/media/file/${key}` };
  }

  /**
   * TODO(cloud storage): implement with the AWS SDK v3 (@aws-sdk/client-s3)
   * once that dependency is approved for this project. Do not add the aws-sdk
   * package speculatively — this stub exists so a deployment that sets
   * STORAGE_BUCKET/STORAGE_ACCESS_KEY without finishing the integration fails
   * loudly (500) instead of silently writing to local disk.
   *
   * Sketch of the real implementation:
   *   const client = new S3Client({
   *     region: this.config.get('STORAGE_REGION'),
   *     credentials: {
   *       accessKeyId: this.config.get('STORAGE_ACCESS_KEY')!,
   *       secretAccessKey: this.config.get('STORAGE_SECRET_KEY')!,
   *     },
   *   });
   *   await client.send(new PutObjectCommand({
   *     Bucket: this.config.get('STORAGE_BUCKET'),
   *     Key: key,
   *     Body: file.buffer,
   *     ContentType: file.mimetype,
   *   }));
   *   return { key, url: `${this.config.get('STORAGE_PUBLIC_URL')}/${key}` };
   */
  private async saveToCloud(_file: Express.Multer.File, _key: string): Promise<StoredFile> {
    throw new Error('cloud storage not configured');
  }
}
