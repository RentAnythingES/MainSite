# Rent&Roll — SEO Strategy & Audit
> **Last updated**: 2026-08-11 · **Canonical migration**: deployed · **Release sitemap URLs**: 376

This is the **living SEO strategy document** for rentandroll.com. Updated after every SEO-related change. For prioritized fixes, see [SEO_ROADMAP.md](./SEO_ROADMAP.md).

---

## Quick Reference

| Document | Purpose |
|----------|---------|
| **This file** (`SEO_STRATEGY.md`) | Current site state, metrics, cluster health |
| [CORE_KEYWORD_OWNERSHIP.md](./CORE_KEYWORD_OWNERSHIP.md) | Preferred generic owners, supporting product roles and anti-cannibalization rules |
| [SEO_ROADMAP.md](./SEO_ROADMAP.md) | Prioritized action items and fixes |
| [COMPETITOR_REFERENCE.md](./COMPETITOR_REFERENCE.md) | Crawl-verified competitor data |
| [BLOG_CONTENT_STRATEGY.md](./BLOG_CONTENT_STRATEGY.md) | Blog quality standards and content pipeline |

---

## Current Portfolio Baseline — 11 August 2026

`https://rentandroll.com` is the deployed canonical origin. The 11 August 2026
production crawl covers all 370 pre-release sitemap URLs with zero page errors, warnings,
orphans, broken links or broken images. Every sitemap page is within three clicks
of the homepage and 183 EN/ES hreflang pairs validate. Six Spanish product owners
were restored, and governed bilingual product-family owners are live for mobility
scooters, wheelchairs, strollers, car seats and travel cots/cribs. The current
release activates the bilingual Kids & Family category with 20 reviewed secondary
memberships.
Search Console
and Keyword Planner research are complete; GA remains a separate user-owned
analytics task. See
[TECHNICAL_SEO_AUDIT_20260811.md](./TECHNICAL_SEO_AUDIT_20260811.md).

The current release build adds the two bilingual Kids & Family category URLs and
produces a 376-URL sitemap. The full rendered regression must pass against the live
catalogue before and after the batched deployment.

| Layer | English | Spanish | Current role |
|-------|---------|---------|--------------|
| Commercial category hubs | 7 | 7 | Broad transactional owners, including the reviewed Kids & Family discovery collection |
| Product-family owners | 5 | 5 | Narrow transactional owners for mobility scooters, wheelchairs, strollers, car seats and travel cots/cribs |
| Indexable product pages | 114 | 114 | Exact-item and model demand with EN/ES eligibility parity |
| Blog articles | 8 | 8 | Planning, comparison, seasonal and tutorial intent |
| Discover sub-hubs | 5 | 5 | Beaches, neighbourhoods, attractions, day trips and events |
| Discover guides | 26 | 26 | Valencia destination and situational planning |
| Kit detail pages | 8 | 8 | Multi-item use cases and bundle discovery |

Older counts farther down this document are historical milestones. Use the current
database readiness audit, generated sitemap, and regression suite as the release
inventory authorities.

Discover category widgets are bounded previews rather than full catalogue dumps.
The 24 July performance pass reduced the Malvarrosa guide artifact from 181,413
to 122,143 bytes while retaining product previews and a labelled route to the
complete category. See
[DISCOVER_PERFORMANCE_AUDIT_20260724.md](./DISCOVER_PERFORMANCE_AUDIT_20260724.md).

FAQ coverage is an informational quality measure, not a universal publication or
indexability gate. Add product FAQs only where they answer a genuine customer
decision and emit FAQ structured data only for visible answers.

Kids & Family contains 20 reviewed secondary memberships. Its EN/ES routes are
indexable and appear in the sitemap, primary navigation, homepage and Valencia hub.
Every product retains its original primary category, product URL and canonical.

Each product has one primary category owner and may have governed secondary
discovery memberships. Secondary placement exposes the same product in another
useful category grid; it does not create another product URL, canonical, inventory
record, or keyword owner.

### Commercial cluster depth

