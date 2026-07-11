# Product Import Workflow and Results

> Completed: 2026-07-11

## Purpose

Validate the source-page to product-draft workflow before importing the full
`Product_Database_WIP.xlsx` catalogue.

## Full Workbook Import

The full workbook contained 137 named rows. After excluding the four pilot
products and the duplicate Beach Wheelchair row, 132 remaining products were
reconciled on 2026-07-11:

- **129** new inactive drafts were created.
- **3** already-existing products were left untouched: Double Stroller,
  Standard Wheelchair, and Travel Crib.
- **61** source images were downloaded and copied to the `product-images`
  Supabase Storage bucket; all 61 returned HTTP 200 after upload.
- **71** drafts have no image yet because the workbook had no usable source URL
  or the source did not expose a safe raster product image. They remain inactive.

The import added draft-only database categories where the workbook did not map
to the existing public catalogue: Events & Celebrations, Fitness & Wellness,
Photography & Content, and Catalogue Review. No active customer-facing products
were added to these categories.

## Imported Drafts

| Product | Site category | Source | Draft status |
|---|---|---|---|
| Acupressure Mat | Home and Living / Wellness & Recovery | [Decathlon 8767817](https://www.decathlon.es/es/p/esterilla-de-masaje-acupresion/343121/c251c309c344m8767817) | Inactive; pricing review required |
| Motorized Beach Wheelchair E4 | Mobility and Daily Aid / Beach Wheelchairs | [Wheels in the Sand E4](https://www.wheelsinthesand.com/product/motorized-beach-wheelchair-e4/) | Inactive; pricing review required |
| Thule ProRide 598 Roof Bike Carrier | Travel and Outdoors / Travel Accessories | [Decathlon 8676835](https://www.decathlon.es/es/p/portabicicletas-techo-thule-proride-598/X8676835/m8676835) | Inactive; pricing review required |
| Deuter Kid Comfort Child Carrier | Baby and Children / Baby Carriers | [Decathlon 8746948](https://www.decathlon.es/es/p/portabebes-rigido-deuter-kid-comfort/X8746948/m8746948) | Inactive; pricing review required |

## Confirmed Workflow

1. Read source data from the workbook and source product page.
2. Summarise factual product information for the RentAnything catalogue.
3. Download one source image and upload it to the `product-images` Supabase
   Storage bucket. The site stores and serves its own public Storage URL; it
   does not hotlink external retailer images.
4. Create the product as inactive with a zero-price placeholder.
5. Keep the product inactive until the operator has confirmed physical stock,
   set positive rental pricing, reviewed delivery/collection suitability, and
   confirmed image-use approval where required.

The reusable workbook importer is `scripts/import-workbook-drafts.py`. It is
resumable: rerunning a batch skips product rows already created rather than
duplicating them.

## Activation Rule

The admin API now prevents activation when any pricing tier is zero, an image
is invalid or missing, stock is invalid, or required catalogue fields are
incomplete.
