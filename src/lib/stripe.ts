import Stripe from "stripe";

/**
 * Server-side Stripe client.
 * Only available in API routes / server components — never expose in client code.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY        — sk_test_... or sk_live_...
 *   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY — pk_test_... or pk_live_...  (for future client-side use)
 *   STRIPE_WEBHOOK_SECRET    — whsec_... (for webhook signature verification)
 */

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.warn(
    "[stripe] STRIPE_SECRET_KEY not set — Stripe payments will be unavailable. " +
    "Set it in .env.local or Vercel environment variables."
  );
}

export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      typescript: true,
    })
  : null;

/**
 * Check if Stripe is configured and available
 */
export function isStripeConfigured(): boolean {
  return stripe !== null;
}
