# Discover Expansion Strategy — 20 July 2026

## Purpose

Build Discover into a durable Valencia travel-planning layer that earns local
search visibility, helps visitors make practical decisions, and routes relevant
needs into RentAnything categories, kits, and products without turning guides
into disguised sales pages.

The expansion must favour useful clusters over page count. Each URL needs one
clear search intent, a maintained factual basis, meaningful internal links, and
a reason to exist beyond repeating an official tourism page.

## Current Baseline

The existing system is technically strong:

- 14 published English guides
- 5 neighbourhood guides
- 4 day-trip guides
- 2 attraction guides
- 2 beach guides
- 1 event guide
- 4 data-driven sub-hubs: neighbourhoods, day trips, attractions, and events
- Licensed hero imagery on every guide
- Complete staying guidance for neighbourhoods and visiting guidance for all guides
- Source tracking for all published restaurant recommendations
- Role-appropriate structured data on hubs and guides
- Production crawl with no broken links, broken images, orphan pages, or pages
  deeper than three clicks from the homepage

The main weaknesses are portfolio depth and language coverage:

- Events has only one guide: Fallas.
- Attractions covers only a narrow part of the city's main visitor demand.
- Beaches do not have their own hub despite their commercial and early search value.
- Existing hub introductions are too thin to own broad planning intent well.
- Discover has no Spanish route layer.
- Mutable guide facts outside restaurant recommendations do not yet have a
  consistent source and review-date model.

### Implementation checkpoint — 20 July 2026

- Guide-level governance is live for all 14 published guides with refresh class,
  content review date, next review date, authoritative sources, supported claims,
  and source check dates.
- `npm run audit:discover-sources` now fails on missing governance, invalid dates,
  overdue reviews, stale sources, invalid URLs, or source records without stated
  claim coverage.
- `/discover/beaches` is live in code as the fifth Discover sub-hub with
  CollectionPage, ItemList, BreadcrumbList, and FAQ schema.
- All five Discover hubs now include substantive selection guidance, practical
  planning checks, contextual pathways, rendered FAQs, and FAQ schema.
- Malvarrosa and Patacona now belong to the Beaches hub while retaining their
  existing guide URLs.
- The Beaches hub is included in the Discover index, guide breadcrumbs, sitemap,
  and technical SEO hub classification.
- Each guide now exposes its review date and source list to readers.

## Strategic Role

Discover pages own **place and event planning intent**. They should answer where
to go, what the experience is like, how to get there, who it suits, what practical
friction to expect, and what visitors should arrange before going.

They must not compete with:

- Category pages for broad rental terms
- Product pages for exact-item rental terms
- Kit pages for bundled-use-case searches
- Blog posts for broad thematic advice that is not tied to one place or event

The intended path is:

`search or internal guide -> place/event guide -> relevant category or kit -> exact product -> availability`

Commercial links should appear only where equipment solves a real planning
problem, such as shade at a beach, a stroller for a long walking route, cooling
for a summer stay, or mobility support for an attraction.

## Target Architecture

### Hub ownership

| Hub | Primary intent | Supporting intent | Commercial relationship |
|---|---|---|---|
| `/discover/neighbourhoods` | where to stay in Valencia by neighbourhood | area comparisons, atmosphere, transport, suitability | Arrival, family, remote-work, and accessibility needs |
| `/discover/beaches` | Valencia beaches guide | best beach by audience, access, facilities, transport | Beach & Outdoor category and Family Beach Kit |
| `/discover/attractions` | Valencia attractions planning | accessibility, visit duration, family suitability | Mobility, Baby & Toddler, Kids & Family |
| `/discover/events` | Valencia festivals and events guide | annual planning, crowds, transport, family suitability | Event-specific practical equipment only |
| `/discover/day-trips` | best day trips from Valencia | travel time, car-free options, suitability | Travel, family, cooling, mobility where genuinely useful |

The new Beaches hub is justified because:

1. Beach & Outdoor is the earliest visible commercial search cluster.
2. Malvarrosa and Patacona already form a real guide cluster.
3. Beach comparison intent is materially different from generic attractions.
4. The hub can route naturally to the Family Beach Kit and beach inventory.

### Individual guide ownership

Each guide owns a single formulation such as:

- `Ruzafa Valencia neighbourhood guide`
- `Malvarrosa Beach guide`
- `Oceanogràfic Valencia guide`
- `Semana Santa Marinera Valencia guide`
- `Xàtiva day trip from Valencia`

Minor query variations belong within the guide. Do not create separate pages for
parking, accessibility, visiting with children, or transport unless Search
Console later demonstrates a distinct recurring intent that cannot be served
well by the parent guide.

## Portfolio Expansion

Candidate priority is based on current cluster gaps, Valencia visitor relevance,
commercial fit, and confirmation that the subjects are recognised by official
Valencia tourism sources. Search Console must refine ordering before production.

### Priority A — strengthen and complete the core

1. Enrich all five hubs with comparison guidance, selection criteria, FAQs,
   audience pathways, and links to every child guide.
