import { randomUUID } from "node:crypto";

const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!base || !serviceRoleKey) throw new Error("Supabase environment variables are required");

const headers = {
  apikey: serviceRoleKey,
  Authorization: `Bearer ${serviceRoleKey}`,
};

const products = [
  {
    slug: "acupressure-mat",
    name: "Acupressure Mat",
    brand: "Decathlon",
    category_id: "70df11c9-085d-4a05-bc66-18f13244dc68",
    subcategory: "Wellness & Recovery",
    subcategory_slug: "wellness-recovery",
    description: "Acupressure mat and pillow set for a calm recovery session at your Valencia accommodation.",
    features: ["Mat and pillow set", "Designed for a relaxing recovery session", "Compact home-wellness essential"],
    specs: {
      "Product reference": "Decathlon 8767817",
      "Pricing review": "Set rental pricing before activation",
    },
    image: "https://contents.mediadecathlon.com/p2437025/k$7dda281141d2a6e80810199610ccaaa6/picture.jpg?format=auto&f=640x0",
  },
  {
    slug: "motorized-beach-wheelchair-e4",
    name: "Motorized Beach Wheelchair E4",
    brand: "Wheels in the Sand",
    category_id: "9fb5e053-5da7-4cae-9309-13d3b3d3255e",
    subcategory: "Beach Wheelchairs",
    subcategory_slug: "beach-wheelchairs",
    description: "Motorised beach wheelchair designed for dry, level beach terrain, with adjustable comfort and transfer features.",
    features: ["Adjustable seat back", "Adjustable swing-up armrests", "Adjustable headrest", "Controller can be positioned on either side"],
    specs: {
      "Maximum rider weight": "285 lb (129 kg)",
      "Battery runtime": "Up to 6–8 hours in normal conditions",
      "Terrain guidance": "Dry, level ground only",
      "Pricing review": "Set rental pricing before activation",
    },
    image: "https://www.wheelsinthesand.com/wp-content/uploads/PXL_20260513_172513312-scaled-1200x1200.jpg",
  },
  {
    slug: "thule-proride-598-roof-bike-carrier",
    name: "Thule ProRide 598 Roof Bike Carrier",
    brand: "Thule",
    category_id: "af48375c-eafa-4769-8dee-8bef44773a7c",
    subcategory: "Travel Accessories",
    subcategory_slug: "travel-accessories",
    description: "Roof-mounted bike carrier for securely transporting a bicycle during your Valencia stay.",
    features: ["Quick, straightforward bike mounting", "Locks both the bike and carrier", "Compatible with through-axle bikes", "Suitable for carbon frames"],
    specs: {
      "Maximum bike weight": "20 kg",
      "Product reference": "Thule / Decathlon 8676835",
      "Pricing review": "Set rental pricing before activation",
    },
    image: "https://contents.mediadecathlon.com/p2061331/k$f8dfd0f3dbceec7aedf1504d9a0b16e6/picture.jpg?format=auto&f=3000x0",
  },
  {
    slug: "deuter-kid-comfort-child-carrier",
    name: "Deuter Kid Comfort Child Carrier",
    brand: "Deuter",
    category_id: "cadee899-5332-4609-9a3f-b769ae8d7f7c",
    subcategory: "Baby Carriers",
    subcategory_slug: "baby-carriers",
    description: "Structured child carrier backpack with ventilated support for family days out around Valencia.",
    features: ["Ventilated back support system", "Height-adjustable child seat", "Adjustable hip stabilisers", "Integrated UV sunshade"],
    specs: {
      "Carrier weight": "3.23 kg",
      "Maximum load": "18 kg child + 4 kg gear",
      "Safety certification": "TÜV GS",
      "Product reference": "Deuter / Decathlon 8746948",
      "Pricing review": "Set rental pricing before activation",
    },
    image: "https://contents.mediadecathlon.com/p2130355/k$9998127cb5c4ebf33f4dfede24fde11c/picture.jpg?format=auto&f=640x0",
  },
];

const slugs = products.map((product) => product.slug);
const existingResponse = await fetch(`${base}/rest/v1/products?select=slug&slug=in.(${slugs.join(",")})`, { headers });
const existingProducts = await existingResponse.json();
if (!existingResponse.ok) throw new Error("Could not check existing products");
if (existingProducts.length > 0) throw new Error(`Pilot slugs already exist: ${existingProducts.map((product) => product.slug).join(", ")}`);

const results = [];
for (const product of products) {
  const imageResponse = await fetch(product.image);
  if (!imageResponse.ok) throw new Error(`Could not download image for ${product.slug}`);

  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
  const contentType = (imageResponse.headers.get("content-type") || "image/jpeg").split(";")[0].trim();
  if (!contentType.startsWith("image/")) throw new Error(`Source did not return an image for ${product.slug}`);

  const extension = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const storagePath = `${product.slug}/${Date.now()}-${randomUUID()}.${extension}`;
  const uploadResponse = await fetch(`${base}/storage/v1/object/product-images/${storagePath}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": contentType, "x-upsert": "false" },
    body: imageBuffer,
  });
  if (!uploadResponse.ok) throw new Error(`Image upload failed for ${product.slug}: ${await uploadResponse.text()}`);

  const imageUrl = `${base}/storage/v1/object/public/product-images/${storagePath}`;
  const productResponse = await fetch(`${base}/rest/v1/products`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({
      ...product,
      image: undefined,
      image_url: imageUrl,
      city: "valencia",
      stock_total: 1,
      stock_available: 1,
      is_active: false,
      emoji: "📦",
    }),
  });
  const createdProducts = await productResponse.json();
  if (!productResponse.ok) throw new Error(`Product create failed for ${product.slug}: ${JSON.stringify(createdProducts)}`);

  const pricingResponse = await fetch(`${base}/rest/v1/pricing_tiers`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify([{ product_id: createdProducts[0].id, min_days: 1, per_day_cents: 0 }]),
  });
  if (!pricingResponse.ok) throw new Error(`Pricing placeholder failed for ${product.slug}: ${await pricingResponse.text()}`);

  results.push({ slug: product.slug, id: createdProducts[0].id, imageUrl });
}

console.log(JSON.stringify(results, null, 2));
