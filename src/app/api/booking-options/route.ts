import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { fetchActivePickupLocations, fetchActiveServiceZones } from "@/lib/fulfillment-options";
import { MarketContextError, resolveMarketContext } from "@/lib/market-context";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  try {
    if (params.getAll("marketSlug").length > 1 || params.getAll("locale").length > 1) {
      return NextResponse.json({ error: "Duplicate city or language parameter" }, { status: 400 });
    }
    const supabase = createServiceClient();
    const market = await resolveMarketContext(supabase, {
      mode: "public", marketSlug: params.get("marketSlug") ?? undefined,
      locale: params.get("locale") ?? undefined, requireBooking: true,
    });
    const [pickupLocationsResult, serviceZonesResult] = await Promise.all([
      fetchActivePickupLocations(supabase, market.id),
      fetchActiveServiceZones(supabase, market.id),
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
    }, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof MarketContextError) {
      if (err.status >= 500) console.error("[booking-options] Market resolution failed", { code: err.code });
      return NextResponse.json({ error: err.message, code: err.code }, { status: err.status });
    }
    console.error("[booking-options] Fulfillment read failed", { marketSlug: params.get("marketSlug") ?? "valencia", error: err });
    return NextResponse.json(
      { error: "Failed to load booking options" },
      { status: 500 }
    );
  }
}
