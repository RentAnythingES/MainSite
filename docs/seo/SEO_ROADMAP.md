# RentAnything.es — SEO Roadmap
> **Last updated**: 2026-06-17 · Prioritized by estimated traffic impact × effort

---

## ✅ Completed

- [x] 16 product pages with structured data (JSON-LD Product)
- [x] 5 category pages
- [x] Dynamic sitemap (`src/app/sitemap.ts`)
- [x] Title tags ≤60 chars on all pages
- [x] Canonical tags on all pages
- [x] Open Graph / Twitter meta on all pages
- [x] Valencia landing page (local SEO)
- [x] Legal pages (privacy, terms, refunds, cookies)
- [x] BookingWidget with pricing calculator
- [x] Contact form (Resend-powered)
- [x] Google Analytics integration (env var ready)
- [x] Supabase backend (schema, seed, API)
- [x] SEO documentation framework (this file + strategy + competitor ref + blog strategy)

---

## 🔴 Tier 1 — High Impact, Low-Medium Effort

### 1.1 Build data-driven blog architecture
**Impact**: 🔴 Critical · **Effort**: 2 hours · **Status**: Next up

Create `src/content/blog.ts` with BlogPost interface and auto-publishing gate. Build `/blog/[slug]` template with Article JSON-LD, FAQ schema, hero image, internal links.

**Files**: `src/content/blog.ts`, `src/app/blog/[slug]/page.tsx`, `src/app/blog/page.tsx`

---

### 1.2 Publish 4 launch blog posts
**Impact**: 🔴 High · **Effort**: 2-3 hours · **Status**: Blocked on 1.1

| Post | Primary Keyword | Est. Impact |
|------|----------------|-------------|
| Valencia with Kids | `Valencia with kids` | High — family travel traffic |
| Accessible Valencia | `wheelchair accessible Valencia` | High — accessibility traffic |
| Digital Nomad Valencia | `digital nomad Valencia` | Medium — nomad traffic |
| Valencia Summer Guide | `Valencia summer tips` | Medium — seasonal |

---

### 1.3 Google Search Console setup
**Impact**: 🔴 High · **Effort**: 10 min · **Status**: Open (user action)

Verify domain, submit sitemap. Monitor crawl errors and indexing.

---

### 1.4 Cross-cluster internal linking audit
**Impact**: 🟠 High · **Effort**: 30 min · **Status**: Open

Product pages should link to related blog posts. Blog posts link to products. Category pages should have editorial prose sections.

---

## 🟠 Tier 2 — Medium Impact, Medium Effort

### 2.1 i18n — Spanish translations (EN/ES)
**Impact**: 🟠 High · **Effort**: 4-6 hours · **Status**: Open

Valencia is Spain. Spanish content is essential for domestic visitors and Google.es ranking.

**Architecture**: next-intl with locale routing (`/es/product/[slug]`)
**Priority pages**: Homepage, category pages, top 5 products, contact

---

### 2.2 Category page editorial enrichment
**Impact**: 🟡 Medium · **Effort**: 1 hour · **Status**: Open

Add 2 editorial H2 prose sections to each category page. Target category-level keywords ("baby equipment rental Valencia", "mobility hire Spain").

---

### 2.3 FAQ schema on product pages
**Impact**: 🟡 Medium · **Effort**: 1 hour · **Status**: Open

Add FAQ sections to product pages with JSON-LD FAQSchema. Target PAA questions.

---

### 2.4 Valencia neighbourhood pages
**Impact**: 🟡 Medium · **Effort**: 2-3 hours · **Status**: Future

Create `/valencia/[neighbourhood]` pages for: Ruzafa, El Carmen, Malvarrosa, Cabanyal, Benimaclet. Each page: what to do, what to rent, delivery info.

---

## 🟡 Tier 3 — Medium Impact, Higher Effort

### 3.1 Blog cadence — 2 posts/month
**Impact**: 🟡 Medium · **Effort**: Ongoing

Maintain publishing cadence. Seasonal content planned around:
- **July-Aug**: Summer/beach content
- **September**: Back-to-school, Fallas planning
- **October**: Autumn/winter content
- **March**: Las Fallas family guide

---

### 3.2 Stripe payment integration
**Impact**: 🟡 Medium · **Effort**: 2-3 hours · **Status**: Open

Payment flow for deposit holds. Currently booking is WhatsApp/contact only.

---

### 3.3 Backlink strategy
**Impact**: 🟡 Medium · **Effort**: Ongoing

Target backlinks from:
- Valencia expat/nomad blogs
- Family travel review sites
- Accessibility travel directories
- Digital nomad directories (Nomad List, etc.)

---

## 🟢 Tier 4 — Lower Priority / Future

### 4.1 Additional product verticals
- Camping gear
- Kitchen equipment (blenders, instant pots)
- Exercise equipment (yoga mats, resistance bands)

### 4.2 Reviews/testimonials system
Connect to Google Reviews or build custom review collection.

### 4.3 Multi-city expansion pages
Template for: Alicante, Málaga, Barcelona (SEO land-grab before entering).

### 4.4 Partner/affiliate page
Backlink opportunities from travel bloggers and influencers.

---

## Priority Execution Order (Next Session)

1. **1.1** — Blog architecture (`blog.ts` + template)
2. **1.2** — 4 launch blog posts
3. **1.3** — Google Search Console (user action)
4. **1.4** — Internal linking audit
5. **2.1** — Spanish translations

---

## Metrics to Track

| Metric | Current (June 2026) | Target (90 days) |
|--------|---------|-----------------|
| Total pages | ~37 | ~50+ (with blog + ES) |
| Blog posts | 0 | 8+ |
| Languages | EN only | EN + ES |
| Products | 16 | 16 (expand later) |
| Categories | 5 | 5 |
| Google Search Console | Not verified | Verified, sitemap submitted |
| Internal links per page | ~3 | 6+ |
| Homepage word count | ~400w | ~500w |
