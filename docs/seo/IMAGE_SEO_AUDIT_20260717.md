# Image SEO and Media Performance Audit

> Audit date: 2026-07-17

## Scope

The audit covers every raster asset committed under `public/`, plus rendered
image-alt validation already enforced by the technical SEO crawler.

## Baseline findings

- 46 raster assets occupied 35,474,739 bytes (33.8 MiB).
- 34 files had an extension/content mismatch: they were named `.png` but
  contained JPEG data.
- 38 assets exceeded 500 KB.
- No exact duplicate assets were found.

The mismatched file types could produce incorrect response metadata and made the
asset library harder to validate. The oversized source files also increased
repository, build and uncached transfer costs even where Next.js generated a
smaller derivative.

## Remediation

- Converted the 44 category, destination, hero and static product images to
  correctly encoded WebP at quality 82.
- Updated all page, component, structured-data and social-image references.
- Added `npm run audit:image-seo` to fail on files above 1.5 MB or extension/content
  mismatches, and warn on files above 500 KB, dimensions above 3000 px or exact
  duplicates.
- Retained PNG for the brand and application icons, where transparency and icon
  compatibility matter.

## Result

- 46 raster assets now occupy 6,910,088 bytes (6.6 MiB).
- Static raster weight fell by 28,564,651 bytes, or 80.5%.
- The post-remediation audit reports zero errors, zero warnings and zero duplicate
  groups.
- The rendered technical crawl validates 79 primary and social image URLs with
  zero broken responses or invalid content types.
- Existing image dimensions remain unchanged, avoiding layout or crop changes.

Machine-readable evidence:

- `docs/seo/image-seo-audit-before-20260717.json`
- `docs/seo/image-seo-audit-local-20260717.json`

## Ongoing rule

Run `npm run audit:image-seo` before deployment whenever repository-hosted media
is added or replaced. Product images uploaded to Supabase remain outside this
filesystem audit and should continue through the admin image-rights and content
readiness workflow.
