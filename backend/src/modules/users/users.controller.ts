import { Body, Controller, Delete, Get, Ip, Param, Patch, Post, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUsersDto } from './dto/list-users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  @RequirePermissions('user:read')
  list(@Query() query: ListUsersDto) {
    return this.users.list(query);
  }

  @Get(':id')
  @RequirePermissions('user:read')
  findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }

  @Post()
  @RequirePermissions('user:write')
  create(@Body() dto: CreateUserDto, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.users.create(dto, user, ip);
  }

  @Patch(':id')
  @RequirePermissions('user:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    return this.users.update(id, dto, user, ip);
  }

  @Delete(':id')
  @RequirePermissions('user:delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.users.remove(id, user, ip);
  }
}
