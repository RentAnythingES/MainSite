# SEO Growth Audit — 22 July 2026

## Executive assessment

RentAnything has a strong technical and intent architecture for a site with only
about ten days of Search Console history. The 7–19 July performance screenshot
shows 57 clicks, 1.14K impressions, 5% CTR and average position 16.3. A separate
24-hour view shows 4 clicks, 89 impressions, 4.5% CTR and average position 16.4.
Early conversions indicate commercially relevant traffic, but the sample is too
small to treat aggregate CTR or position as a stable benchmark.

The site does not need higher mechanical keyword density. Its category owners have
clear titles/H1s and substantial natural-language coverage; growth is now more
dependent on complete indexing, local prominence, genuine authority, reviews and
query-led improvements to pages already receiving impressions.

## Live technical state

Audit time: 22 July 2026, approximately 10:37 CEST.

- Database: 178 products, 34 active, 31 indexable in English and 31 in Spanish.
- Indexable products by cluster: Beach & Outdoor 12, Baby & Toddler 6, Mobility 5,
  Apartment Comfort 4, Remote Work 3, Sports & Wellness 1, Kids & Family 0.
- SEO regression audit: passed across seven categories, representative products,
  canonicals, redirects, EN/ES hreflang, schemas and commercial pathways.
- Launch audit: no critical failures; three active products remain intentionally
  blocked by editorial/image approval.
- Production sitemap during the crawl: 192 URLs. It still contained four stale
  product URLs returning 404 and omitted 12 newly indexable product URLs. The
  resulting 4 error pages, 3 apparent orphans and one depth-4 page are largely a
  stale-sitemap snapshot, not a broken live navigation graph. Refresh/invalidate
  the sitemap and rerun before diagnosing those as structural defects.
- Current live category pages had refreshed to 12 Beach, 5 Apartment Comfort,
  5 Mobility and 7 Baby active products.

## Keyword and topical coverage

Measured against rendered English category pages:

| Cluster owner | Visible words | Owning phrase uses | Assessment |
|---|---:|---:|---|
| Baby & Toddler | 732 | 4 | Natural and sufficient |
| Kids & Family | 450 | 4 | Copy is adequate; indexable inventory is not |
| Mobility | 628 | 5 | Sufficient; title can match wheelchair/scooter language more directly |
| Remote Work | 669 | 4 | Sufficient; lower commercial priority until demand appears |
| Apartment Comfort | 711 | 4 | Sufficient; generic portable-AC intent can be signalled more strongly in title/H1 |
| Beach & Outdoor | 899 | 8 | Strongest topical hub; avoid adding repetition |
| Sports & Wellness | 659 | 11 | More optimized than its one-product inventory depth justifies |

Representative product pages contain roughly 520–900 visible words. The two
portable-AC pages use `air conditioner` six or seven times, `rent` variants 13–14
times and `Valencia` 18 times while still reading naturally. More repetition is
not a sensible optimization. Product improvement should add verified decision
value—fit, venting, noise, inclusions, delivery, setup and availability—not synonyms.

## Search Console signal

Queries in the supplied screenshots include:

- `rent beach chairs and umbrellas near me`
- `valencia beach chair rental`
- `malvarrosa beach umbrella rental`
- `alquiler equipamiento para bebe`
- `rent baby equipment`
- `renting a car seat`
- `wheelchair rental valencia`
- `rent portable air conditioner near me`

These validate the planned commercial clusters. Positions around 8–20 should be
handled by strengthening the existing owner before creating another page. Segment
future reporting by brand/non-brand, language, country, device, landing-page
cluster and conversion stage; aggregate CTR is currently too easily skewed by a
few branded or one-impression queries.

## Strategic priorities

## Implementation update — 22 July 2026

- The English Apartment Comfort owner now targets `Portable Air Conditioner
  Rental in Valencia` in its title and H1; the Spanish owner uses the equivalent
  `Alquiler de Aire Acondicionado Portátil en Valencia` wording.
- The English Mobility owner now targets `Wheelchair & Mobility Scooter Rental in
  Valencia`; the Spanish page already used the equivalent wheelchair/scooter title.
