import { Module } from '@nestjs/common';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';
import { SeoRepository } from './seo.repository';
import { SearchConsoleService } from './search-console.service';

@Module({
  controllers: [SeoController],
  providers: [SeoService, SeoRepository, SearchConsoleService],
  exports: [SearchConsoleService],
})
export class SeoModule {}
