import { Body, Controller, Delete, Get, Ip, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('blog/categories')
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  /** Public: the frontend needs the category list to render filters/nav. */
  @Public()
  @Get()
  list() {
    return this.categories.list();
  }

  @Post()
  @RequirePermissions('blog:write')
  create(@Body() dto: CreateCategoryDto, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.categories.create(dto, user.id, { ip });
  }

  @Patch(':id')
  @RequirePermissions('blog:write')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
    @CurrentUser() user: AuthUser,
    @Ip() ip: string,
  ) {
    return this.categories.update(id, dto, user.id, { ip });
  }

  @Delete(':id')
  @RequirePermissions('blog:write')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser, @Ip() ip: string) {
    return this.categories.remove(id, user.id, { ip });
  }
}
