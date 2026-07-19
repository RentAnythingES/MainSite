# Technical SEO production audit — 19 July 2026

## Production baseline

The live technical audit covered all 110 sitemap URLs on
`https://www.rentanything.es` and reported:

- 0 pages with errors or warnings;
- 0 orphan pages;
- 0 pages beyond three clicks from the homepage;
- 0 broken internal links;
- 0 broken internal images;
- 0 linked indexable pages missing from the sitemap;
- 35 reciprocal English/Spanish hreflang pairs.

Eight internal product links are intentionally absent from the sitemap because those
products are not content-ready and render `noindex`. They are not indexation leaks.
The rendered SEO regression suite also passed all canonical, hreflang, cluster-pathway,
robots, sitemap, and representative product checks.

## Evergreen trust-page finding

The crawler showed that `/faq` had no `FAQPage` structured data and
`/how-it-works` had no `HowTo` or `FAQPage` structured data. More importantly, the
visible FAQ copy still described a cart, an automatic security-deposit hold, a fixed
free-delivery threshold, and unconditional changes that do not match the current
booking architecture.

The July 19 hardening batch aligns those pages and `/refunds` with the live flow:
server-checked availability, configured pickup/service zones, Stripe Checkout,
availability-dependent modifications, transparent delivery pricing, and no automatic
online security deposit. The same visible FAQ and process content now supplies the
structured data, preventing markup/content drift. The rendered regression audit now
requires these canonicals, statements, and schema types.

## Next external validation

After deployment, resubmit `sitemap.xml` in Google Search Console and inspect `/faq`
and `/how-it-works` alongside the existing representative category and product set.
Monitor enhancement parsing, canonical selection, and crawled-not-indexed changes.

## Spanish trust-page parity follow-up

The next code batch adds complete Spanish versions of the three operational trust
pages at `/es/faq`, `/es/how-it-works`, and `/es/refunds`. English and Spanish pages
declare reciprocal hreflang and self-canonicals; the Spanish header/footer now route
to the localized pages; and all three URLs enter the sitemap. This raises the expected
indexable sitemap count from 110 to 113 and adds three reciprocal locale pairs. The
Spanish FAQ and process schemas are generated from their visible translated content.