- Sitemap revalidation was reduced from 60 minutes to five minutes. A fresh local
  production crawl returned 200 sitemap URLs with zero errors, warnings, orphans,
  pages beyond three clicks or indexable URLs omitted from the sitemap.
- The crawl exposed and corrected one stale Spanish blog link to the retired
  Decathlon beach-shelter slug. The only remaining unlisted product links point to
  three intentionally noindexed products awaiting image-rights approval.

### First 30 days

1. Deploy the completed sitemap refresh, resubmit it in Search Console, and inspect
   the Apartment Comfort, Beach, Baby and Mobility owners plus their strongest
   products. Local verification confirms the four stale URLs disappear and the 12
   newly indexable URLs appear in the 200-URL sitemap.
2. Establish or complete an accurate Google Business Profile as a service-area
   business. Use the real business name, correct service area/category, phone,
   hours, delivery model and original photos. `Near me` visibility is influenced
   by local relevance, distance and prominence, not by adding `near me` repeatedly
   to website copy.
3. Request honest Google reviews from completed renters through the existing
   post-rental workflow. Do not gate, incentivize or fabricate reviews. Respond to
   every review with useful, non-stuffed language.
4. Improve pages already showing impressions:
   - make the Apartment Comfort title/H1 more explicit about portable AC rental;
   - make the Mobility category title/H1 reflect wheelchair and scooter queries;
   - retain the current Beach owner and strengthen snippets only after query-level
     CTR has enough impressions to evaluate;
   - keep Baby focused on equipment, stroller, cot and car-seat decisions.
5. Track organic landing page -> availability check -> checkout start -> purchase
   by cluster. Record weekly 7-day and rolling 28-day baselines.

### Days 31–60

1. Earn locally relevant citations and links from accommodation partners,
   aparthotels, relocation providers, family-travel resources and accessible-travel
   organizations. Start with existing real relationships and useful referral pages,
   not mass directory submissions or paid link packages.
2. Publish/enrich only products that are physically rentable and directly support
   proven queries or live kits. Priority order: portable cooling, wheelchair/
   mobility, stroller/car-seat/baby essentials, then beach setup.
3. Use Search Console query-to-page data to find positions 8–20. Improve title,
   opening answer, selection guidance, FAQs and internal anchors on that owner.
4. Build a mid-tail landing page only when a distinct query recurs and at least
   three meaningfully different rentable products support comparison. Portable AC
   currently has two indexable units, so the category should own the generic term
   for now. Beach shade/umbrella is the closest candidate, but current impression
   volume is still too small to justify splitting authority.

### Days 61–90

1. Compare cluster-level impressions, clicks, non-brand CTR, median position and
   organic conversion rate against the first complete 28-day baseline.
2. Create one evidence-backed comparison or decision page only for a proven gap;
   avoid a generic two-post-per-week quota.
3. Expand EN/ES commercial inventory where real stock exists. Delay additional
   languages until the English/Spanish local-authority and conversion loop works.
4. Turn genuine accommodation or brand pilots into useful case studies and links
   only after measurable customer evidence exists.

## What not to do

- Do not optimize toward a keyword-density percentage or add blocks of city/`near
  me` variants. Google explicitly treats unnatural repetition as keyword stuffing.
- Do not create a landing page for every wording permutation.
- Do not publish the 144 inactive catalogue records merely to increase page count.
- Do not prioritize broad informational tourism traffic over commercial owners
  already generating impressions and conversions.
- Do not expand to other cities until Valencia has repeatable local visibility,
  reviews, inventory reliability and conversion measurement.

## Primary Google references

- Local ranking factors and Business Profile completeness:
  https://support.google.com/business/answer/7091
- Business Profile eligibility and accurate service-area representation:
  https://support.google.com/business/answer/3038177
- Sitemap construction and canonical URL inclusion:
  https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- LocalBusiness structured data and URL inspection guidance:
  https://developers.google.com/search/docs/appearance/structured-data/local-business
- Keyword-stuffing policy:
  https://developers.google.com/search/docs/essentials/spam-policies
