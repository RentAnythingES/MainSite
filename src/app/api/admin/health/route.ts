import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { isStripeConfigured } from "@/lib/stripe";
import { sendEmailHealthCheck } from "@/lib/email";
import { createServiceClient } from "@/lib/supabase";
import { cleanupExpiredBookingDrafts } from "@/lib/booking-v2";

function maskEmail(value: string | undefined): string | null {
  if (!value) return null;
  const match = value.match(/<([^>]+)>/);
  const email = match?.[1] || value;
  const [local, domain] = email.split("@");

  if (!local || !domain) return value;
  return `${local.slice(0, 2)}***@${domain}`;
}

async function isAvailable(query: unknown) {
  const { error } = await (query as PromiseLike<{ error: unknown }>);
  return !error;
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const supabase = createServiceClient();
  const cleanup = await cleanupExpiredBookingDrafts(supabase);
  const now = new Date().toISOString();

  const [
    activeDraftsResult,
    expiredDraftsWithHoldsResult,
    unpaidHoldsResult,
    bookingDraftsReady,
    bookingInventoryReady,
    bookingOpsReady,
    inventoryAssignmentsReady,
    paymentLedgerReady,
    bookingDocumentsReady,
    productContentStatusReady,
    productLocalizationsReady,
    productFaqsReady,
    productImagesReady,
    systemIncidentsReady,
    unresolvedIncidentsResult,
    monitoringReady,
    latestMonitoringRun,
  ] = await Promise.all([
    supabase
      .from("booking_drafts")
      .select("id", { count: "exact", head: true })
      .in("status", ["draft", "checkout_created"])
      .gt("expires_at", now),
    supabase
      .from("booking_inventory_blocks")
      .select("id, booking_drafts!inner(status, expires_at)", { count: "exact", head: true })
      .is("booking_id", null)
      .in("booking_drafts.status", ["draft", "checkout_created"])
      .lt("booking_drafts.expires_at", now),
    supabase
      .from("booking_inventory_blocks")
      .select("id", { count: "exact", head: true })
      .is("booking_id", null)
      .not("booking_draft_id", "is", null),
    isAvailable(supabase.from("booking_drafts").select("id", { head: true })),
    isAvailable(supabase.from("booking_inventory_blocks").select("id", { head: true })),
    isAvailable(supabase.from("booking_ops_tasks").select("id", { head: true })),
    isAvailable(supabase.from("booking_inventory_unit_assignments").select("id", { head: true })),
    isAvailable(supabase.from("booking_payment_events").select("id", { head: true })),
    isAvailable(supabase.from("booking_documents").select("id", { head: true })),
    isAvailable(supabase.from("products").select("content_status", { head: true })),
    isAvailable(supabase.from("product_localizations").select("id", { head: true })),
    isAvailable(supabase.from("product_faqs").select("id", { head: true })),
    isAvailable(supabase.from("product_images").select("id", { head: true })),
    isAvailable(supabase.from("system_incidents").select("id", { head: true })),
    supabase
      .from("system_incidents")
      .select("id, source, severity, event_type, message, created_at", { count: "exact" })
      .is("resolved_at", null)
      .order("created_at", { ascending: false })
      .limit(10),
    isAvailable(supabase.from("monitoring_runs").select("id", { head: true })),
    supabase.from("monitoring_runs").select("status,issues,alert_sent,created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

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
      activeDraftCount: activeDraftsResult.count || 0,
      unpaidHoldCount: unpaidHoldsResult.count || 0,
      expiredDraftHoldCount: expiredDraftsWithHoldsResult.count || 0,
      lastCleanup: {
        expiredDrafts: cleanup.expiredDraftCount,
        deletedHolds: cleanup.deletedHoldCount,
      },
    },
    analytics: {
      gaConfigured: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID),
    },
    monitoring: {
      available: monitoringReady,
      cronSecretConfigured: Boolean(process.env.CRON_SECRET),
      latest: latestMonitoringRun.error ? null : latestMonitoringRun.data,
    },
    incidents: {
      available: systemIncidentsReady,
      unresolvedCount: unresolvedIncidentsResult.error ? null : unresolvedIncidentsResult.count || 0,
      latest: unresolvedIncidentsResult.error ? [] : unresolvedIncidentsResult.data || [],
    },
    migrations: {
      bookingCoreReady: bookingDraftsReady && bookingInventoryReady,
      bookingOpsReady,
      inventoryAssignmentsReady,
      financeReady: paymentLedgerReady && bookingDocumentsReady,
      productContentReady: productContentStatusReady && productLocalizationsReady && productFaqsReady && productImagesReady,
    },
  });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const result = await sendEmailHealthCheck();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
