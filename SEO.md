# SEO / GEO / AEO — status and playbook

Living document. Covers what is implemented in this repo, what is blocked on
information only you have, and what has to be done outside the codebase.

---

## 1. Implemented in code

### Structured data

All JSON-LD is emitted as plain `<script type="application/ld+json">` in the
**server HTML** via `components/JsonLd.tsx` → `JsonLdScript`.

> ⚠️ Do not switch these back to `next/script`. It injects client-side only, so
> the JSON-LD never reaches the static HTML. That was the original bug: every
> piece of structured data on the site was invisible to crawlers that do not
> execute JavaScript, and unreliable in the Rich Results Test.

| Schema type | Where | Source |
|---|---|---|
| `Organization` (+ `founder` Person, `knowsAbout`, `sameAs`) | every page, `@graph` | `lib/site.ts` |
| `WebSite` | every page, `@graph` | `lib/site.ts` |
| `ProfessionalService` (LocalBusiness) | `/contact` | `lib/site.ts` |
| `BreadcrumbList` | service detail, about, team, contact, certifications, careers, company, infrastructure | `lib/site.ts` |
| `ItemList` | `/services` | `lib/services.ts` |
| `Service` | each `/services/{slug}` | `lib/services.ts` |
| `FAQPage` | homepage + every service detail page with FAQs | `app/page.tsx`, `lib/service-details.ts` |
| `Person` × 7 | `/team` | `lib/team.ts` |

Entities cross-reference by `@id` (`lib/site.ts` → `ENTITY`) rather than being
duplicated, so Google resolves one company node, one website node, one founder.

### Crawl and index

- `app/robots.ts` — wildcard allow, plus explicit allows for AI answer-engine
  crawlers (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended,
  Applebot-Extended, CCBot, meta-externalagent). Several are opt-in by
  convention, so listing them is meaningful, not decorative.
- `app/sitemap.ts` — all 10 static routes + 18 service routes.
- `dynamicParams = false` on `/services/[slug]` — unknown slugs 404 statically
  instead of rendering an indexable "Service Not Found" page.
- `app/not-found.tsx` — 404s keep site chrome and route back into the hubs.
- Canonical on every page via `createPageMetadata`.

### On-page

- Exactly one `<h1>` per route (was missing on 7 of 11).
- Every page above ~350 words (five were under 60).
- OG/Twitter cards on every page, backed by a real 1200×630 image generated at
  build time (`app/opengraph-image.tsx`). Previously every page shared a square
  logo, which crops badly as `summary_large_image`.
- Meta descriptions unique and under ~160 characters.

### Accessibility

- Skip link → `#main-content`.
- `aria-hidden` on 63 decorative icons.
- Mobile nav open/close were `div[role="button"]` with no key handler and could
  not be operated by keyboard; now real `<button>`s with `aria-expanded` /
  `aria-controls`.
- `next/image` with explicit dimensions on the about and team photos (was raw
  `<img>` with no width/height → layout shift).

### Truthfulness / EEAT

Claims that could not be substantiated were removed rather than softened,
because buyers and Google both verify them:

- `/certifications` claimed ISO 27001, AWS, and Google Cloud certifications.
  Rebuilt as "Engineering Standards" describing practices we can demonstrate.
- Homepage stats must stay consistent with `SITE.foundingYear` (2019), which
  is published as `Organization.foundingDate`. A years-in-business figure that
  disagrees with it is a contradiction Google can see in our own markup.
  Current: 7+ years, 30+ projects, 100% code/IP ownership, 24/7 support.
- About page said the company was founded in **Surat**; `lib/site.ts` and the
  Google Business Profile say **Ahmedabad**. Standardised on Ahmedabad.

---

## 2. Blocked — needs information only you have

### 🔴 Social profile URLs (highest-value remaining code change)

`Organization.sameAs` is the strongest Knowledge Graph association signal and
is currently **empty**. Everything downstream is already wired: add entries to
`SOCIAL_LINKS` in `lib/site.ts` and both the footer icons and `sameAs` light up
automatically.

