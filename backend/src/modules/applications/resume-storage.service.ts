import { Injectable, Logger } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

/**
 * Disk storage for candidate resumes.
 *
 * Deliberately separate from MediaAsset/StorageService: media is images only
 * and is served publicly from `/api/media/file/:key`, whereas a CV contains
 * personal data and must only ever leave through the authorised admin route.
 * Keeping it in its own directory means a misrouted public handler cannot
 * accidentally reach it.
 *
 * On Render the container filesystem is ephemeral — a redeploy wipes it. The
 * DB row (and the notification email) survive regardless, so a lost file
 * degrades the feature rather than losing the application. Mount a disk at
 * `backend/uploads` to make files durable.
 */
@Injectable()
export class ResumeStorageService {
  private readonly logger = new Logger(ResumeStorageService.name);
  private readonly dir = join(process.cwd(), 'uploads', 'resumes');

  /** Writes the buffer under `key` and returns nothing — the DB row owns it. */
  async save(buffer: Buffer, key: string): Promise<void> {
    await fs.mkdir(this.dir, { recursive: true });
    await fs.writeFile(this.filePath(key), buffer);
  }

  /** Absolute path on disk for a stored key. */
  filePath(key: string): string {
    return join(this.dir, key);
  }

  /** True when the file is still on disk (see the ephemeral-FS note above). */
  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.filePath(key));
      return true;
    } catch {
      return false;
    }
  }

  /** Best-effort physical delete; the soft-deleted row stays either way. */
  async remove(key: string): Promise<void> {
    try {
      await fs.unlink(this.filePath(key));
    } catch {
      this.logger.warn(`Resume ${key} was already gone from disk`);
    }
  }
}
