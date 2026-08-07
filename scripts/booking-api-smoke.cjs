const baseUrl = (process.env.SMOKE_BASE_URL || "https://rentandroll.com").replace(/\/$/, "");
const configuredProductSlug = process.env.SMOKE_PRODUCT_SLUG?.trim() || null;
const quantity = Number(process.env.SMOKE_QUANTITY || "1");

async function readJson(url) {
  const response = await fetch(url, { headers: { "user-agent": "Rent&Roll launch smoke test" }, signal: AbortSignal.timeout(15000) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${url} returned ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

async function resolveProductSlug() {
  if (configuredProductSlug) return configuredProductSlug;

  const response = await fetch(`${baseUrl}/sitemap.xml`, {
    headers: { "user-agent": "Rent&Roll launch smoke test" },
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`${baseUrl}/sitemap.xml returned ${response.status}`);
  }

  const sitemap = await response.text();
  for (const match of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = new URL(match[1]);
    const productMatch = url.pathname.match(/^\/product\/([^/]+)$/);
    if (productMatch) return decodeURIComponent(productMatch[1]);
  }

  throw new Error("No active product route was found in the sitemap");
}

async function main() {
  const productSlug = await resolveProductSlug();
  const start = new Date(Date.now() + 35 * 24 * 60 * 60 * 1000);
  start.setUTCHours(9, 0, 0, 0);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const options = await readJson(`${baseUrl}/api/booking-options`);
  const availabilityUrl = new URL(`${baseUrl}/api/availability`);
  availabilityUrl.searchParams.set("slug", productSlug);
  availabilityUrl.searchParams.set("startAt", start.toISOString());
  availabilityUrl.searchParams.set("endAt", end.toISOString());
  availabilityUrl.searchParams.set("quantity", String(quantity));
  const availability = await readJson(availabilityUrl.toString());
  const report = { baseUrl, productSlug, quantity, pickupLocations: options.pickupLocations?.length || 0, serviceZones: options.serviceZones?.length || 0, availabilityResponse: availability };
  if (!Array.isArray(options.pickupLocations) || !Array.isArray(options.serviceZones)) throw new Error("Booking options response is incomplete");
  if (typeof availability.available !== "boolean") throw new Error("Availability response does not include a boolean available field");
  if (availability.requestedQuantity !== quantity) throw new Error("Availability response quantity does not match request");
  if (typeof availability.maxAvailableQuantity !== "number") throw new Error("Availability response does not include maxAvailableQuantity");
  if (availability.quote?.quantity !== quantity) throw new Error("Quote quantity does not match request");
  if (availability.quote?.rentalSubtotalCents < 0 || availability.quote?.totalCents < availability.quote?.rentalSubtotalCents) throw new Error("Quantity quote totals are invalid");
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => { console.error(error); process.exit(1); });
