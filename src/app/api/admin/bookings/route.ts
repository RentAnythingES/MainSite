import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";

/**
 * GET /api/admin/bookings — List all bookings with product info
 */
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    const supabase = createAdminClient();

    let query = supabase
      .from("bookings")
      .select(`
        *,
        product:products (id, name, slug, brand, image_url)
      `)
      .order("created_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, error } = await query;
    if (error) throw error;

    const bookings = (data || []) as Array<Record<string, unknown>>;
    const pickupLocationIds = [...new Set(bookings.map((booking) => booking.pickup_location_id).filter(Boolean))] as string[];
    const serviceZoneIds = [
      ...new Set(
        bookings
          .flatMap((booking) => [booking.delivery_zone_id, booking.collection_zone_id])
          .filter(Boolean)
      ),
    ] as string[];

    const [pickupLocationsResult, serviceZonesResult] = await Promise.all([
      pickupLocationIds.length > 0
        ? supabase
            .from("pickup_locations")
            .select("id, name, slug, address, city")
            .in("id", pickupLocationIds)
        : Promise.resolve({ data: [], error: null }),
      serviceZoneIds.length > 0
        ? supabase
            .from("service_zones")
            .select("id, name, slug, city")
            .in("id", serviceZoneIds)
        : Promise.resolve({ data: [], error: null }),
    ]);

    if (pickupLocationsResult.error) throw pickupLocationsResult.error;
    if (serviceZonesResult.error) throw serviceZonesResult.error;

    const pickupLocationById = new Map(
      (pickupLocationsResult.data || []).map((location: { id: string }) => [location.id, location])
    );
    const serviceZoneById = new Map(
      (serviceZonesResult.data || []).map((zone: { id: string }) => [zone.id, zone])
    );

    const enrichedBookings = bookings.map((booking) => ({
      ...booking,
      pickup_location: booking.pickup_location_id
        ? pickupLocationById.get(booking.pickup_location_id as string) || null
        : null,
      delivery_zone: booking.delivery_zone_id
        ? serviceZoneById.get(booking.delivery_zone_id as string) || null
        : null,
      collection_zone: booking.collection_zone_id
        ? serviceZoneById.get(booking.collection_zone_id as string) || null
        : null,
    }));

    return NextResponse.json({ bookings: enrichedBookings });
  } catch (err) {
    console.error("[admin/bookings] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