| Cluster | EN / ES indexable products | Main supporting layers | Expansion posture |
|---------|----------------------------|------------------------|-------------------|
| Beach & Outdoor | 49 / 49 | Category, Family Beach kit, beach/summer blogs, 4 beach guides | Strongest cluster; the category visibly merchandises every active member as a full card |
| Baby & Toddler | 33 / 33 | Category, stroller, car-seat and cot/crib family owners, Baby Arrival and Toddler City kits, family/baby articles | Governed families own unmodified selection intent; products retain exact-item intent |
| Mobility & Accessibility | 6 / 6 | Category, mobility-scooter and wheelchair family owners, 2 accessibility kits, accessibility guide, local guides | Family owners handle generic type-selection intent; exact products retain their modifiers |
| Remote Work | 6 / 6 | Category, Remote Work kit, nomad guide, home-office tutorial | Deepen exact workstation and temporary-stay decisions |
| Apartment Comfort | 8 / 8 | Category, Summer and Long-Stay kits, cooling guide | Deepen only from measured long-stay demand |
| Kids & Family | 20 / 20 | Category, Toddler City and Family Beach kits, family guide and exact products | Active reviewed discovery collection; expand only through explicit product-fit review |
| Sports & Wellness | 15 / 15 | Category, Turia Gardens guide and product pathways | Includes three secondary bike-carrier discovery listings; expand only with approved inventory and distinct demand |

### Ownership sanity review — 11 August 2026

This review compares each commercial owner with the live governed memberships,
not merely with an earlier keyword recommendation. A category owner must describe
the complete shop surface it controls; a strong secondary query cannot replace the
category identity in the visible H1.

| Owner | Live scope | Status |
|-------|------------|--------|
| Baby & Toddler | 33 products; stroller, car-seat and cot/crib families have separate narrow owners | Aligned: broad category owns the full baby-equipment shop; family pages own selection intent and follow the complete category catalogue |
| Kids & Family | 20 reviewed secondary products | Aligned: active broad owner with a useful collection; primary product categories and canonicals remain unchanged |
| Mobility & Accessibility | 6 products; scooters and wheelchairs have separate family owners | Aligned: broad category retains general mobility intent; family owners handle type selection and exact products retain their modifiers |
| Remote Work | 6 products | Aligned: the broad workstation owner matches monitors, desk and chair inventory |
| Apartment Comfort | 8 products spanning cooling, air quality, cleaning and practical home equipment | Visible H1, breadcrumb, schema name and intro corrected to the broad category. AC-only metadata remains an explicit review item because it conflicts with the approved broad owner |
| Beach & Outdoor | 49 products spanning beach, camping, water, transport and outdoor equipment | Needs review: the current beach-only H1 and metadata are narrower than the catalogue. Do not change them without an approved ownership decision |
| Sports & Wellness | 15 products spanning sport, fitness and recovery, plus three secondary bike-carrier memberships | Heading ownership is broad enough. Supporting body copy needs a later content review because it still over-emphasises the original tennis/padel launch inventory |

The five published family owners—mobility scooters, wheelchairs, strollers, car seats
and travel cots/cribs—show
their complete governed product sets before guidance and do not replace or hide the
parent category catalogue. Product pages remain the sole exact-item/model owners;
secondary category membership does not create duplicate product URLs.

---

## Strategic Direction

The SEO system should support the brand promise: **Travel light. Rent what you need.**

Rent&Roll should not behave like a generic rental catalogue. The core funnel should become:

`Valencia guide section -> practical friction point -> relevant kit/bundle -> configurable add-ons -> availability / WhatsApp support -> individual products as needed`

This means the next SEO layer is not simply more product pages. It is a data-driven kit/bundle architecture, clearer customer-facing categories, and contextual guide CTAs.

Product pages now have a dedicated publication framework in
[PRODUCT_CONTENT_STRATEGY.md](./PRODUCT_CONTENT_STRATEGY.md). They capture
bottom-funnel item demand only after verified facts, operational readiness,
metadata, local links, and locale content are complete; they do not replace the
guide and kit layers.

### Product Content Review Pipeline

