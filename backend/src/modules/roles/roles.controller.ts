import { Body, Controller, Delete, Get, Ip, Param, Patch, Post } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly roles: RolesService) {}

  @Get()
  @RequirePermissions('role:read')
  list() {
    return this.roles.list();
  }

  @Get(':id')
  @RequirePermissions('role:read')
  findOne(@Param('id') id: string) {
    return this.roles.findOne(id);
  }

  @Post()
  @RequirePermissions('role:write')
  create(@Body() dto: CreateRoleDto, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.roles.create(dto, user, ip);
  }

  @Patch(':id')
  @RequirePermissions('role:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    return this.roles.update(id, dto, user, ip);
  }

  @Delete(':id')
  @RequirePermissions('role:write')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.roles.remove(id, user, ip);
  }
}
