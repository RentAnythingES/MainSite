# Category Merchandising Audit — 11 August 2026

## Purpose

Category pages are shopping surfaces. They must show every active member as a full
product card, while the first row should represent the products most useful to the
business and customer. Merchandising order does not change SEO ownership, product
canonicals, category membership or indexability.

## Evidence reviewed

A read-only production query aggregated product-level bookings and rental subtotal
revenue, excluding `cancelled` and `refunded` bookings. No customer data was read or
stored.

| Category | Observed demand used for the initial order |
|---|---|
| Apartment Comfort | Both portable AC units have 3 bookings each and €791 combined rental subtotal revenue |
| Remote Work | The 27-inch monitor has 1 booking and €133 rental subtotal revenue |
| Baby & Toddler | The Peg Perego car seat has 1 booking/€55; the travel cot has 1 booking/€22.50 |
| Beach & Outdoor | Beach Umbrella and Chair Set has 1 booking/€60; umbrella with table has 1/€30; Beach Towel XL has 2/€17 |
| Mobility & Accessibility | No recorded non-cancelled bookings; published keyword evidence supports leading with the three scooter options, followed by wheelchairs and the rollator |
| Kids & Family | No recorded non-cancelled bookings; lead with clearly representative child mobility, play and shared family activity products |
| Sports & Wellness | No recorded non-cancelled bookings or sufficiently strong product-level evidence; retain alphabetical order until evidence supports a change |

## Implementation rule

`src/data/category-merchandising.ts` contains short, explicit leading-product lists.
The public product service applies those entries first and preserves the existing
alphabetical order for every unlisted product. This is intentionally simpler than a
new database/admin ordering subsystem for the current catalogue size.

Guardrails:

- no product is hidden, capped or moved out of its category;
- one product may have a different position in each relevant category;
- order is not calculated from search keywords automatically;
- sales evidence protects proven products, but zero-sales products can lead where
  they represent validated category demand or the category's core shopping job;
- update the list only after product, sales, seasonality or customer-navigation
  evidence changes; do not churn order reactively after one impression or click;
- EN and ES must use the same product sequence.

## Initial leading sequences

- Baby & Toddler: booked Peg Perego seat, booked travel cot, compact stroller, high chair.
- Kids & Family: Bobby Car, toddler bike, sand toys, single-child trailer/jogger,
  two-child trailer/stroller, beach tennis, beachminton, family kayak.
- Mobility: foldable, standard and XL scooters; transport and powered wheelchairs;
  rollator.
- Remote Work: booked 27-inch monitor, remaining monitor sizes, desk, chair.
- Apartment Comfort: the two proven portable AC units.
- Beach & Outdoor: the two proven umbrella setups, booked XL towel, chair, sand toys,
  compact shelter and wagon.
- Sports & Wellness: unchanged alphabetical fallback pending evidence.
