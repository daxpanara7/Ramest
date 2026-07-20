import { Body, Controller, Delete, Get, Ip, Param, Post } from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('blog/tags')
export class TagsController {
  constructor(private readonly tags: TagsService) {}

  /** Public: the frontend needs the tag list to render filters. */
  @Public()
  @Get()
  list() {
    return this.tags.list();
  }

  @Post()
  @RequirePermissions('blog:write')
  create(@Body() dto: CreateTagDto, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.tags.create(dto, user.id, { ip });
  }

  @Delete(':id')
  @RequirePermissions('blog:write')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.tags.remove(id, user.id, { ip });
  }
}
