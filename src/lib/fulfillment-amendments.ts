import type { SupabaseClient } from "@supabase/supabase-js";

export type FulfillmentAmendmentStatus =
  | "quoted"
  | "checkout_created"
  | "paid"
  | "cancelled"
  | "expired";

export interface FulfillmentAmendment {
  id: string;
  booking_id: string;
  public_token: string;
  status: FulfillmentAmendmentStatus;
  fulfillment_mode: "delivery_only" | "delivery_and_collection";
  delivery_zone_id: string | null;
  collection_zone_id: string | null;
  delivery_address: string;
  collection_address: string | null;
  delivery_notes: string | null;
  collection_notes: string | null;
  delivery_fee_cents: number;
  collection_fee_cents: number;
  currency: string;
  is_custom_quote: boolean;
  quote_notes: string | null;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  quoted_at: string;
  expires_at: string;
  paid_at: string | null;
  applied_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  updated_at: string;
}

export function isMissingFulfillmentAmendmentsTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const value = error as { code?: string; message?: string };
  return value.code === "PGRST205" || Boolean(value.message?.includes("booking_fulfillment_amendments"));
}

export function getFulfillmentAmendmentUrl(token: string): string {
  return `https://rentanything.es/booking/fulfillment/${token}`;
}

export function getFulfillmentAmendmentTotal(amendment: Pick<FulfillmentAmendment, "delivery_fee_cents" | "collection_fee_cents">) {
  return amendment.delivery_fee_cents + amendment.collection_fee_cents;
}

export async function fetchFulfillmentAmendmentsByBookingIds(
  supabase: SupabaseClient,
  bookingIds: string[],
): Promise<{ data: FulfillmentAmendment[]; error: unknown }> {
  if (bookingIds.length === 0) return { data: [], error: null };

  const { data, error } = await supabase
    .from("booking_fulfillment_amendments")
    .select("*")
    .in("booking_id", bookingIds)
    .order("created_at", { ascending: false });

  if (error) return { data: [], error };
  return { data: (data || []) as FulfillmentAmendment[], error: null };
}
