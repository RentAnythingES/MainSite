export interface Product {
  slug: string;
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  categorySlug: string;
  subcategorySlug: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  pricing: { days: number; perDay: number }[];
  emoji: string;
  image: string;
  city: string;
}

export const products: Product[] = [
  // ===== BABY & CHILDREN =====
  {
    slug: "compact-stroller",
    name: "Compact Folding Stroller",
    brand: "Kinderkraft",
    category: "Baby & Children",
    subcategory: "Strollers & Accessories",
    categorySlug: "baby-gear",
    subcategorySlug: "strollers",
    description: "Lightweight, one-hand fold stroller perfect for navigating Valencia's old town streets and beach promenades. Includes rain cover and cup holder.",
    features: ["One-hand fold", "Reclining seat", "UV canopy", "Rain cover included", "5-point harness", "Shopping basket"],
    specs: { "Age": "6m – 3 years", "Weight limit": "22 kg", "Stroller weight": "7.5 kg", "Folded size": "54 × 44 × 28 cm" },
    pricing: [{ days: 1, perDay: 14 }, { days: 3, perDay: 10 }, { days: 7, perDay: 7 }, { days: 14, perDay: 5 }],
    emoji: "🍼",
    image: "/products/compact-stroller.png",
    city: "valencia",
  },
  {
    slug: "double-stroller",
    name: "Double Stroller",
    brand: "Baby Jogger",
    category: "Baby & Children",
    subcategory: "Strollers & Accessories",
    categorySlug: "baby-gear",
    subcategorySlug: "strollers",
    description: "Side-by-side double stroller for twins or siblings. Fits through standard doorways and folds flat for storage.",
    features: ["Side-by-side seating", "Independent recline", "All-terrain wheels", "One-hand fold", "UV 50+ canopy"],
    specs: { "Age": "6m – 4 years", "Weight limit": "2 × 22 kg", "Stroller weight": "13 kg", "Width": "76 cm" },
    pricing: [{ days: 1, perDay: 20 }, { days: 3, perDay: 15 }, { days: 7, perDay: 11 }, { days: 14, perDay: 8 }],
    emoji: "👶",
    image: "/products/double-stroller.png",
    city: "valencia",
  },
  {
    slug: "travel-crib",
    name: "Travel Crib",
    brand: "BabyBjörn",
    category: "Baby & Children",
    subcategory: "Sleep & Nursery",
    categorySlug: "baby-gear",
    subcategorySlug: "sleep-nursery",
    description: "Ultra-light travel crib that sets up in seconds. Breathable mesh sides and firm mattress for safe sleep anywhere in Valencia.",
    features: ["Sets up in one step", "Breathable mesh", "Firm mattress included", "Fitted sheet included", "Carry bag"],
    specs: { "Age": "0 – 3 years", "Weight limit": "12 kg", "Crib weight": "6 kg", "Open size": "112 × 64 × 82 cm" },
    pricing: [{ days: 1, perDay: 12 }, { days: 3, perDay: 9 }, { days: 7, perDay: 6 }, { days: 14, perDay: 4 }],
    emoji: "😴",
    image: "/products/travel-crib.png",
    city: "valencia",
  },
  {
    slug: "car-seat-infant",
    name: "Infant Car Seat (i-Size)",
    brand: "Cybex",
    category: "Baby & Children",
    subcategory: "Car Seats",
    categorySlug: "baby-gear",
    subcategorySlug: "car-seats",
    description: "Rear-facing infant car seat, i-Size certified. Perfect for airport transfers and day trips from Valencia.",
    features: ["i-Size certified", "Rear-facing", "Side impact protection", "Removable newborn insert", "ISOFIX compatible"],
    specs: { "Age": "0 – 15 months", "Weight limit": "13 kg", "Height": "45 – 87 cm", "Seat weight": "4.2 kg" },
    pricing: [{ days: 1, perDay: 10 }, { days: 3, perDay: 8 }, { days: 7, perDay: 5 }, { days: 14, perDay: 4 }],
    emoji: "🚗",
    image: "/products/car-seat-infant.png",
    city: "valencia",
  },
  {
    slug: "high-chair",
    name: "Folding High Chair",
    brand: "Stokke",
    category: "Baby & Children",
    subcategory: "Feeding",
    categorySlug: "baby-gear",
    subcategorySlug: "feeding",
    description: "Ergonomic high chair that grows with your child. Easy to clean, folds flat for apartments.",
    features: ["Adjustable height", "5-point harness", "Removable tray", "Easy clean", "Folds flat"],
    specs: { "Age": "6m – 3 years", "Weight limit": "20 kg", "Chair weight": "7 kg" },
    pricing: [{ days: 1, perDay: 8 }, { days: 3, perDay: 6 }, { days: 7, perDay: 4 }, { days: 14, perDay: 3 }],
    emoji: "🪑",
    image: "/products/high-chair.png",
    city: "valencia",
  },

  // ===== MOBILITY =====
  {
    slug: "standard-wheelchair",
    name: "Standard Wheelchair",
    brand: "Invacare",
    category: "Mobility & Daily Aid",
    subcategory: "Wheelchairs",
    categorySlug: "mobility",
    subcategorySlug: "wheelchairs",
    description: "Lightweight folding wheelchair ideal for exploring Valencia. Fits in most car boots and taxi trunks.",
    features: ["Foldable frame", "Removable footrests", "Padded armrests", "Rear wheel brakes", "Puncture-proof tyres"],
    specs: { "Seat width": "46 cm", "Weight capacity": "115 kg", "Chair weight": "14 kg", "Folded width": "28 cm" },
    pricing: [{ days: 1, perDay: 15 }, { days: 3, perDay: 12 }, { days: 7, perDay: 8 }, { days: 14, perDay: 6 }],
    emoji: "♿",
    image: "/products/standard-wheelchair.png",
    city: "valencia",
  },
  {
    slug: "transport-wheelchair",
    name: "Transport Wheelchair (Lightweight)",
    brand: "Drive Medical",
    category: "Mobility & Daily Aid",
    subcategory: "Wheelchairs",
    categorySlug: "mobility",
    subcategorySlug: "wheelchairs",
    description: "Ultra-light transport chair at only 9 kg. Perfect for airports, museums, and sightseeing in Valencia.",
    features: ["Ultra-light 9 kg", "Companion-push", "Swing-away footrests", "Seatbelt", "Folds compact"],
    specs: { "Seat width": "43 cm", "Weight capacity": "100 kg", "Chair weight": "9 kg" },
    pricing: [{ days: 1, perDay: 12 }, { days: 3, perDay: 9 }, { days: 7, perDay: 6 }, { days: 14, perDay: 5 }],
    emoji: "🦽",
    image: "/products/transport-wheelchair.png",
    city: "valencia",
  },
  {
    slug: "mobility-scooter-lightweight",
    name: "Lightweight Mobility Scooter",
    brand: "Pride",
    category: "Mobility & Daily Aid",
    subcategory: "Mobility Scooters",
    categorySlug: "mobility",
    subcategorySlug: "scooters",
    description: "Compact 4-wheel scooter perfect for Valencia's flat terrain. Disassembles into 5 pieces for transport.",
    features: ["4-wheel stability", "Disassembles easily", "20 km range", "Adjustable seat", "Front basket"],
    specs: { "Max speed": "6 km/h", "Range": "20 km", "Weight capacity": "115 kg", "Scooter weight": "34 kg" },
    pricing: [{ days: 1, perDay: 35 }, { days: 3, perDay: 28 }, { days: 7, perDay: 20 }, { days: 14, perDay: 15 }],
    emoji: "🛵",
    image: "/products/mobility-scooter-lightweight.png",
    city: "valencia",
  },
  {
    slug: "heavy-duty-mobility-scooter",
    name: "Heavy-Duty Mobility Scooter",
    brand: "Invacare",
    category: "Mobility & Daily Aid",
    subcategory: "Mobility Scooters",
    categorySlug: "mobility",
    subcategorySlug: "scooters",
    description: "Full-size scooter with extended range for all-day exploration. Ideal for the Turia Gardens and City of Arts.",
    features: ["Full suspension", "40 km range", "LED lights", "Mirrors", "Large tyres"],
    specs: { "Max speed": "12 km/h", "Range": "40 km", "Weight capacity": "160 kg", "Scooter weight": "68 kg" },
    pricing: [{ days: 1, perDay: 70 }, { days: 3, perDay: 55 }, { days: 7, perDay: 40 }, { days: 14, perDay: 30 }],
    emoji: "🏍️",
    image: "/products/heavy-duty-mobility-scooter.png",
    city: "valencia",
  },
  {
    slug: "rollator-walker",
    name: "Rollator Walker",
    brand: "Drive Medical",
    category: "Mobility & Daily Aid",
    subcategory: "Walkers",
    categorySlug: "mobility",
    subcategorySlug: "walkers",
    description: "4-wheel rollator with seat and storage bag. Great for navigating Valencia at your own pace.",
    features: ["4-wheel design", "Built-in seat", "Storage bag", "Loop brakes", "Height adjustable", "Foldable"],
    specs: { "Weight capacity": "135 kg", "Seat height": "56 cm", "Walker weight": "6.5 kg" },
    pricing: [{ days: 1, perDay: 10 }, { days: 3, perDay: 8 }, { days: 7, perDay: 5 }, { days: 14, perDay: 4 }],
    emoji: "🚶",
    image: "/products/rollator-walker.png",
    city: "valencia",
  },

  // ===== REMOTE WORK =====
  {
    slug: "monitor-27",
    name: '27" USB-C Monitor',
    brand: "Dell",
    category: "Work & Tech",
    subcategory: "Remote Working",
    categorySlug: "remote-work",
    subcategorySlug: "monitors",
    description: "4K USB-C monitor — plug in your laptop and get a full workspace. Perfect for digital nomads in Valencia.",
    features: ["4K resolution", "USB-C (65W charging)", "Adjustable stand", "Built-in speakers", "HDMI + DisplayPort"],
    specs: { "Screen": "27 inch IPS", "Resolution": "3840 × 2160", "Ports": "USB-C, HDMI, DP", "Weight": "6.2 kg" },
    pricing: [{ days: 1, perDay: 21 }, { days: 3, perDay: 15 }, { days: 7, perDay: 10 }, { days: 14, perDay: 7 }],
    emoji: "🖥️",
    image: "/products/monitor-27.png",
    city: "valencia",
  },
  {
    slug: "standing-desk",
    name: "Electric Standing Desk",
    brand: "FlexiSpot",
    category: "Work & Tech",
    subcategory: "Remote Working",
    categorySlug: "remote-work",
    subcategorySlug: "desks",
    description: "Height-adjustable electric standing desk. Transform any Valencia apartment into a proper home office.",
    features: ["Electric height adjust", "Memory presets", "Cable management", "Anti-collision", "120 × 60 cm top"],
    specs: { "Height range": "72 – 120 cm", "Desk weight": "25 kg", "Load capacity": "70 kg" },
    pricing: [{ days: 1, perDay: 18 }, { days: 3, perDay: 14 }, { days: 7, perDay: 9 }, { days: 14, perDay: 6 }],
    emoji: "🪜",
    image: "/products/standing-desk.png",
    city: "valencia",
  },
  {
    slug: "ergonomic-chair",
    name: "Ergonomic Office Chair",
    brand: "Herman Miller",
    category: "Work & Tech",
    subcategory: "Remote Working",
    categorySlug: "remote-work",
    subcategorySlug: "chairs",
    description: "Premium mesh office chair with full lumbar support. Say goodbye to kitchen-chair back pain.",
    features: ["Mesh back", "Lumbar support", "Adjustable arms", "Tilt mechanism", "Height adjustable"],
    specs: { "Weight capacity": "130 kg", "Seat height": "40 – 52 cm", "Chair weight": "12 kg" },
    pricing: [{ days: 1, perDay: 15 }, { days: 3, perDay: 12 }, { days: 7, perDay: 8 }, { days: 14, perDay: 6 }],
    emoji: "💺",
    image: "/products/ergonomic-chair.png",
    city: "valencia",
  },

  // ===== HOME & LIVING =====
  {
    slug: "air-purifier",
    name: "HEPA Air Purifier",
    brand: "Dyson",
    category: "Home & Living",
    subcategory: "Home Air Quality",
    categorySlug: "home-living",
    subcategorySlug: "air-quality",
    description: "Hospital-grade HEPA filtration for allergy sufferers. Covers rooms up to 40m². Quiet night mode.",
    features: ["HEPA H13 filter", "Covers 40m²", "Night mode", "Air quality sensor", "App control", "Timer"],
    specs: { "CADR": "320 m³/h", "Noise level": "24 – 48 dB", "Weight": "4.7 kg" },
    pricing: [{ days: 1, perDay: 12 }, { days: 3, perDay: 9 }, { days: 7, perDay: 6 }, { days: 14, perDay: 4 }],
    emoji: "🌬️",
    image: "/products/air-purifier.png",
    city: "valencia",
  },
  {
    slug: "portable-ac",
    name: "Portable Air Conditioner",
    brand: "De'Longhi",
    category: "Home & Living",
    subcategory: "Home Air Quality",
    categorySlug: "home-living",
    subcategorySlug: "air-quality",
    description: "Beat the Valencia summer heat. Cools rooms up to 30m². Essential for older apartments without AC.",
    features: ["9,000 BTU", "3-in-1 (cool, fan, dehumidify)", "Remote control", "Timer", "Quiet mode"],
    specs: { "Cooling capacity": "9,000 BTU", "Room size": "Up to 30m²", "Noise": "52 dB", "Weight": "26 kg" },
    pricing: [{ days: 1, perDay: 25 }, { days: 3, perDay: 20 }, { days: 7, perDay: 14 }, { days: 14, perDay: 10 }],
    emoji: "❄️",
    image: "/products/portable-ac.png",
    city: "valencia",
  },

  // ===== TRAVEL & OUTDOORS =====
  {
    slug: "beach-umbrella-set",
    name: "Beach Umbrella & Chair Set",
    brand: "RentAnything",
    category: "Travel & Outdoors",
    subcategory: "Beach Gear",
    categorySlug: "travel-outdoors",
    subcategorySlug: "beach",
    description: "Complete beach setup: XL umbrella, 2 folding chairs, and a cooler bag. Ready for Malvarrosa or Patacona.",
    features: ["2m umbrella with UV protection", "2 × folding chairs", "Insulated cooler bag", "Sand anchor", "Carry bag"],
    specs: { "Umbrella diameter": "2m", "UV protection": "UPF 50+", "Total weight": "6 kg" },
    pricing: [{ days: 1, perDay: 15 }, { days: 3, perDay: 10 }, { days: 7, perDay: 7 }, { days: 14, perDay: 5 }],
    emoji: "🏖️",
    image: "/products/beach-umbrella-set.png",
    city: "valencia",
  },
];

// ===== HELPER FUNCTIONS =====

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getProductsBySubcategory(subcategorySlug: string): Product[] {
  return products.filter((p) => p.subcategorySlug === subcategorySlug);
}

export function getAllCategories() {
  const map = new Map<string, { name: string; slug: string; emoji: string; count: number }>();
  for (const p of products) {
    const existing = map.get(p.categorySlug);
    if (existing) {
      existing.count++;
    } else {
      map.set(p.categorySlug, { name: p.category, slug: p.categorySlug, emoji: p.emoji, count: 1 });
    }
  }
  return Array.from(map.values());
}

export function getAllSlugs(): string[] {
  return products.map((p) => p.slug);
}
