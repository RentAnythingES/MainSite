import { privateGermanPreviewEnabled } from "@/lib/localization-preview";

import { createAdminClient } from "@/lib/supabase-admin";
import { storedBookingLocale } from "@/lib/booking-locale";
import { germanCustomerAccess } from "@/lib/german-customer-access";
import { readPrivateGermanDrafts } from "@/lib/private-german-catalogue";
import { amendmentCopy } from "@/i18n/private-quotes";
import type { Locale } from "@/i18n/config";

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Resolve before rendering so loading/error copy uses the saved language too. */
export async function privateQuoteLocale(kind: "custom" | "amendment" | "review", token: string) {
  if (!uuid.test(token)) return null;
  const db = createAdminClient();
  const { data, error } = kind === "custom"
    ? await db.from("booking_custom_quotes").select("locale").eq("public_token", token).maybeSingle()
    : kind === "review"
      ? await db.from("booking_reviews").select("locale").eq("public_token", token).maybeSingle()
      : await db.from("booking_fulfillment_amendments").select("booking:bookings!inner(locale)").eq("public_token", token).maybeSingle();
  if (error || !data) return null;
  const value = kind !== "amendment" ? (data as { locale: unknown }).locale : (data as unknown as { booking: { locale: unknown } }).booking.locale;
  const locale = storedBookingLocale(value);
  if (locale === "de" && !germanCustomerAccess()) return null;
  return locale;
}

export async function quoteProductName(product: { name: string; slug?: string } | null, locale: Locale, displayName?: unknown) {
  if (typeof displayName === "string" && displayName.trim()) return displayName;
  if (!product) return amendmentCopy[locale].product;
  if (locale !== "de") return product.name;
  if (!privateGermanPreviewEnabled()) {
    const { publishedGermanProducts } = await import("@/lib/german-catalogue");
    const translated = (await publishedGermanProducts()).find(item => item.slug === product.slug);
    if (!translated) throw new Error("German product translation is not published");
    return translated.name;
  }
  const draft = (await readPrivateGermanDrafts()).find(item => item.slug === product.slug);
  if (!draft) throw new Error("Missing German product name for transport quote");
  return draft.content.name;
}
