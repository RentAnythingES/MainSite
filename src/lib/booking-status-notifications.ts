import type { SupabaseClient } from "@supabase/supabase-js";
import { createBookingReviewInvitation } from "@/lib/booking-reviews";
import { sendBookingStatusUpdate } from "@/lib/email";
import { fetchPickupLocationsById, fetchServiceZonesById } from "@/lib/fulfillment-options";

export type BookingDocumentLink = {
  label: string;
  url: string;
  documentNumber?: string | null;
};

export async function sendBookingLifecycleNotification(
  supabase: SupabaseClient,
  booking: Record<string, unknown>,
  status: string,
  documentLinks?: BookingDocumentLink[],
) {
  const product = booking.product as { name?: string } | null;
  const pickupLocationId = booking.pickup_location_id as string | null;
  const deliveryZoneId = booking.delivery_zone_id as string | null;
  const collectionZoneId = booking.collection_zone_id as string | null;
  const [pickupLocationsResult, serviceZonesResult] = await Promise.all([
    pickupLocationId
      ? fetchPickupLocationsById(supabase, [pickupLocationId])
      : Promise.resolve({ data: [], error: null }),
    deliveryZoneId || collectionZoneId
      ? fetchServiceZonesById(
          supabase,
          [deliveryZoneId, collectionZoneId].filter(Boolean) as string[],
        )
      : Promise.resolve({ data: [], error: null }),
  ]);
  const pickupLocation = (pickupLocationsResult.data || [])[0] as {
    name?: string;
    address?: string | null;
    city?: string | null;
    customer_instructions?: string | null;
    pickup_instructions?: string | null;
    internal_notes?: string | null;
    lead_time_hours?: number | null;
  } | undefined;
  const serviceZones = (serviceZonesResult.data || []) as Array<{
    id?: string;
    name?: string;
    customer_instructions?: string | null;
    internal_notes?: string | null;
    lead_time_hours?: number | null;
    delivery_window?: string | null;
    collection_window?: string | null;
  }>;
  const deliveryZone = serviceZones.find((zone) => zone.id === deliveryZoneId);
  const collectionZone = serviceZones.find((zone) => zone.id === collectionZoneId);
  const fulfillmentDisplayLabel =
    pickupLocation?.name ||
    ((booking.fulfillment_mode as string) === "delivery_and_collection"
      ? [deliveryZone?.name, collectionZone?.name].filter(Boolean).join(" → ")
      : deliveryZone?.name) ||
    undefined;
  const fulfillmentAddress =
    (booking.fulfillment_mode as string) === "customer_pickup"
      ? [pickupLocation?.name, pickupLocation?.address, pickupLocation?.city]
          .filter(Boolean)
          .join(", ") || (booking.delivery_address as string)
      : (booking.fulfillment_mode as string) === "delivery_and_collection"
        ? [
            booking.delivery_address,
            booking.collection_address
              ? `Collection: ${booking.collection_address}`
              : null,
          ]
            .filter(Boolean)
            .join(" · ")
        : (booking.delivery_address as string);

  const reviewUrl =
    status === "completed"
      ? await createBookingReviewInvitation(
          supabase,
          booking.id as string,
          (booking.product_id as string) || null,
        )
      : null;

  return sendBookingStatusUpdate(
    {
      bookingRef: booking.booking_ref as string,
      customerName: booking.customer_name as string,
      customerEmail: booking.customer_email as string,
      customerPhone: (booking.customer_phone as string) || undefined,
      productName: product?.name || "Rental equipment",
      startDate: booking.start_date as string,
      endDate: booking.end_date as string,
      rentalStartAt: (booking.rental_start_at as string) || null,
      rentalEndAt: (booking.rental_end_at as string) || null,
      rentalDays: booking.rental_days as number,
      totalCents: booking.total_cents as number,
      deliveryAddress: fulfillmentAddress,
      deliveryType: (booking.delivery_type as string) || "standard",
      fulfillmentMode: (booking.fulfillment_mode as string) || undefined,
      fulfillmentLabel: fulfillmentDisplayLabel,
      customerInstructions:
        pickupLocation?.customer_instructions ||
        pickupLocation?.pickup_instructions ||
        deliveryZone?.customer_instructions ||
        collectionZone?.customer_instructions ||
        null,
      internalNotes:
        pickupLocation?.internal_notes ||
        deliveryZone?.internal_notes ||
        collectionZone?.internal_notes ||
        null,
      deliveryWindow: deliveryZone?.delivery_window || null,
      collectionWindow: collectionZone?.collection_window || null,
      leadTimeHours:
        pickupLocation?.lead_time_hours ||
        deliveryZone?.lead_time_hours ||
        collectionZone?.lead_time_hours ||
        null,
      stripeCheckoutSessionId:
        (booking.stripe_checkout_session_id as string) || null,
      stripePaymentIntentId:
        (booking.stripe_payment_intent_id as string) || null,
      documentLinks,
      reviewUrl,
    },
    status,
  );
}
