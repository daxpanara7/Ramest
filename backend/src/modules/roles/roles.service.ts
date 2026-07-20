import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { AuditService } from '../../common/audit/audit.service';
import type { AuthUser } from '../../common/decorators/current-user.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

/** These roles are seeded by the platform and must always exist. */
const PROTECTED_ROLE_NAMES = ['admin', 'editor', 'viewer'];

@Injectable()
export class RolesService {
  constructor(
    private readonly repo: RolesRepository,
    private readonly audit: AuditService,
  ) {}

  async list() {
    const items = await this.repo.findMany();
    return { items, total: items.length };
  }

  async listPermissions() {
    const items = await this.repo.findAllPermissions();
    return { items, total: items.length };
  }

  async findOne(id: string) {
    const role = await this.repo.findById(id);
    if (!role) throw new NotFoundException('Role not found');
    return role;
  }

  async create(dto: CreateRoleDto, actor: AuthUser, ip?: string) {
    const existing = await this.repo.findByName(dto.name);
    if (existing) throw new ConflictException('A role with this name already exists');

    const permissionIds = await this.resolvePermissionIds(dto.permissionKeys);

    const role = await this.repo.create({
      name: dto.name,
      description: dto.description,
      permissionIds,
    });

    await this.audit.record({
      userId: actor.id,
      action: 'role.create',
      entity: 'Role',
      entityId: role.id,
      ip,
    });

    return role;
  }

  async update(id: string, dto: UpdateRoleDto, actor: AuthUser, ip?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Role not found');

    const permissionIds = dto.permissionKeys
      ? await this.resolvePermissionIds(dto.permissionKeys)
      : undefined;

    const updated = await this.repo.update(id, { description: dto.description }, permissionIds);

    await this.audit.record({
      userId: actor.id,
      action: 'role.update',
      entity: 'Role',
      entityId: id,
      ip,
    });

    return updated;
  }

  async remove(id: string, actor: AuthUser, ip?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('Role not found');
    if (PROTECTED_ROLE_NAMES.includes(existing.name)) {
      throw new ForbiddenException(`The built-in "${existing.name}" role cannot be deleted`);
    }

    await this.repo.delete(id);

    await this.audit.record({
      userId: actor.id,
      action: 'role.delete',
      entity: 'Role',
      entityId: id,
      ip,
    });

    return { ok: true };
  }

  private async resolvePermissionIds(keys?: string[]): Promise<string[]> {
    if (!keys || keys.length === 0) return [];
    const uniqueKeys = [...new Set(keys)];
    const permissions = await this.repo.findPermissionsByKeys(uniqueKeys);
    if (permissions.length !== uniqueKeys.length) {
      throw new BadRequestException('One or more permissionKeys are invalid');
    }
    return permissions.map((p) => p.id);
  }
}
