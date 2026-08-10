# Rent&Roll — Product Roadmap

> Last updated: 2026-08-10. Purpose: track product capabilities separately from SEO content, search demand
> validation and technical SEO work.

## Planned

### Multi-category product membership

- **Status:** Planned; not scheduled or authorized for implementation.
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
- **SEO relationship:** SEO Strategy defines how memberships affect discovery and
  ownership, but this capability remains a product-platform project. SEO audit
  work can continue independently.

## Completed

No product-roadmap items are recorded as completed in this document yet.
