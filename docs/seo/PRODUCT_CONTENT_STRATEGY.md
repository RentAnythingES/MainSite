# Product Content Strategy

> Last updated: 2026-07-11
> Status: Strategy approved for implementation; imported products remain inactive drafts.

## Purpose

Product pages are the bottom-funnel layer of RentAnything's Valencia SEO system.
They should answer a specific rental need well enough to rank for a genuine search,
help a visitor decide whether the item suits their stay, and create a natural path
back to the relevant category, kit, and local guide.

They are not a reason to publish hundreds of thin catalogue pages. An item should
be published only when RentAnything can actually rent it, explain it accurately,
and support the delivery or pickup experience it promises.

## Role in the Valencia SEO System

```
Guide / discover page
  -> practical Valencia stay problem
  -> relevant kit or customer-intent category
  -> specific product page when one item solves the need
  -> availability check, tailored request, or booking
```

| Surface | Primary job | Product-page relationship |
|---|---|---|
| Guides | Build trust and answer planning questions | Link only where a product solves the friction described |
| Kits | Reduce decision load for a stay scenario | Present products as included items, upgrades, or alternatives |
| Categories | Capture broad rental demand and aid comparison | Group compatible products and route to the right item page |
| Product pages | Capture precise rental intent and convert | Link back to the relevant kit, guide, and category |

This supports the brand promise **Travel light. Feel at home.** Product copy must
lead with the visitor's situation in Valencia, then explain the verified item facts.

## Search-Intent Rules

Every published product has one primary intent and may support one secondary
variation. Do not make one page target every related term.

| Intent type | Example | Best target |
|---|---|---|
| Exact item rental | `travel crib rental Valencia` | Product page |
| Product-family rental | `baby equipment rental Valencia` | Category / kit |
| Stay scenario | `Valencia with a baby` | Guide with kit/product links |
| Comparative or planning question | `do I need a stroller in Valencia` | Guide or FAQ, not a thin product page |
| Local fulfilment question | `wheelchair delivery Valencia` | Mobility category + relevant product FAQ |

Use natural variants such as *hire*, *rental*, *delivered in Valencia*, and Spanish
equivalents only where they improve clarity. Never repeat a keyword mechanically.

## Product Publish Gate

An item remains an inactive draft until all of the following are confirmed.

### Operational facts

- Exact product name, model, and brand, or an honest generic inventory label.
- Physical stock quantity and condition are confirmed.
- Positive rental pricing, minimum duration, and any deposit/insurance rule are set.
- What is included, excluded, and required for safe use is known.
- Delivery, pickup, setup, cleaning, and return constraints are confirmed.
- At least one approved hero image is stored in RentAnything's own Storage bucket.

### Content facts

- A visitor-useful short description and a verified detail section exist.
- Features and specifications are supported by a source, manual, or physical inspection.
- Item-specific constraints are explicit: age/weight limits, dimensions, access needs,
  charging, assembly, hygiene, weather, or terrain as relevant.
- The page has a category, a related kit or guide where appropriate, and 3–5 useful FAQs.
- English and Spanish content have been reviewed separately before Spanish indexing.

### SEO and trust facts

- Unique title, meta description, image alt text, and canonical route are available.
- Product structured data reflects only verified price, availability, and item facts.
- Image-use approval is recorded internally before a supplier or manufacturer image is published.
- No product is activated only because it has generated copy; operational truth wins.

## Content Model

The current `products` table supports a name, short description, features, specs,
pricing, one image URL, and optional meta fields. Before bulk publication, extend
the product model to support the fields below.

| Content field | Purpose | Publication requirement |
|---|---|---|
| Short description | Card and booking-context summary, 35–60 words | Required |
| Product detail copy | 120–180 words explaining Valencia use case and verified fit | Required |
| Includes / excludes | Avoids fulfilment misunderstandings | Required where applicable |
| Constraints and care | Safety, hygiene, access, charging, weather, or fit notes | Required where applicable |
| SEO title | Unique, concise search snippet | Required |
| Meta description | Unique 140–155 character invitation | Required |
| Image alt text | Accurate accessibility and image context | Required per image |
| FAQs | 3–5 genuine pre-rental questions | Required for priority products |
| English / Spanish fields | Locale-specific copy, metadata, FAQs, and alt text | Required before locale publication |
| Source / rights record | Internal audit trail for facts and imagery | Required, never rendered publicly |

