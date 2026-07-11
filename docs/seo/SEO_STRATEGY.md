# RentAnything.es — SEO Strategy & Audit
> **Last updated**: 2026-07-08 · **Build**: ✅ Clean · **Total pages**: ~89+

This is the **living SEO strategy document** for rentanything.es. Updated after every SEO-related change. For prioritized fixes, see [SEO_ROADMAP.md](./SEO_ROADMAP.md).

---

## Quick Reference

| Document | Purpose |
|----------|---------|
| **This file** (`SEO_STRATEGY.md`) | Current site state, metrics, cluster health |
| [SEO_ROADMAP.md](./SEO_ROADMAP.md) | Prioritized action items and fixes |
| [COMPETITOR_REFERENCE.md](./COMPETITOR_REFERENCE.md) | Crawl-verified competitor data |
| [BLOG_CONTENT_STRATEGY.md](./BLOG_CONTENT_STRATEGY.md) | Blog quality standards and content pipeline |

---

## Strategic Direction

The SEO system should support the brand promise: **Travel light. Feel at home.**

RentAnything.es should not behave like a generic rental catalogue. The core funnel should become:

`Valencia guide section -> practical friction point -> relevant kit/bundle -> configurable add-ons -> availability / WhatsApp support -> individual products as needed`

This means the next SEO layer is not simply more product pages. It is a data-driven kit/bundle architecture, clearer customer-facing categories, and contextual guide CTAs.

Product pages now have a dedicated publication framework in
[PRODUCT_CONTENT_STRATEGY.md](./PRODUCT_CONTENT_STRATEGY.md). They capture
bottom-funnel item demand only after verified facts, operational readiness,
metadata, local links, and locale content are complete; they do not replace the
guide and kit layers.

Priority structural changes:

- Split `Baby & Children` into `Baby & Toddler` and `Kids & Family`
- Introduce kit pages for Family Beach, Baby Arrival, Toddler City, Remote Work, Summer Apartment, Accessible Valencia, Grandparents Visiting, and Long-Stay Kitchen
- Rename display categories toward customer intent: `Mobility & Accessibility`, `Apartment Comfort`, `Beach & Outdoor`, `Pregnancy & Postpartum`
- Keep URLs stable until redirects/canonicals are planned; display names can change first
- Build partner/brand surfaces later as measurable kit pilots, not generic sponsorship banners

## Site Architecture

```
rentanything.es/
├── /                               Homepage (photo carousel hero, photo categories)
│
├── /product/                       Product pages (16 products)
│   └── /product/[slug]             Individual product + BookingWidget
│
├── /rental/                        Category pages (5 categories)
│   ├── /rental/baby-gear
│   ├── /rental/mobility
│   ├── /rental/remote-work
│   ├── /rental/home-living
│   └── /rental/travel-outdoors
│
├── /blog/                          Blog hub (4 posts live)
│   └── /blog/[slug]                Individual posts (Article + FAQ JSON-LD)
│
├── /discover/                      Discover hub (photo-backed)
│   ├── /discover/neighbourhoods    Hub: neighbourhood guides
│   ├── /discover/day-trips         Hub: day trip guides
│   ├── /discover/attractions       Hub: attraction guides
│   ├── /discover/events            Hub: event guides
│   └── /discover/[slug]            Individual destination guides (5 live)
│
├── /valencia                       Valencia landing page (photo hero)
├── /valencia/kits                  Kit/bundle hub
│   └── /valencia/kits/[slug]       Individual kit pages (6 live)
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

### 🛒 Products (16 pages) — ✅ Complete
- All products rendered from `src/data/products.ts`
- Each page has: name, brand, description, features, specs, pricing tiers
- BookingWidget with date picker, tiered pricing calculator, WhatsApp deep-link
- JSON-LD Product structured data
- Internal links to category page + related products

### 📂 Categories (5 pages) — ✅ Complete
- Rendered from product data, grouped by category
- Each page: category description, product grid, internal links

### 📝 Blog (4 posts live) — ✅ Complete
- Data-driven architecture (`src/content/blog.ts`)
- 4 launch posts live with Article JSON-LD + FAQ schema
- Cross-linked to products, categories, and discover pages

### 📦 Kits & Bundles (7 pages) — ✅ Initial Layer Live
- Data-driven architecture (`src/data/bundles.ts`)
- Hub page at `/valencia/kits`
- 8 individual kit pages with related products, guides, add-ons, FAQ, and Product JSON-LD
- Current handoff is WhatsApp while configurable bundle checkout remains future work

### 📍 Valencia Landing (1 page) — ✅ Live
- Local SEO landing page
- Valencia-specific content, neighbourhood mentions

### 📄 Legal (4 pages) — ✅ Complete
- Privacy, Terms, Refunds, Cookies

---

## Technical SEO Checklist

| Item | Status | Notes |
|------|--------|-------|
| Sitemap | ✅ Dynamic | `src/app/sitemap.ts` — all products + categories |
| Title tags | ✅ All ≤60 | Using `| RentAnything.es` suffix |
| Canonical tags | ✅ | Set in `generateMetadata()` |
| JSON-LD (Product) | ✅ | Product pages have structured data |
| JSON-LD (Article) | ✅ | Blog posts have Article + FAQ JSON-LD |
| Open Graph / Twitter | ✅ | Title, description, image on all pages |
| Robots.txt | ✅ | Standard allow-all with sitemap reference |
| Google Search Console | 🔲 | Needs verification + sitemap submission |
| Internal linking | ✅ | Products ↔ blog ↔ categories ↔ discover all cross-linked |
| i18n / hreflang | 🔲 | Planned (EN + ES) — not yet implemented |
| Blog | ✅ | 4 posts live with Article + FAQ JSON-LD |
| Discover guides | ✅ | 5 destination guides live with photo heroes + product widgets |

---

## Keyword Coverage

### Tier 1 — Direct Booking Intent (highest value)

| Keyword (EN) | Keyword (ES) | Target Page | Competition |
|-------------|-------------|-------------|-------------|
| stroller rental Valencia | alquiler cochecito Valencia | `/rental/baby-gear` | Medium |
| wheelchair rental Valencia | alquiler silla de ruedas Valencia | `/rental/mobility` | Medium |
| mobility scooter hire Valencia | alquiler scooter movilidad Valencia | `/rental/mobility` | Medium |
| baby equipment rental Valencia | alquiler material bebé Valencia | `/rental/baby-gear` | Medium |
| car seat rental Valencia | alquiler silla coche Valencia | `/product/car-seat-infant` | Low |
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

| Metric | RentAnything | Babonbo | Amigo 24 | Motion4rent |
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
