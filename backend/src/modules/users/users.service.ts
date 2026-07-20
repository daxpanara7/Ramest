import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { PasswordService } from '../auth/password.service';
import { AuditService } from '../../common/audit/audit.service';
import type { AuthUser } from '../../common/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUsersDto } from './dto/list-users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UsersRepository,
    private readonly passwords: PasswordService,
    private readonly audit: AuditService,
  ) {}

  list(query: ListUsersDto) {
    return this.repo.findMany({
      search: query.search,
      skip: query.skip,
      take: query.take,
    });
  }

  async findOne(id: string) {
    const user = await this.repo.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(dto: CreateUserDto, actor: AuthUser, ip?: string) {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) throw new ConflictException('A user with this email already exists');

    if (dto.roleIds?.length) {
      await this.assertRolesExist(dto.roleIds);
    }

    const passwordHash = await this.passwords.hash(dto.password);
    const user = await this.repo.create({
      name: dto.name,
      email: dto.email,
      passwordHash,
      roleIds: dto.roleIds,
    });

    await this.audit.record({
      userId: actor.id,
      action: 'user.create',
      entity: 'User',
      entityId: user.id,
      ip,
    });

    return user;
  }

  async update(id: string, dto: UpdateUserDto, actor: AuthUser, ip?: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('User not found');

    if (dto.roleIds?.length) {
      await this.assertRolesExist(dto.roleIds);
    }

    const data: Prisma.UserUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    const updated = await this.repo.update(id, data, dto.roleIds);

    await this.audit.record({
      userId: actor.id,
      action: 'user.update',
      entity: 'User',
      entityId: id,
      ip,
    });

    return updated;
  }

  async remove(id: string, actor: AuthUser, ip?: string) {
    if (id === actor.id) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundException('User not found');

    await this.repo.softDelete(id);

    await this.audit.record({
      userId: actor.id,
      action: 'user.delete',
      entity: 'User',
      entityId: id,
      ip,
    });

    return { ok: true };
  }

  private async assertRolesExist(roleIds: string[]) {
    const unique = new Set(roleIds);
    const count = await this.repo.countExistingRoles(roleIds);
    if (count !== unique.size) {
      throw new BadRequestException('One or more roleIds are invalid');
    }
  }
}