Imported products remain inactive by default. Editorial enrichment is completed
in small, source-backed batches and recorded in
`PRODUCT_CONTENT_BATCH_01.md`, `PRODUCT_CONTENT_BATCH_02.md`,
`PRODUCT_CONTENT_BATCH_03.md`, `PRODUCT_CONTENT_BATCH_04.md`, and
`PRODUCT_CONTENT_BATCH_05.md`, `PRODUCT_CONTENT_BATCH_06.md`, and
`PRODUCT_CONTENT_BATCH_07.md`, `PRODUCT_CONTENT_BATCH_08.md`, and
`PRODUCT_CONTENT_BATCH_09.md` through `PRODUCT_CONTENT_BATCH_20.md`. A product may progress to `facts_verified` when
its model facts, English SEO copy, and FAQs are source-checked, but it cannot be
published until physical stock, approved pricing, image-use status, and the full
`content_ready` checklist are complete.

Priority structural changes:

- Split `Baby & Children` into `Baby & Toddler` and `Kids & Family`
- Introduce kit pages for Family Beach, Baby Arrival, Toddler City, Remote Work, Summer Apartment, Accessible Valencia, Grandparents Visiting, and Long-Stay Kitchen
- Rename display categories toward customer intent: `Mobility & Accessibility`, `Apartment Comfort`, `Beach & Outdoor`, `Pregnancy & Postpartum`
- Keep URLs stable until redirects/canonicals are planned; display names can change first
- Build partner/brand surfaces later as measurable kit pilots, not generic sponsorship banners

## Site Architecture

```
rentandroll.com/
├── /                               Homepage (photo carousel hero, photo categories)
│
├── /product/                       Product pages (37 EN + 37 ES indexable)
│   └── /product/[slug]             Individual product + BookingWidget
│
├── /rental/                        Category pages (6 categories per locale)
│   ├── /rental/baby-gear
│   ├── /rental/mobility
│   ├── /rental/remote-work
│   ├── /rental/home-living
│   ├── /rental/travel-outdoors
│   ├── /rental/kids-family
│   └── /rental/[category]/[family] Governed family owners (scooters, wheelchairs, strollers, car seats, cots/cribs)
│
├── /blog/                          Blog hub (8 posts live per locale)
│   └── /blog/[slug]                Individual posts (Article + FAQ JSON-LD)
│
├── /discover/                      Discover hub (photo-backed)
│   ├── /discover/neighbourhoods    Hub: neighbourhood guides
│   ├── /discover/day-trips         Hub: day trip guides
│   ├── /discover/attractions       Hub: attraction guides
│   ├── /discover/events            Hub: event guides
│   └── /discover/[slug]            Individual destination guides (14 live)
│
├── /valencia                       Valencia landing page (photo hero)
├── /valencia/kits                  Kit/bundle hub
│   └── /valencia/kits/[slug]       Individual kit pages (8 live)
├── /about                          About page
├── /contact                        Contact form (Resend-powered)
│
├── /privacy                        Legal
├── /terms                          Legal
├── /refunds                        Legal
├── /cookies                        Legal
│
├── /sitemap.xml                    Dynamic sitemap
└── /robots.txt                     Robots
```

### API Routes (not indexed)
```
Public:
  /api/bookings       POST — Create booking + block dates
  /api/contact        POST — Send contact email via Resend
  /api/availability   GET  — Check product availability for date range

Admin (Supabase Auth protected):
  /api/admin/login        POST     — Authenticate, set httpOnly cookies
  /api/admin/logout       POST     — Clear auth cookies
  /api/admin/products     GET/POST — List / create products
  /api/admin/products/[id] PUT/DEL — Update / deactivate product
  /api/admin/bookings     GET      — List bookings (optional status filter)
  /api/admin/bookings/[id] PUT     — Update booking status
  /api/admin/categories   GET      — List categories (for dropdowns)

Admin Dashboard:
  /admin                  Dashboard overview (stats, quick actions)
  /admin/login            Supabase Auth email/password login
  /admin/products         Product table (edit, toggle, pricing tiers)
  /admin/products/new     Add new product form
  /admin/bookings         Booking list with lifecycle management
```

---

