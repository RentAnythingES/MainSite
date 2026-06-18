// Discover section: data-driven destination & event guides
// See implementation plan for architecture details

// ===== TYPES =====

export type DestinationType =
  | "neighbourhood"
  | "beach"
  | "attraction"
  | "day-trip"
  | "city"
  | "event"
  | "natural-area";

export type AudienceTag =
  | "families"
  | "mobility-needs"
  | "digital-nomads"
  | "couples"
  | "elderly"
  | "budget"
  | "luxury";

export type HubType = "neighbourhoods" | "day-trips" | "attractions" | "events";

// ===== SECTION INTERFACES =====

export interface DestinationOverview {
  paragraphs: string[];
  quickFacts?: { label: string; value: string }[];
}

export interface DestinationHighlight {
  name: string;
  description: string;
  icon?: string;
  tip?: string;
  googleMapsUrl?: string;
}

export interface GettingThere {
  summary: string;
  options: {
    mode: "metro" | "tram" | "bus" | "car" | "bike" | "walk" | "train";
    description: string;
    duration?: string;
    cost?: string;
    tip?: string;
  }[];
  parkingNotes?: string;
}

export interface BestTimeToVisit {
  summary: string;
  seasons: {
    season: "spring" | "summer" | "autumn" | "winter";
    description: string;
    rating: 1 | 2 | 3 | 4 | 5;
  }[];
  avoidDates?: string;
}

export interface WhatToBring {
  bring: string[];
  dontBring: string[];
  rentInstead: string[];
}

export interface AccessibilityInfo {
  overallRating: 1 | 2 | 3 | 4 | 5;
  summary: string;
  wheelchairNotes?: string;
  strollerNotes?: string;
  publicTransportAccess?: string;
}

export interface FoodAndDrink {
  summary: string;
  recommendations: {
    name: string;
    type: string;
    priceRange: "€" | "€€" | "€€€";
    tip?: string;
    familyFriendly?: boolean;
    /** Internal: why we recommend this — source, personal visit, review reference. Not rendered. */
    sourceNote?: string;
  }[];
  localSpeciality?: string;
}

export interface WhereToStay {
  summary: string;
  tips: string[];
}

export interface AudienceTip {
  audience: AudienceTag;
  tips: string[];
}

export interface EventInfo {
  dates: string;
  frequency: string;
  ticketsRequired: boolean;
  ticketUrl?: string;
  crowdLevel: "low" | "moderate" | "high" | "extreme";
  bookingAdvice: string;
  whatToExpect: string[];
  safetyTips?: string[];
  months?: number[];
}

export interface ProductWidget {
  /** Category slug to pull products from (e.g. "mobility", "baby-gear", "remote-work") */
  categorySlug: string;
  /** Short thematic heading (e.g. "Travelling with kids?", "Need mobility support?") */
  heading: string;
  /** Which section this strip appears after */
  afterSection: string;
}

export interface DestinationFAQ {
  question: string;
  answer: string;
}

// ===== CORE INTERFACE =====

export interface Destination {
  // Identity
  slug: string;
  name: string;
  type: DestinationType;
  tagline: string;
  heroImage?: string;
  heroImageAlt?: string;

  // SEO
  title: string;
  description: string;
  keywords: string[];
  date: string;
  lastUpdated: string;

  // Classification
  audiences: AudienceTag[];
  region: string;
  distanceFromValencia?: string;
  hubs: HubType[];

  // Modular sections (all optional)
  overview?: DestinationOverview;
  highlights?: DestinationHighlight[];
  gettingThere?: GettingThere;
  bestTimeToVisit?: BestTimeToVisit;
  whatToBring?: WhatToBring;
  accessibility?: AccessibilityInfo;
  foodAndDrink?: FoodAndDrink;
  whereToStay?: WhereToStay;
  /** For neighbourhoods: the "staying here" angle — accommodation, commuting out, daily life */
  stayingHere?: {
    summary: string;
    pros: string[];
    cons: string[];
    gettingElsewhere: string[];
  };
  /** For neighbourhoods: the "visiting here" angle — what to do for a few hours, best time of day */
  visitingHere?: {
    summary: string;
    idealDuration: string;
    bestTimeOfDay: string;
    tips: string[];
  };
  practicalTips?: string[];
  audienceTips?: AudienceTip[];

  // Event-specific
  eventInfo?: EventInfo;

  // Product integration
  productWidgets: ProductWidget[];

  // Cross-linking
  relatedDestinations: string[];
  relatedBlogPosts: string[];
  faqs: DestinationFAQ[];
}

// ===== HELPERS =====

export function isPublished(dest: Destination): boolean {
  return new Date(dest.date) <= new Date();
}

export function getPublishedDestinations(): Destination[] {
  return destinations
    .filter(isPublished)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getDestinationBySlug(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug);
}

export function getDestinationsByHub(hub: HubType): Destination[] {
  return getPublishedDestinations().filter((d) => d.hubs.includes(hub));
}

export function getDestinationsByType(type: DestinationType): Destination[] {
  return getPublishedDestinations().filter((d) => d.type === type);
}

export function getAllDestinationSlugs(): string[] {
  return getPublishedDestinations().map((d) => d.slug);
}

export function getAllDestinationSlugsForBuild(): string[] {
  return destinations.map((d) => d.slug);
}

// ===== DESTINATIONS =====
// Add new destinations here. They auto-publish when date ≤ today.

