# RentAnything.es Keyword Cluster Map — 15 July 2026

## Purpose

This document assigns one clear search intent to each page layer so category,
product, kit and guide pages reinforce one another instead of competing for the
same query. English and Spanish pages should follow the same ownership model,
but a Spanish URL is indexable only when its Spanish content is complete.

## Early Search Console signal

The 24-hour Search Console snapshot supplied on 15 July 2026 showed:

- 79 impressions
- 12 clicks
- 15.2% CTR
- average position 12
- `/rental/travel-outdoors`: 40 impressions and 4 clicks
- homepage: 6 impressions and 4 clicks
- `/rental/remote-work`: 3 impressions and 1 click
- `/product/monitor-27`: 3 impressions and 1 click

This is too little data to establish durable rankings, but Beach & Outdoor
already accounts for roughly half of the observed impressions. It is therefore
the first cluster to strengthen, not a reason to create many overlapping beach
pages immediately.

## Page-layer ownership

| Layer | Search intent | Page responsibility | Must not target |
|---|---|---|---|
| Homepage | Brand and broad service discovery | Explain RentAnything.es and route users into Valencia inventory | Every category keyword independently |
| Valencia inventory hub | Broad transactional local intent | Own `equipment rental Valencia` and expose every commercial category | Brand-only or individual-model queries |
| Category hub | Category-level transactional intent | Own one head term and its close variants | Specific product models or general travel advice |
| Subcategory hub | Mid-tail transactional intent | Own a distinct equipment type when demand and inventory justify a page | Duplicate category copy or a single product model |
| Product page | Bottom-funnel long-tail intent | Own model/product-type rental queries and answer suitability questions | The broad category head term |
| Kit page | Scenario and bundled-solution intent | Own complete-use-case queries and reduce decision load | Single-item model queries |
| Blog/guide | Informational planning intent | Answer the travel problem and link into the commercial cluster | Pretend to be a booking/category page |
| Discover page | Place-specific local intent | Explain a Valencia location and surface relevant inventory | Generic equipment category terms |

## Core commercial clusters

### Brand and city layer

| Page | Primary target | Supporting terms | Role |
|---|---|---|---|
| `/` | `RentAnything Valencia` / brand queries | `rent anything Valencia`, practical rentals delivered in Valencia | Brand authority and cluster routing |
| `/valencia` | `equipment rental Valencia` | `rental equipment Valencia`, `rent equipment Valencia`, `Valencia equipment delivery` | Broad commercial inventory hub |
| `/es` | `RentAnything Valencia` / brand queries | `alquiler RentAnything Valencia` | Spanish brand hub |
| `/es/valencia` | `alquiler de equipamiento en Valencia` | `alquiler material Valencia`, `equipos de alquiler Valencia` | Spanish broad commercial hub |

### Category ownership

| Category page | Primary English target | Primary Spanish target | Important secondary terms |
|---|---|---|---|
| `/rental/baby-gear` | `baby equipment rental Valencia` | `alquiler material bebé Valencia` | stroller rental, travel cot rental, high-chair rental, car-seat rental |
| `/rental/kids-family` | `kids equipment rental Valencia` | `alquiler material infantil Valencia` | balance-bike rental, toys for holiday rental, family activity equipment |
| `/rental/mobility` | `mobility equipment rental Valencia` | `alquiler ayudas movilidad Valencia` | wheelchair rental, mobility-scooter rental, walker/rollator rental |
| `/rental/remote-work` | `remote work equipment rental Valencia` | `alquiler equipo teletrabajo Valencia` | monitor rental, desk rental, ergonomic-chair rental |
| `/rental/home-living` | `apartment equipment rental Valencia` | `alquiler equipamiento apartamento Valencia` | portable AC rental, fan rental, air-purifier rental, appliance rental |
| `/rental/travel-outdoors` | `beach equipment rental Valencia` | `alquiler material playa Valencia` | beach umbrella rental, beach shade rental, family beach gear, outdoor equipment rental |

The established slugs remain stable even when customer-facing category names
evolve. Any future slug migration requires permanent redirects, self-canonicals
on the destination URLs, sitemap replacement and Search Console monitoring.

## Beach & Outdoor cluster — first priority

### Implementation status - 15 July 2026

- `/rental/travel-outdoors` now targets `beach equipment rental Valencia` with
  transactional copy about equipment choice, verified product facts, delivery,
  pickup and date-based availability.
- The category links directly to the Family Beach Kit and the Malvarrosa and
  Patacona local guides, creating clear routes for bundled and place-specific
  intent without adding overlapping landing pages.
- The Spanish category mirrors the same ownership model for
  `alquiler de equipamiento de playa en Valencia`.
- Category pages emit `CollectionPage`, `ItemList` and breadcrumb structured
  data based on the current catalogue rather than hard-coded product lists.
- Commercial blog calls to action now route by topic. Beach guides point to the
  Beach & Outdoor category instead of the former site-wide Baby Gear fallback.
- The family beach guide links to both local beach guides, the transactional
  category and relevant individual products. Malvarrosa and Patacona guides
  surface the Beach & Outdoor catalogue through contextual product widgets.

This is the complete first-pass cluster loop:

`family beach guide -> Malvarrosa/Patacona guide -> Beach & Outdoor category -> Family Beach Kit or product -> availability`

Do not add separate pages for minor keyword variants until Search Console shows
a distinct recurring intent that the category, kit or product layer cannot own.

### Search ownership

- **Category hub:** `/rental/travel-outdoors`
  - Owns `beach equipment rental Valencia` and the broad Spanish equivalent.
  - Explains pickup/delivery, beach suitability, category range and how rentals work.
