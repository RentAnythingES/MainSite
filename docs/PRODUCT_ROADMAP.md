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

## Completed

No product-roadmap items are recorded as completed in this document yet.

## Open catalogue verification

### Resolve two contradictory car-seat records

- **Priority:** P1 safety and catalogue integrity.
- **`car-seat-infant`:** The core record and Spanish page identify a rear-facing
  infant seat for 45–87 cm / up to 13 kg, while the English localization describes
  a different Unico Evo 40–150 cm rotating seat. Inspect the physical unit, approval
  label, model number, manual and included installation parts before choosing which
  identity is correct. Do not promote this record from the car-seat family owner
  until the contradiction is resolved.
- **`seat-booster`:** The record lacks a verified brand/model and mixes 1.2 kg and
  under-1 kg product facts, while the English copy makes unsupported absolute-safety
  claims. Inspect the physical label/manual and confirm its exact child range,
  approval and installation before rewriting or promoting it.
- **Guardrail:** Do not infer either identity from the current image or copy. Keep
  both existing listings operational but outside the governed family comparison
  until the physical evidence is recorded and reviewed.
