import { Controller, Get, Param, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { QueryPublicPostsDto } from './dto/query-public-posts.dto';
import { Public } from '../../common/decorators/public.decorator';

/** Public reads for the Next.js frontend — published (or due-to-publish
 * scheduled) posts only, safe fields only, no auth required. */
@Controller('blog/public/posts')
export class PublicPostsController {
  constructor(private readonly posts: PostsService) {}

  @Public()
  @Get()
  list(@Query() query: QueryPublicPostsDto) {
    return this.posts.listPublic(query);
  }

  @Public()
  @Get(':slug')
  getBySlug(@Param('slug') slug: string) {
    return this.posts.getPublicBySlug(slug);
  }
}
