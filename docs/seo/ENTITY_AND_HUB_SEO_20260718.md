# Entity and Hub SEO — 18 July 2026

## Objective

Strengthen RentAnything.es as one coherent Valencia rental entity and make each
commercial/content hub's ownership explicit to crawlers. This work deliberately
avoids adding thin keyword pages or changing catalogue publication decisions.

## Query ownership

| Search intent | Primary owner | Supporting pages |
|---|---|---|
| Beach equipment rental Valencia | `/rental/travel-outdoors` | Family Beach Kit, Malvarrosa and Patacona guides, individual beach products |
| Baby equipment rental Valencia | `/rental/baby-gear` | Baby Arrival Kit, Valencia-with-kids guide, cot/stroller/car-seat products |
| Kids and family equipment Valencia | `/rental/kids-family` | Toddler City Kit, Family Beach Kit, family guide |
| Wheelchair / mobility rental Valencia | `/rental/mobility` | Accessible Valencia Kit, accessibility guide, individual mobility products |
| Monitor / remote-work equipment Valencia | `/rental/remote-work` | Remote Work Apartment Kit, digital-nomad guide, monitor/desk/chair products |
| Portable AC / apartment equipment Valencia | `/rental/home-living` | Summer Apartment Kit, summer guide, verified AC and air-quality products |
| Broad equipment rental in Valencia | `/valencia` | Six category hubs, kit hub and active products |
| Valencia stay planning | `/discover` and `/blog` | Destination guides, practical guides and contextual category/kit links |

Individual product pages own model- and item-specific long-tail demand. They
support their category owner; they should not replace it for broad category
phrases. New subcategory landing pages should be created only when query evidence,
inventory depth and unique content justify a standalone search intent.

## Search-landscape implications

Fresh July 18 checks show:

- RentAnything already appears for Beach & Outdoor and Spanish Remote Work terms.
- Baby Roller competes with direct stroller checkout and station pickup; Babonbo
  and BabyQuip retain broad Valencia baby-equipment inventory pages.
- Amigo 24, Scooter a Domicilio and Cloud of Goods compete for mobility demand.
- Monis now targets Valencia monitor/desk rental, although its current location
  page presents a waitlist rather than a completed local booking flow.
- Cloud of Goods now targets portable AC rental in Valencia, so Apartment Comfort
  is no longer accurately described as having zero competition.

The strategy is therefore not "we are the only option." It is one locally coherent
service covering several stay problems, with bilingual planning, real inventory,
pickup/delivery configuration and connected kits.

## Structured-data implementation

- Homepage: verified `LocalBusiness` identity plus `WebSite` publisher entity.
- Valencia EN/ES: `CollectionPage` with an `ItemList` of active products.
- Blog: `CollectionPage` with published guide inventory.
- Discover: `CollectionPage` with published destination inventory.
- Kits: `CollectionPage` with the available scenario-led kit inventory.
- Stable entity IDs connect hubs to `https://rentanything.es/#website` and
  `https://rentanything.es/#business`.

Unverified social profiles and assumed opening hours were removed from business
schema. The legal entity, CIF, address, service area, languages and currency are
represented using confirmed business information.

## Next non-catalogue opportunities

1. Use Search Console query exports to refine titles and introductory copy on the
   six existing category owners; do not create new pages from impressions alone.
2. Expand Spanish planning coverage beyond products/categories so Spanish guides
   can support the same commercial clusters without translating weak content.
3. Add evidence-based comparison/help content around delivery, pickup, deposits,
   setup constraints and choosing the right equipment—questions that improve
   conversion as well as long-tail coverage.
4. Build authority off-site through the Google Business Profile, accommodation
   partners and relevant Valencia/family/accessibility directories.

