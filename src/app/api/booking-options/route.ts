import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const [pickupLocationsResult, serviceZonesResult] = await Promise.all([
      supabase
        .from("pickup_locations")
        .select("id, slug, name, address, pickup_instructions, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("service_zones")
        .select("id, slug, name, description, delivery_fee_cents, collection_fee_cents, roundtrip_fee_cents, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    if (pickupLocationsResult.error) {
      throw pickupLocationsResult.error;
    }

    if (serviceZonesResult.error) {
      throw serviceZonesResult.error;
    }

    return NextResponse.json({
      pickupLocations: pickupLocationsResult.data || [],
      serviceZones: serviceZonesResult.data || [],
    });
  } catch (err) {
    console.error("[booking-options] Error:", err);
    return NextResponse.json(
      { error: "Failed to load booking options" },
      { status: 500 }
    );
  }
}
