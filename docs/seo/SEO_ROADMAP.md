# RentAnything.es — SEO Roadmap
> **Last updated**: 2026-06-18 · Prioritized by estimated traffic impact × effort

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
- [x] SEO documentation framework
- [x] Blog architecture + 4 launch posts (data-driven, Article + FAQ JSON-LD)
- [x] Cross-cluster internal linking (products ↔ blog ↔ categories)
- [x] Category page editorial enrichment (3 paragraphs per category)
- [x] FAQ schema on all 16 product pages (~40 FAQs)
- [x] Discover section: infrastructure + 5 destination guides (Ruzafa, Malvarrosa, Fallas, Albufera, City of Arts & Sciences)
- [x] Discover hub pages (neighbourhoods, day-trips, attractions, events)
- [x] Inline contextual product widgets in discover pages

---

## 🔴 Tier 1 — High Impact, Low-Medium Effort

### 1.1 Build data-driven blog architecture
**Impact**: 🔴 Critical · **Effort**: 2 hours · **Status**: ✅ Done

Blog architecture live with `src/content/blog.ts`, `/blog/[slug]` template with Article JSON-LD, FAQ schema, hero images, internal links.

**Files**: `src/content/blog.ts`, `src/app/blog/[slug]/page.tsx`, `src/app/blog/page.tsx`

---

### 1.2 Publish 4 launch blog posts
**Impact**: 🔴 High · **Effort**: 2-3 hours · **Status**: ✅ Done

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
**Impact**: 🟠 High · **Effort**: 30 min · **Status**: ✅ Done

Product → blog, blog → products, categories → blog. Bidirectional linking implemented.

---

## 🟠 Tier 2 — Medium Impact, Medium Effort

### 2.1 i18n — Phased multilingual rollout
**Impact**: 🟠 High · **Effort**: 4-6 hours per language · **Status**: Open

Spain receives 97M international visitors/year. Language priority based on verified INE tourist volume:

| Phase | Language | Tourist Volume | Effort | Status |
|-------|----------|---------------|--------|--------|
| 1 | **Spanish** | Domestic + LATAM | 4-6h | ✅ Done (Phase 1: homepage, products, categories, Valencia) |
| 2 | **German** | ~11M visitors/yr (#3 market) | 4-6h | 🔲 Future |
| 3 | **French** | ~12M visitors/yr (#2 market) | 4-6h | 🔲 Future |
| 4 | **Dutch** | 1M+ in 5 months 2026 | 4-6h | 🔲 Future |

**Architecture**: next-intl with locale routing (`/es/product/[slug]`)
**Priority pages per locale**: Homepage, category pages, top 5 products, contact

---

### 2.2 Category page editorial enrichment
**Impact**: 🟡 Medium · **Effort**: 1 hour · **Status**: ✅ Done

3 editorial paragraphs per category + blog cross-links.

---

### 2.3 FAQ schema on product pages
**Impact**: 🟡 Medium · **Effort**: 1 hour · **Status**: ✅ Done

~40 FAQs across 16 products with FAQPage JSON-LD.

---

### 2.4 Discover section — Travel guide content engine
**Impact**: 🟡 Medium · **Effort**: 2-3 hours · **Status**: ✅ Infrastructure done, populating

Data-driven `/discover/[slug]` pages. 5 destinations live. Hub pages for neighbourhoods, day-trips, attractions, events.

**Completed design items:**
- [x] **Photo heroes** — AI-generated hero images for all 5 destinations
- [x] **Category-based product strips** — Compact, thematic horizontal scrolling widgets (mobility, baby, remote work)
- [x] **Two-layer overlay** — Consistent `bg-black/50` + gradient pattern on all photo heroes
- [x] **Widget spacing** — No two product strips adjacent; contextually placed after relevant sections
- [x] **Photo-backed hub cards** — Discover index uses lifestyle photos instead of emojis

**Open design items:**
- [ ] **Real photos** — Replace AI-generated images with sourced photography for trust
- [ ] **Valencia map widget** — Interactive or visual map showing destination locations and transport
- [ ] **Restaurant source tracking** — `sourceNote` fields exist but need populating with research
- [ ] **Staying vs Visiting** — Data model supports both angles; content needs fleshing out

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

### 4.1 Marketplace platform (third-party provider listings)
Enable third-party rental providers to list products. Commission model. Expands inventory without owning every item.

### 4.2 Spain-wide expansion
**Path**: Valencia → Costa Blanca (Alicante, Benidorm) → Barcelona → Málaga → Madrid
Create city landing pages as SEO land-grab before entering markets.

### 4.3 Additional product verticals
- Camping gear
- Kitchen equipment (blenders, instant pots)
- Exercise equipment (yoga mats, resistance bands)

### 4.4 Reviews/testimonials system
Connect to Google Reviews or build custom review collection.

### 4.5 Distribution channel listings
List our products on Babonbo, BabyQuip, Cloud of Goods (20% commission) as secondary distribution. Always prefer direct organic traffic.

### 4.6 Partner/affiliate page
Backlink opportunities from travel bloggers and influencers.

---

## Priority Execution Order (Next Session)

1. **1.3** — Google Search Console setup (user action)
2. **2.1** — Spanish translations (i18n)
3. **3.1** — Blog cadence — next 2 posts
4. **3.2** — Stripe payment integration
5. **Discover** — Add more destination guides (10+ target)
6. **Visual** — Replace AI images with real photography

---

## Metrics to Track

| Metric | Pre-session (June 17) | Current (June 18) | Target (90 days) |
|--------|----------------------|-------------------|------------------|
| Total pages | ~37 | ~77+ (22 ES pages added) | ~100+ (with more discover + DE) |
| Blog posts | 0 | 4 | 8+ |
| Discover guides | 0 | 5 | 15+ |
| Photo assets | 0 | 22+ (hero, category, hub, destination) | 50+ |
| Languages | EN only | EN + ES (Phase 1) | EN + ES + DE |
| Products | 16 | 16 (× 2 locales) | 16 (expand later) |
| Categories | 5 | 5 | 5 |
| Product FAQs | 0 | ~40 | ~40 |
| Google Search Console | Not verified | Not verified | Verified, sitemap submitted |
| Internal links per page | ~3 | 6+ | 8+ |
