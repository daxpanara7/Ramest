import { Controller, Get, Query } from '@nestjs/common';
import { SeoService } from './seo.service';
import { RequirePermissions } from '../../common/decorators/permissions.decorator';
import { SearchConsoleService } from './search-console.service';

/**
 * SEO Command Center — read-only aggregation over blog content plus
 * honestly-labelled placeholders for metrics that need external tooling
 * (PageSpeed Insights API, a crawler, a citation tracker) not wired up yet.
 * No mutations, so no AuditService calls are needed here.
 */
@Controller('seo')
@RequirePermissions('seo:read')
export class SeoController {
  constructor(
    private readonly seo: SeoService,
    private readonly gsc: SearchConsoleService,
  ) {}

  /**
   * Live Google Search Console data. Every response carries `enabled` so the
   * UI can distinguish "no data yet" from "integration not configured" —
   * those look identical otherwise and waste a lot of debugging time.
   *
   * `days` is clamped: GSC keeps ~16 months, and an unbounded value would let
   * a caller request a query that times out.
   */
  @Get('search-console/summary')
  async gscSummary(@Query('days') days?: string) {
    if (!this.gsc.enabled) return { enabled: false, reason: 'GOOGLE_SERVICE_ACCOUNT_JSON not configured' };
    const d = clampDays(days);
    const [totals, series, devices] = await Promise.all([
      this.gsc.totalsWithPrevious(d),
      this.gsc.timeseries(d),
      this.gsc.devices(d),
    ]);
    return { enabled: true, site: this.gsc.siteUrl, days: d, ...totals, series, devices };
  }

  @Get('search-console/pages')
  async gscPages(@Query('days') days?: string) {
    if (!this.gsc.enabled) return { enabled: false, items: [] };
    return { enabled: true, items: await this.gsc.pages(clampDays(days)) };
  }

  @Get('search-console/queries')
  async gscQueries(@Query('days') days?: string) {
    if (!this.gsc.enabled) return { enabled: false, items: [] };
    return { enabled: true, items: await this.gsc.queries(clampDays(days)) };
  }

  @Get('search-console/countries')
  async gscCountries(@Query('days') days?: string) {
    if (!this.gsc.enabled) return { enabled: false, items: [] };
    return { enabled: true, items: await this.gsc.countries(clampDays(days)) };
  }

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

/** GSC retains ~16 months; anything outside 1..480 days is a bad request. */
function clampDays(raw?: string): number {
  const n = Number(raw);
  if (!Number.isFinite(n)) return 28;
  return Math.min(480, Math.max(1, Math.trunc(n)));
}
