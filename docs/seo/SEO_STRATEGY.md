# RentAnything.es — SEO Strategy & Audit
> **Last updated**: 2026-06-17 · **Build**: ✅ Clean · **Total pages**: ~37

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

## Site Architecture

```
rentanything.es/
├── /                               Homepage (hero, categories, value props, trust)
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
├── /blog/                          Blog hub (planned — data-driven)
│   └── /blog/[slug]                Individual posts
│
├── /valencia                       Valencia landing page (local SEO)
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
/api/bookings    POST — Create booking + block dates
/api/contact     POST — Send contact email via Resend
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

### 📝 Blog (0 live, 4 planned) — 🔲 Not Started
- Data-driven architecture planned (`src/content/blog.ts`)
- 4 initial posts identified (see BLOG_CONTENT_STRATEGY.md)
- Article JSON-LD + FAQ schema planned

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
| JSON-LD (Article) | 🔲 | Planned for blog posts |
| Open Graph / Twitter | ✅ | Title, description, image on all pages |
| Robots.txt | ✅ | Standard allow-all with sitemap reference |
| Google Search Console | 🔲 | Needs verification + sitemap submission |
| Internal linking | ⚠️ | Products link to categories, needs cross-cluster expansion |
| i18n / hreflang | 🔲 | Planned (EN + ES) — not yet implemented |
| Blog | 🔲 | Data-driven blog architecture not yet built |

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
| 2026-06-17 | Initial SEO strategy document created |
| 2026-06-17 | Competitor research completed — see COMPETITOR_REFERENCE.md |
| 2026-06-17 | Keyword map established (Tier 1-3) |
| 2026-06-17 | Supabase backend deployed (schema + seed + API routes) |
| 2026-06-17 | Contact form backend (Resend) deployed |
