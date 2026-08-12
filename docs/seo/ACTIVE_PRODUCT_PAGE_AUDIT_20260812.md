# Active Product Page Audit — 12 August 2026

## Scope

This follow-up covered the complete active Valencia catalogue and the next
fact-complete non-AC product-copy group. It did not alter either portable air
conditioner, product identity, URLs, pricing, stock, images or category ownership.

## Complete image-delivery result

The repeatable `scripts/active-product-image-audit.cjs` check derives the live
catalogue from all seven English and Spanish category pages, opens every linked
product page and requests its rendered primary image.

Production result on 12 August 2026:

- 7 bilingual category owners checked;
- 114 unique active products found in each locale;
- 228 EN/ES product pages checked;
- 228 primary image responses returned successfully with an image content type;
- 0 missing or broken rendered product images.

The application deliberately normalizes legacy local `.png` or `.jpg` database
paths to the existing `.webp` assets. Audits must verify the rendered normalized
URL rather than treating the stale database extension as the customer-facing file.

### Visual and administrative follow-up

- The 24-, 27-, 29- and current 32-inch monitor records all use the same generic
  monitor image. Nothing is broken, but distinct verified photos are still needed
  to communicate the variants properly.
- `air-purifier` uses its valid legacy local image without a separate primary
  `product_images` record. This is an editorial/provenance cleanup, not a live
  display failure.
- Three corrected car-seat images load successfully but retain `unknown` rights
  status in the editorial table. Resolve the provenance status separately; do not
  hide or noindex working products because of that internal field.

## Six-product customer-copy repair

The following active pages had sufficient stored product facts for a guarded
bilingual repair:

- `baby-bed-60x120`;
- `bedside-crib`;
- `stroller-all-terrain`;
- `travel-cot`;
- `bed-rail-for-kids`;
- `video-baby-monitor`.

The migration replaces internal import or activation language, malformed supplier
copy and incomplete Spanish descriptions with direct customer information:

- what the product is;
- the verified dimensions, limits or key functions that affect selection;
- what the rental includes;
- the practical compatibility or setup information a customer needs;
- three useful FAQs in English and Spanish.

All twelve metadata titles are below 60 characters and all descriptions are
between 121 and 151 characters. The migration updates exactly six base descriptions,
twelve localization records and thirty-six FAQs, with count guards and a retired-copy
check.

## Spanish FAQ isolation

The product-service fallback previously allowed static English FAQs to appear on a
Spanish product page when that product lacked Spanish database FAQs. Static FAQ
fallback is now English-only. Spanish pages use Spanish database FAQs or omit that
optional section; they never display English fallback questions.

The all-terrain stroller exposed the defect in production and now has three proper
Spanish FAQs. The other five repaired products also receive complete bilingual FAQ
coverage.

## Product identity corrections

The 32-inch monitor had a correct public headline and 32-inch specification but
an incorrect `27-inch-monitor-hdmi-cable` URL. Its canonical slug is now
`32-inch-monitor-hdmi-cable`; permanent English and Spanish redirects preserve the
old URLs. The separate `monitor-27` product remains distinct, and its erroneous
24-inch `Screen` specification is corrected to 27 inches.

The `lifejacket-25-40kg` page now consistently describes the 25–40 kg product named
in its headline. The contradictory Size 6, 10–20 kg, height, chest and internal
review copy has been removed from its base record, bilingual content, metadata and
FAQs. Pricing, stock, images and category memberships are unchanged.

The 24-inch monitor's Spanish short description also incorrectly named a
27-inch screen. It now states 24 inches, matching the product headline, canonical
slug and `Screen` specification. The permanent product-readiness audit now checks
monitor-size references across the headline, slug, screen specification and EN/ES
localized fields; the production catalogue currently has zero active size-identity
conflicts.

The 24-, 29- and 32-inch listings now also expose their actual variant differences
in English and Spanish metadata and customer copy. All three are 4K IPS monitors;
the 24-inch listing offers HDMI and DisplayPort, while the 29- and 32-inch listings
also state their verified USB-C connection and charging up to 65 W. Each page now
has three factual FAQs per language covering size, resolution and connections. The
existing 27-inch listing was not changed, and no inventory or accessory claim was
added.

## Mobility bilingual support completion

The remaining priority mobility product gaps were completed without changing
product identity or availability:

- the powered-wheelchair English search description now describes only that
  product rather than trailing into unrelated scooters, crutches and walkers;
- powered-wheelchair FAQs now cover user weight, range and car transport in both
  English and Spanish;
- rollator FAQ wording now distinguishes the verified 56 cm seat height from seat
  width and states the 135 kg user limit clearly;
- transport-wheelchair FAQ grammar was corrected and Spanish coverage now includes
  the verified 100 kg user limit.

All three products now have at least three FAQs in each language. A production
rerun still reports 114 active products and 114 indexable product pages per
language.

## Child-water customer-copy repair

The remaining `lifejacket-15-40kg` and `swimming-vest-19-30kg` pages contained
internal activation, physical-review and source-conflict prose. They now present
the actual customer choice directly:

- the child lifejacket offers 15–30 kg and 30–40 kg sizes within its 15–40 kg
  overall range;
- the orange swimming vest is for 19–30 kg and is clearly distinguished as a
  swimming aid rather than a lifejacket;
- English and Spanish descriptions, inclusions, constraints, handover notes,
  metadata and FAQs use the same product identity;
- internal workflow language was removed without changing URLs, pricing, stock,
  images or category memberships.

## Active-catalogue copy hygiene

A production-wide field scan found internal import, activation, physical-review or
source-dispute language on 34 active products. The cleanup preserved product facts
while removing text written for an internal workflow rather than a customer:

