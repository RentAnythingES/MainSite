const baseUrl = (process.env.SMOKE_BASE_URL || "https://www.rentanything.es").replace(/\/$/, "");
const productSlug = process.env.SMOKE_PRODUCT_SLUG || "compact-stroller";

async function readJson(url) {
  const response = await fetch(url, { headers: { "user-agent": "RentAnything launch smoke test" }, signal: AbortSignal.timeout(15000) });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(`${url} returned ${response.status}: ${JSON.stringify(body)}`);
  return body;
}

async function main() {
  const start = new Date(Date.now() + 35 * 24 * 60 * 60 * 1000);
  start.setUTCHours(9, 0, 0, 0);
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  const options = await readJson(`${baseUrl}/api/booking-options`);
  const availabilityUrl = new URL(`${baseUrl}/api/availability`);
  availabilityUrl.searchParams.set("slug", productSlug);
  availabilityUrl.searchParams.set("startAt", start.toISOString());
  availabilityUrl.searchParams.set("endAt", end.toISOString());
  const availability = await readJson(availabilityUrl.toString());
  const report = { baseUrl, productSlug, pickupLocations: options.pickupLocations?.length || 0, serviceZones: options.serviceZones?.length || 0, availabilityResponse: availability };
  if (!Array.isArray(options.pickupLocations) || !Array.isArray(options.serviceZones)) throw new Error("Booking options response is incomplete");
  if (typeof availability.available !== "boolean") throw new Error("Availability response does not include a boolean available field");
  console.log(JSON.stringify(report, null, 2));
}

main().catch((error) => { console.error(error); process.exit(1); });