2. Add `/discover/beaches` and move beach ownership from Attractions or
   Neighbourhoods into the new hub without changing existing guide URLs.
3. Add a source registry to every guide, not only restaurant recommendations.
4. Add `contentReviewedAt`, `nextReviewAt`, and an explicit refresh class.
5. Add Spanish Discover templates and require reciprocal hreflang only after a
   complete human-quality translation exists.

### Priority B — high-value guide expansion

#### Events

| Candidate | Page role | Refresh class | Notes |
|---|---|---|---|
| Semana Santa Marinera | Major recurring event guide | Annual | Strong Cabanyal connection; crowd, procession, transport, and family guidance |
| Gran Fira de València | Summer event guide | Annual | Strengthens July planning and summer-stay pathways |
| Corpus Christi Valencia | Cultural event guide | Annual | Distinct historic-centre intent |
| Christmas in Valencia | Seasonal planning guide | Annual | Family and long-stay relevance; programme details must be refreshed |
| 9 d'Octubre in Valencia | Local festival guide | Annual | Useful autumn event coverage; avoid overstating fixed schedules |

Fallas remains the flagship event page. Time-specific programmes should not be
hard-coded as evergreen facts. The evergreen guide owns the event; a dated
programme section may be refreshed annually on the same URL.

#### Attractions

| Candidate | Page role | Commercial fit |
|---|---|---|
| Oceanogràfic Valencia | Standalone major-attraction guide | Strollers, family gear, mobility planning |
| Central Market and La Lonja | Historic market-district guide | Walking, family, and accessibility planning |
| Bioparc Valencia | Family attraction guide | Strollers, family gear, mobility planning |
| Valencia historic centre | Area-based first-visit guide | Walking routes, stroller and mobility considerations |
| Valencia Marina | Waterfront attraction guide | Beach, family, cycling, and access planning |

The current City of Arts & Sciences guide should remain the complex-level owner;
an Oceanogràfic guide is justified only if it provides materially deeper visit
planning and links back to the complex guide rather than duplicating it.

#### Beaches

| Candidate | Page role | Commercial fit |
|---|---|---|
| El Saler Beach | Natural beach guide | Shade, coolers, chairs, transport planning |
| Pinedo Beach | Accessible/local beach guide | Accessibility, shade, family beach gear |
| Las Arenas Beach | Urban beach guide | Family access, waterfront planning, beach gear |

Malvarrosa and Patacona become the initial anchors of the new Beaches hub.

### Priority C — cluster breadth after measurement

#### Day trips

- Buñol, with La Tomatina handled as an annual event section or a connected
  event guide rather than defining the whole town page
- Cullera
- Gandia
- Chulilla
- Serra Calderona natural area

#### Neighbourhoods and stay areas

- Extramurs
- Pla del Real
- Quatre Carreres / Penya-roja
- Alboraya / Port Saplaya only if the staying and beach intent can be separated
  clearly from Patacona

New neighbourhood pages need genuine accommodation, daily-life, transport, and
visitor-suitability guidance. A page should not be created merely because the
district exists.

## Bilingual Publication Policy

Discover should move to English and Spanish as a managed rollout:

1. Build the shared Spanish route/template architecture.
2. Translate the strongest existing pages first: Discover hub, Beaches hub,
   Malvarrosa, Patacona, Fallas, City of Arts & Sciences, Ruzafa, El Carmen,
   Albufera, and Xàtiva.
3. Publish every net-new Priority B guide in English and Spanish together.
4. Add hreflang only when both pages are complete and indexable.
5. Do not use thin machine translation or publish placeholder locale pages.

German remains a later site-wide architecture decision. The homepage's
multilingual-support statement does not imply German Discover SEO coverage.

## Content Standard

### Required for every guide

- One clear primary search intent and keyword owner
- Original summary and practical overview
- Key highlights with non-generic visitor guidance
- Getting there from central Valencia
- Best time or conditions to visit
- Accessibility and stroller considerations
- Audience-specific advice
- What to bring, what not to bring, and when renting is useful
- At least three useful FAQs
- At least two contextual internal links outside the Discover section
- At least two links to related Discover guides or its parent hub
- Licensed hero image with provenance
- Factual sources and review dates
- Self-canonical, breadcrumb schema, and role-appropriate structured data

### Neighbourhood additions

- Staying versus visiting distinction
- Accommodation character without unsupported hotel recommendations
- Noise, walkability, transport, food-shopping, and daily-life considerations
- Best audience fit and trade-offs

### Event additions

- Evergreen event explanation
- Recurrence and typical period
- Current-year dates only when officially confirmed
- Crowd intensity, closures, transport disruption, accessibility, and safety
- `nextReviewAt` before the following event cycle
- No stale year in the canonical slug

### Day-trip additions

- Realistic door-to-door travel choices
- Car-free feasibility
- Minimum useful visit duration
- Return-journey risks and seasonal constraints
- Clear distinction between the destination and any associated event

## Source and Freshness Model

