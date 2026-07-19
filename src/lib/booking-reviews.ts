import type { SupabaseClient } from "@supabase/supabase-js";

const REVIEW_BASE_URL = "https://rentanything.es/review";

export function isMissingBookingReviewsTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const value = error as { code?: string; message?: string };
  return value.code === "PGRST205" || Boolean(value.message?.includes("booking_reviews"));
}

export async function createBookingReviewInvitation(
  supabase: SupabaseClient,
  bookingId: string,
  productId: string | null,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("booking_reviews")
    .insert({ booking_id: bookingId, product_id: productId, locale: "en" })
    .select("public_token")
    .single();

  if (!error && data?.public_token) {
    return `${REVIEW_BASE_URL}/${data.public_token}`;
  }

  if (isMissingBookingReviewsTable(error)) {
    console.warn("[reviews] booking_reviews migration is not available; review invitation skipped");
    return null;
  }

  const { data: existing, error: existingError } = await supabase
    .from("booking_reviews")
    .select("public_token")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (existingError || !existing?.public_token) {
    console.error("[reviews] Failed to create review invitation", error || existingError);
    return null;
  }

  return `${REVIEW_BASE_URL}/${existing.public_token}`;
}
