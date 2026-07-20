import {
  Body,
  Controller,
  Delete,
  Get,
  Ip,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PublishPostDto } from './dto/publish-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';

/** Admin CRUD + publish workflow for blog posts. */
@Controller('blog/posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  @RequirePermissions('blog:read')
  list(@Query() query: QueryPostsDto) {
    return this.posts.list(query);
  }

  @Get(':id')
  @RequirePermissions('blog:read')
  getById(@Param('id') id: string) {
    return this.posts.getById(id);
  }

  /** Admin preview pane: same lookup as getById, regardless of status. */
  @Get(':id/preview')
  @RequirePermissions('blog:read')
  preview(@Param('id') id: string) {
    return this.posts.preview(id);
  }

  @Post()
  @RequirePermissions('blog:write')
  create(@Body() dto: CreatePostDto, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.posts.create(dto, user.id, { ip });
  }

  @Patch(':id')
  @RequirePermissions('blog:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    return this.posts.update(id, dto, user.id, { ip });
  }

  @Post(':id/publish')
  @RequirePermissions('blog:publish')
  publish(
    @Param('id') id: string,
    @Body() dto: PublishPostDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    return this.posts.publish(id, dto, user.id, { ip });
  }

  @Post(':id/unpublish')
  @RequirePermissions('blog:publish')
  unpublish(@Param('id') id: string, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.posts.unpublish(id, user.id, { ip });
  }

  @Delete(':id')
  @RequirePermissions('blog:delete')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.posts.remove(id, user.id, { ip });
  }
}
