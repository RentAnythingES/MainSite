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
  productSlug: string;
  context: string;
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
        { name: "Canalla Bistro", type: "Creative Fusion", priceRange: "€€€", tip: "Book dinner. Lunch walk-ins possible.", familyFriendly: false },
        { name: "Casa Baldo 1915", type: "Traditional Valencian", priceRange: "€€", tip: "Try the esmorzaret (Valencian mid-morning snack)", familyFriendly: true },
        { name: "Bluebell Coffee", type: "Specialty Coffee & Brunch", priceRange: "€€", tip: "Weekday mornings for no queues", familyFriendly: true },
        { name: "Copenhagen", type: "Vegetarian Tapas", priceRange: "€€", familyFriendly: true },
        { name: "Nozomi Sushi Bar", type: "Japanese", priceRange: "€€€", tip: "Stunning interior — worth the splurge", familyFriendly: false },
        { name: "Dulce de Leche", type: "Bakery & Cakes", priceRange: "€", tip: "Go on a weekday — weekend queues are long", familyFriendly: true },
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
      {
        productSlug: "ergonomic-chair",
        context: "Working from your Ruzafa apartment? Most rentals come with a kitchen chair that's painful after 2 hours. An ergonomic office chair transforms your productivity — and your back.",
        afterSection: "Neighbourhoods for Remote Workers",
      },
      {
        productSlug: "compact-stroller",
        context: "Ruzafa's flat, wide streets are ideal for strollers. Our compact model folds one-handed — perfect for hopping between cafes and the market.",
        afterSection: "For Families",
      },
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
];
