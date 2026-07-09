import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { fetchAllPickupLocations, fetchAllServiceZones } from "@/lib/fulfillment-options";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const supabase = createAdminClient();
    const [pickupLocationsResult, serviceZonesResult] = await Promise.all([
      fetchAllPickupLocations(supabase),
      fetchAllServiceZones(supabase),
    ]);

    if (pickupLocationsResult.error) throw pickupLocationsResult.error;
    if (serviceZonesResult.error) throw serviceZonesResult.error;

    return NextResponse.json({
      pickupLocations: pickupLocationsResult.data || [],
      serviceZones: serviceZonesResult.data || [],
    });
  } catch (err) {
    console.error("[admin/fulfillment] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch fulfillment settings" }, { status: 500 });
  }
}
