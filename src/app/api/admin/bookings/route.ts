import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { fetchPickupLocationsById, fetchServiceZonesById } from "@/lib/fulfillment-options";
import { fetchBookingPaymentEventsByBookingId } from "@/lib/payment-ledger";
import { fetchBookingDocumentsByBookingId } from "@/lib/booking-documents";
import { DEFAULT_OPS_TASKS, isMissingBookingOpsTasksTable } from "@/lib/booking-ops";
import {
  fetchFulfillmentAmendmentsByBookingIds,
  getFulfillmentAmendmentUrl,
  isMissingFulfillmentAmendmentsTable,
} from "@/lib/fulfillment-amendments";

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
    const bookingIds = bookings.map((booking) => booking.id).filter(Boolean) as string[];
    const pickupLocationIds = [...new Set(bookings.map((booking) => booking.pickup_location_id).filter(Boolean))] as string[];
    const serviceZoneIds = [
      ...new Set(
        bookings
          .flatMap((booking) => [booking.delivery_zone_id, booking.collection_zone_id])
          .filter(Boolean)
      ),
    ] as string[];

    const [
      pickupLocationsResult,
      serviceZonesResult,
      inventoryBlocksResult,
      paymentEventsResult,
      bookingDocumentsResult,
      opsTasksResult,
      fulfillmentAmendmentsResult,
    ] = await Promise.all([
      fetchPickupLocationsById(supabase, pickupLocationIds),
      fetchServiceZonesById(supabase, serviceZoneIds),
      bookingIds.length > 0
        ? supabase
            .from("booking_inventory_blocks")
            .select("id, booking_id, starts_at, ends_at, quantity, reason")
            .in("booking_id", bookingIds)
        : Promise.resolve({ data: [], error: null }),
      fetchBookingPaymentEventsByBookingId(supabase, bookingIds),
      fetchBookingDocumentsByBookingId(supabase, bookingIds),
      bookingIds.length > 0
        ? supabase
            .from("booking_ops_tasks")
            .select("*")
            .in("booking_id", bookingIds)
            .order("sort_order", { ascending: true })
        : Promise.resolve({ data: [], error: null }),
      fetchFulfillmentAmendmentsByBookingIds(supabase, bookingIds),
    ]);

    if (pickupLocationsResult.error) throw pickupLocationsResult.error;
    if (serviceZonesResult.error) throw serviceZonesResult.error;
    if (inventoryBlocksResult.error) throw inventoryBlocksResult.error;
    if (opsTasksResult.error && !isMissingBookingOpsTasksTable(opsTasksResult.error)) {
      throw opsTasksResult.error;
    }
    const bookingOpsTasksAvailable = !opsTasksResult.error;
    if (
      fulfillmentAmendmentsResult.error &&
      !isMissingFulfillmentAmendmentsTable(fulfillmentAmendmentsResult.error)
    ) {
      throw fulfillmentAmendmentsResult.error;
    }
    const fulfillmentAmendmentsAvailable = !fulfillmentAmendmentsResult.error;

    const pickupLocationById = new Map(
      (pickupLocationsResult.data || []).map((location: { id: string }) => [location.id, location])
    );
    const serviceZoneById = new Map(
      (serviceZonesResult.data || []).map((zone: { id: string }) => [zone.id, zone])
    );
    const inventoryBlocksByBookingId = new Map<string, unknown[]>();
    const paymentEventsByBookingId = new Map<string, unknown[]>();
    const bookingDocumentsByBookingId = new Map<string, unknown[]>();
    const opsTasksByBookingId = new Map<string, unknown[]>();
    const fulfillmentAmendmentsByBookingId = new Map<string, unknown[]>();

    for (const block of inventoryBlocksResult.data || []) {
      const bookingId = (block as { booking_id?: string | null }).booking_id;
      if (!bookingId) continue;
      const existing = inventoryBlocksByBookingId.get(bookingId) || [];
      existing.push(block);
      inventoryBlocksByBookingId.set(bookingId, existing);
    }

    for (const event of paymentEventsResult.data || []) {
      const bookingId = (event as { booking_id?: string | null }).booking_id;
      if (!bookingId) continue;
      const existing = paymentEventsByBookingId.get(bookingId) || [];
      existing.push(event);
      paymentEventsByBookingId.set(bookingId, existing);
    }

    for (const document of bookingDocumentsResult.data || []) {
      const bookingId = (document as { booking_id?: string | null }).booking_id;
      if (!bookingId) continue;
      const existing = bookingDocumentsByBookingId.get(bookingId) || [];
      existing.push(document);
      bookingDocumentsByBookingId.set(bookingId, existing);
    }

    for (const task of opsTasksResult.data || []) {
      const bookingId = (task as { booking_id?: string | null }).booking_id;
      if (!bookingId) continue;
      const existing = opsTasksByBookingId.get(bookingId) || [];
      existing.push(task);
      opsTasksByBookingId.set(bookingId, existing);
    }

    for (const amendment of fulfillmentAmendmentsResult.data || []) {
      const bookingId = amendment.booking_id;
      const existing = fulfillmentAmendmentsByBookingId.get(bookingId) || [];
      existing.push({
        ...amendment,
        customer_url: getFulfillmentAmendmentUrl(amendment.public_token),
      });
      fulfillmentAmendmentsByBookingId.set(bookingId, existing);
    }

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
      inventory_blocks: inventoryBlocksByBookingId.get(booking.id as string) || [],
      payment_events: paymentEventsByBookingId.get(booking.id as string) || [],
      documents: bookingDocumentsByBookingId.get(booking.id as string) || [],
      ops_tasks: opsTasksByBookingId.get(booking.id as string) ||
        DEFAULT_OPS_TASKS.map((task) => ({
          ...task,
          booking_id: booking.id,
          is_done: false,
          completed_at: null,
          note: null,
        })),
      fulfillment_amendments: fulfillmentAmendmentsByBookingId.get(booking.id as string) || [],
    }));

    return NextResponse.json({
      bookings: enrichedBookings,
      capabilities: {
        bookingOpsTasks: bookingOpsTasksAvailable,
        fulfillmentAmendments: fulfillmentAmendmentsAvailable,
      },
    });
  } catch (err) {
    console.error("[admin/bookings] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
