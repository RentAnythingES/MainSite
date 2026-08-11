export interface ProductFAQ {
  question: string;
  answer: string;
}

export interface Product {
  id?: string;
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
  imageAlt?: string;
  detailDescription?: string;
  includesText?: string;
  constraintsText?: string;
  deliverySetupNote?: string;
  careNote?: string;
  seoTitle?: string;
  seoDescription?: string;
  contentStatus?: "draft" | "facts_verified" | "content_ready";
  stockTotal?: number;
  stockAvailable?: number;
  city: string;
  faqs?: ProductFAQ[];
}

export const products: Product[] = [
  // ===== BABY & TODDLER =====
  {
    slug: "stroller-travel-compact",
    name: "Stroller - Travel Compact",
    brand: "CYBEX",
    category: "Baby & Toddler",
    subcategory: "Strollers",
    categorySlug: "baby-gear",
    subcategorySlug: "strollers",
    description: "A compact travel stroller for family days around Valencia, with a quick fold for apartment storage, taxis, and train journeys.",
    features: ["Compact one-hand fold with integrated carry strap", "Near-flat recline and integrated leg rest", "One-pull harness adjustment", "Travel-system ready with compatible CYBEX infant car seats"],
    specs: { "Product weight": "6.6 kg", "Open dimensions": "79 × 44 × 105 cm", "Folded dimensions": "53.5 × 45 × 22 cm", "Manufacturer guidance": "Up to approximately 4 years" },
    pricing: [{ days: 1, perDay: 15 }, { days: 3, perDay: 11 }, { days: 7, perDay: 8 }],
    emoji: "🍼",
    image: "https://figuuqyofkvxvelqvqhm.supabase.co/storage/v1/object/public/product-images/cybex-coya-stroller-travel-compact/1783786922743-c125b6a2-dc98-4184-9aac-9cbebc96c488.jpg",
    city: "valencia",
    seoTitle: "Travel Stroller Rental in Valencia",
    seoDescription: "Rent a compact-fold travel stroller in Valencia for family days, taxis and apartment stays. Check exact folded dimensions and dates.",
    faqs: [
      { question: "Can I take this stroller as airline cabin baggage?", answer: "Do not assume so. Airline size and acceptance rules differ and can change. Compare its 53.5 × 45 × 22 cm folded dimensions with the allowance confirmed directly by your airline." },
      { question: "Is this stroller suitable for every Valencia route?", answer: "No stroller is suitable for every surface or access situation. Review the planned route, kerbs, stairs and accommodation access, and use the stroller according to the manufacturer's instructions." },
    ],
  },
  {
    slug: "stroller-all-terrain",
    name: "All-Terrain Stroller",
    brand: "Bebeconfort",
    category: "Baby & Toddler",
    subcategory: "Strollers",
    categorySlug: "baby-gear",
    subcategorySlug: "strollers",
    description: "All-terrain stroller with air-filled wheels and lie-flat recline for suitable uneven paved routes. It is not approved for running or skating.",
    features: ["All-terrain air wheels", "Three-wheel design", "Fast folding system and lock", "Lie-flat recline", "Adjustable handlebar", "Large storage basket", "Up to 22 kg"],
    specs: { "Model": "Cloudy", "Seat": "Forward-facing, lie-flat recline", "Wheels": "3 all-terrain air wheels", "Age range": "From birth to approximately 4 years", "Maximum child weight": "22 kg" },
    pricing: [{ days: 1, perDay: 15 }, { days: 3, perDay: 12 }, { days: 14, perDay: 7 }],
    emoji: "👶",
    image: "https://figuuqyofkvxvelqvqhm.supabase.co/storage/v1/object/public/product-images/stroller-all-terrain/1785164310928-d5d4a0e9-c3af-4da3-ba10-c68aa9cabe94.jpg",
    city: "valencia",
    seoTitle: "All-Terrain Stroller Rental in Valencia",
    seoDescription: "Rent an all-terrain stroller in Valencia for suitable uneven paved routes. Check child limits, access, transport and dates before booking.",
    faqs: [
      { question: "Can I use this stroller for running or skating?", answer: "No. The all-terrain wheels do not make it a jogging stroller. Use the harness, apply the brake when stationary and follow the manufacturer's instructions." },
      { question: "Can a newborn use this stroller?", answer: "Manufacturer guidance supports use from birth only in the fully reclined position. Confirm that this setup and the exact product instructions meet your child's needs before booking." },
    ],
  },
  {
    slug: "stroller-double",
    name: "Stroller - Double",
    brand: "",
    category: "Baby & Toddler",
    subcategory: "Strollers",
    categorySlug: "baby-gear",
    subcategorySlug: "strollers",
    description: "Side-by-side double stroller for twins or siblings. At 76 cm wide, access depends on the exact doorway, lift and storage space.",
    features: ["Side-by-side seating", "Independent recline", "All-terrain wheels", "One-hand fold", "UV 50+ canopy"],
    specs: { "Age": "6m – 4 years", "Weight limit": "2 × 22 kg", "Stroller weight": "13 kg", "Width": "76 cm" },
    pricing: [{ days: 1, perDay: 20 }, { days: 3, perDay: 15 }, { days: 7, perDay: 11 }, { days: 14, perDay: 8 }],
    emoji: "👶",
    image: "/products/double-stroller.webp",
    city: "valencia",
    seoTitle: "Double Stroller Rental in Valencia",
    seoDescription: "Rent a double stroller in Valencia for twins or siblings. Check its 76 cm width, child limits, accommodation access and dates.",
    faqs: [
      { question: "Will this double stroller fit through my accommodation?", answer: "Measure the narrowest entrance, lift and storage area and compare them with the stroller's 76 cm width. A general description cannot guarantee access to a particular building." },
      { question: "Can I rent this double stroller for twins?", answer: "It has two side-by-side seats with a maximum of 22 kg per seat and manufacturer guidance of approximately 6 months to 4 years. Check each child's suitability before booking." },
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
    image: "/products/travel-crib.webp",
    city: "valencia",
    faqs: [
      { question: "Is the travel crib safe for newborns?", answer: "Yes — the BabyBjörn travel crib is suitable from birth to 3 years (up to 12 kg). It has a firm mattress and breathable mesh sides that meet all EU safety standards." },
      { question: "Why rent a travel crib instead of using the hotel one?", answer: "Hotel cribs vary widely in quality and cleanliness. Our BabyBjörn cribs are premium quality, thoroughly cleaned between every rental, and come with a fitted sheet. You also avoid packing a crib in your luggage." },
    ],
  },
  {
    slug: "maxi-cosi-pebble-360-pro2-infant-car-seat",
    name: "Maxi-Cosi Pebble 360 Pro2 Infant Car Seat",
    brand: "Maxi-Cosi",
    category: "Baby & Toddler",
    subcategory: "Car Seats",
    categorySlug: "baby-gear",
    subcategorySlug: "car-seats",
    description: "A lie-flat infant car seat for babies from 40 to 87 cm, supplied without the FamilyFix base and installed with the car's three-point seat belt.",
    features: ["From birth to approximately 18 months", "40–87 cm i-Size range", "Fully reclined positions", "G-CELL side-impact protection", "ClimaFlow ventilation", "Three-point harness", "Integrated sun canopy", "Removable newborn insert"],
    specs: { "Model": "Pebble 360 Pro2", "Child height": "40–87 cm", "Maximum child weight": "13 kg", "Orientation": "Rear-facing", "Installation": "Vehicle three-point seat belt", "FamilyFix base": "Not included", "Product weight": "4.7 kg" },
    pricing: [{ days: 1, perDay: 10 }, { days: 3, perDay: 8 }, { days: 7, perDay: 5 }, { days: 14, perDay: 4 }],
    emoji: "🚗",
    image: "https://figuuqyofkvxvelqvqhm.supabase.co/storage/v1/object/public/product-images/maxi-cosi-pebble-360-pro2-infant-car-seat/primary.png",
    city: "valencia",
    faqs: [
      { question: "Is the FamilyFix base included?", answer: "No. This rental is for the Pebble 360 Pro2 infant carrier without the FamilyFix base." },
      { question: "Can it be installed without the base?", answer: "Yes. Maxi-Cosi allows the Pebble 360 Pro2 to be installed rear-facing with the vehicle's three-point seat belt." },
      { question: "What baby size is it for?", answer: "It is designed from birth to 87 cm, approximately 18 months, with a maximum child weight of 13 kg." },
    ],
  },
  {
    slug: "moni-serengeti-i-size-car-seat",
    name: "Moni Serengeti i-Size Car Seat",
    brand: "Moni",
    category: "Baby & Toddler",
    subcategory: "Car Seats",
    categorySlug: "baby-gear",
    subcategorySlug: "car-seats",
    description: "A rotating i-Size car seat for children from 40 to 150 cm, designed to adapt from newborn journeys through the booster-seat years.",
    features: ["40–150 cm i-Size range", "360-degree rotating seat", "Rear-facing and forward-facing configurations", "ISOFIX and top-tether installation", "Five-point harness for smaller children", "Four recline positions", "Adjustable headrest"],
    specs: { "Model": "Serengeti i-Size", "Child height": "40–150 cm", "Rear-facing": "40–105 cm", "Forward-facing": "76–150 cm", "Installation": "ISOFIX and top tether", "Rotation": "360 degrees", "Recline": "4 positions" },
    pricing: [{ days: 1, perDay: 15 }, { days: 3, perDay: 13 }, { days: 7, perDay: 10 }, { days: 14, perDay: 6.5 }],
    emoji: "🚗",
    image: "https://figuuqyofkvxvelqvqhm.supabase.co/storage/v1/object/public/product-images/moni-serengeti-i-size-car-seat/primary.jpg",
    city: "valencia",
    seoTitle: "Moni Serengeti Car Seat Rental Valencia",
    seoDescription: "Rent a Moni Serengeti i-Size car seat in Valencia for children 40–150 cm, with 360-degree rotation, ISOFIX and local delivery.",
    contentStatus: "content_ready",
    faqs: [
      { question: "What child size is the Moni Serengeti for?", answer: "It covers a broad 40–150 cm height range. The direction and restraint setup change as the child grows, so send us the child's current height and weight." },
      { question: "Does the seat rotate?", answer: "Yes. The seat rotates through 360 degrees, which makes it easier to place and buckle a younger child." },
      { question: "How is it installed?", answer: "The Serengeti uses ISOFIX and a top tether. If you are hiring a car, send the model when it is assigned so you can plan the installation before arrival." },
    ],
  },
  {
    slug: "peg-perego-viaggio1-duo-fix-car-seat",
    name: "Peg Perego Viaggio1 Duo-Fix Car Seat - Rouge",
    brand: "Peg Perego",
    category: "Baby & Toddler",
    subcategory: "Car Seats",
    categorySlug: "baby-gear",
    subcategorySlug: "car-seats",
    description: "A comfortable forward-facing car seat for children from 9 to 18 kg, with an adjustable headrest, five-point harness and four recline positions.",
    features: ["9–18 kg child-weight range", "Forward-facing seat", "Five-point harness", "Adjustable side-impact protection", "Seven-position headrest", "Four recline positions", "Vehicle seat-belt installation"],
    specs: { "Model": "Viaggio1 Duo-Fix", "Colour": "Rouge", "Child weight": "9–18 kg", "Orientation": "Forward-facing", "Harness": "Five-point", "Headrest": "7 positions", "Recline": "4 positions", "Installation": "Vehicle three-point seat belt; compatible ISOFIX base is separate", "Weight": "10 kg", "Dimensions": "45 × 65 × 55 cm" },
    pricing: [{ days: 1, perDay: 15 }, { days: 3, perDay: 12 }, { days: 5, perDay: 11 }, { days: 7, perDay: 9 }, { days: 14, perDay: 7 }],
    emoji: "🚗",
    image: "https://figuuqyofkvxvelqvqhm.supabase.co/storage/v1/object/public/product-images/convertible-car-seat/1785878664815-cb25d354-cafe-400d-9bd1-862954690980.png",
    city: "valencia",
    seoTitle: "Peg Perego Car Seat Rental Valencia",
    seoDescription: "Rent a Peg Perego Viaggio1 Duo-Fix car seat in Valencia for children 9–18 kg, with a five-point harness, adjustable headrest and recline.",
    contentStatus: "content_ready",
    faqs: [
      { question: "What child size is the Viaggio1 Duo-Fix for?", answer: "It is designed for children weighing 9–18 kg, approximately one to four years old." },
      { question: "Does the seat recline?", answer: "Yes. It has four recline positions and a seven-position adjustable headrest." },
      { question: "How is it installed?", answer: "The seat can be secured with the vehicle's three-point seat belt. A compatible Peg Perego ISOFIX base is a separate accessory." },
    ],
  },
  {
    slug: "kinderkraft-i-spark-2-plus-i-size-car-seat",
    name: "Kinderkraft I-SPARK 2 PLUS i-Size Car Seat",
    brand: "Kinderkraft",
    category: "Baby & Toddler",
    subcategory: "Car Seats",
    categorySlug: "baby-gear",
    subcategorySlug: "car-seats",
    description: "A comfortable high-back i-Size seat for children 100 to 150 cm, with ten headrest positions and simple installation using the car's three-point seat belt.",
    features: ["100–150 cm i-Size range", "High-back seat", "Converts to a backless booster above 140 cm", "Ten-position adjustable headrest", "H-GUARD head protection", "SPS side protection", "Vehicle three-point belt installation", "Machine-washable cover"],
    specs: { "Model": "I-SPARK 2 PLUS i-Size", "Child height": "100–150 cm", "Approval": "R129 / i-Size", "Installation": "Vehicle three-point seat belt", "Headrest": "10 positions", "Backless booster mode": "Above 140 cm" },
    pricing: [{ days: 1, perDay: 5 }, { days: 3, perDay: 3.5 }, { days: 7, perDay: 2.5 }, { days: 14, perDay: 1.5 }],
    emoji: "🚗",
    image: "https://figuuqyofkvxvelqvqhm.supabase.co/storage/v1/object/public/product-images/kinderkraft-i-spark-2-plus-i-size-car-seat/primary.jpg",
    city: "valencia",
    seoTitle: "Kinderkraft Car Seat Rental Valencia",
    seoDescription: "Rent a Kinderkraft I-SPARK 2 PLUS i-Size car seat in Valencia for children 100–150 cm, with a high back and simple seat-belt installation.",
    contentStatus: "content_ready",
    faqs: [
      { question: "What child size is the I-SPARK 2 PLUS for?", answer: "Kinderkraft lists it for children from 100 to 150 cm, approximately 3.5 to 12 years." },
      { question: "Does it need ISOFIX?", answer: "No. It installs using the vehicle's three-point seat belt, so no ISOFIX base is required." },
      { question: "Can the backrest be removed?", answer: "Yes. Kinderkraft allows backless booster use for children above 140 cm, following the product instructions." },
    ],
  },
  {
    slug: "seat-booster",
    name: "Backless Booster Seat",
    brand: "",
    category: "Baby & Toddler",
    subcategory: "Car Seats",
    categorySlug: "baby-gear",
    subcategorySlug: "car-seats",
    description: "A lightweight backless booster for older children, easy to move between cars and installed with the vehicle's three-point seat belt.",
    features: ["Lightweight backless design", "Vehicle three-point belt installation", "Forward-facing use", "Compact for travel and transfers"],
    specs: { "Product type": "Backless booster seat", "Installation": "Vehicle three-point seat belt", "Orientation": "Forward-facing", "Brand or colour": "May vary" },
    pricing: [{ days: 1, perDay: 5 }, { days: 3, perDay: 3.5 }, { days: 7, perDay: 2.5 }, { days: 14, perDay: 1.5 }],
    emoji: "🚗",
    image: "https://figuuqyofkvxvelqvqhm.supabase.co/storage/v1/object/public/product-images/seat-booster/1783844627396-aafb7b98-cb1c-4280-af55-700da24e6e3a.jpg",
    city: "valencia",
    seoTitle: "Backless Booster Seat Rental Valencia",
    seoDescription: "Rent a lightweight backless booster seat in Valencia for an older child, with simple three-point seat-belt installation and local delivery.",
    contentStatus: "content_ready",
    stockTotal: 3,
    stockAvailable: 3,
    faqs: [
      { question: "Who is a backless booster for?", answer: "It is a compact option for an older child who still needs a booster to use the vehicle's three-point seat belt correctly. Share the child's height when booking." },
      { question: "How is it installed?", answer: "The booster sits on the vehicle seat and the child uses the car's three-point seat belt." },
      { question: "Will I receive the exact brand shown?", answer: "The supplied brand or colour may vary, but the booking is for the same lightweight backless-booster type." },
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
    image: "/products/high-chair.webp",
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
    image: "/products/standard-wheelchair.webp",
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
    image: "/products/transport-wheelchair.webp",
    city: "valencia",
    faqs: [
      { question: "What's the difference between a transport and standard wheelchair?", answer: "A transport wheelchair is companion-pushed (smaller rear wheels) and much lighter at 9 kg vs 14 kg. It's ideal when someone will be pushing you — for museums, airports, and sightseeing. A standard wheelchair allows self-propelling." },
      { question: "Is this light enough to take on a plane?", answer: "At 9 kg, it's very travel-friendly. However, renting locally avoids the risk of airline damage entirely — and it's waiting at your accommodation when you arrive." },
    ],
  },
  {
    slug: "mobility-scooter-lightweight-foldable",
    name: "Lightweight Mobility Scooter",
    brand: "Model confirmed before booking",
    category: "Mobility & Accessibility",
    subcategory: "Mobility Scooters",
    categorySlug: "mobility",
    subcategorySlug: "scooters",
    description: "A compact four-wheel mobility scooter for shorter accessible journeys and easier storage or transport. Exact model, dimensions and performance are confirmed before payment.",
    features: ["Compact four-wheel layout", "Separates for transport", "Swivelling adjustable seat", "Front basket", "Personal handover"],
    specs: { "Maximum speed": "Up to 6 km/h", "Advertised range": "Up to 20 km per charge", "Maximum user weight": "115 kg", "Listed total weight": "Approximately 34 kg" },
    pricing: [{ days: 1, perDay: 35 }, { days: 3, perDay: 28 }, { days: 7, perDay: 20 }, { days: 14, perDay: 15 }],
    emoji: "🛵",
    image: "/products/mobility-scooter-lightweight.webp",
    city: "valencia",
    faqs: [
      { question: "What makes this the lightweight option?", answer: "It has a compact four-wheel layout and separates into sections for storage or vehicle transport. We confirm the exact component weights and transport requirements before payment." },
      { question: "Can it be used on Valencia's old-town paving?", answer: "Use it on accessible, reasonably even paved routes and cross rough sections slowly. It is not suitable for steps, sand, high kerbs or heavily broken surfaces." },
      { question: "Is the 20 km range guaranteed?", answer: "No. It is an advertised maximum. User weight, gradients, surface, temperature, battery condition and driving style all affect real range." },
    ],
  },
  {
    slug: "heavy-duty-mobility-scooter",
    name: "Heavy-Duty Mobility Scooter",
    brand: "Model confirmed before booking",
    category: "Mobility & Accessibility",
    subcategory: "Mobility Scooters",
    categorySlug: "mobility",
    subcategorySlug: "scooters",
    description: "A full-size four-wheel mobility scooter with higher capacity and greater comfort for longer paved routes. Access, storage and the exact model are confirmed before payment.",
    features: ["Full-size four-wheel layout", "Suspension", "Supportive adjustable seat", "Lights and mirrors", "Personal handover"],
    specs: { "Maximum speed": "Up to 12 km/h", "Advertised range": "Up to 40 km per charge", "Maximum user weight": "160 kg", "Listed scooter weight": "Approximately 68 kg" },
    pricing: [{ days: 1, perDay: 70 }, { days: 3, perDay: 55 }, { days: 7, perDay: 40 }, { days: 14, perDay: 30 }],
    emoji: "🏍️",
    image: "/products/heavy-duty-mobility-scooter.webp",
    city: "valencia",
    faqs: [
      { question: "Who is the heavy-duty scooter intended for?", answer: "It is our largest scooter class, intended for users who need up to 160 kg capacity, a more supportive seat and greater comfort on longer paved routes." },
      { question: "Is the 40 km range guaranteed?", answer: "No. It is an advertised maximum under favourable conditions. User weight, gradients, surface, temperature, battery condition and driving style affect the real distance." },
      { question: "Can it be driven on the beach?", answer: "It can use suitable paved seafront promenades, but it must not be driven on beach sand, steps, flooded areas or high kerbs." },
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
    image: "/products/rollator-walker.webp",
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
    image: "/products/monitor-27.webp",
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
    image: "/products/standing-desk.webp",
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
    image: "/products/ergonomic-chair.webp",
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
    image: "/products/air-purifier.webp",
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
    image: "/products/portable-ac.webp",
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
    brand: "Rent&Roll",
    category: "Beach & Outdoor",
    subcategory: "Beach Gear",
    categorySlug: "travel-outdoors",
    subcategorySlug: "beach",
    description: "Complete beach setup: XL umbrella, 2 folding chairs, and a cooler bag. Ready for Malvarrosa or Patacona.",
    features: ["2m umbrella with UV protection", "2 × folding chairs", "Insulated cooler bag", "Sand anchor", "Carry bag"],
    specs: { "Umbrella diameter": "2m", "UV protection": "UPF 50+", "Total weight": "6 kg" },
    pricing: [{ days: 1, perDay: 15 }, { days: 3, perDay: 10 }, { days: 7, perDay: 7 }, { days: 14, perDay: 5 }],
    emoji: "🏖️",
    image: "/products/beach-umbrella-set.webp",
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