Every mutable factual claim should trace to an authoritative source. Preferred
sources are official destination, municipal, transport, attraction, event, and
tourism sites. Commercial blogs may help discover topics but should not be the
primary authority for operational facts.

Recommended data additions:

```ts
type GuideSource = {
  label: string;
  url: string;
  publisher: string;
  supports: string[];
  checkedAt: string;
};

type RefreshClass = "evergreen" | "six-month" | "annual-event" | "seasonal";
```

Suggested review service levels:

| Content | Review interval |
|---|---|
| Neighbourhood character and evergreen history | 12 months |
| Restaurants and venues | 6 months |
| Transport routes, fares, opening hours, and ticket rules | 3–6 months |
| Recurring festivals | Before each annual programme and after the event |
| Seasonal services, beach accessibility, and bathing support | Before each season |

Audits should fail or warn when a published guide lacks required sources, has an
expired review date, has an unlicensed hero image, has incomplete locale parity,
or is absent from its owning hub.

## Internal-Link System

Each hub should expose:

- A comparison section that helps users choose a child guide
- Audience routes such as families, mobility needs, couples, and long stays
- Related blog planning content
- One relevant commercial category or kit where the connection is natural

Each guide should link:

- Up to its owning hub
- Sideways to two closely related guides
- To one relevant blog guide where useful
- To no more than one primary category or kit CTA per major planning problem

Avoid identical product strips on every guide. Product pathways should be chosen
by actual use case, and Requena or similar pages may correctly have no product
widget when there is no strong fit.

## Delivery Phases

### Phase 0 — governance and measurement

- Record a 28-day GSC baseline by Discover URL and query
- [x] Add guide-level source and freshness fields
- [x] Extend source audits for stale records, missing governance, and invalid dates
- [x] Extend audits for hub membership
- [ ] Extend audits for future locale completeness
- Define hub and guide conversion events in GA4

**Exit gate:** every existing guide has an owner, source status, and next review date.

### Phase 1 — hub consolidation

- [x] Enrich the four existing hubs
- [x] Launch the Beaches hub
- [x] Reassign Malvarrosa and Patacona hub membership
- [x] Add the first comparison module and contextual commercial/editorial links on Beaches

**Exit gate:** complete. All five hubs render successfully, contain useful
editorial guidance and FAQs, expose their complete child-guide collections, and
pass focused lint, source, intent, image-rights, build, and rendered-route checks.

### Phase 2 — first bilingual expansion batch

- Semana Santa Marinera
- Gran Fira de València
- Oceanogràfic
- Central Market and La Lonja
- El Saler Beach
- Pinedo Beach

Publish in EN and ES with licensed imagery and complete source records.

**Exit gate:** six bilingual guides published with no technical audit regressions.

### Phase 3 — second expansion batch

- Corpus Christi
- Christmas in Valencia
- Bioparc
- Valencia historic centre
- Buñol
- Cullera

Ordering should be adjusted using GSC impressions and seasonality.

### Phase 4 — measured breadth

- Translate remaining high-performing English guides
- Add Priority C pages only where Search Console, user demand, partnership value,
  or a clear commercial pathway justifies them
- Consolidate weak or overlapping pages rather than preserving page count

## Measurement Framework

### Search metrics

- Indexed URLs and valid canonical selection
- Impressions, clicks, CTR, and average position
- Non-brand queries owned by each hub
- Query overlap between guides
- EN/ES performance and hreflang correctness

### Engagement metrics

- Guide-to-guide click rate
- Guide-to-category and guide-to-kit click rate
- Product availability checks assisted by a Discover page
- WhatsApp or checkout starts assisted by a Discover page
- Scroll depth and FAQ engagement on hubs and guides

### Quality metrics

- Percentage of guides within source-review SLA
- Percentage with licensed images
- Percentage with complete EN/ES parity
- Orphan pages, broken links, and depth
- Guides with fewer than two contextual inbound links

## Decision Rules

1. Improve an existing URL before creating a close variant.
2. Build a new guide only when it owns distinct intent and can exceed the parent
   hub's treatment materially.
3. Prioritise pages already receiving impressions or supporting a proven
   commercial cluster.
4. Publish recurring-event facts only after official confirmation.
5. Translate winners and all net-new Priority B pages; do not create thin locale copies.
6. Review or consolidate pages that remain unindexed or receive no impressions
   after a reasonable crawl and measurement period.
7. Do not force product links where the guide does not reveal a genuine rental need.

## Official Validation Sources

The initial portfolio was checked against official destination sources on
20 July 2026:

- [Visit Valencia — essential places](https://www.visitvalencia.com/en/what-to-see-valencia/must-sees)
- [Visit Valencia — festivities and traditions](https://www.visitvalencia.com/en/events-valencia/festivities)
- [Visit Valencia — things to do](https://www.visitvalencia.com/en/what-to-see-valencia)
- [Visit Valencia — Fallas](https://www.visitvalencia.com/en/events-valencia/festivities/the-fallas)

These sources validate subject relevance, not final copy. Each guide still needs
its own source set and a fresh factual review immediately before publication.
