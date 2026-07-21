# Mobility Scooter Listing Review — 21 July 2026

## Scope

Reviewed the three active mobility-scooter listings:

- `mobility-scooter-standard`
- `mobility-scooter-lightweight`
- `heavy-duty-mobility-scooter`

The review covered core facts, English and Spanish copy, SEO metadata, FAQs,
constraints, handover guidance, charging guidance, image metadata, inventory state,
and indexability.

## Changes applied

- Replaced unsupported Pride and Invacare labels with the honest catalogue label
  `Model confirmed before booking` / equivalent contextual copy.
- Qualified range and speed values as advertised maximums rather than guaranteed
  real-world performance.
- Added clear access, terrain, charging, vehicle-transport, storage, and lifting
  constraints appropriate to each scooter class.
- Added complete English and Spanish editorial content and five FAQs per locale for
  each product.
- Removed competitor contact details, low-deposit claims, airport/cruise promises,
  partner-network language, guaranteed-route claims, and other unsupported copy.
- Preserved all prices, stock counts, availability blocks, active states, and image
  URLs.
- Updated the static lightweight and heavy-duty fallbacks so a Supabase outage does
  not restore the old unsupported brand and performance claims.

## Current publication state

| Listing | Active | Available stock | Editorial state | EN/ES content | Image provenance |
|---|---:|---:|---|---|---|
| Standard | Yes | 1 | Content ready | Complete | Unknown; third-party rental page recorded as source |
| Lightweight | Yes | 0 | Facts verified | Complete | Unknown; original MVP asset source undocumented |
| Heavy-duty | Yes | 0 | Facts verified | Complete | Unknown; original MVP asset source undocumented |

The standard listing is intentionally excluded from SEO indexability until an image
with documented rights is uploaded or permission for the current asset is recorded.
The two legacy listings remain indexable under the existing legacy-product rule, but
their image provenance is now visible internally rather than being guessed.

## Required operational follow-up

1. Photograph each physical scooter or obtain a supplier/manufacturer catalogue
   image with explicit reuse permission.
2. Record the exact make, model, serial plate, battery specification, dimensions,
   total weight, heaviest transport component, maximum user weight, speed, and
   manufacturer range for each physical unit.
3. Replace the generic images and update image rights to `owned`, `licensed`, or
   `manufacturer_approved` only when evidence exists.
4. Confirm the supported handover method for the heavy-duty unit in fulfillment
   configuration rather than enforcing it through editorial copy.
5. Run a controlled route, charging, access, and brake check before opening each
   unit for paid bookings.

## Validation

- Product metadata title lengths: all under 60 characters.
- Product metadata descriptions: all between 120 and 160 characters.
- Product image asset audit: zero errors and zero warnings.
- Product SEO audit: lightweight and heavy-duty indexable in EN/ES; standard blocked
  only by deliberately unconfirmed image rights.
