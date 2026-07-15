# SEO Indexing Readiness Audit — 15 July 2026

## Executive status

RentAnything.es has a strong initial content footprint, but the technical index
signals and catalogue publication state are not yet aligned. The immediate SEO
priority is to correct canonical, hreflang, sitemap, and product-readiness
behaviour before expanding the number of indexed pages.

## Verified live footprint

- Live sitemap: 85 URLs
- English product URLs in sitemap: 16
- Spanish product URLs in sitemap: 16
- Blog posts: 6
- Discover destination guides: 14, plus 4 discover hubs and the main hub
- Valencia kit pages: 8, plus the kit hub
- Production catalogue records: 156
- Active products: 22
- Inactive products: 134
- Catalogue status: 77 draft, 73 facts verified, 6 content ready
- Active products marked content ready: 4
- Active products with both EN and ES localization records: 5
- Active products with stored FAQs: 5
- Active products with an approved primary editorial image record: 4
- Active products with pricing: 22

These counts show that the content architecture has outgrown the static sitemap
and the current SEO roadmap documentation.

## Critical findings

The P0 implementation addressing these findings was prepared on 15 July 2026.
The findings remain the pre-deployment baseline until the production deployment
and Search Console validation are complete.

### 1. English product canonicals point to the homepage

The root layout declares the homepage canonical and EN/ES homepage alternates.
English product metadata does not override those values. A live check of
`/product/beach-umbrella-set` returned:

- canonical: `https://rentanything.es`
- English alternate: `https://rentanything.es`
- Spanish alternate: `https://rentanything.es/es`

This tells search engines that the product page is a duplicate of the homepage
and can prevent the product URL from being selected for indexing. Every
indexable route must emit a self-referencing canonical, and bilingual pages must
emit reciprocal route-specific hreflang alternates.

### 2. The sitemap is static while the catalogue is database-driven

`src/app/sitemap.ts` imports the original 16 static products. Production has 21
active products, so at least five active product URLs and their possible Spanish
counterparts are absent. Conversely, Spanish routes are generated for all 16
static products even when the database does not contain Spanish editorial copy.

The sitemap should query production catalogue data, include only intentionally
indexable products, include Spanish URLs only when Spanish content is complete,
and use durable `updated_at` values rather than assigning the current timestamp
to every URL on every sitemap request.

### 3. Activation and SEO readiness are separate states

Only 3 of 21 active products are marked `content_ready`. Only 4 active products
have both EN and ES localization records, 4 have database FAQs, and 3 have an
approved primary image record. Active products can therefore be publicly
accessible before the editorial publication checklist is complete.

Define one explicit `is_indexable` decision based on active status, content
readiness, pricing, approved imagery, and locale completeness. Products that are
operationally visible but not editorially ready should emit `noindex, follow`
and remain outside the sitemap until they pass the checklist.

### 4. Spanish parity is not yet catalogue-wide

The Spanish product route can render database products without a Spanish
localization, falling back to English product fields. This risks thin or
duplicated Spanish pages. Spanish product URLs should only be indexable and
included in hreflang when their Spanish title, description, product details,
metadata, and key FAQs are complete.

### 5. Product structured data needs locale and availability review

The shared Product JSON-LD helper always uses an English product URL and always
reports `InStock`. Spanish pages therefore point structured data at the English
URL, and temporarily unavailable or blocked inventory may still claim to be in
stock. Structured data should use the current locale URL and a truthful,
server-derived availability state. Product images and seller/business identity
should be included where supported and accurate.

## Prioritized roadmap

### P0 — Indexing correctness

1. Remove the inherited homepage canonical from non-home routes.
2. Add self-canonicals and reciprocal EN/ES hreflang to every indexable pair.
3. Replace the static product sitemap with a database-backed indexability feed.
4. Add `noindex, follow` for active products that do not pass publication checks.
5. Include Spanish product URLs only when Spanish editorial content is complete.
6. Make Product and Breadcrumb JSON-LD locale-aware and availability-aware.
7. Re-submit the sitemap and validate representative URLs in Search Console.

### P1 — Commercial landing-page strength

1. Finish EN/ES readiness for the active catalogue before bulk activation.
2. Prioritize seasonal and high-intent clusters: portable air conditioning,
   beach equipment, strollers, travel cots, car seats, wheelchairs and mobility.
3. Strengthen category hubs as the main transactional targets; use product pages
   for model-specific and long-tail intent.
4. Add contextual links between products, categories, kits and relevant Valencia
   guides, with descriptive anchor text rather than generic calls to action.
5. Reconcile category naming and database taxonomy, then preserve established
   URLs with redirects and canonicals if slugs eventually change.

### P2 — Local authority and trust

1. Complete and optimize the Google Business Profile.
2. Keep business name, address, phone, service area and opening information
   consistent across the site, structured data and external profiles.
3. Build a genuine post-rental review request flow and surface verified reviews.
4. Acquire relevant local links from accommodation partners, relocation firms,
   family travel resources, accessibility resources and Valencia guides.
5. Replace temporary or AI destination imagery with licensed real photography
   where it materially improves trust and local specificity.

### P3 — Content growth based on Search Console evidence

1. Use query and impression data to update existing pages before creating large
   volumes of new content.
2. Continue two strong blog or guide updates per month, prioritizing pages that
   support a transactional category or kit.
3. Expand neighbourhood, beach and arrival-planning content only where each page
   has distinct local value and a clear route to relevant inventory.
4. Build comparison, sizing, transport and practical-use guides around recurring
   customer questions.
5. Complete Spanish parity before adding German or French catalogue coverage.

### P4 — Measurement and quality control

1. Maintain a weekly Search Console dashboard for indexed URLs, excluded URLs,
   impressions, clicks, CTR, average position and crawl errors.
2. Track organic landing page to availability check, booking draft, Checkout and
   completed booking in GA4.
3. Add an automated SEO regression check for canonicals, hreflang, robots,
   sitemap membership, metadata lengths and structured-data validity.
4. Establish Core Web Vitals baselines for homepage, category, product, kit and
   guide templates, then address template-level regressions.
5. Refresh the main SEO strategy and roadmap counts after the P0 fixes land.

## Search Console actions requiring account access

- Confirm the domain property is verified.
- Confirm `https://rentanything.es/sitemap.xml` is submitted and currently read.
- Review Page Indexing reasons, especially duplicate/canonical selections,
  crawled-not-indexed pages, soft 404s and blocked resources.
- Inspect the homepage, one category, one English product, its Spanish equivalent,
  one kit and one guide after the technical fixes deploy.
- Record the first 28-day query and page baseline before major content expansion.

## Official references

- Google Search Central: canonical URLs —
  https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Search Central: localized versions and hreflang —
  https://developers.google.com/search/docs/specialty/international/localized-versions
- Google Search Central: build and submit a sitemap —
  https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Search Console Help: Page indexing report —
  https://support.google.com/webmasters/answer/7440203?hl=en
