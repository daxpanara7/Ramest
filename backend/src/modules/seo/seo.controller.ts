import { Controller, Get } from '@nestjs/common';
import { SeoService } from './seo.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';

/**
 * SEO Command Center — read-only aggregation over blog content plus
 * honestly-labelled placeholders for metrics that need external tooling
 * (PageSpeed Insights API, a crawler, a citation tracker) not wired up yet.
 * No mutations, so no AuditService calls are needed here.
 */
@Controller('seo')
@RequirePermissions('seo:read')
export class SeoController {
  constructor(private readonly seo: SeoService) {}

  @Get('overview')
  overview() {
    return this.seo.overview();
  }

  @Get('content')
  content() {
    return this.seo.content();
  }

  @Get('metadata-coverage')
  metadataCoverage() {
    return this.seo.metadataCoverage();
  }

  @Get('schema-status')
  schemaStatus() {
    return this.seo.schemaStatus();
  }

  @Get('technical')
  technical() {
    return this.seo.technical();
  }

  @Get('geo')
  geo() {
    return this.seo.geo();
  }

  @Get('aeo')
  aeo() {
    return this.seo.aeo();
  }
}