- 54 inclusion-FAQ answers across 27 products now state `The rental includes…` /
  `El alquiler incluye…` and retain their exact included-item lists;
- `Import review` specifications were removed from the baby playpen, child bed rail
  and video baby monitor;
- the steamer/blender, bottle washer and walking treadmill now use direct bilingual
  descriptions and practical FAQs based on their stored capacities and functions;
- the remaining size-dependent water product is now clearly identified as a 50N+
  buoyancy aid with 25–40, 40–60, 60–80 and over-80 kg options;
- the Koenic AC was not rewritten; only its internal `Pricing review` specification
  key was removed.

The permanent product-readiness audit now checks active descriptions,
specifications, localizations and FAQs for the retired internal-copy patterns and
fails if they return. The final production scan covers 114 active products and
reports zero findings.

## Focused Spanish FAQ follow-up

The baby carrier now has three Spanish FAQs matching its verified positions,
outward-facing guidance and machine-washable construction. The double stroller's
missing Spanish UV 50+ answer was added and its English question typo was fixed.
Process-heavy FAQ text on the bike trailer and compact stroller was deliberately
not copied into Spanish; those pages require a customer-first rewrite before locale
parity is completed.

## Stroller and bike-trailer customer-copy repair

That rewrite is now complete. The production record called the Hamax trailer a
`Pioneer`, but Hamax's current child-trailer range and support material do not
identify a Pioneer model. Rather than assigning another model from its appearance,
the public copy now uses the supported Hamax brand and two-seat product identity.
[Hamax's official support guidance](https://hamax.com/en/support/customer-service/questions-answers?category=4272)
confirms that its child trailers include a bicycle arm and stroller wheel, support
both cycling and strolling, carry a maximum of 22 kg per child, and require bicycle
compatibility at the rear axle or hitch. The rewritten EN/ES page now explains
those useful decisions directly and no longer tells customers not to assume the
stroller function promised by the product title.

The CYBEX Coya page was checked against the
[official CYBEX Coya product page](https://www.cybex-online.com/en/row/p/st-pl-coya.html).
Its EN/ES descriptions and FAQs now state the stored 6.6 kg weight, folded size,
from-birth to approximately four-year range, 22 kg maximum child weight and
compatible CYBEX infant-car-seat system. Internal accessory-confirmation wording
was replaced by the Coya's integrated components and customer decisions. The code
fallback record was aligned with the database so it cannot reintroduce the retired
copy.

## Home & Living support-product repair

Five Home & Living support products were then reviewed as actual shopping pages,
not merely translated for FAQ parity. Four cleaning-machine pages contained long
staff checklists and handover procedures in their descriptions. Their EN/ES copy
now focuses on the task, capacity, standard tools and concise customer limitations:

- the Kärcher SE 3 Compact now explains wet extraction for carpets, upholstery and
  car seats, using [Kärcher's official specifications](https://www.kaercher.com/int/home-garden/spray-extraction-cleaners/se-3-compact-10815380.html);
- the Shark PowerPro now explains floor detection, handheld use and its up-to-50
  minute Eco runtime using [Shark's official IZ380EU page](https://www.sharkninja.es/aspiradora-sin-cable-shark-powerpro/IZ380EU.html);
- the Kärcher K 3 now correctly lists patios, outdoor furniture, bicycles and small
  vehicles instead of incorrectly prohibiting vehicle use, consistent with
  [Kärcher's official K 3 applications](https://www.kaercher.com/int/home-garden/pressure-washers/k-3-16763500.html);
- the Kärcher WD 3 now correctly explains that its one-piece cartridge filter
  handles wet and dry dirt without a filter change, based on
  [Kärcher's WD 3 specifications](https://www.kaercher.com/de/home-garden/nass-trockensauger/wd-3-s-v-17-4-20-16281350.html);
- the IKEA VIHALS folding chair now presents its dimensions, folding use and 110 kg
  tested limit from [IKEA Spain](https://www.ikea.com/es/es/p/vihals-silla-plegable-verde-00592752/),
  without describing internal inspection steps.

All five now have three useful FAQs in each language. The production readiness
audit remains clean and the optional bilingual FAQ queue is down to 12 products.

## Priority baby-support repair

The next five baby-support pages were reviewed before translation. Only the IKEA
ANTILOP high-chair copy was already customer-ready. The foldable bath, bottle
warmer and UV steriliser were framed around internal cleaning or inspection
processes, while the playpen exposed a raw supplier block directly on the page.
Those records now use direct EN/ES shopping copy and three useful FAQs per locale:

- ANTILOP facts are grounded in the
  [official IKEA Spain listing](https://www.ikea.com/es/es/p/antilop-trona-con-bandeja-blanco-blanco-s79597515/);
- the Tommee Tippee Easi-Warm describes its actual warming settings and timing
  rather than an internal hygiene gate;
- the Nuby 30113 states its supported three-minute UV cycle from the
  [official Nuby listing](https://uk.nuby.com/products/3-minute-uv-steriliser/1000);
- the foldable ALMAR bath explains the temperature indicator, newborn support and
  adult-supervision requirement without discussing inspection records;
- the Venture playpen now presents its 120 x 120 cm play area, mesh, padded mat and
  included components in normal customer language, and clearly remains an awake,
  supervised play space rather than a cot.

The production audit remains at 114 indexable active products in each language,
with zero identity or retired-copy conflicts. Seven optional FAQ-gap products
remain.

## Remaining work

1. Replace the shared generic monitor image with verified photos of each variant.
2. Continue the same fact-bound review through the remaining 7 optional FAQ-gap
   products and other lower-priority active products,
   correcting only evidenced defects rather than manufacturing copy volume.
