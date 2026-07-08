import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { isStripeConfigured } from "@/lib/stripe";
import { sendEmailHealthCheck } from "@/lib/email";

function maskEmail(value: string | undefined): string | null {
  if (!value) return null;
  const match = value.match(/<([^>]+)>/);
  const email = match?.[1] || value;
  const [local, domain] = email.split("@");

  if (!local || !domain) return value;
  return `${local.slice(0, 2)}***@${domain}`;
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  return NextResponse.json({
    stripe: {
      configured: isStripeConfigured(),
      webhookSecretConfigured: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
      publishableKeyConfigured: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    },
    resend: {
      configured: Boolean(process.env.RESEND_API_KEY),
      fromEmail: maskEmail(process.env.FROM_EMAIL || "RentAnything <noreply@rentanything.es>"),
      contactEmail: maskEmail(process.env.CONTACT_EMAIL || "hello@rentanything.es"),
    },
    supabase: {
      urlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      anonKeyConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
      serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    },
    booking: {
      paused: process.env.BOOKINGS_PAUSED !== "false",
      publicPaused: process.env.NEXT_PUBLIC_BOOKINGS_PAUSED !== "false",
    },
    analytics: {
      gaConfigured: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID),
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const result = await sendEmailHealthCheck();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
