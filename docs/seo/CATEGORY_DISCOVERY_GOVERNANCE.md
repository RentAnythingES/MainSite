# Category Discovery Governance

> **Last updated:** 2026-07-21

## Purpose

Product activation, customer discovery and SEO publication must use the same
category policy. An active product must never link to a missing category hub or
remain reachable only through a direct URL.

## Category states

1. **Import-only category** — may contain inactive editorial drafts but has no
   customer navigation, category route, sitemap entry or product indexability.
2. **Public category cluster** — appears in Browse navigation, homepage and
   Valencia category surfaces, has complete English and Spanish hub content,
   enters the sitemap and permits ready products to become indexable.
3. **Retired category** — removed only through a controlled reclassification and
   redirect plan after all active products have moved.

## Publication criteria

A category can become public when it has:

- at least one owned, active or launch-ready product with confirmed stock;
- a coherent customer need and a distinct keyword owner;
- complete English and Spanish hub copy, metadata and FAQs;
- a locally stored, rights-cleared category image;
- useful internal pathways beyond the product grid;
- inclusion in category, product, sitemap and regression audits.

Category breadth alone is not enough. Bulk-import groups remain private until
the inventory and customer experience justify a public surface.

## Current decision

`fitness-wellness` is published to customers as **Sports & Wellness** / **Deporte
y Bienestar**. The Tennis/Padel Ball Machine is active, content-ready and in
stock, while a padel racket is already in the editorial queue. The existing slug
is retained to avoid an unnecessary database migration.

`events-celebrations`, `photography-content`, `pregnancy` and
`catalogue-review` remain import-only because they currently have no active
inventory. They must not be added to navigation or sitemap merely because draft
records exist.

## Enforcement

- `src/data/seo-clusters.ts` is the shared public-category source for navigation,
  sitemap generation and product SEO eligibility.
- Admin activation rejects products assigned to a category without a public hub.
- Catalogue updates explicitly revalidate product routes, Valencia catalogue
  pages and the sitemap so stale metadata cannot leave indexable URLs outside the
  sitemap.
- Run `npm run audit:category-coverage` to list every category and detect active
  products outside the public set.
- Run `npm run audit:product-seo`, `npm run audit:seo` and
  `npm run audit:technical-seo` before and after category publication.
