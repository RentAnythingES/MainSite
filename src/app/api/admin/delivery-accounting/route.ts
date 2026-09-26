import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import {
  DEFAULT_DRIVER_NAME,
  DEFAULT_MILEAGE_COST_PER_KM_CENTS,
  DEFAULT_WAREHOUSE_ORIGIN,
  getDeliveryAccountingSettings,
  recordDeliveryTripAccounting,
} from "@/lib/delivery-accounting";

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function cents(value: unknown) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 0 && parsed <= 100_000 ? parsed : null;
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const supabase = createAdminClient();
    const [settings, tripsResult] = await Promise.all([
      getDeliveryAccountingSettings(supabase),
      supabase.from("delivery_trip_accounting")
        .select("*, booking:bookings(booking_ref,delivery_fee_cents,collection_fee_cents), delivery_request:delivery_requests(claimed_by_label,status)")
        .order("event_date", { ascending: false })
        .order("created_at", { ascending: false }),
    ]);
    if (tripsResult.error) throw tripsResult.error;
    return NextResponse.json({ settings, trips: tripsResult.data || [] });
  } catch (error) {
    console.error("[admin/delivery-accounting] GET error:", error);
    return NextResponse.json({ error: "Apply the delivery trip accounting migration before opening this page" }, { status: 503 });
  }
}

export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const warehouseOrigin = text(body?.warehouseOrigin, 220) || DEFAULT_WAREHOUSE_ORIGIN;
  const mileageCost = cents(body?.mileageCostPerKmCents) ?? DEFAULT_MILEAGE_COST_PER_KM_CENTS;
  const defaultDriverName = text(body?.defaultDriverName, 120) || DEFAULT_DRIVER_NAME;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("delivery_accounting_settings").upsert({
      id: true,
      warehouse_origin: warehouseOrigin,
      mileage_cost_per_km_cents: mileageCost,
      default_driver_name: defaultDriverName,
    }).select("warehouse_origin,mileage_cost_per_km_cents,default_driver_name").single();
    if (error) throw error;
    return NextResponse.json({ settings: data });
  } catch (error) {
    console.error("[admin/delivery-accounting] PUT error:", error);
    return NextResponse.json({ error: "Could not save delivery accounting settings" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const tripId = text(body?.tripId, 64);
  if (!tripId) return NextResponse.json({ error: "Trip is required" }, { status: 400 });

  const driverName = text(body?.driverName, 120) || DEFAULT_DRIVER_NAME;
  const completed = Boolean(body?.completed);
  try {
    const { data, error } = await createAdminClient().from("delivery_trip_accounting")
      .update({ driver_name: driverName, completed_at: completed ? new Date().toISOString() : null })
      .eq("id", tripId)
      .select("*")
      .single();
    if (error) throw error;
    return NextResponse.json({ trip: data });
  } catch (error) {
    console.error("[admin/delivery-accounting] PATCH error:", error);
    return NextResponse.json({ error: "Could not update the trip" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const supabase = createAdminClient();
    const { data: requests, error } = await supabase.from("delivery_requests")
      .select("id,booking_id,event_type,event_date, booking:bookings(delivery_address,collection_address)");
    if (error) throw error;
    const requestIds = (requests || []).map((item) => item.id as string);
    const { data: recorded, error: recordedError } = requestIds.length
      ? await supabase.from("delivery_trip_accounting").select("delivery_request_id").in("delivery_request_id", requestIds)
      : { data: [], error: null };
    if (recordedError) throw recordedError;
    const existing = new Set((recorded || []).map((item) => item.delivery_request_id));
    let created = 0;

    for (const requestRow of requests || []) {
      if (existing.has(requestRow.id)) continue;
      const booking = Array.isArray(requestRow.booking) ? requestRow.booking[0] : requestRow.booking;
      const destinationAddress = requestRow.event_type === "delivery"
        ? booking?.delivery_address
        : booking?.collection_address || booking?.delivery_address;
      if (!destinationAddress) continue;
      await recordDeliveryTripAccounting(supabase, {
        deliveryRequestId: requestRow.id,
        bookingId: requestRow.booking_id,
        eventType: requestRow.event_type as "delivery" | "pickup",
        eventDate: requestRow.event_date,
        destinationAddress,
      });
      created += 1;
    }
    return NextResponse.json({ created });
  } catch (error) {
    console.error("[admin/delivery-accounting] POST error:", error);
    return NextResponse.json({ error: "Could not synchronise delivery trips" }, { status: 500 });
  }
}