export const destinations: Destination[] = [
  {
    slug: "ruzafa",
    name: "Ruzafa",
    type: "neighbourhood",
    tagline: "Valencia's creative heart — cafes, galleries, and the best brunch in the city",
    heroImage: "/discover/ruzafa.png",
    heroImageAlt: "Colourful street scene with terrace cafes and street art in Ruzafa, Valencia",
    title: "Ruzafa, Valencia: Neighbourhood Guide",
    description: "The complete guide to Ruzafa — Valencia's trendiest neighbourhood. Best restaurants, coworking spaces, what to do, and how to explore.",
    keywords: ["Ruzafa Valencia", "Russafa", "best neighbourhood Valencia", "Ruzafa restaurants", "Ruzafa guide"],
    date: "2026-06-18",
    lastUpdated: "2026-06-18",
    audiences: ["digital-nomads", "couples", "families"],
    region: "Valencia City",
    hubs: ["neighbourhoods"],
    overview: {
      paragraphs: [
        "Ruzafa (locally spelled Russafa) is Valencia's trendiest neighbourhood — and it earns that reputation honestly. A grid of tree-lined streets packed with independent cafes, galleries, vintage shops, and some of the city's best restaurants. It's walkable, safe, and has a genuine creative energy that doesn't feel forced.",
        "Originally a working-class barrio, Ruzafa has transformed over the past decade into Valencia's answer to Berlin's Kreuzberg or Barcelona's Gràcia. The difference? It's still affordable, still authentically Spanish, and hasn't been overrun by chain stores. You'll find the Mercat de Russafa alongside craft cocktail bars, and grandmothers buying vegetables next to digital nomads on laptops.",
        "For visitors, Ruzafa is an ideal base. It's centrally located (10 minutes walk to the old town, 20 minutes to the beach), well-connected by metro and bus, and has the highest concentration of restaurants and nightlife in the city."
      ],
      quickFacts: [
        { label: "Best for", value: "Digital nomads, Couples, Foodies" },
        { label: "Getting there", value: "Bailén metro (L1), 10 min walk from centre" },
        { label: "Vibe", value: "Creative, bohemian, walkable" },
        { label: "Safety", value: "Very safe — one of Valencia's best neighbourhoods" },
      ],
    },
    highlights: [
      {
        name: "Mercat de Russafa",
        description: "The neighbourhood's beating heart — a 1950s covered market where locals buy fresh produce daily. Better for authentic atmosphere than the touristy Mercado Central. Visit before noon for the full experience.",
        icon: "🏪",
        tip: "Thursday mornings are quietest. The fruit vendors at the back have the best prices.",
      },
      {
        name: "Calle Literato Azorín",
        description: "Ruzafa's main artery for food and nightlife. This pedestrian-friendly street is lined with terrace restaurants, tapas bars, and independent shops. Perfect for an evening paseo.",
        icon: "🚶",
      },
      {
        name: "Canalla Bistro",
        description: "Michelin-recognised bistro by chef Ricard Camarena. Creative fusion dishes in a lively setting. Book ahead for dinner — walk-ins are possible for lunch.",
        icon: "⭐",
        tip: "The tasting menu is exceptional value compared to equivalent restaurants in Barcelona or Madrid.",
      },
      {
        name: "Bluebell Coffee",
        description: "Valencia's best specialty coffee, with seasonal brunch menus and a quiet interior patio. A favourite with remote workers — good wifi, relaxed atmosphere, and proper flat whites.",
        icon: "☕",
        tip: "Weekday mornings are best. Weekend brunch queues can be 30+ minutes.",
      },
      {
        name: "Street Art Walk",
        description: "Ruzafa has some of Valencia's best street art, particularly around Calle Cuba and the streets behind the market. Self-guided walks take about an hour and are free.",
        icon: "🎨",
      },
      {
        name: "Ubik Café",
        description: "A unique café-bookshop hybrid — browse secondhand books, drink wine, and attend occasional live music and literary events. Captures the neighbourhood's creative spirit perfectly.",
        icon: "📚",
      },
    ],
    gettingThere: {
      summary: "Ruzafa is centrally located and easy to reach by metro, bus, or on foot from most parts of Valencia.",
      options: [
        { mode: "metro", description: "Bailén station (Line 1) is at the northern edge of Ruzafa. Xàtiva station (Lines 3, 5, 7, 9) is a 5-minute walk north.", duration: "Direct from airport: 25 min", cost: "€1.50 single, €30-40/month pass" },
        { mode: "walk", description: "10 minutes from Plaza del Ayuntamiento, 15 minutes from the old town (El Carmen), 25 minutes from Malvarrosa beach.", duration: "10-25 min depending on origin" },
        { mode: "bus", description: "Multiple EMT bus lines serve Ruzafa. Lines 7, 27, and 81 are the most useful.", cost: "€1.50 single" },
        { mode: "bike", description: "Flat terrain makes cycling easy. Valenbisi bike-share stations throughout the neighbourhood.", cost: "€30/year for Valenbisi" },
      ],
    },
    bestTimeToVisit: {
      summary: "Ruzafa is great year-round, but spring and autumn are the sweet spot — warm enough for terraces, cool enough for walking.",
      seasons: [
        { season: "spring", description: "Perfect terrace weather (18-25°C). The neighbourhood is vibrant with outdoor dining. Fallas in March brings crowds but incredible energy.", rating: 5 },
        { season: "summer", description: "Hot (30-38°C) but the terraces come alive in the evenings. Many locals leave in August, so some spots close. Great for nightlife.", rating: 3 },
        { season: "autumn", description: "Warm, pleasant (18-28°C). The summer crowds thin out and locals return. Excellent food season — new menus, seasonal ingredients.", rating: 5 },
        { season: "winter", description: "Mild (10-18°C) with occasional rain. Still enjoyable — the cafes and restaurants are cosy, and there are zero tourist queues.", rating: 3 },
      ],
      avoidDates: "Mid-March during Fallas if you don't enjoy extreme crowds and noise (though Fallas itself is worth experiencing at least once).",
    },
    accessibility: {
      overallRating: 4,
      summary: "Ruzafa is one of the most accessible neighbourhoods in Valencia. Streets are flat, wide, and mostly well-paved. A few older sections have narrow pavements.",
      wheelchairNotes: "The grid layout and flat terrain make wheelchair navigation straightforward. Most restaurants have street-level or ramped entrances. The Mercat de Russafa is fully accessible.",
      strollerNotes: "Excellent for strollers — wide pavements, no hills, and plenty of kerb cuts. The pedestrianised streets around Literato Azorín are particularly easy.",
      publicTransportAccess: "Bailén metro station has lifts. All EMT buses serving Ruzafa have ramps and wheelchair spaces.",
    },
    foodAndDrink: {
      summary: "Ruzafa has the highest density of quality restaurants in Valencia — from traditional Valencian rice dishes to Japanese fusion and specialty coffee.",
      recommendations: [
        { name: "Canalla Bistro", type: "Creative Fusion", priceRange: "€€€", tip: "Book dinner. Lunch walk-ins possible.", familyFriendly: false, sourceNote: "Ricard Camarena group. Consistently ranked top-10 Valencia by El Tenedor + local food blogs. Google 4.3★ (2.8k reviews)." },
        { name: "Casa Baldo 1915", type: "Traditional Valencian", priceRange: "€€", tip: "Try the esmorzaret (Valencian mid-morning snack)", familyFriendly: true, sourceNote: "100+ year old institution. Known for esmorzaret among locals. Google 4.4★. Recommended by ValenciaSecreta.com." },
        { name: "Bluebell Coffee", type: "Specialty Coffee & Brunch", priceRange: "€€", tip: "Weekday mornings for no queues", familyFriendly: true, sourceNote: "Top-rated specialty coffee in Ruzafa. Featured in nomad guides (NomadList, Valencia Digital Nomads FB group). Google 4.5★." },
        { name: "Copenhagen", type: "Vegetarian Tapas", priceRange: "€€", familyFriendly: true, sourceNote: "Best-known vegetarian spot in Ruzafa. Google 4.2★ (1.5k reviews). Consistently appears in 'Best Vegetarian Valencia' lists." },
        { name: "Nozomi Sushi Bar", type: "Japanese", priceRange: "€€€", tip: "Stunning interior — worth the splurge", familyFriendly: false, sourceNote: "Award-winning Japanese. Architecturally notable interior (design press coverage). Google 4.4★. TripAdvisor Certificate of Excellence." },
        { name: "Dulce de Leche", type: "Bakery & Cakes", priceRange: "€", tip: "Go on a weekday — weekend queues are long", familyFriendly: true, sourceNote: "Iconic Ruzafa bakery — weekend queues are a neighbourhood landmark. Google 4.5★ (3k+ reviews). Valentina's, local press." },
      ],
      localSpeciality: "Order an agua de Valencia at any terrace bar — it's the city's signature cocktail (orange juice, cava, vodka, gin). Invented in Valencia and best enjoyed in Ruzafa.",
    },
    whereToStay: {
      summary: "Ruzafa is one of the best bases in Valencia — central, safe, and packed with restaurants. Short-term rentals are plentiful.",
      tips: [
        "Look for apartments near Calle Sueca or Calle Literato Azorín for the best location — walking distance to everything.",
        "Newer buildings (post-2006) tend to have better sound insulation. Ruzafa is lively at night — light sleepers should ask about noise levels.",
        "Expect to pay €800-1,200/month for a furnished one-bedroom. Short-term (1-2 weeks) will be at the higher end.",
        "The streets between Gran Vía and the market are the most residential and quieter for families.",
      ],
    },
    stayingHere: {
      summary: "Ruzafa is one of the best neighbourhoods to base yourself in Valencia. Central enough to walk everywhere, lively enough to never get bored, and with the best food scene in the city on your doorstep.",
      pros: [
        "Best restaurant and café density in Valencia — you'll eat well every day without repeating",
        "10 minutes walk to the old town, train station, and city centre",
        "Safe at all hours with a strong community feel",
        "Excellent coworking options (Wayco, Nostromo) and café-workspace culture for remote workers",
        "Fibre internet standard in most apartments (240+ Mbps)",
        "Flat terrain — easy for strollers, wheelchairs, and walking with luggage",
      ],
      cons: [
        "Noisy at night, especially Thursday–Saturday. Request upper floors or interior-facing rooms.",
        "Street parking is almost impossible. Use car parks on Calle Sueca or Gran Vía.",
        "Summer can be hot (35°C+) — check if the apartment has AC before booking.",
        "Not on the beach. Malvarrosa is 25 minutes walk or 15 minutes by bus.",
      ],
      gettingElsewhere: [
        "Old town (El Carmen): 10 min walk or 1 metro stop (Xàtiva → Àngel Guimerà)",
        "Beach (Malvarrosa): 25 min walk, 15 min bus (Line 1/2 from Gran Vía), or 20 min bike via Turia",
        "City of Arts & Sciences: 20 min walk through the Turia Gardens",
        "Airport: 25 min metro (Line 3/5 from Xàtiva) — €5 direct",
        "Albufera: 15 min by bus (Line 25 from Gran Vía)",
      ],
    },
    visitingHere: {
      summary: "Even if you're not staying in Ruzafa, it's worth spending an afternoon or evening here — the food, street art, and terrace culture are the best in Valencia.",
      idealDuration: "3-5 hours (afternoon into evening is ideal)",
      bestTimeOfDay: "Late afternoon → evening. Start around 5pm for market browsing and street art, then settle in for tapas and dinner from 8pm.",
      tips: [
        "Start at Mercat de Russafa (closes 2pm weekdays, so go earlier if you want the market). Then wander the streets around Literato Azorín for street art.",
        "For a quick visit, walk Calle Sueca → Mercat → Literato Azorín → grab a drink at any terrace. 90 minutes, done.",
        "Dinner reservations are essential at popular spots (Canalla Bistro, Nozomi). Walk-ins are easier at lunchtime.",
        "The neighbourhood comes alive at night. Thursday–Saturday from 10pm onwards the terraces are packed.",
      ],
    },
    audienceTips: [
      {
        audience: "digital-nomads",
        tips: [
          "Wayco Ruzafa is the top coworking space — strong community, good events, €120-160/month for a hot desk.",
          "Bluebell Coffee, Ubik Café, and Federal Café all have good wifi and tolerate laptop workers.",
          "Most apartments in Ruzafa come with fibre internet (240+ Mbps). Always verify before signing.",
        ],
      },
      {
        audience: "families",
        tips: [
          "Ruzafa is safe and walkable with kids. The streets are flat and stroller-friendly.",
          "For playgrounds, head to Jardín del Hospital (10 min walk) or the Turia Gardens (15 min walk).",
          "Restaurants are family-friendly — Spanish culture welcomes children at all hours. Casa Baldo and Copenhagen both have high chairs.",
        ],
      },
      {
        audience: "couples",
        tips: [
          "Book dinner at Canalla Bistro or Nozomi for a special evening. Follow with cocktails at Olhöps craft beer bar.",
          "The street art walk + Mercat de Russafa + terrace lunch makes a perfect low-key day.",
          "Ruzafa's nightlife is the best in Valencia — start late (11pm) and it runs until 3-4am on weekends.",
        ],
      },
    ],
    practicalTips: [
      "Ruzafa is safe at all hours, but like any busy neighbourhood, keep an eye on your belongings at crowded terraces.",
      "Street parking is nearly impossible — use the public car parks on Calle Sueca or Gran Vía if driving.",
      "Most shops and restaurants close 2-5pm for siesta, except cafes. Plan accordingly.",
      "The Mercat de Russafa closes by 2pm and is closed on Sundays. Don't show up at 3pm expecting to shop.",
    ],
    productWidgets: [
      { categorySlug: "remote-work", heading: "Working remotely from Ruzafa?", afterSection: "Staying Here" },
      { categorySlug: "baby-gear", heading: "Travelling with kids?", afterSection: "Accessibility" },
      { categorySlug: "mobility", heading: "Need mobility support?", afterSection: "Accessibility" },
    ],
    relatedDestinations: [],
    relatedBlogPosts: ["digital-nomad-guide-valencia", "valencia-with-kids-complete-guide"],
    faqs: [
      { question: "Is Ruzafa safe?", answer: "Yes — Ruzafa is one of Valencia's safest and most popular neighbourhoods. It's well-lit, busy at all hours, and has a strong community feel. Standard city precautions apply." },
      { question: "Is Ruzafa good for families?", answer: "Absolutely. The flat streets are stroller-friendly, restaurants welcome children at all hours, and the Turia Gardens are a 15-minute walk away. It's slightly livelier at night than residential neighbourhoods, so consider that for light sleepers." },
      { question: "What is the best coworking space in Ruzafa?", answer: "Wayco Ruzafa is the most established — professional atmosphere, community events, and hot desk memberships from €120-160/month. For a quieter option, Nostromo Coworking offers a more intimate setting." },
      { question: "How do I get from Ruzafa to the beach?", answer: "The beach is about 25 minutes on foot, or 15 minutes by bus (Line 1 or 2 from Gran Vía). You can also cycle via the Turia Gardens bike path — flat and scenic the entire way." },
    ],
  },
  {
    slug: "malvarrosa-beach",
    name: "Malvarrosa Beach",
    type: "beach",
    tagline: "Valencia's favourite urban beach — wide sand, warm water, and a legendary promenade",
    heroImage: "/discover/malvarrosa-beach.png",
    heroImageAlt: "Golden sandy beach at Malvarrosa with Mediterranean sea and promenade",
    title: "Malvarrosa Beach Guide — Valencia's Best Urban Beach",
    description: "Complete guide to Malvarrosa Beach in Valencia. Amenities, accessibility, chiringuitos, best times, and practical tips from locals.",
    keywords: ["Malvarrosa beach Valencia", "Valencia beach guide", "best beach Valencia", "Malvarrosa"],
    date: "2026-06-18",
    lastUpdated: "2026-06-18",
    audiences: ["families", "couples", "mobility-needs"],
    region: "Valencia City",
    distanceFromValencia: "20 min from city centre",
    hubs: ["attractions"],
    overview: {
      paragraphs: [
        "Malvarrosa is Valencia's most popular urban beach — and for good reason. A wide stretch of golden sand running from the port area north towards Patacona, backed by a lively promenade packed with restaurants, bars, and the historic Las Arenas spa hotel.",
        "Unlike resort beaches, Malvarrosa is a real city beach. Locals jog here before work, families spend entire Sundays, and the chiringuitos (beach bars) serve proper paella with their feet-in-the-sand vibes. It's also one of Spain's most accessible beaches, with a comprehensive assisted bathing programme run by the Red Cross.",
        "The beach is undergoing a renovation in 2026, with new modernised chiringuito buildings featuring glass panoramic designs and solar panels. Some venues may be temporarily closed, but the beach itself is fully open and as good as ever."
      ],
      quickFacts: [
        { label: "Beach length", value: "1.8 km of sand" },
        { label: "Water temp", value: "16°C (winter) to 26°C (summer)" },
        { label: "Lifeguards", value: "June–September" },
        { label: "Blue Flag", value: "Yes (check current status)" },
      ],
    },
    highlights: [
      {
        name: "Paseo Marítimo Promenade",
        description: "The seafront promenade stretches the full length of the beach — wide, flat, and perfect for walking, cycling, or wheeling. Lined with restaurants on one side and the Mediterranean on the other.",
        icon: "🚶",
      },
      {
        name: "Chiringuitos & Paella",
        description: "The beach restaurants serve some of Valencia's best paella — this is where the dish was born, after all. New modernised venues are opening through 2026 with panoramic glass designs.",
        icon: "🥘",
        tip: "Book Sunday paella by Friday at popular spots like La Pepica or Casa Carmela.",
      },
      {
        name: "Assisted Bathing Programme",
        description: "From June 1 to September 15, the Red Cross operates an assisted bathing service with amphibious wheelchairs, lifting cranes, and trained volunteers. Free of charge. Book ahead by calling 96 367 73 75.",
        icon: "♿",
        tip: "Arrive before 11am to avoid the busiest period. The reserved area has shade and adapted facilities.",
      },
      {
        name: "Beach Sports",
        description: "Volleyball courts, CrossFit areas, and a children's playground are available free. The cycle path runs the full length of the promenade.",
        icon: "🏐",
      },
    ],
    gettingThere: {
      summary: "Malvarrosa is well-connected by tram, bus, and bike from the city centre.",
      options: [
        { mode: "tram", description: "Lines 4 and 6 run directly to the beach. La Cadena or Eugenia Viñes stops.", duration: "20 min from centre", cost: "€1.50" },
        { mode: "bus", description: "Lines 1, 2, and 31 serve the beach area from Gran Vía and the city centre.", cost: "€1.50" },
        { mode: "bike", description: "Flat cycle path from the Turia Gardens runs directly to the beach. Valenbisi stations available.", duration: "25 min from Ruzafa" },
        { mode: "walk", description: "Follow the Turia Gardens east — the path leads straight to the beach.", duration: "40 min from old town" },
      ],
      parkingNotes: "Limited street parking. Public car parks near Las Arenas hotel. Avoid driving on summer weekends — it's a nightmare.",
    },
    bestTimeToVisit: {
      summary: "June and September are the sweet spot — warm enough to swim, without the August crowds.",
      seasons: [
        { season: "spring", description: "Pleasant (18-24°C) for walking and terraces. Water is still cool (17-19°C). Fewer crowds.", rating: 3 },
        { season: "summer", description: "Peak season. Hot (30-38°C), warm water (24-26°C), lifeguards on duty. Very busy July-August, especially weekends.", rating: 4 },
        { season: "autumn", description: "September is excellent — warm water, thinner crowds, golden light. October still good for walks.", rating: 5 },
        { season: "winter", description: "Mild (12-18°C). Great for promenade walks and terrace coffee. Nobody swims.", rating: 2 },
      ],
      avoidDates: "Mid-August weekends — the beach is packed shoulder-to-shoulder. Arrive before 10am if you must go.",
    },
    accessibility: {
      overallRating: 5,
      summary: "One of Spain's most accessible beaches. UNE 170001 certified. Fully adapted infrastructure including the promenade, access ramps, adapted toilets, and the Red Cross assisted bathing programme.",
      wheelchairNotes: "The promenade is fully flat and wide. Adapted wooden walkways extend to the water's edge. Amphibious wheelchairs are available free June-September via the Red Cross (96 367 73 75).",
      strollerNotes: "Excellent — the promenade is wide and smooth. Sandy areas require lifting the stroller, but the walkways get you close to the water.",
      publicTransportAccess: "Tram stops are fully accessible with ramps. EMT buses serving the beach have wheelchair ramps.",
    },
    foodAndDrink: {
      summary: "The Malvarrosa promenade is where paella was born — specifically, in the beachfront restaurants that have served rice dishes for over a century.",
      recommendations: [
        { name: "La Pepica", type: "Traditional Paella", priceRange: "€€€", tip: "Book 2+ days ahead for Sunday lunch", familyFriendly: true },
        { name: "Casa Carmela", type: "Wood-Fired Paella", priceRange: "€€", tip: "One of the most authentic paella experiences in Valencia", familyFriendly: true },
        { name: "La Más Bonita", type: "Brunch & Cocktails", priceRange: "€€", tip: "Instagram-famous. Better for drinks than food.", familyFriendly: false },
      ],
      localSpeciality: "Order paella Valenciana (chicken, rabbit, beans) or arroz a banda (fish stock rice). Never order paella for dinner — it's a lunch dish in Valencia.",
    },
    practicalTips: [
      "Bring your own shade — chiringuito sunbed rental is €9-10 each and the good spots fill up by 11am in summer.",
      "Apply sunscreen before arriving. The UV index in Valencia hits 9-10+ in summer — burns happen fast.",
      "The showers and foot-wash stations are free and located at regular intervals along the promenade.",
      "If you're coming with kids, the southern end near the port is slightly less crowded than the main central section.",
    ],
    productWidgets: [
      { categorySlug: "travel-outdoors", heading: "Beach day essentials", afterSection: "Practical Tips" },
      { categorySlug: "mobility", heading: "Need mobility support?", afterSection: "Accessibility" },
    ],
    relatedDestinations: ["ruzafa"],
    relatedBlogPosts: ["valencia-summer-survival-guide", "wheelchair-accessible-valencia"],
    faqs: [
      { question: "Is Malvarrosa Beach free?", answer: "Yes — the beach itself is completely free. You only pay for sunbed rental at chiringuitos (€9-10 each) or for food and drinks. Showers, toilets, and the assisted bathing programme are all free." },
      { question: "Is Malvarrosa good for families with small children?", answer: "Excellent. The water is shallow and warm in summer, lifeguards are on duty June-September, and there's a children's playground area. The southern end near the port tends to be slightly quieter." },
      { question: "Can wheelchair users access the water at Malvarrosa?", answer: "Yes — from June 1 to September 15, the Red Cross operates a free assisted bathing service with amphibious wheelchairs and lifting cranes. Book ahead: 96 367 73 75." },
    ],
  },
  {
    slug: "fallas",
    name: "Las Fallas",
    type: "event",
    tagline: "Europe's wildest street festival — fire, art, and controlled chaos every March",
    heroImage: "/discover/fallas.png",
    heroImageAlt: "Enormous falla sculpture burning during the Cremà at Las Fallas festival in Valencia",
    title: "Las Fallas Valencia Guide — Everything You Need to Know",
    description: "Complete guide to Las Fallas in Valencia. Dates, what to expect, safety tips, where to watch the Cremà, and practical advice for families.",
    keywords: ["Fallas Valencia", "Las Fallas guide", "Fallas 2027", "Valencia fire festival"],
    date: "2026-06-18",
    lastUpdated: "2026-06-18",
    audiences: ["families", "couples", "budget"],
    region: "Valencia City",
    hubs: ["events"],
    eventInfo: {
      dates: "March 15–19 annually (build-up starts March 1)",
      frequency: "Annual — UNESCO Intangible Cultural Heritage since 2016",
      ticketsRequired: false,
      crowdLevel: "extreme",
      bookingAdvice: "Book accommodation at least 2-3 months ahead. Prices triple during Fallas week. Consider staying in Ruzafa or Benimaclet — slightly outside the chaos but walkable to everything.",
      whatToExpect: [
        "Enormous artistic sculptures (fallas) erected at 300+ intersections citywide — many are satirical, political, or surreal",
        "The Mascletà: a deafening firecracker display in Plaza del Ayuntamiento at 2pm daily (March 1-19). Arrive by 1pm for a spot.",
        "La Cremà: on March 19 (St Joseph's Day) ALL the fallas are burned. The city becomes an inferno — deliberately. The biggest falla in Plaza del Ayuntamiento burns last, usually around 1am.",
        "Street parties, open-air concerts, and paella competitions throughout the week",
        "Traditional fallera outfits — ornate dresses and hairstyles — worn by thousands of participants",
      ],
      safetyTips: [
        "The noise is extreme, especially during Mascletà. Bring earplugs for children — this is non-negotiable.",
        "Streets near burning fallas get extremely hot. Stay behind barriers. Follow instructions from firefighters.",
        "Pickpockets operate during Mascletà crowds. Keep valuables in front pockets or a body pouch.",
        "If you have asthma or respiratory issues, the smoke during Cremà can be intense. Stay upwind or watch from a distance.",
      ],
      months: [3],
    },
    overview: {
      paragraphs: [
        "Las Fallas is not a quaint cultural festival — it's a city-wide explosion of art, fire, gunpowder, and organised chaos that takes over every corner of Valencia for nearly three weeks in March. It's been happening since the 18th century and was declared UNESCO Intangible Cultural Heritage in 2016.",
        "The centrepiece is the fallas themselves: enormous artistic sculptures — some reaching 20+ metres — built over months and then deliberately burned on the night of March 19. There are over 300 of them, from grand civic monuments to small neighbourhood creations by local children. The artistic quality is genuinely impressive; the best rival professional gallery installations.",
        "For visitors, Fallas is overwhelming in the best way. The Mascletà (daily firecracker display at 2pm) is unlike anything you've experienced — it's felt in your chest, not just heard. The Cremà (burning night) is genuinely surreal. And in between, the entire city is one continuous street party with paella, churros, and live music.",
      ],
      quickFacts: [
        { label: "When", value: "March 15-19 (build-up from March 1)" },
        { label: "Cost", value: "Free — everything is open-air" },
        { label: "Crowds", value: "Extreme — 2M+ visitors over the festival" },
        { label: "Noise level", value: "Bring earplugs. Seriously." },
      ],
    },
    highlights: [
      {
        name: "The Mascletà",
        description: "Every day at 2pm (March 1-19) in Plaza del Ayuntamiento, a professional pyrotechnician orchestrates a 7-minute firecracker display. It builds from rhythmic pops to a wall of sound that shakes buildings. You feel it in your bones.",
        icon: "💥",
        tip: "Arrive by 1pm or you won't get a spot. The best position is about 30m from the barriers — close enough to feel it, far enough to keep your hearing.",
      },
      {
        name: "La Cremà (The Burning)",
        description: "On the night of March 19, all 300+ fallas are burned simultaneously across the city. The biggest falla in Plaza del Ayuntamiento burns last, usually around 1am. Firefighters hose down buildings as flames reach 15+ metres.",
        icon: "🔥",
        tip: "Watch a smaller neighbourhood cremà first (10pm) — they're more intimate and less crowded. Then head to the main plaza for the finale.",
      },
      {
        name: "The Fallas Sculptures",
        description: "Walk the city to see the 300+ fallas — satirical, political, and often surreal sculptures that have been built over months by professional artists. The official judging route covers the top-tier ones.",
        icon: "🎨",
      },
      {
        name: "Ofrenda de Flores",
        description: "A flower offering to the Virgin Mary where thousands of falleras in traditional dress parade through the streets carrying bouquets. The resulting floral monument in Plaza de la Virgen is stunning.",
        icon: "💐",
      },
    ],
    bestTimeToVisit: {
      summary: "Fallas peaks March 15-19, but the build-up from March 1 has its own charm with fewer crowds.",
      seasons: [
        { season: "spring", description: "Fallas happens in March — temperatures are pleasant (14-20°C) but evenings can be cool, especially waiting for the Cremà. Bring a jacket.", rating: 5 },
        { season: "summer", description: "Fallas doesn't happen in summer.", rating: 1 },
        { season: "autumn", description: "Fallas doesn't happen in autumn.", rating: 1 },
        { season: "winter", description: "Fallas doesn't happen in winter.", rating: 1 },
      ],
    },
    whatToBring: {
      bring: ["Earplugs (essential for children)", "Comfortable walking shoes", "Light jacket for evenings", "Cash for street food", "Phone with good camera"],
      dontBring: ["Expensive jewellery (pickpocket risk in crowds)", "Bulky luggage on Mascletà day", "Anything you can't carry easily"],
      rentInstead: ["Stroller — navigating Fallas crowds with a heavy buggy is miserable. A lightweight, one-hand fold model is essential."],
    },
    accessibility: {
      overallRating: 2,
      summary: "Fallas is challenging for wheelchair users and people with mobility issues. Crowds are dense, streets are closed, and smoke can be intense. However, the Mascletà in the plaza has a designated accessible area.",
      wheelchairNotes: "The main plazas have accessible viewing areas during Mascletà. Smaller neighbourhood events are harder to navigate. Plan routes carefully — many streets are closed to vehicles.",
      strollerNotes: "Use a compact, one-hand fold stroller. You will need to fold it frequently in dense crowds. Avoid the main Cremà with very young children — the heat, noise, and smoke are intense.",
      publicTransportAccess: "Metro and buses run extended hours during Fallas. Accessible, but very crowded. Consider taxis outside peak events.",
    },
    practicalTips: [
      "Download the official Fallas app — it has a map of all 300+ fallas and daily event schedules.",
      "Eat paella for lunch, not dinner. Street churros and buñuelos de calabaza (pumpkin fritters) are the essential Fallas snacks.",
      "The city smells of gunpowder for the entire festival. Your clothes will too. Don't wear anything precious.",
      "Banks and shops in the city centre may have reduced hours during Fallas week. Stock up on cash.",
    ],
    productWidgets: [
      { categorySlug: "baby-gear", heading: "Bringing kids to Fallas?", afterSection: "Accessibility" },
    ],
    relatedDestinations: ["ruzafa", "malvarrosa-beach"],
    relatedBlogPosts: ["valencia-with-kids-complete-guide"],
    faqs: [
      { question: "Is Las Fallas safe for children?", answer: "Yes, with preparation. Bring earplugs (non-negotiable for the Mascletà), avoid the main Cremà with babies or toddlers (heat and smoke are intense), and use a compact stroller that folds easily in crowds. The daytime events and neighbourhood fallas are wonderful for kids." },
      { question: "Do I need tickets for Las Fallas?", answer: "No — Fallas is entirely free and open-air. The Mascletà, Cremà, and all street events are public. Some private Fallas casals host dinners, but the main festival costs nothing." },
      { question: "How far in advance should I book accommodation?", answer: "At least 2-3 months ahead. Hotel prices triple during Fallas week and availability is extremely limited. Apartments in Ruzafa or Benimaclet are good alternatives — slightly outside the chaos but walkable to everything." },
      { question: "What is the Mascletà?", answer: "A daily firecracker display at 2pm in Plaza del Ayuntamiento (March 1-19). It's not fireworks — it's a rhythmic, building crescendo of gunpowder explosions designed to be felt in your chest, not just watched. Arrive by 1pm for a spot. It lasts about 7 minutes and is unlike anything else in Europe." },
    ],
  },
  {
    slug: "albufera",
    name: "Albufera Natural Park",
    type: "day-trip",
    tagline: "Sunset boat rides, wild rice fields, and the birthplace of paella — 15 minutes from the city",
    heroImage: "/discover/albufera.png",
    heroImageAlt: "Sunset over Albufera lagoon with traditional boat and reflections on calm water",
    title: "Albufera Natural Park — Valencia Day Trip Guide",
    description: "Visit Albufera Natural Park from Valencia. Boat rides, paella at source, birdwatching, and sunset tours. Just 15 minutes by bus.",
    keywords: ["Albufera Valencia", "Albufera boat trip", "Albufera Natural Park", "day trip from Valencia"],
    date: "2026-06-18",
    lastUpdated: "2026-06-18",
    audiences: ["families", "couples", "budget"],
    region: "Valencia Province",
    distanceFromValencia: "15 min by bus",
    hubs: ["day-trips"],
    overview: {
      paragraphs: [
        "Albufera is one of Spain's most important wetlands — a vast freshwater lagoon surrounded by rice paddies, just 10 km south of Valencia city. It's the actual birthplace of paella: the dish was invented by rice farmers cooking over wood fires with whatever ingredients were at hand.",
        "The main draw is a sunset boat ride on the lagoon. Traditional flat-bottomed boats glide through reed channels onto the open water as the sky turns orange. It's genuinely beautiful and takes about 40 minutes. Afterwards, eat paella at one of the restaurants in El Palmar — the village at the heart of the lagoon.",
        "The park is also excellent for birdwatching (over 300 species) and has several walking trails through the rice fields and pine forests. It's one of the easiest day trips from Valencia — bus 25 runs directly from the city centre.",
      ],
      quickFacts: [
        { label: "Distance", value: "10 km south (15 min by bus)" },
        { label: "Boat ride", value: "€5-8 per person, ~40 min" },
        { label: "Best time", value: "Sunset — book an evening trip" },
        { label: "Entry fee", value: "Free (park), boats separate" },
      ],
    },
    highlights: [
      {
        name: "Sunset Boat Ride",
        description: "The signature experience — a traditional flat-bottomed boat glides through reed channels onto the open lagoon as the sun sets. About 40 minutes, departing from El Palmar or the Gola de Pujol.",
        icon: "🚤",
        tip: "Book for 1 hour before sunset. The light is magical. €5-8 per person.",
      },
      {
        name: "Paella in El Palmar",
        description: "This tiny village inside the park is where paella was literally invented. Restaurants like Bon Aire and Mateu serve wood-fired paella Valenciana in its purest form — chicken, rabbit, snails, and local rice.",
        icon: "🥘",
        tip: "Lunch only — paella is never served for dinner. Book ahead on weekends.",
      },
      {
        name: "Birdwatching",
        description: "Over 300 species use the Albufera wetlands. Flamingos, herons, and marsh harriers are common. The Racó de l'Olla visitor centre has free hides and information.",
        icon: "🦩",
      },
      {
        name: "Rice Field Walks",
        description: "Walking trails weave through the rice paddies surrounding the lagoon. In autumn (September-October), the flooded fields create mirror-like reflections. In spring, they're vivid green.",
        icon: "🌾",
      },
    ],
    gettingThere: {
      summary: "Albufera is one of the easiest day trips from Valencia — direct bus service in 15-20 minutes.",
      options: [
        { mode: "bus", description: "EMT Bus 25 runs from the city centre (Paseo de la Gran Vía) to El Palmar. Frequent service.", duration: "15-20 min", cost: "€1.50", tip: "Last bus back is around 9:30pm — check the schedule for your visit day." },
        { mode: "car", description: "15 minutes via the V-31. Free parking at El Palmar and the Gola de Pujol.", duration: "15 min" },
        { mode: "bike", description: "Flat cycle path runs from the city to the park entrance. Beautiful ride through orange groves.", duration: "40-50 min" },
      ],
    },
    bestTimeToVisit: {
      summary: "Sunset is the magic hour year-round. Autumn is best for birdwatching; spring for the green rice fields.",
      seasons: [
        { season: "spring", description: "Rice fields are vivid green. Pleasant temperatures. Bird nesting season.", rating: 5 },
        { season: "summer", description: "Hot but the water keeps it cooler than the city. Mosquitoes can be fierce — bring repellent.", rating: 3 },
        { season: "autumn", description: "Peak birdwatching. Flooded rice fields create mirror reflections. Rice harvest atmosphere.", rating: 5 },
        { season: "winter", description: "Quietest season. Cool but beautiful. Fewer boat services — check availability.", rating: 3 },
      ],
    },
    accessibility: {
      overallRating: 3,
      summary: "The visitor centre and main paths are accessible. The traditional boats are not wheelchair-accessible — you need to step down into them. The rice field walking trails are flat but unpaved.",
      wheelchairNotes: "The Racó de l'Olla visitor centre is fully accessible. Main lakeside paths are paved. Boats require stepping down from a dock — not suitable for most wheelchair users.",
      strollerNotes: "The main paths around El Palmar and the visitor centre work fine. The unpaved rice field trails can be muddy after rain.",
    },
    practicalTips: [
      "Bring mosquito repellent in summer — the wetlands breed them. Seriously.",
      "Paella in El Palmar takes 30-40 minutes to cook. Order when you arrive, take a walk, then eat.",
      "The sunset boat ride is the highlight — time your visit so you're on the water as the sun goes down.",
      "Don't swim in the lagoon. It's a freshwater ecosystem, not a swimming lake.",
    ],
    productWidgets: [
      { categorySlug: "mobility", heading: "Need mobility support?", afterSection: "Accessibility" },
    ],
    relatedDestinations: ["malvarrosa-beach"],
    relatedBlogPosts: ["valencia-with-kids-complete-guide"],
    faqs: [
      { question: "How much does an Albufera boat ride cost?", answer: "€5-8 per person for a 40-minute traditional boat ride. Children under 3 are usually free. Book through your boatman at El Palmar or the Gola de Pujol jetty." },
      { question: "Can I visit Albufera without a car?", answer: "Yes — EMT Bus 25 runs from Valencia city centre to El Palmar in 15-20 minutes. It's one of the easiest day trips from the city." },
      { question: "Is Albufera worth visiting?", answer: "Absolutely — especially at sunset. The boat ride, followed by paella in El Palmar, is one of Valencia's best experiences. It's free to enter the park, the boat ride is €5-8, and a paella lunch is €12-20 per person." },
    ],
  },
  {
    slug: "city-of-arts-and-sciences",
    name: "City of Arts & Sciences",
    type: "attraction",
    tagline: "Valencia's futuristic landmark — aquarium, science museum, and stunning architecture by Calatrava",
    heroImage: "/discover/city-of-arts-and-sciences.png",
    heroImageAlt: "Futuristic white Calatrava architecture reflected in turquoise pool at City of Arts and Sciences",
    title: "City of Arts & Sciences — Valencia Visitor Guide",
    description: "Complete guide to Valencia's City of Arts and Sciences. Oceanogràfic, Hemisfèric, Science Museum — tickets, tips, and what's worth your time.",
    keywords: ["City of Arts and Sciences Valencia", "Oceanogràfic", "Calatrava Valencia", "Ciudad de las Artes"],
    date: "2026-06-18",
    lastUpdated: "2026-06-18",
    audiences: ["families", "couples", "mobility-needs"],
    region: "Valencia City",
    distanceFromValencia: "20 min walk from city centre",
    hubs: ["attractions"],
    overview: {
      paragraphs: [
        "The City of Arts and Sciences (Ciudad de las Artes y las Ciencias) is Valencia's most iconic landmark — a cluster of futuristic white buildings designed by architect Santiago Calatrava, set in the drained bed of the old Turia River. Love it or hate it architecturally, it's visually stunning and genuinely impressive in person.",
        "The complex contains Europe's largest aquarium (Oceanogràfic), an IMAX cinema in a building shaped like a giant eye (Hemisfèric), a hands-on science museum (Museu de les Ciències), and an opera house (Palau de les Arts). You could spend a full day here, or just an afternoon walking the grounds for free.",
        "For families, it's the top attraction in Valencia. The Oceanogràfic alone justifies the visit — it's world-class, with beluga whales, sharks, penguins, and a 30-metre underwater tunnel. The Science Museum is excellent for older kids with interactive exhibits.",
      ],
      quickFacts: [
        { label: "Tickets", value: "Oceanogràfic €34, combo deals available" },
        { label: "Time needed", value: "3-5 hours (Oceanogràfic alone: 2-3h)" },
        { label: "Free areas", value: "Grounds, gardens, exterior architecture" },
        { label: "Getting there", value: "20 min walk, or bus 35/95" },
      ],
    },
    highlights: [
      {
        name: "Oceanogràfic",
        description: "Europe's largest aquarium, with over 45,000 animals from 500 species. The shark tunnel, beluga whales, dolphin show, and Arctic zone are standouts. Allow 2-3 hours minimum.",
        icon: "🐬",
        tip: "Buy tickets online — the queue at the entrance can be 30+ minutes in summer. The dolphin show runs 3-4 times daily; check the schedule on arrival.",
      },
      {
        name: "Hemisfèric (IMAX Cinema)",
        description: "An IMAX and planetarium inside a building shaped like a giant eye. The architecture is the real star — the building reflects perfectly in the surrounding pools. Shows run every 45 minutes.",
        icon: "👁️",
        tip: "The reflection photos are best in the morning or late afternoon when there's no wind. Evening illumination is spectacular.",
      },
      {
        name: "Museu de les Ciències",
        description: "A huge interactive science museum — best for kids aged 6-14. Exhibits cover space, the human body, and technology. The DNA climbing structure is a highlight.",
        icon: "🔬",
        tip: "Skip if you only have half a day — the Oceanogràfic is the better use of time for most visitors.",
      },
      {
        name: "Free Grounds & Architecture",
        description: "Even without buying tickets, walking the grounds is free and worth doing. The buildings are extraordinary — stark white bone-like structures reflected in turquoise pools. Some of the best photos in Valencia.",
        icon: "📸",
      },
    ],
    gettingThere: {
      summary: "The City of Arts and Sciences sits at the eastern end of the Turia Gardens — walkable from the city centre or quick by bus.",
      options: [
        { mode: "walk", description: "Follow the Turia Gardens east — it's a beautiful, shaded walk along the former riverbed. Flat the entire way.", duration: "20 min from Ruzafa, 35 min from old town" },
        { mode: "bus", description: "Lines 35 and 95 stop directly at the complex. Line 1 from the beach is also useful.", cost: "€1.50" },
        { mode: "bike", description: "The Turia Gardens cycle path runs right past. Valenbisi stations at the entrance.", duration: "15 min from centre" },
      ],
    },
    bestTimeToVisit: {
      summary: "Mornings are less crowded. The grounds are stunning at sunset and after dark when illuminated.",
      seasons: [
        { season: "spring", description: "Perfect — comfortable for outdoor walking, reasonable crowds. The pools are full and reflections are beautiful.", rating: 5 },
        { season: "summer", description: "Very hot outdoors but the Oceanogràfic is air-conditioned. Go early or late afternoon. Expect peak crowds.", rating: 3 },
        { season: "autumn", description: "Excellent — warm enough for outdoor enjoyment, thinner crowds than summer.", rating: 5 },
        { season: "winter", description: "Quietest time. The indoor venues are perfect for cool days. Reflection pools may be partially drained.", rating: 3 },
      ],
    },
    accessibility: {
      overallRating: 5,
      summary: "The entire complex was designed to be fully accessible. All venues have lift access, adapted toilets, and ramps. The grounds are flat and paved. Wheelchair rental available at the Oceanogràfic.",
      wheelchairNotes: "Fully accessible throughout. The Oceanogràfic provides free wheelchair loans. The underwater tunnel and all exhibits are accessible. The dolphin show has reserved wheelchair seating.",
      strollerNotes: "Excellent — the grounds are completely flat and stroller-friendly. The Oceanogràfic interior is spacious enough for strollers throughout. No need to fold.",
      publicTransportAccess: "Bus stops directly outside are fully accessible. The Turia Gardens path to the complex is flat and paved.",
    },
    practicalTips: [
      "Buy combo tickets online — Oceanogràfic + Hemisfèric is better value than individual tickets.",
      "The Oceanogràfic alone needs 2-3 hours. Don't try to rush it.",
      "Bring water and sunscreen if walking the grounds in summer — there's minimal shade outside.",
      "The restaurant inside the Oceanogràfic (Submarino) lets you eat surrounded by fish — worth booking for the novelty, though the food is average.",
    ],
    productWidgets: [
      { categorySlug: "baby-gear", heading: "Visiting with kids?", afterSection: "Accessibility" },
      { categorySlug: "mobility", heading: "Need mobility support?", afterSection: "Accessibility" },
    ],
    relatedDestinations: ["malvarrosa-beach", "ruzafa"],
    relatedBlogPosts: ["valencia-with-kids-complete-guide"],
    faqs: [
      { question: "How much do City of Arts and Sciences tickets cost?", answer: "Oceanogràfic: €34 adult, €26 child. Hemisfèric: €9. Science Museum: €9. Combo tickets available from €30-40 for 2-3 venues. Buy online to skip queues." },
      { question: "Is the City of Arts and Sciences worth visiting?", answer: "Yes — even if you only visit the Oceanogràfic, it's one of the best aquariums in Europe. The grounds are free to walk and photograph. For families, it's Valencia's #1 attraction." },
      { question: "How long do you need at the City of Arts and Sciences?", answer: "3-5 hours for a good visit. The Oceanogràfic alone takes 2-3 hours. If you add the Hemisfèric or Science Museum, plan a full day." },
    ],
  },
];
