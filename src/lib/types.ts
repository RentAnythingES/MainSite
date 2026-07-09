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
export type FulfillmentMode = "customer_pickup" | "delivery_only" | "delivery_and_collection";
export type BookingDraftStatus = "draft" | "checkout_created" | "paid" | "expired" | "cancelled";

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
  booking_draft_id?: string | null;
  rental_start_at?: string | null;
  rental_end_at?: string | null;
  timezone?: string;
  fulfillment_mode?: FulfillmentMode | null;
  pickup_location_id?: string | null;
  delivery_zone_id?: string | null;
  collection_zone_id?: string | null;
  collection_address?: string | null;
  collection_notes?: string | null;
  collection_fee_cents?: number;
  pricing_snapshot?: Record<string, unknown>;
  stripe_checkout_session_id?: string | null;
}

interface BlockedDateRow {
  id: string;
  product_id: string;
  blocked_date: string;
  reason: string | null;
  booking_id: string | null;
  created_at: string;
}

interface PickupLocationRow {
  id: string;
  slug: string;
  name: string;
  address: string;
  city: string;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  pickup_instructions: string | null;
  customer_instructions: string | null;
  internal_notes: string | null;
  lead_time_hours: number;
  handoff_contact: string | null;
  confirmation_template: string | null;
  opening_hours: Record<string, unknown>;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface ServiceZoneRow {
  id: string;
  slug: string;
  name: string;
  city: string;
  description: string | null;
  postal_codes: string[];
  delivery_fee_cents: number;
  collection_fee_cents: number;
  roundtrip_fee_cents: number;
  express_surcharge_cents: number;
  minimum_order_cents: number;
  customer_instructions: string | null;
  internal_notes: string | null;
  lead_time_hours: number;
  same_day_cutoff: string | null;
  delivery_window: string | null;
  collection_window: string | null;
  confirmation_template: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

interface BookingDraftRow {
  id: string;
  product_id: string;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  rental_start_at: string;
  rental_end_at: string;
  timezone: string;
  rental_days: number;
  fulfillment_mode: FulfillmentMode;
  pickup_location_id: string | null;
  delivery_zone_id: string | null;
  collection_zone_id: string | null;
  delivery_address: string | null;
  collection_address: string | null;
  delivery_notes: string | null;
  collection_notes: string | null;
  currency: string;
  per_day_cents: number;
  rental_subtotal_cents: number;
  delivery_fee_cents: number;
  collection_fee_cents: number;
  total_cents: number;
  deposit_cents: number;
  pricing_snapshot: Record<string, unknown>;
  status: BookingDraftStatus;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

interface BookingInventoryBlockRow {
  id: string;
  product_id: string;
  booking_id: string | null;
  booking_draft_id: string | null;
  starts_at: string;
  ends_at: string;
  quantity: number;
  reason: string;
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
      pickup_locations: {
        Row: PickupLocationRow;
        Insert: Omit<PickupLocationRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<PickupLocationRow, "id" | "created_at" | "updated_at">>;
      };
      service_zones: {
        Row: ServiceZoneRow;
        Insert: Omit<ServiceZoneRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<ServiceZoneRow, "id" | "created_at" | "updated_at">>;
      };
      booking_drafts: {
        Row: BookingDraftRow;
        Insert: Omit<BookingDraftRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BookingDraftRow, "id" | "created_at" | "updated_at">>;
      };
      booking_inventory_blocks: {
        Row: BookingInventoryBlockRow;
        Insert: Omit<BookingInventoryBlockRow, "id" | "created_at">;
        Update: Partial<Omit<BookingInventoryBlockRow, "id" | "created_at">>;
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
export type PickupLocation = PickupLocationRow;
export type ServiceZone = ServiceZoneRow;
export type BookingDraft = BookingDraftRow;
export type BookingInventoryBlock = BookingInventoryBlockRow;

// Product with pricing (joined query result)
export interface ProductWithPricing extends Product {
  pricing_tiers: PricingTier[];
  category: Category;
}
