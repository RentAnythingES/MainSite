# Car-seat catalogue correction — 2026-08-11

## Release status

- The guarded transaction preview passed and rolled back cleanly.
- The production database migration was applied on 2026-08-11.
- All five existing product UUIDs were preserved.
- Generic-booster stock and Valencia online capacity now equal three.
- The application changes in this release add the corrected family membership,
  static fallback data and permanent redirects from the four false legacy slugs.

## Why this correction exists

The live car-seat catalogue contains incorrect product identities, mixed-source
copy, incorrect images, and operational verification language presented as
customer-facing sales copy. Existing names, slugs, descriptions, features,
specifications, FAQs, and image labels must not be treated as source evidence.

The physical product identities below were supplied directly by the business
owner on 2026-08-11 and are authoritative for this correction.

## Record mapping

| Existing product ID | Existing slug | Correct product | Action |
|---|---|---|---|
| `d9ec347e-8c22-4394-b58e-c8cbd02d1b34` | `car-seat-britax-i-size` | Moni Serengeti i-Size, 40–150 cm | Replace the false Britax identity and all associated copy and imagery. |
| `54928c5f-3e30-4d00-90e5-44daa9acc8bc` | `car-seat-infant` | Maxi-Cosi Pebble 360 Pro², without FamilyFix base | Replace the mixed generic/Cybex/Chicco identity and copy. |
| `67ce7859-a850-4ff4-b8ef-26256727687b` | `convertible-car-seat` | Peg Perego Viaggio1 Duo-Fix, Rouge | Keep the product ID, pricing, stock, and booking history; restore the actual product name and useful copy. |
| `1cdb7ecb-4a5c-4c05-9d26-a125b8185e30` | `kinderkraft-i-boost-2-booster-seat` | Kinderkraft I-SPARK 2 PLUS i-Size | Replace the false I-BOOST 2 identity, specifications, copy, and mismatched Maxi-Cosi image. |
| `9d978c2d-4e71-463a-9878-a2ba17cf6e2c` | `seat-booster` | Generic backless seat boosters | Keep one model-neutral customer listing backed by three interchangeable physical booster units. Remove unsupported brand/model claims. |

## Verified product facts

### Kinderkraft I-SPARK 2 PLUS i-Size

- Source: https://kinderkraft.es/productos/i-spark-2-plus-i-size?color=gris
- Manufacturer range: 100–150 cm, approximately 3.5–12 years.
- R129 / i-Size.
- Installs using the vehicle's three-point seat belt; ISOFIX is not required.
- High-back seat with H-GUARD and SPS protection systems.
- Ten-position adjustable headrest.
- For children over 140 cm, the backrest can be removed and the product used as
  a booster cushion, following the manufacturer instructions.
- Machine-washable cover.

### Moni Serengeti i-Size

- Business-supplied product page: https://www.carrefour.es/silla-de-coche-serenguetti-moni-i-size-40-a-150-cm/VC4A-26107319/p?skuId=3086160102&selectedSize
- Manufacturer product page: https://moni.bg/en/products/product_id/9619/stol-za-kola-serengeti-40-150sm-svetlosiv
- Product range: 40–150 cm.
- 360-degree rotating seat.
- Rear-facing and forward-facing configurations according to the child's size.
- ISOFIX and top-tether installation.
- Five-point harness for the applicable smaller-child configuration.
- Thirteen-position adjustable headrest and four recline positions.

The Carrefour product title spells the model `Serenguetti`; the product/manual
name is commonly rendered `Serengeti`. Use `Moni Serengeti i-Size` in Rent&Roll
copy unless the label on the physical unit uses a different spelling.

### Maxi-Cosi Pebble 360 Pro²

- Source: https://www.maxi-cosi.es/sillas-de-coche/pebble-360-pro2
- Rental configuration confirmed by the business owner: **FamilyFix base is not included**.
- From birth / 40–87 cm, approximately 0–18 months, 0–13 kg.
- i-Size / R129/03.
- Rear-facing infant carrier with three-point harness.
- Can be installed using the vehicle's three-point seat belt without the
  FamilyFix 360 Pro base.
- Fully reclined positions, G-CELL side-impact protection, ClimaFlow,
  removable newborn insert, integrated sun canopy, and removable cover.
- Product weight: 4.7 kg.
- Included by the manufacturer: seat, Baby Hugg insert, and sun canopy.

Do not describe SlideTech or 360-degree rotation as available in this rental;
those functions require the FamilyFix base, which is not supplied.

### Peg Perego Viaggio1 Duo-Fix, Rouge

- Manufacturer manual: https://www.pegperego.com/media/catalog/product/download/Viaggio1Duo-FixK_FI001801I128.pdf
- Business-supplied identity: Peg Perego Viaggio 1 Duo-Fix, Rouge.
- Forward-facing seat for 9–18 kg, approximately 1–4 years.
- Five-point harness.
- Adjustable side-impact protection and seven-position headrest.
- Four recline positions.
- Can be secured with the vehicle's three-point seat belt.
- The compatible Peg Perego ISOFIX Base 0+1 is a separate installation option;
  do not imply that it is included until the physical rental set confirms it.

The manual calls this an ECE R44/04 `Group 1` seat because that is its historical
regulatory category. `Group 1` is not the product name and should not replace the
model identity in customer-facing headings or descriptions.

### Generic backless seat boosters

- Business-confirmed inventory: three different generic booster units that are
  functionally equivalent for customer selection.
- Keep one public listing rather than creating three duplicate product pages.
- Do not use a manufacturer or model in the product name.
- Present them as lightweight backless boosters installed using the vehicle's
  three-point seat belt.
- Do not retain the current model-specific Kinderkraft/Maxi-Cosi copy or dimensions.
- The public listing should ask for the child's height so the assigned physical
  unit can be appropriate, without exposing internal inspection language.
- Catalogue stock and Valencia offer capacity should be three; changing availability
  remains a database concern rather than static page prose.

## Copy rules for the correction

- Lead with the exact product, child-size range, installation method, and useful
  travel benefit.
- Write for families arranging equipment before arriving in Valencia.
- Do not expose inspection workflows, approval-label checks, catalogue uncertainty,
  or internal release controls as sales copy.
- Do not claim that any seat fits every child or every vehicle.
- Keep necessary selection guidance concise and helpful: child height/weight and
  vehicle details can be requested without turning the listing into a compliance form.
- Do not mention changing stock quantities or compare the number of physical units
  in static prose.
- Preserve product IDs, pricing and booking history while correcting identity. Keep
  the four distinct seats at one unit each and set the generic-booster listing to
  the business-confirmed quantity of three.

## Production evidence before correction

- No car-seat inventory-unit records contain serial numbers or physical model notes.
- The Peg Perego product has one historical booking; the other four current records
  have no bookings.
- The product images themselves are unreliable evidence: the supposed Kinderkraft
  record currently displays a Maxi-Cosi Tanza image. The generic booster image can
  remain illustrative only if it accurately represents the supplied backless units;
  its brand must not be presented as the identity of all three units.
