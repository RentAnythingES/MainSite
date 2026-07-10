import type { SupabaseClient } from "@supabase/supabase-js";
import type { BookingPaymentEvent } from "@/lib/payment-ledger";
import { randomBytes } from "crypto";

type BookingDocumentType = "invoice" | "refund_receipt" | "rental_agreement";
type BookingDocumentStatus = "draft" | "issued" | "void";

export interface BookingDocument {
  id: string;
  booking_id: string;
  payment_event_id: string | null;
  document_type: BookingDocumentType;
  status: BookingDocumentStatus;
  document_number: string | null;
  document_year: number;
  currency: string;
  subtotal_cents: number;
  delivery_fee_cents: number;
  collection_fee_cents: number;
  deposit_cents: number;
  tax_cents: number;
  total_cents: number;
  customer_snapshot: Record<string, unknown>;
  company_snapshot: Record<string, unknown>;
  booking_snapshot: Record<string, unknown>;
  payment_snapshot: Record<string, unknown>;
  pdf_url: string | null;
  notes: string | null;
  customer_access_token?: string | null;
  customer_access_expires_at?: string | null;
  customer_access_last_sent_at?: string | null;
  issued_at: string;
  voided_at: string | null;
  created_at: string;
  updated_at: string;
}

interface DynamicQueryBuilder {
  insert: (row: Record<string, unknown>) => {
    select: (columns: string) => {
      single: () => Promise<{ data: unknown | null; error: unknown }>;
    };
  };
  select: (columns: string) => {
    eq: (column: string, value: string) => {
      single: () => Promise<{ data: unknown | null; error: unknown }>;
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

const COMPANY_SNAPSHOT = {
  name: "Escalera Labs S.L.",
  brand: "RentAnything.es",
  country: "Spain",
  city: "Valencia",
};

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.rentanything.es").replace(/\/$/, "");

function createCustomerAccessToken() {
  return randomBytes(32).toString("hex");
}

function createCustomerAccessExpiry() {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 365);
  return expiresAt.toISOString();
}

export function getCustomerDocumentUrl(document: BookingDocument | null): string | null {
  if (!document?.customer_access_token) return null;
  return `${SITE_URL}/api/documents/${document.customer_access_token}/pdf`;
}

export async function createBookingDocumentForPaymentEvent(
  supabase: SupabaseClient,
  input: {
    booking: Record<string, unknown>;
    paymentEvent: BookingPaymentEvent | null;
    productName?: string | null;
  }
) {
  const { booking, paymentEvent } = input;
  if (!paymentEvent) return null;

  const documentType: BookingDocumentType =
    paymentEvent.event_type === "refund" ? "refund_receipt" : "invoice";
  const isRefund = documentType === "refund_receipt";
  const bookingId = booking.id as string | undefined;
  if (!bookingId) return null;

  const row = {
    booking_id: bookingId,
    payment_event_id: paymentEvent.id,
    document_type: documentType,
    status: "issued",
    currency: paymentEvent.currency || "eur",
    subtotal_cents: isRefund ? 0 : (booking.subtotal_cents as number) || 0,
    delivery_fee_cents: isRefund ? 0 : (booking.delivery_fee_cents as number) || 0,
    collection_fee_cents: isRefund ? 0 : (booking.collection_fee_cents as number) || 0,
    deposit_cents: isRefund ? 0 : (booking.deposit_cents as number) || 0,
    tax_cents: 0,
    total_cents: isRefund ? paymentEvent.amount_cents : (booking.total_cents as number) || paymentEvent.amount_cents,
    customer_snapshot: {
      name: booking.customer_name || null,
      email: booking.customer_email || null,
      phone: booking.customer_phone || booking.customer_whatsapp || null,
    },
    company_snapshot: COMPANY_SNAPSHOT,
    booking_snapshot: {
      booking_ref: booking.booking_ref || null,
      product_name: input.productName || null,
      rental_start_at: booking.rental_start_at || booking.start_date || null,
      rental_end_at: booking.rental_end_at || booking.end_date || null,
      rental_days: booking.rental_days || null,
      fulfillment_mode: booking.fulfillment_mode || null,
    },
    payment_snapshot: {
      payment_event_id: paymentEvent.id,
      event_type: paymentEvent.event_type,
      provider: paymentEvent.provider,
      provider_event_id: paymentEvent.provider_event_id,
      stripe_checkout_session_id: paymentEvent.stripe_checkout_session_id,
      stripe_payment_intent_id: paymentEvent.stripe_payment_intent_id,
      stripe_refund_id: paymentEvent.stripe_refund_id,
    },
    notes: isRefund ? "Generated from Stripe refund event." : "Generated from Stripe Checkout payment.",
    customer_access_token: createCustomerAccessToken(),
    customer_access_expires_at: createCustomerAccessExpiry(),
    issued_at: paymentEvent.occurred_at || new Date().toISOString(),
  };

  const { data, error } = await asDynamicSupabase(supabase)
    .from("booking_documents")
    .insert(row)
    .select("*")
    .single();

  if (error) {
    console.error("[booking-documents] Failed to create booking document:", error);
    return null;
  }

  return data as BookingDocument | null;
}

export async function fetchBookingDocumentByCustomerToken(
  supabase: SupabaseClient,
  token: string
): Promise<{ data: BookingDocument | null; error: unknown }> {
  const { data, error } = await asDynamicSupabase(supabase)
    .from("booking_documents")
    .select("*")
    .eq("customer_access_token", token)
    .single();

  if (error) {
    console.error("[booking-documents] Failed to fetch customer document:", error);
    return { data: null, error };
  }

  return { data: data as BookingDocument | null, error: null };
}

export async function fetchBookingDocumentsByBookingId(
  supabase: SupabaseClient,
  bookingIds: string[]
): Promise<{ data: BookingDocument[]; error: unknown }> {
  if (bookingIds.length === 0) return { data: [], error: null };

  const { data, error } = await asDynamicSupabase(supabase)
    .from("booking_documents")
    .select("*")
    .in("booking_id", bookingIds)
    .order("issued_at", { ascending: false });

  if (error) {
    console.error("[booking-documents] Failed to fetch booking documents:", error);
    return { data: [], error };
  }

  return { data: (data || []) as BookingDocument[], error: null };
}