## Page Blueprint

1. **H1** — Clear item + Valencia rental intent, without stuffing.
2. **Use-case summary** — Who it helps, when it matters, and where it fits in a Valencia stay.
3. **Verified item details** — Features, dimensions, age/weight limits, inclusions, and constraints.
4. **Delivery and setup note** — Only what RentAnything can operationally confirm.
5. **Care / hygiene / safety note** — Specific to baby, mobility, kitchen, fabric, or technical equipment.
6. **Related kit and guide links** — Relevant, not a generic link wall.
7. **FAQs** — Questions a customer asks before rental, not generic SEO filler.
8. **Availability CTA** — `Check availability for your dates` or a tailored-request route.

### Metadata Pattern

Use a product-specific title such as:

`Rent a Travel Crib in Valencia | Delivery & Pickup`

Use a description that combines item fit, local fulfilment, and a practical benefit:

`Rent a lightweight travel crib in Valencia for your baby's stay. Clean, inspected and available with delivery or pickup options.`

The price belongs in metadata only when the displayed price is current and genuinely
useful. Avoid stale “from” claims and invented urgency.

## Internal-Linking Pattern

Each priority product should have:

- One parent category link.
- One relevant kit link where the product is an included item or add-on.
- One relevant Valencia guide link where the item solves a real planning problem.
- Two or three related products only when they are substitutes, complements, or
  commonly rented together.

Examples:

| Product type | Kit connection | Guide connection |
|---|---|---|
| Travel crib | Baby Arrival Kit | Valencia with kids |
| Compact stroller | Toddler City Kit | Valencia with kids / old-town planning |
| Transport wheelchair | Accessible Valencia Kit | Wheelchair-accessible Valencia |
| Monitor / desk setup | Remote Work Apartment Kit | Digital nomad guide to Valencia |
| Portable AC | Summer Apartment Survival Kit | Valencia summer guide |

## Prioritisation

### Wave 1 — Conversion-ready core inventory

Publish only 12–20 items with confirmed stock, pricing, delivery feasibility, and
approved media. Prioritise Baby & Toddler, Mobility & Accessibility, Remote Work,
Apartment Comfort, and Beach & Outdoor because these align with the existing guide,
kit, and category architecture.

### Wave 2 — Kit-enabling add-ons

Add products that strengthen a live kit: sleep, feeding, beach, workstation,
summer comfort, and accessibility accessories. These may have lower standalone
search demand but improve bundle relevance and attachment.

### Wave 3 — New verticals

Events, photography, fitness, camping, and review-only products need an explicit
commercial use case, category page, fulfilment process, and supporting content
before publication. A database category alone is not an SEO cluster.

## Current Implementation Gaps

1. Imported drafts are deliberately incomplete: most lack confirmed brand, specs,
   features, positive price, stock, and metadata.
2. Some older active products still rely on the static catalogue for editorial
   fields and FAQs. Move them to the database workflow only when their facts and
   operations are reviewed; do not bulk-copy stale content.
3. Locale-specific descriptions, metadata and FAQs are database-backed, but the
   base product name, features and specification keys remain shared. Fully
   localized structured specifications need an intentional model extension.
4. Product images support alt text, source and rights records, but unresolved
   rights warnings must remain visible until permission is documented.
5. New draft-only categories do not yet have customer-facing category pages, editorial
   copy, kit connections, or sitemap strategy.

## Content Production Workflow

1. **Fact collection** — operator confirms real inventory and source evidence.
2. **Content brief** — select primary intent, visitor scenario, category, kit/guide links,
   constraints, and language scope.
3. **Draft copy** — write from the fact sheet; never infer technical, safety, or hygiene claims.
4. **SEO review** — check unique intent, metadata, internal links, structured data, and
   cannibalisation against a category/kit/guide page.
5. **Operations review** — verify pricing, stock, delivery, setup, and image rights.
6. **Publish** — activate product, then submit its URL through sitemap/GSC monitoring.
7. **Measure** — track product views, guide-to-product clicks, kit-to-product clicks,
   availability checks, WhatsApp handoffs, and completed bookings.

## Definition of Done

A product is ready for indexing when it is operationally rentable, content-complete,
localised for every published locale, connected to the right cluster, and measured.
It is not ready merely because a draft row, stock image, or generic description exists.