```ts
export const SOCIAL_LINKS = [
  { label: "LinkedIn",  icon: "fa-brands fa-linkedin-in", href: "https://www.linkedin.com/company/…" },
  { label: "Instagram", icon: "fa-brands fa-instagram",   href: "https://www.instagram.com/ramest_technolabs/" },
  { label: "GitHub",    icon: "fa-brands fa-github",      href: "https://github.com/…" },
];
```

Only add URLs that resolve — a broken `sameAs` is worse than an absent one.

### 🟡 Review schema

`AggregateRating` / `Review` markup requires **real, verifiable reviews**.
Fabricating them violates Google's structured data policy and risks a manual
action. Once you have Google Business Profile or Clutch reviews, they can be
marked up. Until then this target stays intentionally unmet.

### 🟡 Contact form has no backend

`components/ContactForm.tsx` submits via `mailto:`, which opens the user's mail
client. Many visitors will drop off, and no conversion can be tracked. Worth
replacing with a real endpoint (Vercel serverless route + email service).

---

## 3. Outside the codebase

These are on your target list but cannot be done from the repository.

### Google Business Profile

Highest-leverage local SEO work available, and entirely off-site.

- Primary category: **Software company**. Secondary: IT consultant, Website
  designer, Mobile app development company.
- NAP must match `lib/site.ts` **character for character** — Google
  cross-references the site against the profile:
  `RE11 - 2nd Floor, Iscon, Ambli Rd, Ahmedabad, Gujarat 380058`, `+91 9510903725`.
- Fill Services using the 18 names from `lib/services.ts` so the profile and
  site describe the same entity.
- Add real photos (office, team, work). Post weekly.
- Seed the Q&A section with the homepage FAQs.
- Request reviews from every completed client — this also unblocks Review schema.

### Search Console

- Verify the property (verification tokens are already in `app/layout.tsx`).
- Submit `https://www.ramesttechnolabs.com/sitemap.xml`.
- Watch Coverage for anything unexpectedly excluded, and Enhancements for the
  FAQ / Breadcrumb / Sitelinks searchbox reports now that schema is server-rendered.

### Citations / NAP consistency

Create or correct listings with identical NAP: Justdial, IndiaMART, Sulekha,
Clutch, GoodFirms, Crunchbase, LinkedIn, Glassdoor, Bing Places. Inconsistent
NAP across directories is the most common cause of weak local ranking.

### Core Web Vitals

Field data requires the deployed site — measure with PageSpeed Insights, not
a local build. One known code-side issue remains:

> Font Awesome loads as a render-blocking stylesheet from cdnjs
> (`app/layout.tsx`). A `preconnect` was added, but self-hosting a subset — or
> replacing the ~40 icons actually used with inline SVG — would remove a
> third-party render-blocking request from every page. Worth doing if LCP or
> FCP measures poorly in the field.

### Content / authority (ongoing)

The site has no blog, case studies, or portfolio. This is the main remaining
gap versus competitors like Hidden Brains, and the main driver of topical
authority and long-tail coverage. Suggested order:

1. **Case studies** — highest conversion value, and unblocks real proof.
2. **Blog** at `/blog` with `Article` schema — target the long-tail questions
   already answered in the service-page FAQs, expanded.
3. **Location pages** — only if you genuinely serve those markets. Thin
   doorway pages for cities you have no presence in are penalised.

---

## 4. Conventions to keep

- New page? Use `createPageMetadata` (canonical + OG + Twitter + robots) and
  `PageHero` (provides the single H1). Never use `SectionHeader` at the top of
  a page — it renders an `<h2>`.
- New route? Add it to `sitemapRoutes` in `lib/nav.ts`.
- Structured data goes through `JsonLdScript`, never `next/script`.
- Descriptive anchor text only. No "Learn more" / "Click here".
- Do not add a claim to the site that you could not substantiate to a client
  who asked for evidence.
