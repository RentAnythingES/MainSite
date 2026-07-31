# Multi-Market Architecture

> Status: production schema applied; application compatibility changes ready locally
> Initial market: Valencia
> Customer-facing change in the foundation release: none

## Implementation state

The foundation is implemented by
`supabase/migrations/20260731_multi_market_foundation.sql`. Its
`20260725_custom_booking_quotes.sql` dependency and the foundation migration were
applied to production in that order on 31 July 2026.

The rollback-only production-schema rehearsal on 31 July 2026 verified:

- 153 products mapped to 153 Valencia offers;
- 472 legacy pricing tiers mapped to 472 Valencia offer tiers;
- 3 quantity discounts mapped to 3 Valencia offer discounts;
- zero missing market/offer references across existing operational records;
- legacy Valencia inventory writes synchronize to the default offer;
- the new offer-scoped reservation path reserves independently;
- cross-market physical inventory assignment is rejected.

The rehearsal used one transaction and persisted no writes. After migration,
`npm run db:audit`, `npm run db:verify`, and the deployed-site booking smoke test
all passed. The production ledger holds checksums for both migrations.

## Decision

Rent'n'Roll will separate the global product catalogue from the local commercial
offer made in a city or region.

The internal term is **market** because a service area may be a city, a group of
cities, or a region. Customer-facing pages may continue to use "city" where that
is the clearest language.

The foundation release must:

- create one active, public, booking-enabled Valencia market;
- create one Valencia offer for every existing product;
- copy current stock, online capacity, pricing tiers, and quantity discounts into
  those Valencia offers;
- assign every existing operational record to Valencia;
- preserve current public URLs, request payloads, response shapes, pricing,
  availability, checkout, admin behavior, and SEO output;
- fail closed when a legacy operation becomes ambiguous after a product gains
  offers in more than one market;
- remain additive and reversible until the application has completed the later
  offer-authoritative cutover.

No additional market is launched by this work.

## Domain boundaries

### Global catalogue

`products` remains the global product identity. It owns the canonical slug,
brand/model facts, category, specifications, imagery, and localized editorial
content.

A product is not itself proof that the item is available in any market.

### Market

`markets` represents a customer-facing operating area. It owns:

- stable slug and display name;
- market type (`city` or `region`);
- country, timezone, and currency;
- supported/default locales;
- independent active, booking-enabled, public, and indexable gates;
- the default-market flag used by the existing Valencia routes.

Only one default market may exist.

### Product offer

`product_offers` connects a global product to a market. It owns:

- market-specific publication state;
- declared local stock;
- concurrent online capacity;
- market-specific pricing tiers;
- market-specific quantity discounts.

There is at most one offer for a product in a market.

### Physical locations and units

`inventory_locations` represents a structured depot or storage location in a
market. Physical inventory units retain their existing free-text `location` value
for historical display, while gaining a market and structured location reference.

The foundation creates a non-public `valencia-unassigned` inventory location.
Existing units are assigned there without inventing a more precise physical
location.

### Booking context

Bookings, drafts, inventory blocks, manual blocked dates, stock events, and custom
quotes store both:

- `market_id`, as an immutable operational snapshot; and
- `product_offer_id`, identifying the inventory and commercial offer involved.

The existing `product_id` remains for compatibility and global catalogue joins.
Database validation requires the product, offer, and market to agree.

Pickup locations and service zones belong to exactly one market. A booking or
draft cannot reference fulfillment configuration from another market.

## Compatibility period

During the foundation period, the existing Valencia columns remain the live
application contract:

- `products.stock_total`
- `products.stock_available`
- `products.is_active`
- `pricing_tiers`
- `product_quantity_discounts`

Database synchronization copies changes from those legacy Valencia sources into
the default-market offer tables. This is deliberately one-way so there is one
authoritative write path during the compatibility period.

New non-default-market offers must not be managed through the legacy product
fields. A later, separately reviewed cutover will make offer tables authoritative,
update admin write paths, and then retire compatibility synchronization.

## Safety invariants

1. Every existing product has exactly one Valencia offer after backfill.
2. Every existing booking-critical row has a non-null market and offer.
3. A row's `product_id` must equal its offer's `product_id`.
4. A row's `market_id` must equal its offer's `market_id`.
5. Pickup locations and service zones used by a booking or draft must belong to
   the booking market.
6. Physical inventory assigned to a booking must belong to the same market and
   offer as the booking.
7. Offer online capacity must be between zero and declared offer stock.
8. Legacy inserts may resolve automatically only to the default Valencia offer.
9. An incomplete market is never public, bookable, or indexable.
10. Existing identifiers, historical booking records, and payment references are
    never rewritten.
11. An inventory hold must have the same market and offer as its owning draft or
    booking.
12. A booking created from a draft must preserve that draft's market and offer.

## URL and frontend compatibility

The foundation release does not change frontend routing.

- `/product/[slug]` remains the Valencia product route.
- `/rental/[category]` remains the Valencia category route.
- Existing API calls that submit only a product slug resolve against the default
  Valencia market on the server.
- Existing API responses continue to expose the same fields.

Future market routes will provide an explicit market slug. URL context will be the
source of truth; cookies may remember a preference but cannot override a shared
URL.

## Rollout sequence

### 1. Additive schema foundation

Create market, offer, offer-pricing, offer-discount, and inventory-location tables.
Add nullable context columns, backfill Valencia, validate parity, then make the
new references non-null.

### 2. Compatibility enforcement

Add database validation and synchronization triggers. Keep application behavior
on the current Valencia contract.

### 3. Server-side offer reads

Resolve the default Valencia offer inside booking services while preserving
public request and response contracts. Availability and fulfillment reads become
explicitly market-scoped.

The foundation release resolves the default market server-side and scopes
fulfillment options to it. Product/pricing/availability reads intentionally remain
on the compatibility contract until the offer-authoritative cutover.

### 4. Offer-authoritative admin

Add market-aware admin filters and writes. The default admin view may aggregate
all markets, but mutation actions must always have an explicit market scope.

### 5. First dormant test market

Create a non-public, non-bookable, non-indexable test market. Verify catalogue,
inventory, pricing, fulfillment, booking, analytics, and SEO isolation without
exposing it to customers.

### 6. City and region onboarding

Only after the dormant-market checks pass should public routing and city-specific
SEO publication be enabled.

## Required before a second market can accept bookings

The foundation prevents data-model rework, but it does not itself launch another
market. Before enabling booking or indexing for a second market:

- switch product discovery, pricing, date blocks, availability, and draft creation
  to explicit `product_offer_id` reads;
- use `reserve_product_offer_inventory(...)` from the booking service;
- make admin inventory and pricing writes explicitly market-scoped;
- replace the remaining legacy `blocked_dates(product_id, blocked_date)` conflict
  target with the offer-scoped uniqueness constraint;
- exercise the dormant-market isolation suite for inventory, fulfillment, booking,
  reporting, and access control;
- add explicit market URLs, selector/navigation behavior, canonicals, hreflang,
  sitemap rules, structured data, and city-cluster publication gates.

## Deferred decisions

The following are intentionally not encoded into the foundation:

- which legal entity contracts with a customer;
- whether a market is operated directly, licensed, franchised, or fulfilled by a
  partner;
- settlement and revenue-share arrangements;
- operator-level admin permissions;
- country-specific tax, invoicing, deposit, or insurance policies.

Markets may later reference an operator or fulfillment entity without changing
the catalogue, inventory, URLs, or booking history.
