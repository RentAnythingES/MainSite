# Technical SEO Audit — 17 July 2026

## Scope

The automated audit checks every sitemap URL for response status, title and
description metadata, canonical consistency, robots directives, one H1,
document language, Open Graph/Twitter metadata, image alt text, JSON-LD
validity, sitemap orphaning, and broken internal links.

Run it with:

```bash
npm run audit:technical-seo
```

Set `SEO_BASE_URL` to audit another deployment and `SEO_AUDIT_OUTPUT` to retain
the complete JSON report.

## Findings and fixes

The first live crawl covered 95 sitemap URLs and found 28 hard failures. Every
failure was a Spanish URL rendered with `<html lang="en">`. The root layout now
uses the pathname locale injected by middleware, so Spanish documents render
with `lang="es"` and English documents remain `lang="en"`.

Shared metadata fixes also:

- remove automatic duplicate brand suffixes from page titles;
- provide a default social preview image;
- provide article and destination social images at template level;
- prevent the language switch from linking to untranslated `/es/...` routes;
- correct the obsolete `/discover/albufera-natural-park` link to `/discover/albufera`.

The crawler now normalizes apex and `www` URLs to the audited origin and checks
linked non-sitemap targets for 404 responses. A broken internal link causes the
audit command to fail.

## Verified result

The final production-build crawl covered the 71 routes available from the local
static fallback and returned:

- 0 pages with hard errors;
- 0 sitemap orphans;
- 0 broken internal links;
- 19 pages with non-blocking metadata-length warnings.

The local build cannot load Supabase-only products because outbound database
access is restricted in the build environment. The initial live crawl provides
coverage of those database-backed routes, while the local crawl verifies the
updated shared product and locale templates.

## Editorial follow-up

The remaining warnings are title or description lengths, concentrated in older
Discover guides, several blog posts, and a small number of legacy product SEO
records. These are editorial optimization tasks rather than technical indexing
failures. Product copy remains subject to the existing manual content-review
workflow; this audit did not activate, archive, or rewrite catalogue records.

## Evidence

- `technical-seo-audit-results-20260717.json` — pre-fix live crawl
- `technical-seo-audit-local-20260717.json` — final production-build crawl
