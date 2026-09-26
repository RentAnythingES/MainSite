import type { SupabaseClient } from "@supabase/supabase-js";

export const DEFAULT_WAREHOUSE_ORIGIN = "Carrer Obispo Muñoz, 73, 46100 Burjassot, Valencia, Spain";
export const PATERNAL_WAREHOUSE_ORIGIN = "Carrer el Puig, 32, 46980 Paterna, Valencia, Spain";
export const DEFAULT_MILEAGE_COST_PER_KM_CENTS = 35;
export const DEFAULT_DRIVER_NAME = "Fadi";

type AccountingSettings = {
  warehouse_origin: string;
  mileage_cost_per_km_cents: number;
  default_driver_name: string;
};

type TripInput = {
  deliveryRequestId: string;
  bookingId: string;
  eventType: "delivery" | "pickup";
  eventDate: string;
  destinationAddress: string;
};

function fallbackSettings(): AccountingSettings {
  return {
    warehouse_origin: DEFAULT_WAREHOUSE_ORIGIN,
    mileage_cost_per_km_cents: DEFAULT_MILEAGE_COST_PER_KM_CENTS,
    default_driver_name: DEFAULT_DRIVER_NAME,
  };
}

export async function getDeliveryAccountingSettings(supabase: SupabaseClient): Promise<AccountingSettings> {
  const { data, error } = await supabase
    .from("delivery_accounting_settings")
    .select("warehouse_origin,mileage_cost_per_km_cents,default_driver_name")
    .eq("id", true)
    .maybeSingle();
  if (error) throw error;
  return data ? data as AccountingSettings : fallbackSettings();
}

export async function calculateDrivingDistanceMeters(origin: string, destination: string) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return { distanceMeters: null, error: "Google Maps routing is not configured" };

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/directions/json");
    url.searchParams.set("origin", origin);
    url.searchParams.set("destination", destination);
    url.searchParams.set("mode", "driving");
    url.searchParams.set("key", apiKey);
    const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
    const payload = await response.json() as {
      status?: string;
      error_message?: string;
      routes?: Array<{ legs?: Array<{ distance?: { value?: number } }> }>;
    };
    const legs = payload.routes?.[0]?.legs || [];
    const distanceMeters = legs.reduce((total, leg) => total + (Number(leg.distance?.value) || 0), 0);
    if (!response.ok || payload.status !== "OK" || distanceMeters <= 0) {
      return { distanceMeters: null, error: payload.error_message || `Google routing returned ${payload.status || response.status}` };
    }
    return { distanceMeters, error: null };
  } catch (error) {
    return { distanceMeters: null, error: error instanceof Error ? error.message : "Driving-distance lookup failed" };
  }
}

export async function recordDeliveryTripAccounting(supabase: SupabaseClient, input: TripInput) {
  const settings = await getDeliveryAccountingSettings(supabase);
  const route = await calculateDrivingDistanceMeters(settings.warehouse_origin, input.destinationAddress);
  const tripCostCents = route.distanceMeters === null
    ? null
    : Math.round((route.distanceMeters / 1000) * settings.mileage_cost_per_km_cents);
  const { error } = await supabase.from("delivery_trip_accounting").upsert({
    delivery_request_id: input.deliveryRequestId,
    booking_id: input.bookingId,
    event_type: input.eventType,
    event_date: input.eventDate,
    origin_address: settings.warehouse_origin,
    destination_address: input.destinationAddress,
    distance_meters: route.distanceMeters,
    distance_status: route.distanceMeters === null ? "unavailable" : "calculated",
    routing_error: route.error,
    mileage_cost_per_km_cents: settings.mileage_cost_per_km_cents,
    trip_cost_cents: tripCostCents,
    driver_name: settings.default_driver_name,
  }, { onConflict: "delivery_request_id" });
  if (error) throw error;
}

export async function recordClaimedTripDriver(supabase: SupabaseClient, deliveryRequestId: string, driverName: string) {
  const { error } = await supabase.from("delivery_trip_accounting")
    .update({ driver_name: driverName.trim() || DEFAULT_DRIVER_NAME })
    .eq("delivery_request_id", deliveryRequestId);
  if (error) throw error;
}
