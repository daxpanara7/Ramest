import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

type AuditInput = {
  userId?: string | null;
  action: string; // "auth.login", "post.publish", "user.delete"
  entity?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ip?: string;
};

/**
 * Writes to the immutable ActivityLog. Reused by every module. Never throws
 * into the caller — a failed audit write must not break the business action,
 * but it is logged so the gap is visible.
 */
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  async record(input: AuditInput): Promise<void> {
    try {
      await this.prisma.activityLog.create({
        data: {
          userId: input.userId ?? null,
          action: input.action,
          entity: input.entity,
          entityId: input.entityId,
          metadata: input.metadata as any,
          ip: input.ip,
        },
      });
    } catch (err) {
      this.logger.error(`Audit write failed for ${input.action}: ${String(err)}`);
    }
  }
}
