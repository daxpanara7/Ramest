import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { createReadStream, promises as fs } from 'fs';
import { dirname, join } from 'path';
import type { Readable } from 'stream';

export interface StoredFile {
  key: string;
  url: string;
}

export type StorageMode = 'cloud' | 'local';

/**
 * Storage abstraction used by MediaService.
 *
 * - "cloud" mode is selected when STORAGE_BUCKET + STORAGE_ACCESS_KEY are both
 *   set. Backed by the S3 API, which Cloudflare R2 implements, so the same
 *   client serves either — R2 only needs STORAGE_ENDPOINT pointing at
 *   https://<account-id>.r2.cloudflarestorage.com.
 * - "local" mode (the default for local/dev) writes to backend/uploads/ and
 *   serves files back via GET /api/media/file/:key.
 *
 * ⚠️ Local mode is for development only. On Render the container filesystem is
 * ephemeral and no persistent disk is mounted, so anything written there is
 * gone on the next deploy, restart or instance recycle. Production must run in
 * cloud mode or uploads will quietly disappear.
 */
@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly uploadsDir = join(process.cwd(), 'uploads');
  readonly mode: StorageMode;

  private readonly client: S3Client | null;
  private readonly bucket: string;
  /** Public base URL files are served from — R2 custom domain or S3 website. */
  private readonly publicUrl: string;

  constructor(private readonly config: ConfigService) {
    const bucket = this.config.get<string>('STORAGE_BUCKET');
    const accessKey = this.config.get<string>('STORAGE_ACCESS_KEY');
    this.mode = bucket && accessKey ? 'cloud' : 'local';
    this.bucket = bucket ?? '';
    this.publicUrl = (this.config.get<string>('STORAGE_PUBLIC_URL') ?? '').replace(/\/$/, '');

    if (this.mode === 'cloud') {
      const endpoint = this.config.get<string>('STORAGE_ENDPOINT');
      this.client = new S3Client({
        // R2 ignores region but the SDK requires one; "auto" is R2's convention.
        region: this.config.get<string>('STORAGE_REGION') ?? 'auto',
        ...(endpoint ? { endpoint } : {}),
        credentials: {
          accessKeyId: accessKey!,
          secretAccessKey: this.config.get<string>('STORAGE_SECRET_KEY') ?? '',
        },
      });
      if (!this.publicUrl) {
        // Not fatal: files still upload, but the URLs handed to the admin and
        // the site would be unusable, so this needs to be loud.
        this.logger.error(
          'STORAGE_PUBLIC_URL is not set — uploads will succeed but their public URLs will be wrong.',
        );
      }
    } else {
      this.client = null;
    }

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
      try {
        await this.client!.send(
          new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
        );
      } catch (err) {
        // Best effort by contract: the soft-deleted row is the source of
        // truth, so a failed object delete must not fail the request. Logged
        // because it leaks storage until someone reconciles it.
        this.logger.warn(`remove(${key}) failed: ${(err as Error).message}`);
      }
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

  /**
   * Reads an object back as a stream, for endpoints that serve private files
   * through the API instead of handing out a bucket URL. Works in either mode
   * so the admin behaves identically in dev and production.
   */
  async getStream(key: string): Promise<Readable> {
    if (this.mode === 'cloud') {
      const out = await this.client!.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      if (!out.Body) throw new Error(`Empty object body for ${key}`);
      return out.Body as Readable;
    }
    return createReadStream(this.localFilePath(key));
  }

  private async saveToLocal(file: Express.Multer.File, key: string): Promise<StoredFile> {
    const target = this.localFilePath(key);
    // Create the key's own directory, not just uploads/. Keys are namespaced
    // ("leads/<id>.pdf"), which is free in a bucket but a real subdirectory on
    // disk — mkdir'ing only uploads/ left nested writes failing with ENOENT.
    await fs.mkdir(dirname(target), { recursive: true });
    await fs.writeFile(target, file.buffer);
    return { key, url: `/api/media/file/${key}` };
  }

  /**
   * S3-compatible write, used for both AWS S3 and Cloudflare R2.
   *
   * Deliberately no ACL parameter: R2 rejects it outright, and modern S3
   * buckets with Object Ownership enforced do too. Public read access is a
   * property of the bucket (an R2 custom domain, or an S3 bucket policy), not
   * of each object.
   */
  private async saveToCloud(file: Express.Multer.File, key: string): Promise<StoredFile> {
    await this.client!.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        // Content-addressed keys never change contents, so they can be cached
        // hard by the CDN in front of the bucket.
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
    return { key, url: `${this.publicUrl}/${key}` };
  }
}
