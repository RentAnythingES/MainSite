import type { SupabaseClient } from "@supabase/supabase-js";
import type { RentalBundle } from "@/data/bundles";
import {
  calculateRentalDays,
  cleanupExpiredBookingDrafts,
  getProductWithPricing,
  quoteBooking,
} from "@/lib/booking-v2";
import type { Database } from "@/lib/types";

export type BundleAvailabilityStatus = "available" | "unavailable" | "manual_confirmation";

export interface BundleAvailabilityLine {
  name: string;
  productSlug: string | null;
  status: BundleAvailabilityStatus;
  maxAvailableQuantity: number | null;
  rentalSubtotalCents: number | null;
  note: string | null;
}

export interface BundleAvailabilityResult {
  bundleSlug: string;
  startDate: string;
  endDate: string;
  rentalDays: number;
  status: "available" | "unavailable" | "partial";
  knownRentalSubtotalCents: number;
  lines: BundleAvailabilityLine[];
  checkedAt: string;
}

async function checkMappedProduct(
  supabase: SupabaseClient<Database>,
  name: string,
  productSlug: string,
  startDate: string,
  endDate: string,
  startAt: Date,
  endAt: Date,
): Promise<BundleAvailabilityLine> {
  try {
    const { product, tiers, quantityDiscounts } = await getProductWithPricing(supabase, productSlug);
    const [{ data: blockedRows, error: blockedError }, { data: blockRows, error: blockError }] = await Promise.all([
      supabase
        .from("blocked_dates")
        .select("blocked_date")
        .eq("product_id", product.id)
        .gte("blocked_date", startDate)
        .lte("blocked_date", endDate),
      supabase
        .from("booking_inventory_blocks")
        .select("quantity, booking_drafts!left(status, expires_at)")
        .eq("product_id", product.id)
        .lt("starts_at", endAt.toISOString())
        .gt("ends_at", startAt.toISOString()),
    ]);

    if (blockedError) throw blockedError;
    if (blockError && blockError.code !== "42P01" && blockError.code !== "42703") throw blockError;

    const overlappingQuantity = (blockRows || []).reduce((total, row) => {
      const block = row as {
        quantity: number;
        booking_drafts?: { status?: string; expires_at?: string } | null;
      };
      const draft = block.booking_drafts;
      const active = !draft || (
        ["draft", "checkout_created"].includes(draft.status || "") &&
        new Date(draft.expires_at || 0).getTime() > Date.now()
      );
      return active ? total + block.quantity : total;
    }, 0);
    const maxAvailableQuantity = (blockedRows || []).length > 0
      ? 0
      : Math.max(0, Math.min(product.stock_available, product.stock_total - overlappingQuantity));
    const quote = quoteBooking(
      tiers,
      quantityDiscounts,
      startAt,
      endAt,
      { mode: "customer_pickup" },
      null,
      null,
      1,
    );

    return {
      name,
      productSlug,
      status: maxAvailableQuantity > 0 ? "available" : "unavailable",
      maxAvailableQuantity,
      rentalSubtotalCents: quote.rentalSubtotalCents,
      note: maxAvailableQuantity > 0 ? null : "No online stock is currently available for these dates.",
    };
  } catch (error) {
    console.warn(`[bundle-availability] Could not resolve ${productSlug}`, error);
    return {
      name,
      productSlug,
      status: "manual_confirmation",
      maxAvailableQuantity: null,
      rentalSubtotalCents: null,
      note: "This selection needs staff confirmation.",
    };
  }
}

export async function checkBundleAvailability(
  supabase: SupabaseClient<Database>,
  bundle: RentalBundle,
  selectedItemNames: string[],
  selectedAddonNames: string[],
  startDate: string,
  endDate: string,
): Promise<BundleAvailabilityResult> {
  const startAt = new Date(`${startDate}T09:00:00+02:00`);
  const endAt = new Date(`${endDate}T09:00:00+02:00`);
  const rentalDays = calculateRentalDays(startAt, endAt);
  await cleanupExpiredBookingDrafts(supabase);

  const selected = [
    ...bundle.includedItems.filter((item) => selectedItemNames.includes(item.name)),
    ...bundle.addons.filter((item) => selectedAddonNames.includes(item.name)),
  ];
  const lines = await Promise.all(selected.map((item) =>
    item.productSlug
      ? checkMappedProduct(supabase, item.name, item.productSlug, startDate, endDate, startAt, endAt)
      : Promise.resolve<BundleAvailabilityLine>({
          name: item.name,
          productSlug: null,
          status: "manual_confirmation",
          maxAvailableQuantity: null,
          rentalSubtotalCents: null,
          note: "This kit component is selected from available alternatives by staff.",
        }),
  ));
  const knownRentalSubtotalCents = lines.reduce(
    (total, line) => total + (line.status === "available" ? line.rentalSubtotalCents || 0 : 0),
    0,
  );
  const hasUnavailable = lines.some((line) => line.status === "unavailable");
  const hasManual = lines.some((line) => line.status === "manual_confirmation");

  return {
    bundleSlug: bundle.slug,
    startDate,
    endDate,
    rentalDays,
    status: hasUnavailable ? "unavailable" : hasManual ? "partial" : "available",
    knownRentalSubtotalCents,
    lines,
    checkedAt: new Date().toISOString(),
  };
}
