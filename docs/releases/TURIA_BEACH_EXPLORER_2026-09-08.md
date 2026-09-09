# Turia & Beach Explorer release — 2026-09-08

User authorized completing and publishing this package first. Release is isolated from the main dirty working tree, based on origin/master c7489e1.

## Scope and sequence
1. Add one bilingual data-driven kit using the existing /valencia/kits/[slug] architecture, index and sitemap.
2. Present one selected Rockrider E-ACTV 100 low-frame pearl-grey L/XL (172–195 cm), one Hamax Pioneer two-seat trailer and compact shade. Optional cooler and sand toys require cargo confirmation.
3. Publish as request for dates; no instant stock, rental price, savings percentage or physical fit promise. Supplier images remain unpublished. Helmet/lock details and full quote confirmed before payment.
4. Check production build, browser desktop/mobile and request payload with mocked responses (no email or customer records created).
5. Commit only this isolated release, deploy and verify both public routes plus discovery and sitemap.

## Asset provenance
public/bundles/turia-beach-explorer.png — generated with the built-in imagegen tool, editorial illustration, not a product photograph. Caption discloses illustration. Prompt: refined Valencia travel illustration in cream, teal and amber; Turia gardens, distant City of Arts and Sciences and beach; separate grey low-step bike, empty two-seat trailer and compact shade; no people or connected hitch, no text. No supplier media published. Full generation prompt remains in this task history.

## Evidence and operational handoff
Selected model and owner L/XL decision: docs/catalogue-intake/2026-09-07-electric-bike-rockrider-lxl.json in the working workspace (private intake evidence, not part of website assets).
Manufacturer: https://www.decathlon.es/es/p/bicicleta-trekking-electrica-cuadro-bajo-e-actv-100-gris-perla/356245/c200m8893262 and https://support.decathlon.es/rockrider-e-actv-100-manual-reparacion (verified intake 2026-09-07). Hamax compatibility is manufacturer-listed; exact hitch, loaded setup and child suitability still require operational checks.
E-bike draft remains inactive with zero stock and no pricing. Supply, helmets/lock, packed shade/cooler dimensions and load, child fit and delivery must be checked before accepting a request. No purchase or inventory activation.

## Validation
- Production build passes: 255 generated pages, both Explorer routes included. Explicit Turbopack root prevents duplicate Next.js contexts in nested release checkouts.
- Four isolated regression checks pass: catalogue/i18n, EN request, ES request, rejected missing consent. Database and email functions mocked.
- Browser checks pass at 1440px and 390px in both languages: HTTP 200, correct canonicals, three fixed core items, optional cooler, successful mocked form response, no forced WhatsApp navigation, repeat submit disabled and no horizontal overflow or browser errors.
- No real customer requests, messages, payments or stock changes made.
- Publication verification pending; will be appended after the deployed routes respond.
