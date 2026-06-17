// Auto-generated types matching supabase/schema.sql
// Replace with `npx supabase gen types` once project is connected

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "paid"
  | "delivering"
  | "active"
  | "returning"
  | "completed"
  | "cancelled"
  | "refunded";

export type DeliveryType = "standard" | "express";

// Flattened Insert types to avoid circular references with Database interface

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  brand: string;
  description: string;
  emoji: string;
  image_url: string | null;
  category_id: string;
  subcategory: string;
  subcategory_slug: string;
  city: string;
  stock_total: number;
  stock_available: number;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  features: string[];
  specs: Record<string, string>;
  created_at: string;
  updated_at: string;
}

interface PricingTierRow {
  id: string;
  product_id: string;
  min_days: number;
  per_day_cents: number;
  created_at: string;
}

interface BookingRow {
  id: string;
  booking_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  customer_whatsapp: string | null;
  product_id: string;
  start_date: string;
  end_date: string;
  rental_days: number;
  per_day_cents: number;
  subtotal_cents: number;
  delivery_fee_cents: number;
  total_cents: number;
  deposit_cents: number;
  delivery_type: DeliveryType;
  delivery_address: string;
  delivery_city: string;
  delivery_notes: string | null;
  status: BookingStatus;
  stripe_payment_intent_id: string | null;
  stripe_deposit_intent_id: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  cancelled_at: string | null;
  completed_at: string | null;
}

interface BlockedDateRow {
  id: string;
  product_id: string;
  blocked_date: string;
  reason: string | null;
  booking_id: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<CategoryRow, "id" | "created_at" | "updated_at">>;
      };
      products: {
        Row: ProductRow;
        Insert: Omit<ProductRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ProductRow, "id" | "created_at" | "updated_at">>;
      };
      pricing_tiers: {
        Row: PricingTierRow;
        Insert: Omit<PricingTierRow, "id" | "created_at">;
        Update: Partial<Omit<PricingTierRow, "id" | "created_at">>;
      };
      bookings: {
        Row: BookingRow;
        Insert: Omit<BookingRow, "id" | "booking_ref" | "created_at" | "updated_at">;
        Update: Partial<Omit<BookingRow, "id" | "booking_ref" | "created_at" | "updated_at">>;
      };
      blocked_dates: {
        Row: BlockedDateRow;
        Insert: Omit<BlockedDateRow, "id" | "created_at">;
        Update: Partial<Omit<BlockedDateRow, "id" | "created_at">>;
      };
    };
  };
}

// Convenience types
export type Category = CategoryRow;
export type Product = ProductRow;
export type PricingTier = PricingTierRow;
export type Booking = BookingRow;
export type BlockedDate = BlockedDateRow;

// Product with pricing (joined query result)
export interface ProductWithPricing extends Product {
  pricing_tiers: PricingTier[];
  category: Category;
}