## Cluster Health

### 🛒 Products (37 EN / 37 ES indexable pages) — 🟠 Editorial queue active
- Live database baseline: 178 total products, 37 active, 37 indexable in English and 37 in Spanish
- Each page has: name, brand, description, features, specs, pricing tiers
- BookingWidget with date picker, tiered pricing calculator, WhatsApp deep-link
- JSON-LD Product structured data
- Internal links to category page + related products

### 📂 Categories (6 pages per locale) — ✅ Complete
- Rendered from product data, grouped by category
- Each page: category description, product grid, internal links

### 📝 Blog (8 posts live per locale) — ✅ Initial library complete
- Data-driven architecture (`src/content/blog.ts`)
- 8 planning posts live in English and Spanish with Article JSON-LD + FAQ schema
- Cross-linked to products, categories, and discover pages

### 📦 Kits & Bundles (9 pages including hub) — ✅ Initial Layer Live
- Data-driven architecture (`src/data/bundles.ts`)
- Hub page at `/valencia/kits`
- 8 individual kit pages with related products, guides, add-ons, FAQ, and Product JSON-LD
- Current handoff is WhatsApp while configurable bundle checkout remains future work

### 📍 Valencia Landing (1 page) — ✅ Live
- Local SEO landing page
- Valencia-specific content, neighbourhood mentions

### 📄 Legal (4 pages per locale) — ✅ Complete
- Privacy, Terms, Refunds and Cookies in English and Spanish

---

## Technical SEO Checklist

| Item | Status | Notes |
|------|--------|-------|
| Sitemap | ✅ Dynamic | `src/app/sitemap.ts` — all products + categories |
| Title tags | ✅ All ≤60 | Using `| Rent&Roll` suffix |
| Canonical tags | ✅ | Set in `generateMetadata()` |
| JSON-LD (Product) | ✅ | Product pages have structured data |
| JSON-LD (Article) | ✅ | Blog posts have Article + FAQ JSON-LD |
| Open Graph / Twitter | ✅ | Title, description, image on all pages |
| Robots.txt | ✅ | Standard allow-all with sitemap reference |
| Google Search Console | 🔲 | Needs verification + sitemap submission |
| Internal linking | ✅ | Products ↔ blog ↔ categories ↔ discover all cross-linked |
| i18n / hreflang | 🔲 | Planned (EN + ES) — not yet implemented |
| Blog | ✅ | 8 bilingual posts live with Article + FAQ JSON-LD |
| Discover guides | ✅ | 5 destination guides live with photo heroes + product widgets |

---

## Keyword Coverage

### Tier 1 — Direct Booking Intent (highest value)

| Keyword (EN) | Keyword (ES) | Target Page | Competition |
|-------------|-------------|-------------|-------------|
| stroller rental Valencia | alquiler cochecito Valencia | `/rental/baby-gear/strollers` + `/es/rental/baby-gear/strollers` | Medium |
| wheelchair rental Valencia | alquiler silla de ruedas Valencia | `/rental/mobility` | Medium |
| mobility scooter hire Valencia | alquiler scooter movilidad Valencia | `/rental/mobility/mobility-scooters` + `/es/rental/mobility/mobility-scooters` | Medium |
| baby equipment rental Valencia | alquiler material bebé Valencia | `/rental/baby-gear` | Medium |
| car seat rental Valencia | alquiler silla coche Valencia | `/rental/baby-gear/car-seats` + `/es/rental/baby-gear/car-seats` | Low |
| travel crib rental Valencia | alquiler cuna viaje Valencia | `/product/travel-crib` | Low |

### Tier 2 — Zero Competition (blue ocean)

| Keyword (EN) | Keyword (ES) | Target Page | Competition |
|-------------|-------------|-------------|-------------|
| monitor rental Valencia | alquiler monitor Valencia | `/rental/remote-work` | **None** |
| standing desk rental Valencia | alquiler escritorio Valencia | `/rental/remote-work` | **None** |
| portable AC rental Valencia | alquiler aire acondicionado portátil Valencia | `/rental/home-living` | **None** |
| air purifier rental Valencia | alquiler purificador aire Valencia | `/rental/home-living` | **None** |
| beach gear rental delivery Valencia | alquiler material playa Valencia | `/rental/travel-outdoors` | **None** |

