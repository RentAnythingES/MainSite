# Production Technical SEO Receipt — 11 August 2026

## Scope

- Canonical origin: `https://rentandroll.com`
- Sitemap URLs crawled: 366
- Crawl completed: 11 August 2026 at 09:01 UTC
- Regression command: `npm run audit:seo`
- Full-crawl command: `npm run audit:technical-seo`

## Verified result

| Check | Result |
|---|---:|
| Pages with errors | 0 |
| Pages with warnings | 0 |
| Orphan pages | 0 |
| Pages deeper than three clicks | 0 |
| Maximum click depth | 3 |
| Pages with one or fewer inbound links | 0 |
| Unlisted internal links | 0 |
| Broken internal links | 0 |
| Indexable unlisted internal links | 0 |
| Validated EN/ES hreflang pairs | 181 |
| Internal images checked | 204 |
| Broken internal images | 0 |

The SEO regression suite also passed against production, including the English
and Spanish mobility-scooter family owners, their canonicals, hreflang links,
sitemap entries, indexability, CollectionPage/BreadcrumbList/FAQPage structured
data, visible decision content, and links from the scooter product pages.

## Issues found and resolved during release verification

1. The new family routes initially inherited preview `noindex` behavior. Both
   routes now declare page-level `index, follow`, and production verification
   confirms no `noindex` metadata.
2. Vercel returned `OPTIMIZED_IMAGE_REQUEST_PAYMENT_REQUIRED` for uncached product
   image variants. The source assets returned 200. Product-family cards and the
   related-product cards on EN/ES kit pages now serve their reviewed source files
   directly; the final production crawl reports zero broken images.
3. The technical audit's robots parser still expected the retired
   `rentanything.es` sitemap declaration. It now validates
   `https://rentandroll.com/sitemap.xml`.

## Release references

- PR #14: governed bilingual mobility-scooter owner and data migration
- PR #15: direct image delivery for product-family cards
- PR #16: direct image delivery for EN/ES kit-related product cards
