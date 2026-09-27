export interface Coupon {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  value: number; // Basis points for percentages, cents for fixed EUR amounts.
  scope: "all" | "products" | "categories";
  product_ids: string[];
  category_ids: string[];
  is_active: boolean;
  expires_on: string;
}

export function couponToday(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function defaultCouponExpiry(now = new Date()): string {
  const date = new Date(`${couponToday(now)}T00:00:00Z`);
  const month = date.getUTCMonth();
  date.setUTCFullYear(date.getUTCFullYear() + 1);
  if (date.getUTCMonth() !== month) date.setUTCDate(0);
  return date.toISOString().slice(0, 10);
}

function isCouponDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function validateCouponExpiry(value: unknown, now = new Date()): string {
  if (!isCouponDate(value) || value < couponToday(now)) throw new Error("Choose an expiry date today or later.");
  return value;
}

export function isCouponExpired(coupon: Pick<Coupon, "expires_on">, now = new Date()): boolean {
  return !isCouponDate(coupon.expires_on) || coupon.expires_on < couponToday(now);
}

export function normalizeCouponCode(value: unknown): string {
  if (typeof value !== "string") throw new Error("Enter a valid coupon code.");
  const code = value.trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,40}$/.test(code)) throw new Error("Use 3–40 letters, numbers, hyphens or underscores for the coupon code.");
  return code;
}

export function calculateCouponDiscount(coupon: Coupon, productId: string, categoryIds: string[], subtotalCents: number, now = new Date()): number {
  if (!coupon.is_active) throw new Error("This coupon is no longer active.");
  if (isCouponExpired(coupon, now)) throw new Error("This coupon has expired.");
  if (coupon.scope === "products" && !coupon.product_ids.includes(productId)) throw new Error("This coupon does not apply to this product.");
  if (coupon.scope === "categories" && !coupon.category_ids.some((id) => categoryIds.includes(id))) throw new Error("This coupon does not apply to this product.");
  if (!Number.isSafeInteger(coupon.value) || coupon.value <= 0 || (coupon.discount_type === "percentage" && coupon.value > 10000)) throw new Error("This coupon is not valid.");
  return Math.min(subtotalCents, coupon.discount_type === "percentage" ? Math.round(subtotalCents * coupon.value / 10000) : coupon.value);
}
