# Coupons

Apply `npm run db:migrate -- 20260927_coupons.sql 20260927_coupon_expiry.sql` before deploying this feature.
The migration adds a private table without changing existing bookings.

Open `/admin/coupons`. Enter a code, or leave it blank for automatic generation.
Choose a percentage (up to 100%) or fixed EUR amount, then all products, specific
products, or one or more categories. Category eligibility includes both primary
and secondary product memberships. Codes are case-insensitive and reusable without
a redemption limit. Every coupon has a required expiry date, defaulting to one
calendar year after creation (29 February becomes 28 February in a non-leap year).
Admins can change the date at creation or use **Save expiry** on an existing coupon.
Coupons remain valid through the selected date in Europe/Madrid time. Availability
and draft creation reject expired codes. Existing coupons are backfilled to one
year after their creation date. Disable a code to prevent new discounted drafts.
Already-created drafts and open payment sessions retain their agreed price, including
when the coupon later expires. Changing expiry does not re-enable a disabled coupon.

Customers enter a single code and select **Apply / update price** before continuing.
The server reapplies validation when creating the booking draft. Discounts apply
after quantity discounts to rental charges only, once per booking; fixed amounts
are capped at the rental subtotal. Transport, extras, and deposits are excluded.
Custom staff-authored quote links keep their agreed prices and do not accept coupons.
Amounts are calculated in integer cents (percentage configuration uses basis points).

The draft and paid booking preserve `pricing_snapshot.coupon` for audit. Stored
rental subtotal and total are net of the coupon, so invoices and payment records
use the amount actually agreed. Stripe receives a single exact rental amount for
all selected units, avoiding fractional-cent allocation errors.

Fully discounted orders use Stripe Checkout with a zero total. Fulfillment accepts
`no_payment_required` only for a completed, zero-total session, and still checks
the amount against the stored draft. Nonzero totals below €0.50 are rejected with
a customer-facing explanation before creating a draft. See Stripe's
[no-cost orders](https://docs.stripe.com/payments/checkout/no-cost-orders) and
[minimum charge amounts](https://docs.stripe.com/currencies#minimum-and-maximum-charge-amounts).

Verification: `npm run test:coupons`, `npx tsc --noEmit`, and `npx next build`.
`npm run db:verify:coupons` verifies database security and coupon constraints inside
a transaction that is always rolled back. The migration was applied to the
connected database on 27 September 2026; coupon verification and the existing
backend verification passed with no persisted test writes. Browser checks covered
unknown-code errors and clearing the code to return to normal checkout.
Before release, exercise both locales with valid, unknown, disabled, out-of-scope,
percentage, fixed, and fully discounted coupons using Stripe test mode. Verify
the paid booking, inventory hold conversion, and invoice total.
