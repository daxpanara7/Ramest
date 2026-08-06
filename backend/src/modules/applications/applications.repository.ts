import { Injectable } from '@nestjs/common';
import { ApplicationStatus, JobApplication, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface ApplicationFilterParams {
  status?: ApplicationStatus;
  search?: string;
  position?: string;
}

export interface ListApplicationsParams extends ApplicationFilterParams {
  skip?: number;
  take?: number;
}

/**
 * Data access for job applications. Keeps Prisma queries out of the service
 * (Controller -> Service -> Repository).
 */
@Injectable()
export class ApplicationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.JobApplicationCreateInput): Promise<JobApplication> {
    return this.prisma.jobApplication.create({ data });
  }

  private buildWhere(params: ApplicationFilterParams): Prisma.JobApplicationWhereInput {
    const where: Prisma.JobApplicationWhereInput = { deletedAt: null };
    if (params.status) {
      where.status = params.status;
    }
    if (params.position) {
      where.position = params.position;
    }
    if (params.search) {
      const q = params.search;
      where.OR = [
        { fullName: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { position: { contains: q, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  async findMany(
    params: ListApplicationsParams,
  ): Promise<{ items: JobApplication[]; total: number }> {
    const where = this.buildWhere(params);
    const [items, total] = await Promise.all([
      this.prisma.jobApplication.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip ?? 0,
        take: params.take ?? 25,
      }),
      this.prisma.jobApplication.count({ where }),
    ]);
    return { items, total };
  }

  findForExport(params: ApplicationFilterParams): Promise<JobApplication[]> {
    return this.prisma.jobApplication.findMany({
      where: this.buildWhere(params),
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string): Promise<JobApplication | null> {
    return this.prisma.jobApplication.findFirst({ where: { id, deletedAt: null } });
  }

  update(id: string, data: Prisma.JobApplicationUpdateInput): Promise<JobApplication> {
    return this.prisma.jobApplication.update({ where: { id }, data });
  }

  softDelete(id: string): Promise<JobApplication> {
    return this.prisma.jobApplication.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async countByStatus(): Promise<{ status: ApplicationStatus; count: number }[]> {
    const rows = await this.prisma.jobApplication.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { _all: true },
    });
    return rows.map((r) => ({ status: r.status, count: r._count._all }));
  }

  /**
   * Every recorded event for one application, oldest first — the submission
   * itself plus each status change, with who made it.
   *
   * Reads ActivityLog rather than a per-application history table: the audit
   * trail already records `application.created` / `.update` with statusFrom
   * and statusTo, so a second store would be a copy that can drift.
   */
  findHistory(id: string) {
    return this.prisma.activityLog.findMany({
      where: { entity: 'JobApplication', entityId: id },
      orderBy: { createdAt: 'asc' },
      include: { user: { select: { id: true, name: true } } },
    });
  }

  /** Distinct positions applied for, for the admin's filter dropdown. */
  async distinctPositions(): Promise<string[]> {
    const rows = await this.prisma.jobApplication.findMany({
      where: { deletedAt: null },
      distinct: ['position'],
      select: { position: true },
      orderBy: { position: 'asc' },
    });
    return rows.map((r) => r.position);
  }
}
