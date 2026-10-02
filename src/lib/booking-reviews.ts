import { customerTokenPath } from "@/i18n/customer-path";
import type { SupabaseClient } from "@supabase/supabase-js";

const REVIEW_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://rentandroll.com").replace(/\/$/, "");
const reviewUrl = (token: string, locale: "en" | "es" | "de") =>
  `${REVIEW_SITE_URL}${customerTokenPath(locale, `/review/${token}`)}?locale=${locale}`;

export function isMissingBookingReviewsTable(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const value = error as { code?: string; message?: string };
  return value.code === "PGRST205" || Boolean(value.message?.includes("booking_reviews"));
}

export async function createBookingReviewInvitation(
  supabase: SupabaseClient,
  bookingId: string,
  productId: string | null,
  locale: "en" | "es" | "de" = "en",
): Promise<string | null> {
  const { data, error } = await supabase
    .from("booking_reviews")
    .insert({ booking_id: bookingId, product_id: productId, locale })
    .select("public_token")
    .single();

  if (!error && data?.public_token) {
    return reviewUrl(data.public_token, locale);
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

  return reviewUrl(existing.public_token, locale);
}
