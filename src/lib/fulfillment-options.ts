import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

const PICKUP_LOCATION_SELECT =
  "id, slug, name, address, city, pickup_instructions, customer_instructions, internal_notes, lead_time_hours, handoff_contact, opening_hours, sort_order";
const PICKUP_LOCATION_FALLBACK_SELECT =
  "id, slug, name, address, city, pickup_instructions, opening_hours, sort_order";

const SERVICE_ZONE_SELECT =
  "id, slug, name, city, description, customer_instructions, internal_notes, lead_time_hours, same_day_cutoff, delivery_window, collection_window, delivery_fee_cents, collection_fee_cents, roundtrip_fee_cents, express_surcharge_cents, minimum_order_cents, sort_order";
const SERVICE_ZONE_FALLBACK_SELECT =
  "id, slug, name, city, description, delivery_fee_cents, collection_fee_cents, roundtrip_fee_cents, express_surcharge_cents, minimum_order_cents, sort_order";

function shouldFallback(error: unknown): boolean {
  const code = (error as { code?: string } | null)?.code;
  return code === "42703" || code === "PGRST204" || code === "PGRST200";
}

export async function fetchActivePickupLocations(supabase: SupabaseClient<Database>) {
  const result = await supabase
    .from("pickup_locations")
    .select(PICKUP_LOCATION_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (!result.error || !shouldFallback(result.error)) return result;

  return supabase
    .from("pickup_locations")
    .select(PICKUP_LOCATION_FALLBACK_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
}

export async function fetchAllPickupLocations(supabase: SupabaseClient<Database>) {
  const result = await supabase
    .from("pickup_locations")
    .select(PICKUP_LOCATION_SELECT)
    .order("sort_order", { ascending: true });

  if (!result.error || !shouldFallback(result.error)) return result;

  return supabase
    .from("pickup_locations")
    .select(PICKUP_LOCATION_FALLBACK_SELECT)
    .order("sort_order", { ascending: true });
}

export async function fetchActiveServiceZones(supabase: SupabaseClient<Database>) {
  const result = await supabase
    .from("service_zones")
    .select(SERVICE_ZONE_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (!result.error || !shouldFallback(result.error)) return result;

  return supabase
    .from("service_zones")
    .select(SERVICE_ZONE_FALLBACK_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
}

export async function fetchAllServiceZones(supabase: SupabaseClient<Database>) {
  const result = await supabase
    .from("service_zones")
    .select(SERVICE_ZONE_SELECT)
    .order("sort_order", { ascending: true });

  if (!result.error || !shouldFallback(result.error)) return result;

  return supabase
    .from("service_zones")
    .select(SERVICE_ZONE_FALLBACK_SELECT)
    .order("sort_order", { ascending: true });
}

export async function fetchPickupLocationsById(
  supabase: SupabaseClient<Database>,
  pickupLocationIds: string[]
) {
  if (pickupLocationIds.length === 0) return { data: [], error: null };

  const result = await supabase
    .from("pickup_locations")
    .select(PICKUP_LOCATION_SELECT)
    .in("id", pickupLocationIds);

  if (!result.error || !shouldFallback(result.error)) return result;

  return supabase
    .from("pickup_locations")
    .select(PICKUP_LOCATION_FALLBACK_SELECT)
    .in("id", pickupLocationIds);
}

export async function fetchServiceZonesById(
  supabase: SupabaseClient<Database>,
  serviceZoneIds: string[]
) {
  if (serviceZoneIds.length === 0) return { data: [], error: null };

  const result = await supabase
    .from("service_zones")
    .select(SERVICE_ZONE_SELECT)
    .in("id", serviceZoneIds);

  if (!result.error || !shouldFallback(result.error)) return result;

  return supabase
    .from("service_zones")
    .select(SERVICE_ZONE_FALLBACK_SELECT)
    .in("id", serviceZoneIds);
}
