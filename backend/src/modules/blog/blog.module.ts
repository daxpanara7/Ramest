import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PublicPostsController } from './public-posts.controller';
import { CategoriesController } from './categories.controller';
import { TagsController } from './tags.controller';
import { PostsService } from './posts.service';
import { CategoriesService } from './categories.service';
import { TagsService } from './tags.service';
import { PostsRepository } from './posts.repository';
import { CategoriesRepository } from './categories.repository';
import { TagsRepository } from './tags.repository';

// PrismaService and AuditService are global (PrismaModule, AuditModule) and
// need no re-import here.
@Module({
  controllers: [PostsController, PublicPostsController, CategoriesController, TagsController],
  providers: [
    PostsService,
    CategoriesService,
    TagsService,
    PostsRepository,
    CategoriesRepository,
    TagsRepository,
  ],
})
export class BlogModule {}
