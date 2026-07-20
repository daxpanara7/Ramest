import { Module } from '@nestjs/common';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';
import { SeoRepository } from './seo.repository';

@Module({
  controllers: [SeoController],
  providers: [SeoService, SeoRepository],
})
export class SeoModule {}
