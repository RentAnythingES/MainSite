import type { SupabaseClient } from "@supabase/supabase-js";

type PaymentEventType =
  | "payment"
  | "refund"
  | "deposit_authorization"
  | "deposit_capture"
  | "deposit_release"
  | "manual_adjustment";

type PaymentEventStatus = "pending" | "succeeded" | "failed" | "cancelled";

export interface BookingPaymentEvent {
  id: string;
  booking_id: string;
  booking_draft_id: string | null;
  event_type: PaymentEventType;
  status: PaymentEventStatus;
  provider: string;
  currency: string;
  amount_cents: number;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  stripe_refund_id: string | null;
  stripe_charge_id: string | null;
  provider_event_id: string | null;
  description: string | null;
  metadata: Record<string, unknown>;
  occurred_at: string;
  created_at: string;
}

interface RecordBookingPaymentEventInput {
  bookingId: string;
  bookingDraftId?: string | null;
  eventType: PaymentEventType;
  status?: PaymentEventStatus;
  provider?: string;
  currency?: string | null;
  amountCents: number;
  stripeCheckoutSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  stripeRefundId?: string | null;
  stripeChargeId?: string | null;
  providerEventId?: string | null;
  description?: string | null;
  metadata?: Record<string, unknown>;
  occurredAt?: string | null;
}

interface DynamicQueryBuilder {
  upsert: (row: Record<string, unknown>, options?: { onConflict?: string }) => Promise<{ error: unknown }>;
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      maybeSingle: () => Promise<{ data: unknown | null; error: unknown }>;
    };
    in: (column: string, values: string[]) => {
      order: (column: string, options?: { ascending?: boolean }) => Promise<{ data: unknown[] | null; error: unknown }>;
    };
  };
}

interface DynamicSupabaseClient {
  from: (table: string) => DynamicQueryBuilder;
}

const asDynamicSupabase = (supabase: SupabaseClient) => supabase as unknown as DynamicSupabaseClient;

export async function recordBookingPaymentEvent(
  supabase: SupabaseClient,
  input: RecordBookingPaymentEventInput
): Promise<BookingPaymentEvent | null> {
  const provider = input.provider || "stripe";
  const providerEventId = input.providerEventId || null;
  const row = {
    booking_id: input.bookingId,
    booking_draft_id: input.bookingDraftId || null,
    event_type: input.eventType,
    status: input.status || "succeeded",
    provider,
    currency: (input.currency || "eur").toLowerCase(),
    amount_cents: Math.max(0, Math.round(input.amountCents)),
    stripe_checkout_session_id: input.stripeCheckoutSessionId || null,
    stripe_payment_intent_id: input.stripePaymentIntentId || null,
    stripe_refund_id: input.stripeRefundId || null,
    stripe_charge_id: input.stripeChargeId || null,
    provider_event_id: providerEventId,
    description: input.description || null,
    metadata: input.metadata || {},
    occurred_at: input.occurredAt || new Date().toISOString(),
  };

  const query = asDynamicSupabase(supabase)
    .from("booking_payment_events")
    .upsert(row, providerEventId ? { onConflict: "provider,provider_event_id" } : undefined);

  const { error } = await query;

  if (error) {
    console.error("[payment-ledger] Failed to record payment event:", error);
    return null;
  }

  if (!providerEventId) return null;

  const { data, error: fetchError } = await asDynamicSupabase(supabase)
    .from("booking_payment_events")
    .select("*")
    .eq("provider_event_id", providerEventId)
    .maybeSingle();

  if (fetchError) {
    console.error("[payment-ledger] Failed to fetch saved payment event:", fetchError);
    return null;
  }

  return (data as BookingPaymentEvent | null) || null;
}

export async function fetchBookingPaymentEventsByBookingId(
  supabase: SupabaseClient,
  bookingIds: string[]
): Promise<{ data: BookingPaymentEvent[]; error: unknown }> {
  if (bookingIds.length === 0) return { data: [], error: null };

  const { data, error } = await asDynamicSupabase(supabase)
    .from("booking_payment_events")
    .select("*")
    .in("booking_id", bookingIds)
    .order("occurred_at", { ascending: false });

  if (error) {
    console.error("[payment-ledger] Failed to fetch payment events:", error);
    return { data: [], error };
  }

  return { data: (data || []) as BookingPaymentEvent[], error: null };
}
