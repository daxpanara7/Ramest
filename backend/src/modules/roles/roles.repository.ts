import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const roleSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  permissions: {
    select: {
      permission: { select: { id: true, key: true, label: true } },
    },
  },
} satisfies Prisma.RoleSelect;

export type RoleWithPermissions = Prisma.RoleGetPayload<{ select: typeof roleSelect }>;

/**
 * Data access for roles/permissions. Keeps Prisma queries out of the service
 * (Controller -> Service -> Repository).
 */
@Injectable()
export class RolesRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMany(): Promise<RoleWithPermissions[]> {
    return this.prisma.role.findMany({ select: roleSelect, orderBy: { name: 'asc' } });
  }

  findById(id: string): Promise<RoleWithPermissions | null> {
    return this.prisma.role.findUnique({ where: { id }, select: roleSelect });
  }

  findByName(name: string) {
    return this.prisma.role.findUnique({ where: { name } });
  }

  findAllPermissions() {
    return this.prisma.permission.findMany({ orderBy: { key: 'asc' } });
  }

  findPermissionsByKeys(keys: string[]) {
    return this.prisma.permission.findMany({ where: { key: { in: [...new Set(keys)] } } });
  }

  create(data: {
    name: string;
    description?: string;
    permissionIds: string[];
  }): Promise<RoleWithPermissions> {
    return this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description,
        permissions: data.permissionIds.length
          ? { create: data.permissionIds.map((permissionId) => ({ permissionId })) }
          : undefined,
      },
      select: roleSelect,
    });
  }

  /** Updates scalar fields and, when permissionIds is provided, replaces the grant set atomically. */
  async update(id: string, data: Prisma.RoleUpdateInput, permissionIds?: string[]) {
    await this.prisma.$transaction(async (tx) => {
      await tx.role.update({ where: { id }, data });
      if (permissionIds) {
        await tx.rolePermission.deleteMany({ where: { roleId: id } });
        if (permissionIds.length) {
          await tx.rolePermission.createMany({
            data: permissionIds.map((permissionId) => ({ roleId: id, permissionId })),
          });
        }
      }
    });
    return this.findById(id);
  }

  delete(id: string) {
    return this.prisma.role.delete({ where: { id } });
  }
}
