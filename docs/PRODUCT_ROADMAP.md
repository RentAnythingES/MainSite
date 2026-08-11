# Rent&Roll — Product Roadmap

> Last updated: 2026-08-11. Purpose: track product capabilities separately from SEO content, search demand
> validation and technical SEO work.

## Completed

### Multi-category product membership

- **Status:** Deployed and live-verified on 2026-08-10.
- **Priority:** P1 product architecture.
- **Problem:** Products can currently have only one `category_id`, although a
  customer may reasonably expect the same item under several need-based
  categories—for example Kids & Family plus Sports & Wellness, or Kids & Family
  plus Baby & Toddler.
- **Outcome:** Each product has exactly one primary category and may have governed
  secondary category memberships. Customers can discover the same item from
  several relevant category pages without duplicating the product, stock, price,
  booking identity or public product URL.
- **Primary-category role:** Default admin classification, breadcrumb, structured
  hierarchy and principal internal parent.
- **Secondary-category role:** Additional catalogue discovery only. It does not
  create another product page, canonical URL or keyword owner.
- **Required product work:** Add an additive product/category membership model;
  backfill current categories as primary; add primary plus secondary controls to
  admin and import flows; make category listings membership-aware and deduplicate
  products; preserve existing booking and market-offer behavior.
- **Acceptance:** Every catalogue-ready product has exactly one primary category;
  duplicate membership pairs are impossible; secondary membership is optional and
  reviewed; category grids contain unique products; existing product URLs and
  bookings remain unchanged.
- **Guardrails:** No freeform category tags, automated keyword-based assignment,
  duplicate category-specific product routes or category placement used solely to
  pad an empty catalogue page.
- **Dependencies:** Schema and data migration plan, admin UX, import/export
  contract, category read-model changes, breadcrumb/schema tests and catalogue
  membership review.
- **Implemented:** Primary/secondary membership invariants, membership-aware public
  category reads, create/edit controls, CSV and Excel import/export support, and a
  guarded repair moving five transport products from Mobility to Travel & Outdoors.
  The three bike carriers also use Fitness & Wellness as secondary discovery.
- **Live verification:** EN and ES render 6 unique Mobility products, 49 unique
  Travel & Outdoors products, and 15 unique Sports & Wellness products. The five
  moved products retain their existing product URLs and canonicals; no duplicate
  product links were introduced.
- **SEO relationship:** SEO Strategy defines how memberships affect discovery and
  ownership, but this capability remains a product-platform project. SEO audit
  work can continue independently.
- **Kids & Family activation:** A reviewed 20-product secondary membership set is
  live in production for the bilingual Kids & Family category. It deliberately excludes
  infant-only equipment, generic adult products and two child lifejacket records
  with conflicting documented weight ranges; all included products retain their
  existing primary category and canonical URL.

## Completed

No product-roadmap items are recorded as completed in this document yet.

## Catalogue corrections ready for release

### Replace the contradictory car-seat records

- **Priority:** P1 catalogue integrity and revenue protection.
- **Confirmed catalogue:** four distinct named seats—Moni Serengeti i-Size,
  Maxi-Cosi Pebble 360 Pro2 without base, Peg Perego Viaggio1 Duo-Fix Rouge and
  Kinderkraft I-SPARK 2 PLUS i-Size—plus one generic backless-booster listing.
- **Generic boosters:** the business owns three interchangeable units. They remain
  one model-neutral customer listing with stock and online capacity set to three;
  they must not be split into invented brand/model pages.
- **Preservation rule:** keep the existing product UUIDs so prices, booking history
  and operational references remain attached while false names, slugs, copy and
  images are replaced.
- **Release state:** the rollback preview, production build and rendered EN/ES
  regression passed. The production database correction is applied; the matching
  route redirects and five-product family configuration are included in this release.
- **Evidence:** see
  [`docs/seo/CAR_SEAT_CATALOGUE_CORRECTION_2026-08-11.md`](seo/CAR_SEAT_CATALOGUE_CORRECTION_2026-08-11.md).