- **Kit page:** `/valencia/kits/family-beach-kit`
  - Owns `family beach kit Valencia`, `beach equipment package Valencia` and similar bundled intent.
- **Product pages:**
  - Own `rent [specific product/model] in Valencia`.
  - Examples: beach umbrella with table rental, Iwiko 180 beach shelter rental,
    compact beach shade rental and model-specific searches.
- **Blog:** `/blog/best-beaches-valencia-families`
  - Owns family beach planning and discovery intent.
- **Discover:** `/discover/malvarrosa-beach` and `/discover/patacona-beach`
  - Own place-specific visit planning and link into the beach category or kit.

### Mid-tail pages to consider later

Create a subcategory landing page only when all three conditions are met:

1. Search Console or keyword research shows distinct recurring demand.
2. At least three genuinely different, rentable products support the intent.
3. The page can provide unique selection guidance beyond a filtered product grid.

First candidates:

- Beach umbrellas and shelters
- Portable air conditioners
- Strollers
- Wheelchairs
- Mobility scooters
- Monitors

Until those thresholds are met, category sections and product pages should cover
the mid-tail terms. Creating thin subcategory pages early would split authority
from the category page that is already receiving impressions.

## Apartment Comfort cluster - second priority

### Implementation status - 15 July 2026

- `/rental/home-living` owns `apartment equipment rental Valencia` and supports
  portable air conditioner, air purifier and apartment-comfort queries without
  competing with model-specific product pages.
- `/es/rental/home-living` mirrors that ownership for
  `alquiler de equipamiento para apartamentos en Valencia`.
- The category explains portable-AC venting, room suitability, noise and setup
  considerations before directing visitors into date-based availability.
- The category links to `/valencia/kits/summer-apartment-survival-kit` for
  bundled intent and `/blog/valencia-summer-survival-guide` for informational
  summer-planning intent.
- The summer guide links back to the category, kit and relevant individual
  products. Product pages already link to their category and related guide.

The first-pass cluster loop is:

`summer guide -> Apartment Equipment category -> Summer Apartment Kit or exact product -> availability`

### Search ownership

- **Category hub:** `/rental/home-living`
  - Owns broad apartment-equipment and apartment-comfort rental intent.
- **Kit page:** `/valencia/kits/summer-apartment-survival-kit`
  - Owns bundled cooling and summer-apartment setup intent.
- **Products:**
  - Own brand/model and precise equipment queries such as De'Longhi Pinguino or
    KOENIC portable air conditioner rental in Valencia.
- **Blog:** `/blog/valencia-summer-survival-guide`
  - Owns informational heat-management and summer-stay planning intent.

Do not create a portable-air-conditioner subcategory until Search Console shows
recurring distinct demand and at least three genuinely different, available AC
products can support useful comparison guidance.

## Product-page long-tail rules

Each indexable product page should target one primary formulation:

`rent [brand/model or precise product type] in Valencia`

Spanish equivalent:

`alquiler de [marca/modelo o tipo de producto] en Valencia`

Supporting copy should naturally answer:

- What exactly is the product?
- Who and what use case is it suitable for?
- Important size, capacity, safety and compatibility facts
- What is included?
- Pickup, delivery and setup expectations
- Cleaning/care expectations
- Date-based availability and rental pricing
- A link back to the owning category hub
- A link to a relevant kit or Valencia guide where useful

Product pages must not repeat the category introduction or force the category
head term into every heading. Their advantage is specificity and verified facts.

## Internal-link architecture

The desired flow is:

`guide or discover page -> category or kit -> product -> availability -> booking`

Required links:

- Every product links to its category.
- Every category links to its strongest relevant kit and at least one guide.
- Every kit links to its included products and supporting guide.
- Every commercial guide links to one category or kit near the relevant problem,
  not only in a generic footer.
- Product-related anchors describe the item or need; avoid repeated `click here`.

## Anti-cannibalization rules

1. One primary keyword owner per locale.
2. Category hubs own generic transactional category terms.
3. Products own model-specific and exact-item queries.
4. Kits own scenario/bundle queries.
5. Guides own informational queries.
6. Do not create a new page merely because a keyword variation exists.
7. If two pages gain impressions for the same intent, compare conversion role,
   consolidate overlapping copy and strengthen internal links to the chosen owner.
8. Keep category slugs stable unless evidence justifies a controlled migration.

## Technical indexing contract

- Every indexable URL emits a self-referencing canonical.
- EN/ES hreflang appears only when both locale pages contain real localized content.
- Only indexable products enter the sitemap.
- Active but editorially incomplete products emit `noindex, follow`.
- Spanish pages without complete Spanish editorial content canonicalize to English
  and remain `noindex`.
- Sitemap `lastmod` values come from durable content timestamps, not request time.
- Admin, Checkout success, internal testing and unsubscribe routes remain noindex
  and outside the sitemap.
- Structured data uses the current locale URL and truthful rental availability.

## Search Console operating rhythm

### Weekly during initial indexing

- Review queries and pages over 7-day and 28-day windows.
- Record impressions, clicks, CTR and average position by cluster owner.
- Inspect unexpected pages ranking for category terms.
- Review duplicate/canonical, crawled-not-indexed and soft-404 reports.
- Validate one new or materially changed URL per cluster after deployment.

### Decision rules

- **Positions 8–20 with impressions:** improve the existing page first.
- **High impressions, low CTR:** test title and description against the same intent.
- **Multiple pages for one intent:** consolidate ownership before adding content.
- **Product query without a suitable page:** enrich and publish the exact product.
- **Recurring mid-tail demand with enough inventory:** create a subcategory hub.

The first 28-day baseline should be preserved before broad content expansion so
later gains can be attributed to technical corrections and cluster improvements.
