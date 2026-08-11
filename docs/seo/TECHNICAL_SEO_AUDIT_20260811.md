# Production Technical SEO Receipt — 11 August 2026

## Scope

- Canonical origin: `https://rentandroll.com`
- Sitemap URLs crawled: 370
- Crawl completed: 11 August 2026 at 11:36 UTC
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
| Validated EN/ES hreflang pairs | 183 |
| Internal images checked | 204 |
| Broken internal images | 0 |

The SEO regression suite also passed against production, including the English
and Spanish mobility-scooter, stroller and car-seat family owners, their canonicals,
hreflang links, sitemap entries, indexability, CollectionPage/BreadcrumbList/FAQPage
structured data, visible decision content, exact included-product links and links
back from representative product pages. The car-seat owner contains the three
coherent Britax, Peg Perego and Kinderkraft choices; the contradictory infant seat,
unidentified second booster and inactive Maxi-Cosi draft remain excluded. The Hamax
bike trailer remains excluded from the stroller family, and all six legacy product
redirects return permanent 308s.

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
4. Local production-mode crawls initially treated canonical `rentandroll.com`
   links as external to the local audit origin. URL normalization now maps both
   the retired and current canonical hosts to the configured audit origin, so
   orphan, click-depth, hreflang and internal-link metrics remain meaningful in
   local release-candidate crawls.

## Release references

- PR #14: governed bilingual mobility-scooter owner and data migration
- PR #15: direct image delivery for product-family cards
- PR #16: direct image delivery for EN/ES kit-related product cards
- PR #18: governed bilingual stroller owner, verified product corrections and
  scalable family-owner regression coverage
- PR #20: governed bilingual car-seat owner, three scoped product corrections,
  explicit catalogue exclusions and family-scoped regression coverage
