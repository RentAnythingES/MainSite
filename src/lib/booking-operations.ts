type Product = { name?: string | null };

export function getBookingProductName(booking: {
  pricing_snapshot?: unknown;
  product?: Product | Product[] | null;
}, fallback = "Rental equipment") {
  const snapshot = booking.pricing_snapshot;
  if (snapshot && typeof snapshot === "object" && "displayName" in snapshot) {
    const name = snapshot.displayName;
    if (typeof name === "string" && name.trim()) return name.trim();
  }
  const product = Array.isArray(booking.product) ? booking.product[0] : booking.product;
  return product?.name || fallback;
}

export function getOperationsDate(timestamp?: string | null, legacyDate?: string | null) {
  return timestamp
    ? new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Madrid" }).format(new Date(timestamp))
    : legacyDate || null;
}

type ManifestBooking = Parameters<typeof getBookingProductName>[0] & {
  booking_ref: string;
  status: string;
  fulfillment_mode: string | null;
  rental_start_at: string | null;
  rental_end_at: string | null;
  start_date: string | null;
  end_date: string | null;
  delivery_address: string | null;
  collection_address: string | null;
  pickup_location_id: string | null;
  delivery_zone_id: string | null;
  collection_zone_id: string | null;
};

type ManifestItem = { bookingRef: string; productName: string; area: string };

export function buildDailyOperationsManifest(
  bookings: ManifestBooking[],
  date: string,
  pickupLocationNames = new Map<string, string>(),
  zoneNames = new Map<string, string>(),
) {
  const manifest = {
    date,
    deliveries: [] as ManifestItem[],
    customerPickups: [] as ManifestItem[],
    customerReturns: [] as ManifestItem[],
    returnCollections: [] as ManifestItem[],
  };
  for (const booking of bookings) {
    if (!["paid", "delivering", "active", "returning"].includes(booking.status)) continue;
    const item = { bookingRef: booking.booking_ref, productName: getBookingProductName(booking) };
    const start = getOperationsDate(booking.rental_start_at, booking.start_date);
    const end = getOperationsDate(booking.rental_end_at, booking.end_date);
    const pickupArea = pickupLocationNames.get(booking.pickup_location_id || "") || "Pickup location";
    if (start === date && booking.fulfillment_mode === "customer_pickup") {
      manifest.customerPickups.push({ ...item, area: pickupArea });
    }
    if (start === date && ["delivery_only", "delivery_and_collection"].includes(booking.fulfillment_mode || "") && booking.delivery_address) {
      manifest.deliveries.push({ ...item, area: zoneNames.get(booking.delivery_zone_id || "") || "Valencia" });
    }
    if (end === date && ["customer_pickup", "delivery_only"].includes(booking.fulfillment_mode || "")) {
      manifest.customerReturns.push({ ...item, area: pickupArea });
    }
    if (end === date && booking.fulfillment_mode === "delivery_and_collection" && (booking.collection_address || booking.delivery_address)) {
      manifest.returnCollections.push({ ...item, area: zoneNames.get(booking.collection_zone_id || "") || "Valencia" });
    }
  }
  return manifest;
}
