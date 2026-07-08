export interface ProductFAQ {
  question: string;
  answer: string;
}

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
  faqs?: ProductFAQ[];
}

export const products: Product[] = [
  // ===== BABY & TODDLER =====
  {
    slug: "compact-stroller",
    name: "Compact Folding Stroller",
    brand: "Kinderkraft",
    category: "Baby & Toddler",
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
    faqs: [
      { question: "Can I take this stroller on Valencia's buses and metro?", answer: "Yes — Valencia's EMT buses and metro are fully accessible. The compact fold makes it easy to board and store. Buses kneel for strollers and all metro stations have lifts." },
      { question: "Is this stroller suitable for Valencia's old town cobblestones?", answer: "The compact stroller handles most surfaces well, though the narrowest cobblestone alleys in El Carmen can be bumpy. Its lightweight design (7.5 kg) makes it easy to lift over kerbs when needed." },
      { question: "Do you deliver the stroller to my hotel?", answer: "Yes — we deliver to any address in Valencia city and the beach areas. You can schedule delivery for your arrival date and we collect it when you leave." },
    ],
  },
  {
    slug: "double-stroller",
    name: "Double Stroller",
    brand: "Baby Jogger",
    category: "Baby & Toddler",
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
    faqs: [
      { question: "Will this double stroller fit through doorways in Valencia?", answer: "Yes — at 76 cm wide it fits through standard doorways. Most Valencia restaurants, shops, and attractions have entrances wide enough. The Turia Gardens paths are easily wide enough too." },
      { question: "Can I rent a double stroller for twins in Valencia?", answer: "Absolutely. This side-by-side stroller supports two children up to 22 kg each. It's ideal for twins or siblings close in age visiting Valencia." },
    ],
  },
  {
    slug: "travel-crib",
    name: "Travel Crib",
    brand: "BabyBjörn",
    category: "Baby & Toddler",
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
    faqs: [
      { question: "Is the travel crib safe for newborns?", answer: "Yes — the BabyBjörn travel crib is suitable from birth to 3 years (up to 12 kg). It has a firm mattress and breathable mesh sides that meet all EU safety standards." },
      { question: "Why rent a travel crib instead of using the hotel one?", answer: "Hotel cribs vary widely in quality and cleanliness. Our BabyBjörn cribs are premium quality, thoroughly cleaned between every rental, and come with a fitted sheet. You also avoid packing a crib in your luggage." },
    ],
  },
  {
    slug: "car-seat-infant",
    name: "Infant Car Seat (i-Size)",
    brand: "Cybex",
    category: "Baby & Toddler",
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
    faqs: [
      { question: "Do I need a car seat in taxis in Valencia?", answer: "Spanish law exempts taxis from the car seat requirement. However, for safety — especially for airport transfers or day trips — we strongly recommend using one. This i-Size seat installs in seconds." },
      { question: "Is this car seat ISOFIX compatible?", answer: "Yes — it's ISOFIX compatible and also works with a standard seatbelt installation. Most rental cars and modern taxis in Valencia have ISOFIX anchor points." },
      { question: "Can I use this car seat at Valencia airport?", answer: "Yes — rent it for your arrival day and use it from the airport transfer through your entire trip. We can also deliver to the airport if arranged in advance." },
    ],
  },
  {
    slug: "high-chair",
    name: "Folding High Chair",
    brand: "Stokke",
    category: "Baby & Toddler",
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
    faqs: [
      { question: "Why rent a high chair for my Valencia apartment?", answer: "Most holiday rentals don't include high chairs, and restaurant high chairs vary in quality and cleanliness. Having your own means safe, comfortable mealtimes wherever you eat — at home or on a terrace." },
      { question: "Does this high chair fold flat?", answer: "Yes — the Stokke folds completely flat for storage. It's ideal for small Valencia apartments where space is limited." },
    ],
  },

  // ===== MOBILITY =====
  {
    slug: "standard-wheelchair",
    name: "Standard Wheelchair",
    brand: "Invacare",
    category: "Mobility & Accessibility",
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
    faqs: [
      { question: "Can I use this wheelchair on Valencia's beaches?", answer: "The standard wheelchair works well on the beach promenades and boardwalks. For sand access, Valencia's accessible beaches (Malvarrosa, Pinedo) offer free amphibious wheelchairs during summer months with Red Cross assistance." },
      { question: "Will this wheelchair fit in a taxi?", answer: "Yes — it folds to just 28 cm wide and fits in any standard taxi boot. For transfers from Valencia airport, just fold and go." },
    ],
  },
  {
    slug: "transport-wheelchair",
    name: "Transport Wheelchair (Lightweight)",
    brand: "Drive Medical",
    category: "Mobility & Accessibility",
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
    faqs: [
      { question: "What's the difference between a transport and standard wheelchair?", answer: "A transport wheelchair is companion-pushed (smaller rear wheels) and much lighter at 9 kg vs 14 kg. It's ideal when someone will be pushing you — for museums, airports, and sightseeing. A standard wheelchair allows self-propelling." },
      { question: "Is this light enough to take on a plane?", answer: "At 9 kg, it's very travel-friendly. However, renting locally avoids the risk of airline damage entirely — and it's waiting at your accommodation when you arrive." },
    ],
  },
  {
    slug: "mobility-scooter-lightweight",
    name: "Lightweight Mobility Scooter",
    brand: "Pride",
    category: "Mobility & Accessibility",
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
    faqs: [
      { question: "Can a mobility scooter handle Valencia's cobblestones?", answer: "Yes — the 4-wheel design provides good stability on uneven surfaces. While the narrowest old town alleys can be tight, the main plazas, Turia Gardens, and beach promenades are all smooth and spacious." },
      { question: "How far can I go on a single charge?", answer: "The lightweight scooter has a 20 km range on a full charge — enough for a full day exploring. The City of Arts and Sciences round trip from the centre is about 8 km, so you'll have plenty of range." },
      { question: "Why rent a scooter instead of bringing my own?", answer: "Airlines frequently damage mobility equipment in transit. Renting locally means a fully charged, inspected scooter is waiting at your door — no transit risk, no battery shipping restrictions, no hassle." },
    ],
  },
  {
    slug: "heavy-duty-mobility-scooter",
    name: "Heavy-Duty Mobility Scooter",
    brand: "Invacare",
    category: "Mobility & Accessibility",
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
    faqs: [
      { question: "Is this scooter suitable for all-day use?", answer: "Absolutely — with a 40 km range and full suspension, it's designed for extended use. You can comfortably explore the entire Turia Gardens (9 km), visit the City of Arts and Sciences, and still have charge for the beach." },
      { question: "Can I take this scooter into shops and restaurants?", answer: "It's a full-size scooter, so it fits in most restaurants and larger shops. For narrow old town streets, the lightweight model may be more practical. The beach promenade restaurants all have wide terraces." },
    ],
  },
  {
    slug: "rollator-walker",
    name: "Rollator Walker",
    brand: "Drive Medical",
    category: "Mobility & Accessibility",
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
    faqs: [
      { question: "Is a rollator walker enough for sightseeing in Valencia?", answer: "Valencia is very flat, making a rollator ideal for visitors who can walk but need support and rest breaks. The built-in seat lets you stop and rest anywhere — the Turia Gardens, the Mercado Central, the beach promenade." },
      { question: "Can I take this walker on the bus?", answer: "Yes — Valencia's EMT buses are fully accessible with ramps. The rollator folds compactly and fits in the designated accessibility area. The metro is also fully step-free." },
    ],
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
    faqs: [
      { question: "Can I connect this monitor to my MacBook?", answer: "Yes — it has USB-C with 65W power delivery, so a single cable connects your MacBook, charges it, and extends your display. Also works with HDMI and DisplayPort for other laptops." },
      { question: "Is renting a monitor cheaper than a coworking space?", answer: "Significantly. A monitor rental for a week costs less than a single month of coworking (typically €120-160/month in Valencia). Plus you work from home on your own schedule — no commute." },
    ],
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
    faqs: [
      { question: "Will a standing desk fit in my Valencia apartment?", answer: "At 120 × 60 cm it fits against most walls. We deliver it assembled and ready to use. If your apartment has limited space, it still works as a regular desk — just adjust to sitting height." },
      { question: "Does the desk come assembled?", answer: "Yes — we deliver it fully assembled and set up in your apartment. When your rental ends, we disassemble and collect it. You don't need any tools." },
    ],
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
    faqs: [
      { question: "Why rent an office chair instead of using the apartment's?", answer: "Most holiday rentals provide dining chairs or cheap desk chairs — fine for a meal, painful for 8 hours of work. A proper ergonomic chair with lumbar support prevents back pain and makes you more productive." },
      { question: "Can I combine this with a monitor and desk rental?", answer: "Yes — we offer the full remote work setup. A monitor, standing desk, and ergonomic chair delivered together transforms any apartment into a professional workspace." },
    ],
  },

  // ===== APARTMENT COMFORT =====
  {
    slug: "air-purifier",
    name: "HEPA Air Purifier",
    brand: "Dyson",
    category: "Apartment Comfort",
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
    faqs: [
      { question: "What is calima and do I need an air purifier for it?", answer: "Calima is a weather event that brings Saharan dust across the Mediterranean to Spain. It can reduce air quality for several days. A HEPA purifier makes a noticeable difference, especially for visitors with asthma or allergies." },
      { question: "How quiet is this air purifier for sleeping?", answer: "In night mode it runs at just 24 dB — quieter than a whisper. You won't notice it at all. The auto sensor adjusts speed based on air quality, ramping up when needed and staying quiet otherwise." },
    ],
  },
  {
    slug: "portable-ac",
    name: "Portable Air Conditioner",
    brand: "De'Longhi",
    category: "Apartment Comfort",
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
    faqs: [
      { question: "Do I really need AC for Valencia in summer?", answer: "If you're visiting July-August, temperatures regularly hit 35-40°C with high humidity. Many holiday rentals lack AC or have weak units. A portable AC in the bedroom transforms your sleep quality — it's the single biggest comfort upgrade for summer visitors." },
      { question: "How does the portable AC unit work?", answer: "It cools air and exhausts heat through a hose that vents out a window. We provide all the fittings. It also dehumidifies, which helps significantly since Valencia summers are humid. Cools rooms up to 30m² effectively." },
      { question: "Is renting a portable AC cheaper than buying one?", answer: "Much cheaper for short stays. Buying a unit runs €300-500, and you can't take it home. Renting for a week or two costs a fraction, and we handle delivery, setup, and collection." },
    ],
  },

  // ===== BEACH & OUTDOOR =====
  {
    slug: "beach-umbrella-set",
    name: "Beach Umbrella & Chair Set",
    brand: "RentAnything",
    category: "Beach & Outdoor",
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
    faqs: [
      { question: "Why not just rent a sunbed at the beach?", answer: "Chiringuito sunbed rental costs €9-10 per item and sells out on busy days. With your own set you can go anywhere on the beach, arrive anytime, and aren't limited to the roped-off rental areas. It also works out cheaper over multiple days." },
      { question: "Is UPF 50+ enough for Valencia sun?", answer: "UPF 50+ blocks over 98% of UV radiation — the highest standard available. Valencia gets intense sun, especially June-September, so proper UV protection is essential, particularly for families with children." },
    ],
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
