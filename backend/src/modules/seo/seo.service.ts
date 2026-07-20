import { Injectable } from '@nestjs/common';
import { SeoRepository } from './seo.repository';

/** Shape shared by every metric this module cannot derive from the database. */
interface Placeholder {
  score: null;
  status: 'not_measured';
  source: 'placeholder';
  note: string;
}

const placeholder = (note: string): Placeholder => ({
  score: null,
  status: 'not_measured',
  source: 'placeholder',
  note,
});

/** Placeholder shape for the /technical sub-metrics (no numeric score field). */
interface TechnicalPlaceholder {
  status: 'not_measured';
  source: 'placeholder';
  note: string;
}

const technicalPlaceholder = (note: string): TechnicalPlaceholder => ({
  status: 'not_measured',
  source: 'placeholder',
  note,
});

const SCHEMA_TYPES = ['Organization', 'WebSite', 'BreadcrumbList', 'FAQPage', 'Service', 'Person'] as const;

/**
 * Read-only aggregation for the SEO Command Center. Every response is
 * honestly labelled with `source: "computed"` (derived from the database,
 * right now) or `source: "placeholder"` (needs an external tool that isn't
 * wired up yet — no numbers are invented for those).
 */
@Injectable()
export class SeoService {
  constructor(private readonly repo: SeoRepository) {}

  /** GET /seo/overview — top-level dashboard of sub-scores. */
  async overview() {
    const [statusCounts, gapCounts] = await Promise.all([
      this.repo.countsByStatus(),
      this.repo.publishedGapCounts(),
    ]);

    return {
      seo: {
        ...placeholder(
          'Populated by an SEO scoring engine (e.g. the Lighthouse SEO category via the PageSpeed Insights API) once configured.',
        ),
        signals: {
          source: 'computed' as const,
          note: 'Real metadata coverage across published posts — see /seo/content and /seo/metadata-coverage for detail.',
          publishedPosts: statusCounts.published,
          publishedMissingMetaTitleOrDescription: gapCounts.missingMetaTitleOrDescription,
          publishedMissingExcerpt: gapCounts.missingExcerpt,
          publishedMissingCoverImage: gapCounts.missingCoverImage,
        },
      },
      geo: placeholder(
        'GEO (Generative Engine Optimization) readiness needs an answer-engine citation tracker once configured. See /seo/geo.',
      ),
      aeo: {
        ...placeholder(
          'AEO (Answer Engine Optimization) scoring needs an external FAQ/answer-quality evaluator once configured. See /seo/aeo.',
        ),
        signals: {
          source: 'computed' as const,
          note: 'Published post count only — FAQ-block detection is not derivable from BlogPost alone.',
          publishedPosts: statusCounts.published,
        },
      },
      performance: placeholder(
        'Populated by real Lighthouse / Core Web Vitals runs via the PageSpeed Insights API once configured.',
      ),
    };
  }

  /** GET /seo/content — computed blog content + metadata coverage counts. */
  async content() {
    const [statusCounts, gapCounts] = await Promise.all([
      this.repo.countsByStatus(),
      this.repo.publishedGapCounts(),
    ]);

    return {
      source: 'computed' as const,
      posts: statusCounts,
      metadataGaps: {
        note: 'Counts are scoped to PUBLISHED posts — those are the pages actually indexable by search engines.',
        missingMetaTitleOrDescription: gapCounts.missingMetaTitleOrDescription,
        missingExcerpt: gapCounts.missingExcerpt,
        missingCoverImage: gapCounts.missingCoverImage,
      },
    };
  }

  /** GET /seo/metadata-coverage — per-post metadata booleans + gap list. */
  async metadataCoverage() {
    const rows = await this.repo.publishedMetadataRows();

    const posts = rows.map((row) => {
      const hasMetaTitle = !!row.metaTitle;
      const hasMetaDescription = !!row.metaDescription;
      const hasCanonical = !!row.canonicalUrl;
      const hasOgImage = !!row.ogImageId;
      return {
        slug: row.slug,
        title: row.title,
        hasMetaTitle,
        hasMetaDescription,
        hasCanonical,
        hasOgImage,
        complete: hasMetaTitle && hasMetaDescription && hasCanonical && hasOgImage,
      };
    });

    const gaps = posts.filter((p) => !p.complete).map((p) => p.slug);

    return {
      source: 'computed' as const,
      totalPublished: posts.length,
      summary: {
        missingMetaTitle: posts.filter((p) => !p.hasMetaTitle).length,
        missingMetaDescription: posts.filter((p) => !p.hasMetaDescription).length,
        missingCanonical: posts.filter((p) => !p.hasCanonical).length,
        missingOgImage: posts.filter((p) => !p.hasOgImage).length,
        fullyComplete: posts.filter((p) => p.complete).length,
      },
      slugsWithGaps: gaps,
      posts,
    };
  }

  /** GET /seo/schema-status — structured-data types the frontend emits. */
  schemaStatus() {
    return {
      source: 'placeholder' as const,
      note: 'This lists the JSON-LD schema types the frontend is configured to emit. It does not verify they validate — live validation needs the Google Rich Results API (or a similar structured-data testing tool) once configured.',
      schemas: SCHEMA_TYPES.map((type) => ({ type, configured: true, source: 'placeholder' as const })),
    };
  }

  /** GET /seo/technical — Lighthouse / CWV / crawler / sitemap placeholders. */
  technical() {
    return {
      lighthouse: technicalPlaceholder(
        'Needs a real Lighthouse run (e.g. via the PageSpeed Insights API) once configured.',
      ),
      coreWebVitals: technicalPlaceholder(
        'Needs field data from the Chrome UX Report / PageSpeed Insights API once configured.',
      ),
      brokenLinks: technicalPlaceholder('Needs a site crawler (e.g. a scheduled link-checker job) once configured.'),
      sitemapStatus: technicalPlaceholder(
        'Sitemap generation lives in the frontend app (app/sitemap.ts), not this backend — status would need to be fetched from there or checked live.',
      ),
      robotsStatus: technicalPlaceholder(
        'robots.txt generation lives in the frontend app (app/robots.ts), not this backend — status would need to be fetched from there or checked live.',
      ),
    };
  }

  /** GET /seo/geo — Generative Engine Optimization readiness (placeholder). */
  geo() {
    return {
      source: 'placeholder' as const,
      note: 'GEO readiness (entity coverage, answer-engine citations) needs an external citation tracker / entity-graph tool once configured. Nothing here is derivable from the current database.',
      entityCoverage: placeholder('Needs an entity/knowledge-graph coverage check once configured.'),
      answerEngineCitations: placeholder(
        'Needs a citation tracker across answer engines (e.g. ChatGPT, Perplexity, Gemini) once configured.',
      ),
    };
  }

  /** GET /seo/aeo — Answer Engine Optimization readiness (mostly placeholder). */
  async aeo() {
    const publishedPosts = await this.repo.countPublished();

    return {
      source: 'placeholder' as const,
      note: 'AEO scoring (answer-format quality, FAQ-block detection) needs a content evaluator once configured. Only the published post count below is real.',
      publishedPosts: { value: publishedPosts, source: 'computed' as const },
      faqCoverage: placeholder(
        'Needs FAQ-block/schema detection per post once configured — not derivable from BlogPost fields alone.',
      ),
      answerFormatQuality: placeholder(
        'Needs an answer-engine readiness evaluator (e.g. featured-snippet / direct-answer heuristics) once configured.',
      ),
    };
  }
}