### Tier 3 — Informational / Blog Content

| Keyword (EN) | Target | Content Type |
|-------------|--------|-------------|
| Valencia with kids | Blog post | Family travel guide |
| wheelchair accessible Valencia | Blog post | Accessibility guide |
| digital nomad Valencia | Blog post | Remote work guide |
| things to rent on holiday | Blog post | General rental guide |
| Valencia summer tips | Blog post | Seasonal content |

---

## Competitor Gap Analysis

| Metric | Rent&Roll | Babonbo | Amigo 24 | Motion4rent |
|--------|-------------|---------|----------|-------------|
| Categories covered | 5 (all-in-one) | 1 (baby) | 1 (mobility) | 1 (mobility) |
| Total product pages | 16 | ~20 (Valencia) | ~10 | ~8 |
| Blog posts | 0 (4 planned) | 0 | Yes (thin) | 0 |
| Languages | EN (ES planned) | EN, ES, DE, FR+ | EN, ES | EN, ES |
| Online booking | ✅ Instant | ✅ Via platform | ❌ Phone/form | ❌ Form |
| Modern UX | ✅ | ✅ | ❌ | ⚠️ |
| Valencia-specific content | ✅ | ⚠️ Generic | ⚠️ | ✅ |
| Remote work equipment | ✅ | ❌ | ❌ | ❌ |
| Home/AC equipment | ✅ | ❌ | ❌ | ❌ |

**Key advantage**: We are the ONLY platform covering all 5 verticals with modern UX and English-first content. Remote work and home/AC categories have zero competition.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-08-11 | Corrected the visible EN/ES Apartment Comfort category scope: H1, breadcrumb, CollectionPage name and intro now represent the complete catalogue rather than presenting the category as a portable-AC-only page. Preserved existing metadata ownership for separate review and added exact bilingual H1 regression across all category routes. |
| 2026-08-11 | Retired the invalid category-card cap and forced subgroup layout: EN/ES category owners now show every active member as a full product card in one continuous grid, with optional comparison owners following rather than displacing merchandise. Added rendered regression coverage for full-card parity and flat-grid preservation. |
| 2026-08-11 | Corrected the car-seat catalogue while retaining the existing family owner: four false product identities are replaced with the confirmed named seats, and three interchangeable generic backless boosters remain one model-neutral product with capacity three. The transactional preview, build and rendered EN/ES regression passed. |
| 2026-08-11 | Prepared governed EN/ES car-seat family owner with three verified choices; contradictory infant and unidentified booster records remain excluded pending physical catalogue verification |
| 2026-06-18 | Homepage: photo carousel hero, photo-backed category cards |
| 2026-06-18 | Valencia page: photo hero + photo category cards |
| 2026-06-18 | Discover hub: photo hero + photo-backed hub cards |
| 2026-06-18 | Discover guides: compact category-based product widget strips |
| 2026-06-18 | Fixed heading color override in globals.css (was blocking text-white) |
| 2026-06-18 | Two-layer photo overlay pattern established (bg-black/50 + gradient) |
| 2026-06-17 | Initial SEO strategy document created |
| 2026-06-17 | Competitor research completed — see COMPETITOR_REFERENCE.md |
| 2026-06-17 | Keyword map established (Tier 1-3) |
| 2026-06-17 | Supabase backend deployed (schema + seed + API routes) |
| 2026-06-17 | Contact form backend (Resend) deployed |
## Spanish kit cluster parity — 21 July 2026

The existing eight scenario-led Valencia kit pages now have complete Spanish
counterparts under `/es/valencia/kits`. This adds one localized commercial hub and
eight localized long-tail landing pages without creating new keyword owners or
changing bundle inventory. English and Spanish pages use reciprocal hreflang and
localized internal links; both sets remain subordinate to their category and guide
clusters. The Spanish configurator displays translated item names while submitting
canonical bundle identifiers to the shared request and availability APIs.
