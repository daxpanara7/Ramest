import { Injectable } from '@nestjs/common';
import { ContactLead, LeadStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

export interface LeadFilterParams {
  status?: LeadStatus;
  search?: string;
  assigneeId?: string;
}

export interface ListLeadsParams extends LeadFilterParams {
  skip?: number;
  take?: number;
}

/**
 * Data access for leads. Keeps Prisma queries out of the service so the
 * service holds only lead logic (Controller -> Service -> Repository).
 */
@Injectable()
export class LeadsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: Prisma.ContactLeadCreateInput): Promise<ContactLead> {
    return this.prisma.contactLead.create({ data });
  }

  private buildWhere(params: LeadFilterParams): Prisma.ContactLeadWhereInput {
    const where: Prisma.ContactLeadWhereInput = { deletedAt: null };
    if (params.status) {
      where.status = params.status;
    }
    if (params.assigneeId) {
      where.assigneeId = params.assigneeId;
    }
    if (params.search) {
      const q = params.search;
      where.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { email: { contains: q, mode: 'insensitive' } },
        { company: { contains: q, mode: 'insensitive' } },
      ];
    }
    return where;
  }

  async findMany(params: ListLeadsParams): Promise<{ items: ContactLead[]; total: number }> {
    const where = this.buildWhere(params);
    const [items, total] = await Promise.all([
      this.prisma.contactLead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: params.skip ?? 0,
        take: params.take ?? 25,
      }),
      this.prisma.contactLead.count({ where }),
    ]);
    return { items, total };
  }

  findForExport(params: LeadFilterParams): Promise<ContactLead[]> {
    const where = this.buildWhere(params);
    return this.prisma.contactLead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string): Promise<ContactLead | null> {
    return this.prisma.contactLead.findFirst({ where: { id, deletedAt: null } });
  }

  update(id: string, data: Prisma.ContactLeadUpdateInput): Promise<ContactLead> {
    return this.prisma.contactLead.update({ where: { id }, data });
  }

  softDelete(id: string): Promise<ContactLead> {
    return this.prisma.contactLead.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async countByStatus(): Promise<{ status: LeadStatus; count: number }[]> {
    const rows = await this.prisma.contactLead.groupBy({
      by: ['status'],
      where: { deletedAt: null },
      _count: { _all: true },
    });
    return rows.map((r) => ({ status: r.status, count: r._count._all }));
  }
}
