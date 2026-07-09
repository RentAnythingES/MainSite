import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { fetchActivePickupLocations, fetchActiveServiceZones } from "@/lib/fulfillment-options";

export async function GET() {
  try {
    const supabase = createServiceClient();
    const [pickupLocationsResult, serviceZonesResult] = await Promise.all([
      fetchActivePickupLocations(supabase),
      fetchActiveServiceZones(supabase),
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
