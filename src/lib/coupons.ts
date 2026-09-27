import type { SupabaseClient } from "@supabase/supabase-js";
import { BookingRuleError, type BookingQuote } from "@/lib/booking-v2";
import { calculateCouponDiscount, normalizeCouponCode, type Coupon } from "@/lib/coupon-rules";

export class CouponRuleError extends BookingRuleError {}

export async function applyBookingCoupon(supabase: SupabaseClient, quote: BookingQuote, productId: string, input: unknown) {
  if (input === undefined || input === null || input === "") return;
  let code: string;
  try { code = normalizeCouponCode(input); } catch (error) { throw new CouponRuleError((error as Error).message); }
  const { data, error } = await supabase.from("coupons").select("*").eq("code", code).maybeSingle();
  if (error) throw error;
  if (!data) throw new CouponRuleError("Coupon code not found.");
  const coupon = data as Coupon;
  let categoryIds: string[] = [];
  if (coupon.scope === "categories") {
    const [product, memberships] = await Promise.all([
      supabase.from("products").select("category_id").eq("id", productId).single(),
      supabase.from("product_category_memberships").select("category_id").eq("product_id", productId),
    ]);
    if (product.error) throw product.error;
    if (memberships.error) throw memberships.error;
    categoryIds = [product.data.category_id, ...(memberships.data || []).map((row) => row.category_id)].filter(Boolean);
  }
  let discountCents: number;
  try { discountCents = calculateCouponDiscount(coupon, productId, categoryIds, quote.rentalSubtotalCents); }
  catch (error) { throw new CouponRuleError((error as Error).message); }
  const discountedTotal = quote.totalCents - discountCents;
  if (discountedTotal > 0 && discountedTotal < 50) throw new CouponRuleError("This coupon leaves a total below the €0.50 payment minimum. Please use another code or contact us.");
  quote.couponCode = code;
  quote.couponDiscountCents = discountCents;
  quote.pricingSnapshot = { ...quote.pricingSnapshot, coupon: { id: coupon.id, code, discountType: coupon.discount_type, value: coupon.value, scope: coupon.scope, expiresOn: coupon.expires_on, rentalSubtotalBeforeCouponCents: quote.rentalSubtotalCents, discountCents } };
  quote.rentalSubtotalCents -= discountCents;
  quote.totalCents -= discountCents;
}
