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

export type HubType = "neighbourhoods" | "beaches" | "day-trips" | "attractions" | "events";

export type GuideRefreshClass =
  | "evergreen"
  | "six-month"
  | "annual-event"
  | "seasonal";

export interface GuideSource {
  label: string;
  url: string;
  publisher: string;
  supports: string[];
  checkedAt: string;
}

export interface DestinationGovernance {
  refreshClass: GuideRefreshClass;
  contentReviewedAt: string;
  nextReviewAt: string;
  sources: GuideSource[];
}

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
    /** Internal: official venue or authoritative tourism source. Not rendered. */
    sourceUrl: string;
    /** Internal: ISO date when the source and venue status were last checked. Not rendered. */
    sourceCheckedAt: string;
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

export type HeroImageProvenance =
  | {
      status: "licensed";
      creator: string;
      sourceUrl: string;
      license: string;
      licenseUrl: string;
      verifiedAt: string;
      modifications: string;
    }
  | {
      status: "unverified";
    };

// ===== CORE INTERFACE =====

export interface Destination {
  // Identity
  slug: string;
  name: string;
  type: DestinationType;
  tagline: string;
  heroImage?: string;
  heroImageAlt?: string;
  heroImageProvenance: HeroImageProvenance;

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

export const destinationGovernance: Record<string, DestinationGovernance> = {
  ruzafa: {
    refreshClass: "six-month",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-20",
    sources: [{
      label: "Ruzafa neighbourhood guide",
      url: "https://www.visitvalencia.com/en/what-to-see-valencia/ruzafa-and-ensanche/ruzafa-neighborhood",
      publisher: "Visit Valencia",
      supports: ["neighbourhood character", "location", "visitor highlights"],
      checkedAt: "2026-07-20",
    }],
  },
  "malvarrosa-beach": {
    refreshClass: "seasonal",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-04-01",
    sources: [{
      label: "Valencia beaches overview",
      url: "https://www.visitvalencia.com/en/what-to-see-valencia",
      publisher: "Visit Valencia",
      supports: ["beach location", "public access", "visitor context"],
      checkedAt: "2026-07-20",
    }],
  },
  fallas: {
    refreshClass: "annual-event",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-15",
    sources: [{
      label: "Official Fallas guide",
      url: "https://www.visitvalencia.com/en/events-valencia/festivities/the-fallas",
      publisher: "Visit Valencia",
      supports: ["festival format", "recurrence", "major traditions"],
      checkedAt: "2026-07-20",
    }],
  },
  albufera: {
    refreshClass: "six-month",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-20",
    sources: [{
      label: "Valencia areas and Albufera overview",
      url: "https://www.visitvalencia.com/en/what-to-see-valencia/neighbourhoods-and-areas-valencia",
      publisher: "Visit Valencia",
      supports: ["distance", "transport", "visitor activities"],
      checkedAt: "2026-07-20",
    }],
  },
  "city-of-arts-and-sciences": {
    refreshClass: "six-month",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-20",
    sources: [{
      label: "City of Arts and Sciences visitor guide",
      url: "https://www.visitvalencia.com/en/what-to-see-valencia/city-of-arts-and-sciences/what-to-see",
      publisher: "Visit Valencia",
      supports: ["complex layout", "main venues", "visit planning"],
      checkedAt: "2026-07-20",
    }],
  },
  "el-carmen": {
    refreshClass: "six-month",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-20",
    sources: [{
      label: "El Carmen neighbourhood guide",
      url: "https://www.visitvalencia.com/en/what-to-see-valencia/historical-centre/del-carmen-neighborhood",
      publisher: "Visit Valencia",
      supports: ["history", "location", "visitor highlights"],
      checkedAt: "2026-07-20",
    }],
  },
  cabanyal: {
    refreshClass: "six-month",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-20",
    sources: [{
      label: "El Cabanyal visitor guide",
      url: "https://blog.visitvalencia.com/en/explore-el-cabanyal-valencias-trendy-neighbourhood",
      publisher: "Visit Valencia",
      supports: ["neighbourhood character", "architecture", "visitor activities"],
      checkedAt: "2026-07-20",
    }],
  },
  benimaclet: {
    refreshClass: "six-month",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-20",
    sources: [{
      label: "Valencia neighbourhoods overview",
      url: "https://www.visitvalencia.com/en/what-to-see-valencia/neighbourhoods-and-areas-valencia",
      publisher: "Visit Valencia",
      supports: ["city district context", "visitor orientation"],
      checkedAt: "2026-07-20",
    }],
  },
  "turia-gardens": {
    refreshClass: "six-month",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-20",
    sources: [
      {
        label: "Turia Gardens visitor guide",
        url: "https://www.visitvalencia.com/en/what-to-do-valencia/nature-in-valencia/parks-and-gardens-valencia/turia-gardens",
        publisher: "Visit Valencia",
        supports: ["route", "history", "facilities"],
        checkedAt: "2026-07-20",
      },
      {
        label: "Turia Gardens accessibility guide",
        url: "https://www.visitvalencia.com/en/valencia-accesible/turia-garden",
        publisher: "Visit Valencia",
        supports: ["access", "surfaces", "accessible facilities"],
        checkedAt: "2026-07-20",
      },
    ],
  },
  "el-ensanche": {
    refreshClass: "six-month",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-20",
    sources: [{
      label: "Valencia neighbourhoods overview",
      url: "https://www.visitvalencia.com/en/what-to-see-valencia/neighbourhoods-and-areas-valencia",
      publisher: "Visit Valencia",
      supports: ["Ensanche character", "shopping", "visitor orientation"],
      checkedAt: "2026-07-20",
    }],
  },
  sagunto: {
    refreshClass: "six-month",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-20",
    sources: [{
      label: "Sagunto official tourism portal",
      url: "https://turismo.sagunto.es/en/",
      publisher: "Sagunto Tourism",
      supports: ["historic sites", "visitor orientation", "destination context"],
      checkedAt: "2026-07-20",
    }],
  },
  requena: {
    refreshClass: "six-month",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-20",
    sources: [{
      label: "Requena municipal tourism portal",
      url: "https://www.requena.es/",
      publisher: "Ayuntamiento de Requena",
      supports: ["destination context", "municipal visitor information"],
      checkedAt: "2026-07-20",
    }],
  },
  "patacona-beach": {
    refreshClass: "seasonal",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-04-01",
    sources: [{
      label: "Valencia beaches overview",
      url: "https://www.visitvalencia.com/en/what-to-see-valencia",
      publisher: "Visit Valencia",
      supports: ["beach location", "transport context", "visitor orientation"],
      checkedAt: "2026-07-20",
    }],
  },
  xativa: {
    refreshClass: "six-month",
    contentReviewedAt: "2026-07-20",
    nextReviewAt: "2027-01-20",
    sources: [{
      label: "Xàtiva official tourism portal",
      url: "https://xativaturismo.com/en/",
      publisher: "Xàtiva Tourist Board",
      supports: ["castle", "heritage", "visitor information"],
      checkedAt: "2026-07-20",
    }],
  },
};

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

export function getDestinationGovernance(slug: string): DestinationGovernance | undefined {
  return destinationGovernance[slug];
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
    heroImage: "/discover/ruzafa.webp",
    heroImageAlt: "Carrer de Russafa in central Valencia, looking along the neighbourhood's main shopping street",
    heroImageProvenance: {
      status: "licensed",
      creator: "Joanbanjo",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Carrer_de_Russafa,_Val%C3%A8ncia.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
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
        { name: "Canalla Bistro", type: "Creative fusion", priceRange: "€€€", tip: "Reserve ahead for dinner and check the current menu before visiting.", familyFriendly: false, sourceNote: "Official site confirms the Ricard Camarena concept and Maestro José Serrano location.", sourceUrl: "https://www.canallabistro.com/en/home/", sourceCheckedAt: "2026-07-19" },
        { name: "Bluebell Coffee", type: "Specialty coffee & brunch", priceRange: "€€", tip: "A practical daytime stop; the official site currently lists opening hours until 16:00.", familyFriendly: true, sourceNote: "Official venue site confirms the Buenos Aires 3 location and current daytime hours.", sourceUrl: "https://bluebellcoffeeco.com/contacto/", sourceCheckedAt: "2026-07-19" },
        { name: "Copenhagen", type: "Vegetarian restaurant", priceRange: "€€", tip: "Check the weekly lunch menu or reserve by phone for dinner.", familyFriendly: true, sourceNote: "Official restaurant site confirms its plant-led menu and Literato Azorín location in Russafa.", sourceUrl: "https://restaurantecopenhagen.es/", sourceCheckedAt: "2026-07-19" },
        { name: "Nozomi Sushi Bar", type: "Japanese", priceRange: "€€€", tip: "Reservations are advisable; opening days and service times are limited.", familyFriendly: false, sourceNote: "Official venue site confirms the Pedro III El Grande location and current service schedule.", sourceUrl: "https://nozomisushibar.es/en/contact/", sourceCheckedAt: "2026-07-19" },
        { name: "Dulce de Leche", type: "Bakery & cakes", priceRange: "€", tip: "Allow extra time at popular breakfast and weekend periods.", familyFriendly: true, sourceNote: "Current business directory record confirms the Ruzafa venue at Pintor Gisbert 2.", sourceUrl: "https://www.paginasamarillas.es/f/valencia/dulce-de-leche-boutique-s-l-_225480516_000000001.html", sourceCheckedAt: "2026-07-19" },
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
      { categorySlug: "mobility", heading: "Need mobility support?", afterSection: "Accessibility" },
      { categorySlug: "baby-gear", heading: "Travelling with kids?", afterSection: "Where to Eat & Drink" },
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
    heroImage: "/discover/malvarrosa-beach.webp",
    heroImageAlt: "Malvarrosa Beach in Valencia at sunset, with the Mediterranean and beachfront skyline",
    heroImageProvenance: {
      status: "licensed",
      creator: "Manuel Martín Vicente",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Playa_de_la_Malvarrosa_(Valencia)_01.jpg",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
    title: "Malvarrosa Beach Guide — Valencia's Best Urban Beach",
    description: "Complete guide to Malvarrosa Beach in Valencia. Amenities, accessibility, chiringuitos, best times, and practical tips from locals.",
    keywords: ["Malvarrosa beach Valencia", "Valencia beach guide", "best beach Valencia", "Malvarrosa"],
    date: "2026-06-18",
    lastUpdated: "2026-06-18",
    audiences: ["families", "couples", "mobility-needs"],
    region: "Valencia City",
    distanceFromValencia: "20 min from city centre",
    hubs: ["beaches"],
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
        { name: "La Pepica", type: "Traditional rice restaurant", priceRange: "€€€", tip: "Reserve for weekend lunch and confirm current service hours directly.", familyFriendly: true, sourceNote: "Official site confirms the beachfront Avenida Neptuno restaurant, rice menu and current hours.", sourceUrl: "https://lapepica.com/menu/", sourceCheckedAt: "2026-07-19" },
        { name: "Casa Carmela", type: "Wood-fired paella", priceRange: "€€€", tip: "Reserve ahead and order rice for the table rather than as an individual dish.", familyFriendly: true, sourceNote: "Official site confirms its Isabel de Villena location and wood-fired paella tradition since 1922.", sourceUrl: "https://www.casa-carmela.com/es/", sourceCheckedAt: "2026-07-19" },
        { name: "La Más Bonita", type: "Beachfront café & brunch", priceRange: "€€", tip: "Check the current location hours before relying on it for a specific meal time.", familyFriendly: true, sourceNote: "Official group site confirms the Valencia beachfront venue and current operating locations.", sourceUrl: "https://www.lamasbonita.es/", sourceCheckedAt: "2026-07-19" },
      ],
      localSpeciality: "Order paella Valenciana (chicken, rabbit, beans) or arroz a banda (fish stock rice). Never order paella for dinner — it's a lunch dish in Valencia.",
    },
    practicalTips: [
      "Bring your own shade — chiringuito sunbed rental is €9-10 each and the good spots fill up by 11am in summer.",
      "Apply sunscreen before arriving. The UV index in Valencia hits 9-10+ in summer — burns happen fast.",
      "The showers and foot-wash stations are free and located at regular intervals along the promenade.",
      "If you're coming with kids, the southern end near the port is slightly less crowded than the main central section.",
    ],
    visitingHere: {
      summary: "Malvarrosa works as a short promenade visit or a full beach day. Decide whether you mainly want a swim, a long lunch, accessible seafront time or a complete family setup before choosing where to stop.",
      idealDuration: "3-6 hours",
      bestTimeOfDay: "Morning for space and gentler heat; late afternoon for a promenade walk",
      tips: [
        "Use the promenade as your orientation point and choose a section before carrying equipment onto the sand.",
        "Check the current beach flag, lifeguard coverage and assisted-bathing arrangements on the day of your visit.",
        "Reserve a beachfront lunch separately from any equipment booking, especially on summer weekends.",
      ],
    },
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
    heroImage: "/discover/fallas.webp",
    heroImageAlt: "A falla monument burning during La Cremà, the closing night of Valencia's Fallas festival",
    heroImageProvenance: {
      status: "licensed",
      creator: "ChiralJon",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:La_Crema_Fallas.jpg",
      license: "CC BY 2.0",
      licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
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
    visitingHere: {
      summary: "A Fallas visit needs a route rather than a checklist. Choose one or two neighbourhoods, leave generous walking time and use the official programme for that year's confirmed event locations and access restrictions.",
      idealDuration: "Half a day for neighbourhood fallas; a full day for several major events",
      bestTimeOfDay: "Daytime for families and sculpture viewing; evening for lights and atmosphere",
      tips: [
        "Check the current official programme before leaving because routes, closures and event times can change.",
        "Avoid trying to cross the city quickly; crowds and temporary barriers make short distances take much longer.",
        "Plan a quieter meeting point away from the busiest squares in case your group becomes separated.",
      ],
    },
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
    heroImage: "/discover/albufera.webp",
    heroImageAlt: "View across Albufera lagoon from the bow of a traditional wooden boat",
    heroImageProvenance: {
      status: "licensed",
      creator: "Co3lacanto",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sunset_at_Albufera.JPG",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
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
    visitingHere: {
      summary: "Albufera is easiest as a planned half-day trip built around one main experience: a boat ride, a meal in El Palmar, birdwatching or a walking route. Combining everything requires careful transport timing.",
      idealDuration: "4-6 hours",
      bestTimeOfDay: "Late afternoon if sunset is the priority; lunchtime for paella in El Palmar",
      tips: [
        "Check the return transport before choosing a sunset boat so you are not stranded after the last practical connection.",
        "Book restaurants and boat trips separately when visiting on weekends or during holiday periods.",
        "Bring water, sun protection and seasonal insect repellent; shade is limited away from the village.",
      ],
    },
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
    heroImage: "/discover/city-of-arts-and-sciences.webp",
    heroImageAlt: "The Hemisfèric and surrounding architecture reflected in the pools at Valencia's City of Arts and Sciences",
    heroImageProvenance: {
      status: "licensed",
      creator: "Diego Delso, delso.photo",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Ciudad_de_las_Artes_y_las_Ciencias,_Valencia,_Espa%C3%B1a,_2014-06-29,_DD_39.JPG",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
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
    visitingHere: {
      summary: "The complex can be a free architecture stop, a focused museum visit or a full attraction day. Choose the buildings you genuinely want to enter before buying tickets, because distances and indoor visit times add up.",
      idealDuration: "2 hours for the exterior; 4-8 hours with ticketed attractions",
      bestTimeOfDay: "Opening time for major attractions; late afternoon for exterior photography",
      tips: [
        "Pre-book the specific ticketed attractions you want rather than assuming one short visit covers the whole complex.",
        "Allow walking time between buildings and identify a meeting point if your group splits up.",
        "Use the Turia Gardens route for a flatter approach and bring sun protection for the exposed outdoor areas.",
      ],
    },
    productWidgets: [
      { categorySlug: "mobility", heading: "Need mobility support?", afterSection: "Accessibility" },
      { categorySlug: "baby-gear", heading: "Visiting with kids?", afterSection: "Practical Tips" },
    ],
    relatedDestinations: ["malvarrosa-beach", "ruzafa"],
    relatedBlogPosts: ["valencia-with-kids-complete-guide"],
    faqs: [
      { question: "How much do City of Arts and Sciences tickets cost?", answer: "Oceanogràfic: €34 adult, €26 child. Hemisfèric: €9. Science Museum: €9. Combo tickets available from €30-40 for 2-3 venues. Buy online to skip queues." },
      { question: "Is the City of Arts and Sciences worth visiting?", answer: "Yes — even if you only visit the Oceanogràfic, it's one of the best aquariums in Europe. The grounds are free to walk and photograph. For families, it's Valencia's #1 attraction." },
      { question: "How long do you need at the City of Arts and Sciences?", answer: "3-5 hours for a good visit. The Oceanogràfic alone takes 2-3 hours. If you add the Hemisfèric or Science Museum, plan a full day." },
    ],
  },

  // ===== EL CARMEN =====
  {
    slug: "el-carmen",
    name: "El Carmen",
    type: "neighbourhood",
    tagline: "Medieval walls, street art, and the beating heart of Valencia's old town",
    heroImage: "/discover/el-carmen-hero.webp",
    heroImageAlt: "Carrer de Baix pedestrian street through the historic El Carmen neighbourhood in Valencia",
    heroImageProvenance: {
      status: "licensed",
      creator: "Joanbanjo",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Carrer_de_Baix_(Val%C3%A8ncia).JPG",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
    title: "El Carmen, Valencia — Guide to the Historic Old Town",
    description: "Explore El Carmen in Valencia's old town, from medieval towers and street art to tapas bars, family-friendly plazas and practical visitor tips.",
    keywords: ["El Carmen Valencia", "Valencia old town", "Barrio del Carmen", "Valencia historic centre", "street art Valencia"],
    date: "2026-06-20",
    lastUpdated: "2026-06-20",
    audiences: ["families", "couples", "digital-nomads", "elderly"],
    region: "Valencia Centre",
    hubs: ["neighbourhoods"],
    overview: {
      paragraphs: [
        "El Carmen is Valencia's oldest neighbourhood — a labyrinth of narrow medieval streets tucked between the Torres de Serranos and Torres de Quart, two of the city's iconic 14th-century gate towers. This is where Valencia's 2,000-year history comes alive, layered with Roman ruins, Arabic walls, Gothic churches, and an explosion of modern street art.",
        "By day, El Carmen is a family-friendly stroll through history: the Central Market (one of Europe's largest fresh food markets), the Silk Exchange (UNESCO World Heritage), and the Cathedral where some believe the Holy Grail is kept. By evening, the neighbourhood transforms into Valencia's most vibrant bar and tapas district, with terraces spilling onto every plaza.",
        "For visitors, El Carmen is the quintessential Valencia experience. The cobblestoned streets are pedestrian-friendly (though uneven surfaces can challenge strollers and wheelchairs), the food is outstanding, and you can walk to most major attractions. It's busy and noisy — that's the charm.",
      ],
      quickFacts: [
        { label: "Getting there", value: "Metro L3/L5 Àngel Guimerà or walk from Plaça de l'Ajuntament" },
        { label: "Best for", value: "History, food, nightlife, street art, photography" },
        { label: "Vibe", value: "Bohemian, historic, lively" },
        { label: "Walkability", value: "Excellent (all pedestrian)" },
      ],
    },
    highlights: [
      {
        name: "Torres de Serranos",
        description: "Valencia's most impressive medieval gate tower. Climb to the top for panoramic views of the old town and Turia Gardens. Free on Sundays.",
        icon: "🏰",
        tip: "Go at sunset for golden light. The view is worth the stairs (no lift).",
        googleMapsUrl: "https://maps.google.com/?q=Torres+de+Serranos+Valencia",
      },
      {
        name: "Mercado Central",
        description: "Europe's largest operating fresh food market in a stunning Art Nouveau building. Over 1,200 stalls selling Valencia's finest produce, jamón, seafood, and spices.",
        icon: "🍊",
        tip: "Go before 11am to beat the crowds. The freshly squeezed Valencia orange juice is the best in the city.",
        googleMapsUrl: "https://maps.google.com/?q=Mercado+Central+Valencia",
      },
      {
        name: "Street Art Walking Route",
        description: "El Carmen has one of Spain's best street art scenes. Start at Plaça del Tossal, wander through Calle de Caballeros, and explore the streets around IVAM (the modern art museum). New murals appear regularly.",
        icon: "🎨",
        tip: "The best murals are on Carrer de Dalt, Carrer dels Horts, and around the old Arabic wall ruins.",
      },
      {
        name: "La Lonja de la Seda",
        description: "The 15th-century Silk Exchange is a UNESCO World Heritage Site and one of the finest Gothic civic buildings in Europe. The spiral columns in the main hall are architectural poetry.",
        icon: "🏛️",
        tip: "Free entry on Sundays. The interior takes 20 minutes — well worth combining with a Mercado Central visit next door.",
        googleMapsUrl: "https://maps.google.com/?q=La+Lonja+de+la+Seda+Valencia",
      },
      {
        name: "Valencia Cathedral & Holy Grail",
        description: "The cathedral blends Romanesque, Gothic, Baroque, and Neoclassical styles. Climb the Miguelete bell tower (207 steps) for the best 360° view in Valencia. The chapel houses what the Vatican recognises as the Holy Grail.",
        icon: "⛪",
        tip: "Buy combined ticket for cathedral + Miguelete tower. Go early — the tower queue gets long after 11am.",
        googleMapsUrl: "https://maps.google.com/?q=Valencia+Cathedral",
      },
    ],
    gettingThere: {
      summary: "El Carmen is in the absolute centre. Most visitors walk in from wherever they're staying.",
      options: [
        { mode: "walk", description: "From Plaça de l'Ajuntament: 10 minutes north through pedestrian streets", duration: "10 min" },
        { mode: "metro", description: "Àngel Guimerà (L3/L5) or Colón (L3/L5/L7), then 5-10 minute walk", duration: "5-10 min walk from station", cost: "€1.50" },
        { mode: "bus", description: "Lines 5, 28, 95 stop on the perimeter. The centre is car-free.", duration: "Varies", cost: "€1.50" },
      ],
      parkingNotes: "Driving into El Carmen is nearly impossible — most streets are pedestrianised. Park at Parking Porta de la Mar or Parking Blanquerías on the perimeter (€15-20/day).",
    },
    bestTimeToVisit: {
      summary: "El Carmen is good year-round but busiest in summer evenings.",
      seasons: [
        { season: "spring", description: "Perfect — Las Fallas energy lingers, terraces are open, manageable crowds.", rating: 5 },
        { season: "summer", description: "Hot during the day (35°C+). Come early morning for the market, late evening for tapas. Siesta hours (2-5pm) are quiet.", rating: 3 },
        { season: "autumn", description: "Ideal temperatures, fewer tourists, all attractions open. The local favourite season.", rating: 5 },
        { season: "winter", description: "Mild (10-16°C). Christmas markets around the Cathedral. Some outdoor terraces close.", rating: 4 },
      ],
    },
    whatToBring: {
      bring: ["Comfortable walking shoes (cobblestones!)", "Camera for street art", "Small daypack", "Water bottle in summer"],
      dontBring: ["Heavy luggage", "High heels", "Car (pedestrianised)"],
      rentInstead: ["Stroller with good suspension for cobblestones", "Wheelchair (cobblestones are challenging — plan routes)", "Portable Wi-Fi for navigation"],
    },
    accessibility: {
      overallRating: 2,
      summary: "El Carmen's medieval charm comes with accessibility challenges. Cobblestone streets, narrow alleys, and stepped entrances are common. The main plazas and market are accessible, but side streets can be very difficult for wheelchairs.",
      wheelchairNotes: "Stick to the main streets: Calle de Caballeros, Plaça de la Verge, and Plaça de la Reina are the smoothest routes. The Mercado Central has step-free access. Torres de Serranos and Miguelete tower are stairs only.",
      strollerNotes: "A compact stroller with good suspension is essential. Bulky pushchairs struggle on the narrow cobblestone streets. The market and main plazas are manageable.",
      publicTransportAccess: "Metro stations have lifts. Once in El Carmen, it's all on foot.",
    },
    foodAndDrink: {
      summary: "El Carmen is tapas paradise. From traditional Valencian bars with €2 cañas to trendy wine bars, every price point is represented.",
      recommendations: [
        { name: "Mercado Central", type: "Market / fresh food", priceRange: "€", tip: "Visit in the morning and check official market hours before planning a meal around it.", familyFriendly: true, sourceNote: "Valencia City Council confirms the market location and morning trading pattern.", sourceUrl: "https://www.valencia.es/es/-/mercado-centr-1", sourceCheckedAt: "2026-07-19" },
        { name: "Café de las Horas", type: "Cocktail bar / baroque café", priceRange: "€€", tip: "Known for Agua de Valencia; use the current menu and booking details on the venue site.", familyFriendly: true, sourceNote: "Official venue site confirms its city-centre location, menu and Agua de Valencia focus.", sourceUrl: "https://cafedelashoras.com/", sourceCheckedAt: "2026-07-19" },
        { name: "La Pilareta", type: "Traditional tapas bar", priceRange: "€€", tip: "Clóchinas are seasonal, so check availability rather than assuming they are always on the menu.", familyFriendly: false, sourceNote: "Visit Valencia identifies La Pilareta at Moro Zeid 13 as a traditional place for seasonal clóchinas.", sourceUrl: "https://www.visitvalencia.com/en/what-to-do-valencia/gastronomy/what-to-eat/tapas", sourceCheckedAt: "2026-07-19" },
        { name: "Horchatería Santa Catalina", type: "Horchata & pastries", priceRange: "€€", tip: "A central stop for horchata and fartons; confirm seasonal opening times directly.", familyFriendly: true, sourceNote: "Official venue site confirms the historic-centre location and horchata, fartons and chocolate menu.", sourceUrl: "https://www.horchateriasantacatalina.com/menu/", sourceCheckedAt: "2026-07-19" },
      ],
      localSpeciality: "Horchata and fartons — a sweet tiger nut milk drink with elongated pastries. Try it at Horchatería Santa Catalina, the most famous in the city.",
    },
    stayingHere: {
      summary: "Staying in El Carmen puts you at the centre of everything. You can walk to every major sight, eat incredible food on your doorstep, and experience Valencia's nightlife without a taxi. The trade-off: noise and narrow streets.",
      pros: ["Walk to everything", "Best food and bar scene", "Atmospheric historical setting", "Central location for day trips"],
      cons: ["Noisy at night (especially Thursday-Saturday)", "Cobblestones challenging for mobility", "Limited parking", "Apartments can be small and old"],
      gettingElsewhere: ["Walk to Turia Gardens in 5 minutes", "Metro to beach in 15 minutes", "Walk to Ruzafa in 15 minutes"],
    },
    visitingHere: {
      summary: "A half-day minimum to see the main sights. A full day to properly explore the streets, eat well, and soak in the atmosphere.",
      idealDuration: "4-6 hours",
      bestTimeOfDay: "Morning for the market and sights, evening for tapas and atmosphere",
      tips: [
        "Start at Mercado Central (opens 7:30am), then La Lonja next door, then the Cathedral.",
        "After lunch, wander the street art around IVAM and the Arabic wall ruins.",
        "Come back at sunset for Torres de Serranos views, then stay for dinner.",
      ],
    },
    practicalTips: [
      "Wear flat shoes with grip — cobblestones are uneven and slippery when wet.",
      "The Central Market closes at 3pm and is closed Sundays. Plan accordingly.",
      "Free walking tours depart from Plaça de la Verge daily at 10am — tip-based, excellent quality.",
      "Pickpockets operate around the market and cathedral. Keep valuables in front pockets.",
      "Most tapas bars have limited seating — standing at the bar is normal and expected.",
    ],
    audienceTips: [
      {
        audience: "families",
        tips: [
          "The puppet museum (Museu de l'Iber) near Plaça del Carme is a hidden gem for kids.",
          "The Cathedral has a lift to a viewing level (not the tower), useful with little ones.",
          "Kids love the Mercado Central — let them pick fruits and pastries.",
        ],
      },
      {
        audience: "mobility-needs",
        tips: [
          "Stick to the main east-west street (Calle de Caballeros) for the smoothest route.",
          "The Mercado Central is accessible. La Lonja has step-free access to the main hall.",
          "Consider renting a lightweight wheelchair — heavier models struggle on cobblestones.",
        ],
      },
      {
        audience: "digital-nomads",
        tips: [
          "Ubik Café (Calle del Literat Azorín, technically Ruzafa) is the closest top-tier work café.",
          "Many bars in El Carmen have Wi-Fi but it's unreliable. A portable hotspot is safer.",
          "The IVAM museum has a quiet café with decent Wi-Fi.",
        ],
      },
    ],
    productWidgets: [
      { categorySlug: "mobility", heading: "Navigating cobblestones? We can help", afterSection: "Accessibility" },
      { categorySlug: "baby-gear", heading: "Exploring El Carmen with little ones?", afterSection: "Practical Tips" },
    ],
    relatedDestinations: ["ruzafa", "fallas", "city-of-arts-and-sciences"],
    relatedBlogPosts: ["valencia-with-kids-complete-guide", "accessible-valencia-complete-guide"],
    faqs: [
      { question: "Is El Carmen safe at night?", answer: "Generally yes. The main streets and plazas are busy and well-lit until late. As with any city centre, be aware of your belongings and avoid completely deserted alleys very late at night." },
      { question: "Can I drive in El Carmen?", answer: "Most of El Carmen is pedestrianised or restricted. Park on the perimeter (Parking Blanquerías or Porta de la Mar) and walk in. It's only a few minutes on foot." },
      { question: "What's the best time to visit Mercado Central?", answer: "Go between 8-10am for the best atmosphere with fewer tourists. The market closes at 3pm Monday-Saturday and is closed all day Sunday." },
    ],
  },

  // ===== CABANYAL =====
  {
    slug: "cabanyal",
    name: "Cabanyal",
    type: "neighbourhood",
    tagline: "Valencia's colourful maritime village reborn as the city's coolest beach quarter",
    heroImage: "/discover/cabanyal-hero.webp",
    heroImageAlt: "Carrer de la Reina through Valencia's historic Cabanyal maritime neighbourhood",
    heroImageProvenance: {
      status: "licensed",
      creator: "Joanbanjo",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Carrer_de_la_Reina,_Cabanyal,_Pa%C3%ADs_Valenci%C3%A0.JPG",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
    title: "Cabanyal, Valencia — Guide to the Maritime Beach Quarter",
    description: "Discover Cabanyal, Valencia's maritime neighbourhood, with colourful tiled houses, local restaurants, Las Arenas beach and practical visitor tips.",
    keywords: ["Cabanyal Valencia", "Valencia beach neighbourhood", "Cabanyal guide", "Poblats Marítims Valencia", "Las Arenas beach"],
    date: "2026-06-20",
    lastUpdated: "2026-06-20",
    audiences: ["families", "couples", "digital-nomads", "budget"],
    region: "Maritime Valencia",
    hubs: ["neighbourhoods"],
    overview: {
      paragraphs: [
        "Cabanyal is Valencia's historic fishermen's quarter — a grid of low-rise streets just behind Las Arenas beach, famous for its spectacular colourful tiled facades. Once threatened by demolition plans, the neighbourhood fought back and won protected heritage status. Today it's one of Valencia's most exciting areas: gritty, authentic, and rapidly evolving with craft beer bars, independent galleries, and some of the best seafood restaurants in the city.",
        "The neighbourhood feels like a seaside village within a city. Streets are wide and flat (excellent for strollers and wheelchairs), the Mercado del Cabanyal is a local-only affair with zero tourist inflation, and you can walk to the beach in under 5 minutes from anywhere. The tram runs straight to the city centre in 15 minutes.",
        "Cabanyal is where Valencians actually go to eat paella. The beachfront restaurants (La Pepica, Casa Carmela) are institutions, and the neighbourhood's back streets hide some of the city's best-value tapas. If you want to live like a local near the beach, this is the place.",
      ],
      quickFacts: [
        { label: "Getting there", value: "Tram L4/L6 to La Marina or Eugenia Viñes (15 min from centre)" },
        { label: "Best for", value: "Beach life, paella, architecture, families" },
        { label: "Vibe", value: "Bohemian, maritime, evolving" },
        { label: "Beach access", value: "Las Arenas beach, 2-5 min walk" },
      ],
    },
    highlights: [
      {
        name: "Tiled Facades of Cabanyal",
        description: "The neighbourhood's signature feature: rows of early 20th-century fishermen's houses covered in vibrant ceramic tiles. Each house has a unique design — Art Nouveau, Modernista, geometric, floral. Walk along Calle de la Reina and Calle de los Ángeles for the best concentration.",
        icon: "🎨",
        tip: "The most photogenic stretch is along Calle de la Reina between Calle San Pedro and Calle Padre Luis Navarro.",
      },
      {
        name: "Las Arenas Beach",
        description: "Valencia's main city beach — wide, golden sand, and well-serviced with chiringuitos (beach bars), showers, and lifeguards in summer. The promenade (Paseo Marítimo) runs 3km and is fully accessible.",
        icon: "🏖️",
        tip: "Go early (before 10am) in July-August for your spot. The beach gets packed after midday. Sunsets from here are spectacular.",
        googleMapsUrl: "https://maps.google.com/?q=Playa+Las+Arenas+Valencia",
      },
      {
        name: "Mercado del Cabanyal",
        description: "A real neighbourhood market — no tourist stalls, just locals buying fish straight off the boats, seasonal vegetables, and bakery goods. The building itself is a 1950s modernist gem.",
        icon: "🐟",
        tip: "Go on Saturday morning for the best atmosphere. Try the fish stalls — fresher seafood doesn't exist in Valencia.",
        googleMapsUrl: "https://maps.google.com/?q=Mercado+del+Cabanyal+Valencia",
      },
      {
        name: "La Fábrica de Hielo",
        description: "A converted ice factory turned cultural space with a rooftop terrace bar, live music venue, and rotating art exhibitions. The rooftop views over the port and neighbourhood are excellent.",
        icon: "🎵",
        tip: "Check their Instagram for event listings. The rooftop is best at sunset. Craft beers on tap.",
      },
    ],
    gettingThere: {
      summary: "The tram is the easiest way. Lines 4 and 6 connect Cabanyal to the city centre in about 15 minutes.",
      options: [
        { mode: "tram", description: "Lines L4/L6 from Pont de Fusta (near Turia Gardens) to La Marina or Eugenia Viñes", duration: "15 min", cost: "€1.50" },
        { mode: "bus", description: "Lines 1, 2, 19, 32 from the city centre to various Cabanyal stops", duration: "20 min", cost: "€1.50" },
        { mode: "bike", description: "Flat, easy ride from the city centre via Turia Gardens bike path. Valenbisi bike-share stations throughout the area.", duration: "20 min", cost: "€2 (Valenbisi)" },
        { mode: "walk", description: "From the City of Arts and Sciences, follow the Turia park east. Pleasant 30-minute stroll.", duration: "30 min" },
      ],
      parkingNotes: "Street parking is available but metered and fills fast in summer. The Marina Juan Carlos I car park has ample space (€10-15/day).",
    },
    bestTimeToVisit: {
      summary: "Summer is beach season, but autumn is when the neighbourhood is at its most pleasant without the crowds.",
      seasons: [
        { season: "spring", description: "Lovely — warm enough for beach walks, terraces are open, no summer crowds yet.", rating: 5 },
        { season: "summer", description: "Peak beach season. Hot (35°C+), crowded beaches, but buzzing atmosphere. Come early or late.", rating: 4 },
        { season: "autumn", description: "The best-kept secret: still warm enough to swim (September-October), empty beaches, locals take over.", rating: 5 },
        { season: "winter", description: "Quiet but atmospheric. Paella restaurants are still open. Beach walks are peaceful.", rating: 3 },
      ],
    },
    whatToBring: {
      bring: ["Swimwear and towel", "Sun cream", "Camera for the tiled houses", "Appetite for paella"],
      dontBring: ["Umbrella (it rarely rains)", "Expensive jewellery (beach area)"],
      rentInstead: ["Beach set (umbrella, chairs, toys)", "Stroller for the promenade", "Portable fan for hot days"],
    },
    accessibility: {
      overallRating: 4,
      summary: "Cabanyal is one of Valencia's most accessible neighbourhoods. The streets are flat, wide, and on a grid. The beach promenade is fully paved and accessible. Most restaurants have ground-floor seating.",
      wheelchairNotes: "Excellent accessibility on the main streets. The beach has wooden walkways to the water's edge in summer. The tram has step-free access.",
      strollerNotes: "Very easy with any stroller. Flat streets, wide pavements, accessible beach. One of the best areas for families with buggies.",
      publicTransportAccess: "Tram stops are fully accessible with ramps. Bus stops have low-floor vehicles.",
    },
    foodAndDrink: {
      summary: "Cabanyal is THE place for paella and seafood in Valencia. The beachfront restaurants are institutions — expect to queue on weekends. The back streets have excellent budget tapas.",
      recommendations: [
        { name: "Casa Carmela", type: "Traditional paella restaurant", priceRange: "€€€", tip: "Reserve ahead for a wood-fired rice lunch and confirm the restaurant's current service days.", familyFriendly: true, sourceNote: "Official site confirms the Isabel de Villena location, wood-fired rice focus and current reservation details.", sourceUrl: "https://www.casa-carmela.com/es/", sourceCheckedAt: "2026-07-19" },
        { name: "La Pepica", type: "Historic rice & seafood restaurant", priceRange: "€€€", tip: "Reserve for peak lunch periods and check the current menu before choosing a rice dish.", familyFriendly: true, sourceNote: "Official site confirms the Avenida Neptuno location, 125-year history and current rice and seafood menu.", sourceUrl: "https://lapepica.com/menu/", sourceCheckedAt: "2026-07-19" },
        { name: "La Más Bonita", type: "Beachfront café & brunch", priceRange: "€€", tip: "Check current opening hours if it is an essential stop rather than a flexible café option.", familyFriendly: true, sourceNote: "Official group site confirms the Valencia beachfront venue and current operating locations.", sourceUrl: "https://www.lamasbonita.es/", sourceCheckedAt: "2026-07-19" },
        { name: "Bodega Casa Montaña", type: "Wine bar / tapas", priceRange: "€€€", tip: "Reserve if the visit matters to your plans; the historic dining rooms have limited capacity.", familyFriendly: false, sourceNote: "Visit Valencia confirms the José Benlliure 69 location, extensive wine cellar and traditional tapas focus.", sourceUrl: "https://www.visitvalencia.com/que-hacer-valencia/gastronomia/restaurantes-valencia/bodega-casa-montana", sourceCheckedAt: "2026-07-19" },
      ],
      localSpeciality: "Paella Valenciana cooked over wood fire — this is the neighbourhood where the tradition lives. Sunday paella lunch is a Valencian institution.",
    },
    stayingHere: {
      summary: "Cabanyal offers the best of both worlds: beach on your doorstep and the city centre 15 minutes away by tram. Accommodation is generally more affordable than the old town, and the neighbourhood has a genuine local feel.",
      pros: ["Beach 2-5 minutes walk", "Flat and accessible streets", "Best paella in the city", "More affordable than the centre", "Authentic neighbourhood feel"],
      cons: ["15-20 minutes from old town sights", "Can be noisy on summer nights", "Some streets still rough around the edges", "Limited nightlife compared to El Carmen/Ruzafa"],
      gettingElsewhere: ["Tram to city centre: 15 min", "Walk to City of Arts: 25 min", "Bus to airport: 40 min"],
    },
    visitingHere: {
      summary: "A half-day is perfect: morning at the market and walking the tiled streets, then lunch paella and afternoon on the beach.",
      idealDuration: "Half day (4-5 hours)",
      bestTimeOfDay: "Morning for the architecture walk, lunch for paella, afternoon for the beach",
      tips: [
        "Start with the tiled facades on Calle de la Reina — best light is morning.",
        "Book paella lunch at Casa Carmela or La Pepica by noon (paella takes 30 min to cook).",
        "Spend the afternoon on Las Arenas beach, then sunset drinks at La Fábrica de Hielo rooftop.",
      ],
    },
    practicalTips: [
      "Paella is a lunch dish in Valencia. Most restaurants only serve it 1-3pm. Don't ask for paella at dinner — you'll mark yourself as a tourist.",
      "The neighbourhood is safe but undergoing gentrification. Some blocks are rough — just use normal city awareness.",
      "In summer, beach restaurants fill up fast. Arrive before 1:30pm or make a reservation.",
      "The tiled facades are fragile heritage — don't touch or lean against them.",
    ],
    audienceTips: [
      {
        audience: "families",
        tips: [
          "Las Arenas beach has lifeguards in summer and a shallow, gradual entry — safe for kids.",
          "Rent a beach set (umbrella, chairs, toys) rather than lugging everything from your accommodation.",
          "The promenade is perfect for scooters, trikes, and running around.",
        ],
      },
      {
        audience: "digital-nomads",
        tips: [
          "La Más Bonita has Wi-Fi but it's a social spot, not a work spot.",
          "For serious work, head to a coworking space in the centre (tram: 15 min).",
          "The neighbourhood has excellent value long-stay apartments — cheaper than Ruzafa with better beach access.",
        ],
      },
    ],
    productWidgets: [
      { categorySlug: "travel-outdoors", heading: "Beach day essentials", afterSection: "Highlights" },
      { categorySlug: "baby-gear", heading: "Beach holiday with little ones?", afterSection: "Practical Tips" },
    ],
    relatedDestinations: ["malvarrosa-beach", "city-of-arts-and-sciences", "ruzafa"],
    relatedBlogPosts: ["valencia-with-kids-complete-guide", "valencia-summer-guide"],
    faqs: [
      { question: "Is Cabanyal safe?", answer: "Yes, increasingly so. The neighbourhood has gentrified significantly. Main streets and the waterfront are busy and safe. Use normal city awareness on quieter back streets, especially at night." },
      { question: "Where is the best paella in Valencia?", answer: "Many locals say Casa Carmela in Cabanyal. It's cooked over wood fire in the traditional way. Book in advance — it's well known and fills up, especially on Sundays." },
      { question: "Can you swim at Las Arenas beach?", answer: "Yes, from approximately May to October. The water is warm enough for comfortable swimming from June to September. Lifeguards are on duty in summer months." },
    ],
  },

  // ===== BENIMACLET =====
  {
    slug: "benimaclet",
    name: "Benimaclet",
    type: "neighbourhood",
    tagline: "Valencia's village-within-a-city — students, street markets, and authentic neighbourhood life",
    heroImage: "/discover/benimaclet-hero.webp",
    heroImageAlt: "The church and traditional village square at the heart of Benimaclet, Valencia",
    heroImageProvenance: {
      status: "licensed",
      creator: "Joanbanjo",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Pla%C3%A7a_de_Benimaclet.JPG",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
    title: "Benimaclet Valencia: Local Neighbourhood Guide",
    description: "Explore Benimaclet's village atmosphere, weekly market, local food and transport links, with practical advice for experiencing this Valencia neighbourhood.",
    keywords: ["Benimaclet Valencia", "Valencia student neighbourhood", "Benimaclet guide", "alternative Valencia", "local Valencia"],
    date: "2026-06-20",
    lastUpdated: "2026-06-20",
    audiences: ["digital-nomads", "budget", "couples"],
    region: "North Valencia",
    hubs: ["neighbourhoods"],
    overview: {
      paragraphs: [
        "Benimaclet feels like a village that happens to be inside a city. This former farming hamlet, swallowed by Valencia's expansion but never quite absorbed, retains its own character: a central plaza with old men playing dominoes, a weekly street market, tiny tapas bars where regulars know each other by name, and a fiercely independent community that has successfully blocked corporate development for decades.",
        "The neighbourhood sits between the University of Valencia campus and the northern edge of Turia Gardens, making it a natural hub for students, academics, and young professionals. This means excellent value eating and drinking — you can have a three-course menú del día for €10-12 — alongside a vibrant multicultural food scene: Indian, Senegalese, Chinese, and Middle Eastern restaurants line the main streets.",
        "For visitors, Benimaclet offers something the tourist areas can't: a genuine slice of Valencian daily life. There are no monuments, no museums, no Instagram spots. Just good food, cheap drinks, friendly people, and the comforting rhythm of a real neighbourhood. It's also surprisingly well-connected — the metro has you in the city centre in 8 minutes.",
      ],
      quickFacts: [
        { label: "Getting there", value: "Metro L1 Benimaclet (8 min from centre)" },
        { label: "Best for", value: "Budget food, local life, long-stay living, students" },
        { label: "Vibe", value: "Village-like, alternative, multicultural" },
        { label: "Tourist factor", value: "Almost zero — this is local Valencia" },
      ],
    },
    highlights: [
      {
        name: "Plaça de Benimaclet",
        description: "The heart of the neighbourhood — a leafy square with the parish church, café terraces, and a playground. This is where locals gather for morning coffee, evening vermouth, and Sunday strolls. The weekly flea market happens here on Saturdays.",
        icon: "🌳",
        tip: "Saturday morning is the best time to visit — the market is bustling and the café terraces are full of locals reading the paper.",
      },
      {
        name: "Benimaclet Street Market",
        description: "Every Saturday morning, Benimaclet's streets fill with stalls selling fresh produce, artisan bread, cheese, honey, vintage clothes, and handmade crafts. It's entirely local — no tourist tat.",
        icon: "🛍️",
        tip: "Arrive by 10am for the best produce. The organic vegetable stalls sell out fast. Bring a reusable bag.",
      },
      {
        name: "Horts Urbans de Benimaclet",
        description: "A community urban garden on reclaimed land at the neighbourhood's edge. Locals maintain plots growing vegetables and flowers. It's a symbol of Benimaclet's community spirit and resistance to development.",
        icon: "🌱",
        tip: "Walk through in the late afternoon when gardeners are tending plots — they're friendly and happy to chat.",
      },
      {
        name: "Multicultural Food Mile",
        description: "Carrer de Mistral and surrounding streets pack an incredible diversity of cuisines into a few blocks. Indian thalis, Senegalese thieboudienne, Chinese hand-pulled noodles, and classic Spanish tapas — all at student-friendly prices.",
        icon: "🍛",
        tip: "Ask any student for their favourite spot — they all have strong opinions. The Indian restaurants along Carrer de Mistral are particularly good value.",
      },
    ],
    gettingThere: {
      summary: "Metro Line 1 makes Benimaclet quick and easy to reach from the centre.",
      options: [
        { mode: "metro", description: "Line L1 to Benimaclet station — direct from Àngel Guimerà or Colón", duration: "8 min from centre", cost: "€1.50" },
        { mode: "tram", description: "Tram L4 connects to the eastern end of the neighbourhood", duration: "12 min", cost: "€1.50" },
        { mode: "bike", description: "Easy flat ride from the city centre or Turia Gardens. Valenbisi stations available.", duration: "15 min", cost: "€2 (Valenbisi)" },
        { mode: "walk", description: "Follow Turia Gardens north-east from the City of Arts and Sciences area", duration: "25 min" },
      ],
      parkingNotes: "Free street parking is still available in some residential streets, but it's increasingly metered. The metro is easier.",
    },
    bestTimeToVisit: {
      summary: "Benimaclet is best during the university term (September-June) when the neighbourhood is buzzing with students.",
      seasons: [
        { season: "spring", description: "Perfect weather, the Saturday market is at its best, students are in term — most lively.", rating: 5 },
        { season: "summer", description: "Quieter — many students leave. But the terraces are open and it's cheaper than ever.", rating: 3 },
        { season: "autumn", description: "University starts again in September. The neighbourhood wakes up. Excellent weather.", rating: 5 },
        { season: "winter", description: "Mild and cosy. The indoor tapas bars come into their own. Saturday market still runs.", rating: 4 },
      ],
    },
    whatToBring: {
      bring: ["Reusable bag for the market", "Cash for small bars (some don't take cards)", "Appetite for cheap, good food"],
      dontBring: ["Expectations of tourist attractions", "Fancy clothes — it's casual"],
      rentInstead: ["Bike to explore the area and ride into Turia Gardens"],
    },
    accessibility: {
      overallRating: 3,
      summary: "Benimaclet has flat streets and good pavements on the main roads. Some side streets are narrow with uneven surfaces. The metro station has lift access.",
      wheelchairNotes: "Main streets around the plaza are accessible. The market can be crowded and harder to navigate. The metro station has step-free access.",
      strollerNotes: "Generally easy on the main streets. The playground in the main plaza is a plus for families.",
      publicTransportAccess: "Metro L1 Benimaclet has lifts. Tram stops are accessible.",
    },
    foodAndDrink: {
      summary: "Benimaclet mixes long-running neighbourhood cafés with newer bakeries and Valencian restaurants. Check current opening hours because many independent venues close between services or on selected weekdays.",
      recommendations: [
        { name: "Kaf Café", type: "Literary café & cultural bar", priceRange: "€", tip: "Check its current social channels for opening times and cultural programming before visiting.", familyFriendly: true, sourceNote: "Benimaclet Entra identifies Kaf Café as a neighbourhood literary and cultural café.", sourceUrl: "https://benimacletentra.org/portfolio-item/kaf-cafe/", sourceCheckedAt: "2026-07-19" },
        { name: "Bar Verbena", type: "Tapas & neighbourhood bar", priceRange: "€€", tip: "Use the official site for current reservations and service details.", familyFriendly: true, sourceNote: "Official venue site confirms the Utiel 20 location in Benimaclet and its tapas-led concept.", sourceUrl: "https://barverbena.es/", sourceCheckedAt: "2026-07-19" },
        { name: "Ambra", type: "Traditional Valencian", priceRange: "€€€", tip: "Reserve ahead if you want one of the rice dishes, especially for a weekend meal.", familyFriendly: true, sourceNote: "Current local reporting confirms the Mistral 10 venue, traditional Valencian cooking and rice focus.", sourceUrl: "https://cadenaser.com/comunitat-valenciana/2025/07/04/ambra-el-sabor-de-la-cocina-valenciana-mas-autentica-en-una-casa-de-pueblo-en-benimaclet-radio-valencia/", sourceCheckedAt: "2026-07-19" },
        { name: "KÜME Café", type: "Bakery & café", priceRange: "€€", tip: "Check the split morning and evening hours before planning a visit.", familyFriendly: true, sourceNote: "Official venue site confirms the Guardia Civil 20 location, bakery range and current hours.", sourceUrl: "https://kumepasteleria.com/", sourceCheckedAt: "2026-07-19" },
      ],
      localSpeciality: "The menú del día — a three-course lunch with bread and drink, typically €10-12. This working-class tradition is strongest in neighbourhoods like Benimaclet where locals, not tourists, set the prices.",
    },
    stayingHere: {
      summary: "Benimaclet is ideal for long-stay visitors, digital nomads, and anyone who wants to experience real Valencian life. Rents are 30-40% cheaper than the centre or Ruzafa, and you're 8 minutes from everything by metro.",
      pros: ["Most affordable central neighbourhood", "Genuine local atmosphere", "Excellent value food and drink", "Metro to city centre in 8 min", "Near university and Turia Gardens"],
      cons: ["No tourist attractions nearby", "Quieter nightlife than Ruzafa/El Carmen", "Some streets feel residential and empty at night", "Limited English spoken in local bars"],
      gettingElsewhere: ["Metro to city centre: 8 min", "Walk to Turia Gardens: 10 min", "Tram to beach: 20 min"],
    },
    visitingHere: {
      summary: "Benimaclet is best as a half-day immersion into local life rather than a sightseeing destination. Come on Saturday for the market and stay for lunch.",
      idealDuration: "3-4 hours (Saturday morning ideal)",
      bestTimeOfDay: "Saturday morning 9am-1pm for market + lunch",
      tips: [
        "Come on Saturday for the street market — it's the neighbourhood at its most vibrant.",
        "Have a late breakfast coffee at a terrace on the main plaza, browse the market, then stay for a menú del día lunch.",
        "Walk south through the neighbourhood to reach Turia Gardens for an afternoon stroll.",
      ],
    },
    practicalTips: [
      "Bring cash — several small bars and market stalls don't accept cards.",
      "The Saturday market runs approximately 9am-2pm. Best selection is before 11am.",
      "Spanish is the main language here. A few words of Spanish go a long way with local bar owners.",
      "The neighbourhood has a strong community identity — respect the urban garden spaces and local initiatives.",
    ],
    audienceTips: [
      {
        audience: "digital-nomads",
        tips: [
          "Kaf Café is the best work-friendly café with good Wi-Fi and outlets.",
          "Benimaclet has the cheapest quality accommodation for long stays — many nomads base here for months.",
          "The university library (Biblioteca de la Universitat) is nearby and open to the public.",
        ],
      },
      {
        audience: "budget",
        tips: [
          "This is Valencia's best neighbourhood for eating well on a budget. The menú del día tradition is alive here.",
          "The Saturday market has excellent produce for self-catering at local prices.",
          "Accommodation here costs 30-40% less than Ruzafa or the centre.",
        ],
      },
    ],
    productWidgets: [
      { categorySlug: "remote-work", heading: "Setting up your remote office in Valencia?", afterSection: "Highlights" },
    ],
    relatedDestinations: ["ruzafa", "el-carmen", "city-of-arts-and-sciences"],
    relatedBlogPosts: ["digital-nomad-valencia-guide"],
    faqs: [
      { question: "Is Benimaclet worth visiting as a tourist?", answer: "If you want to see how Valencians actually live — yes. There are no museums or monuments, but the Saturday market, local tapas bars, and neighbourhood atmosphere are a refreshing contrast to the tourist centre." },
      { question: "Is Benimaclet safe?", answer: "Yes, it's a residential neighbourhood with a strong community. Like any area, use normal awareness at night on quiet streets, but overall it's very safe." },
      { question: "What is Benimaclet known for?", answer: "Its village atmosphere, student culture (near the university), Saturday street market, multicultural food scene, and its community's successful resistance to corporate development." },
    ],
  },

  // ===== TURIA GARDENS =====
  {
    slug: "turia-gardens",
    name: "Turia Gardens",
    type: "attraction",
    tagline: "Europe's largest urban park — 9km of green in Valencia's old riverbed",
    heroImage: "/discover/turia-gardens-hero.webp",
    heroImageAlt: "Landscaped paths and a shallow water channel in Valencia's Turia Gardens",
    heroImageProvenance: {
      status: "licensed",
      creator: "Joanbanjo",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Jard%C3%AD_del_T%C3%BAria_de_Val%C3%A8ncia,_riuet.JPG",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
    title: "Turia Gardens Valencia: Complete Visitor Guide",
    description: "Plan a visit to Valencia's Turia Gardens, with practical guidance on cycling routes, Gulliver Park, walking paths, access points and family activities.",
    keywords: ["Turia Gardens Valencia", "Jardín del Turia", "Valencia park", "Gulliver playground Valencia", "cycling Valencia"],
    date: "2026-06-20",
    lastUpdated: "2026-06-20",
    audiences: ["families", "couples", "digital-nomads", "elderly", "budget"],
    region: "Central Valencia",
    hubs: ["attractions"],
    overview: {
      paragraphs: [
        "The Turia Gardens is Valencia's masterpiece of urban planning. After a catastrophic flood in 1957, the River Turia was diverted south and the old riverbed was transformed into a 9-kilometre serpentine park that cuts through the entire city. Today it's one of Europe's largest urban green spaces — and it's completely free.",
        "The park runs from the Bioparc zoo in the west to the City of Arts and Sciences in the east, passing under 18 historic bridges along the way. It contains football pitches, running paths, cycling lanes, botanical gardens, playgrounds (including the famous Gulliver playground), cafés, and thousands of orange and palm trees. Whether you're jogging, cycling, pushing a stroller, or just sitting under a tree with a book, the Turia is where Valencia relaxes.",
        "For visitors, the Turia is the city's connective tissue — use it instead of the metro. Walking or cycling from the old town to the beach, or from Ruzafa to Benimaclet, is faster and infinitely more pleasant through the park than on the streets above. It's flat, shaded, and car-free.",
      ],
      quickFacts: [
        { label: "Length", value: "9 km (5.6 miles) end to end" },
        { label: "Access", value: "Free, open 24 hours" },
        { label: "Best for", value: "Cycling, jogging, families, picnics" },
        { label: "Key landmarks", value: "Gulliver playground, Bioparc, City of Arts & Sciences" },
      ],
    },
    highlights: [
      {
        name: "Gulliver Playground",
        description: "A massive sculpture of Gulliver lying on the ground, 70 metres long, covered in slides, ramps, steps, and climbing surfaces. Kids (and adults) scramble all over this Lilliputian-scale playground. It's one of Valencia's most iconic experiences.",
        icon: "🛝",
        tip: "Go early morning or late afternoon to avoid summer heat and crowds. It's fully free and there are no age restrictions — adults are welcome to climb too.",
        googleMapsUrl: "https://maps.google.com/?q=Parque+Gulliver+Valencia",
      },
      {
        name: "Bioparc Valencia",
        description: "A modern, barrier-free zoo at the western end of the Turia. Animals are grouped by African ecosystem (savannah, equatorial forest, Madagascar, wetlands) rather than species. The gorilla and elephant enclosures are outstanding.",
        icon: "🦁",
        tip: "Buy tickets online to save time. The feeding schedules (check at entrance) add a lot to the experience. Allow 3-4 hours.",
        googleMapsUrl: "https://maps.google.com/?q=Bioparc+Valencia",
      },
      {
        name: "Cycling the Full 9km",
        description: "The entire park has a dedicated bike lane running end to end. From Bioparc to the City of Arts takes about 40 minutes at a leisurely pace — one of the best urban cycling experiences in Europe. Flat, shaded, and completely car-free.",
        icon: "🚲",
        tip: "Use Valenbisi (bike share) stations — there are dozens along the park. Or rent a better bike from a local shop for a half-day.",
      },
      {
        name: "Palau de la Música",
        description: "Valencia's main concert venue sits in the middle of the park surrounded by a lake and gardens. Even without a concert, the grounds are beautiful for a stroll. In summer, there are free outdoor performances.",
        icon: "🎵",
        tip: "Check their website for free summer concerts — they're a lovely evening out in the park.",
        googleMapsUrl: "https://maps.google.com/?q=Palau+de+la+Musica+Valencia",
      },
      {
        name: "Jardí Botànic",
        description: "The university's botanical garden, technically just outside the Turia but connected to its western section. Over 3,000 plant species, an orchid greenhouse, and a remarkably peaceful atmosphere. One of the oldest in Europe (founded 1567).",
        icon: "🌺",
        tip: "Costs €2.50. The cactus collection and tropical greenhouse are the highlights. It's a perfect cool escape on hot summer days.",
        googleMapsUrl: "https://maps.google.com/?q=Jardí+Botànic+Valencia",
      },
    ],
    gettingThere: {
      summary: "You don't really 'go to' the Turia Gardens — you're always near them. The park runs through the entire city and has dozens of access points via staircases and ramps from the bridges above.",
      options: [
        { mode: "walk", description: "Accessible from virtually anywhere in central Valencia. Staircases and ramps descend from every bridge.", duration: "0-15 min from most locations" },
        { mode: "metro", description: "Alameda (L3/L5) exits directly into the park. Àngel Guimerà is also close.", duration: "Direct" },
        { mode: "bike", description: "Valenbisi stations are at many entry points. The park itself is the bike route.", duration: "Varies", cost: "€2 (Valenbisi)" },
      ],
      parkingNotes: "Street parking above the park on surrounding roads. Or use underground car parks at Porta de la Mar or near the City of Arts.",
    },
    bestTimeToVisit: {
      summary: "The Turia is enjoyable year-round, but spring and autumn are perfect. Summer is hot — go early morning or late afternoon.",
      seasons: [
        { season: "spring", description: "Ideal — orange blossoms everywhere, comfortable temperatures, everything in bloom.", rating: 5 },
        { season: "summer", description: "Hot (35°C+). Go before 10am or after 7pm. Shade from the trees helps, but midday is brutal.", rating: 3 },
        { season: "autumn", description: "Beautiful — warm, golden light, the oranges are ripening on the trees. Perfect cycling weather.", rating: 5 },
        { season: "winter", description: "Mild (10-16°C). Less greenery but pleasant for jogging and walking. Park is quiet and peaceful.", rating: 4 },
      ],
    },
    whatToBring: {
      bring: ["Water bottle (essential in summer)", "Sun cream", "Comfortable shoes or running kit", "Picnic blanket"],
      dontBring: ["Heavy bags — you'll be walking/cycling distances"],
      rentInstead: ["Bike for the full park experience", "Stroller for families with young children", "Running watch/tracker for the jogging paths"],
    },
    accessibility: {
      overallRating: 5,
      summary: "The Turia Gardens is one of the most accessible green spaces in any European city. The park is entirely flat (it's a riverbed), paths are wide and paved, and ramp access is available from most bridge entry points.",
      wheelchairNotes: "Excellent. The main paths are smooth, flat, and wide enough for any wheelchair. Most bridge crossings have ramp access (a few older bridges are stairs only — check the western end). The Gulliver playground has accessible sections.",
      strollerNotes: "Perfect for strollers of any size. Flat, smooth paths, shaded sections, multiple playgrounds, and café stops along the way. This is Valencia's best family walk.",
      publicTransportAccess: "Metro Alameda exits at park level. Multiple bus stops along the bridges above have ramp access down.",
    },
    foodAndDrink: {
      summary: "The park has cafés and refreshment points, but facilities are spread across a nine-kilometre route. Carry water and treat food stops as flexible rather than relying on one named kiosk being open.",
      recommendations: [
        { name: "Palau de la Música café area", type: "Café / terrace", priceRange: "€", tip: "Use it as a flexible refreshment stop and confirm opening on the day.", familyFriendly: true, sourceNote: "Visit Valencia's accessibility guide confirms a café and adapted toilet facilities by the Palau de la Música.", sourceUrl: "https://www.visitvalencia.com/en/valencia-accesible/turia-garden", sourceCheckedAt: "2026-07-19" },
        { name: "Gulliver refreshment area", type: "Café / vending", priceRange: "€", tip: "Bring your own water as a fallback, particularly during split summer opening hours.", familyFriendly: true, sourceNote: "Visit Valencia confirms refreshment and adapted toilet facilities around Gulliver Park.", sourceUrl: "https://www.visitvalencia.com/en/what-to-do-valencia/nature-in-valencia/parks-and-gardens-valencia/gulliver-park", sourceCheckedAt: "2026-07-19" },
        { name: "Picnic in the Turia", type: "Self-catered picnic", priceRange: "€", tip: "Buy supplies before entering a long park section and take all waste with you.", familyFriendly: true, sourceNote: "Visit Valencia describes the Turia as suitable for picnics and confirms cafés are distributed along the route.", sourceUrl: "https://www.visitvalencia.com/en/what-to-do-valencia/nature-in-valencia/parks-and-gardens-valencia/turia-gardens", sourceCheckedAt: "2026-07-19" },
      ],
      localSpeciality: "Pack a picnic with supplies from Mercado Central or Mercadona — eating under the orange trees in the Turia is a quintessential Valencia experience.",
    },
    visitingHere: {
      summary: "The full 9km is a half-day by bike or a full day on foot. Most visitors pick a section — the eastern end (City of Arts to Gulliver) is the most popular.",
      idealDuration: "2-4 hours (one section) or full day (end to end by bike)",
      bestTimeOfDay: "Early morning for joggers, mid-morning for families, late afternoon for cyclists and walkers",
      tips: [
        "The eastern section (Gulliver → City of Arts) is the most popular and scenic. Start here if time is limited.",
        "Rent a bike and cycle the full 9km — it's flat, shaded, and one of the best urban rides in Europe.",
        "Pack water and sun cream in summer. The park has trees for shade but midday sun is intense.",
        "Use the park as your daily commute — walking through the Turia is faster and nicer than taking the street above.",
      ],
    },
    practicalTips: [
      "The park is below street level (it's a riverbed), so you need to descend via stairs or ramps from the bridges. Most bridges have both.",
      "Don't pick the oranges — they're bitter Seville oranges used for marmalade, not eating. You will regret it.",
      "Cycling lanes and pedestrian paths are separated — stay in the right lane. Cyclists move fast.",
      "The park is safe day and night, though the western end is quieter and less lit after dark.",
      "Public toilets are near the Gulliver playground and at some café kiosks. They're not abundant — plan ahead.",
    ],
    audienceTips: [
      {
        audience: "families",
        tips: [
          "Gulliver playground is the headline, but there are 6+ smaller playgrounds scattered throughout the park.",
          "The Bioparc (western end) is excellent for kids — the barrier-free design means animals feel very close.",
          "Bring a picnic — the grassy areas near Gulliver are perfect for spreading a blanket.",
        ],
      },
      {
        audience: "digital-nomads",
        tips: [
          "Morning jog in the Turia, then work at a café above — this is the Valencia digital nomad lifestyle.",
          "The Pont de Fusta area has good cafés with Wi-Fi just above the park.",
          "The park's eastern end is near Ruzafa — combine a park run with a Ruzafa brunch.",
        ],
      },
      {
        audience: "elderly",
        tips: [
          "The flat paths make this ideal for gentle walks. The section near the Palau de la Música has benches and shade.",
          "Mobility scooters work well on the main paths — they're wide, flat, and smooth.",
          "The botanical garden (Jardí Botànic) is a peaceful, slow-paced alternative to the main park.",
        ],
      },
    ],
    productWidgets: [
      { categorySlug: "mobility", heading: "Exploring the park with mobility support?", afterSection: "Accessibility" },
      { categorySlug: "baby-gear", heading: "Park day with little ones?", afterSection: "Practical Tips" },
    ],
    relatedDestinations: ["city-of-arts-and-sciences", "el-carmen", "ruzafa", "benimaclet"],
    relatedBlogPosts: ["valencia-with-kids-complete-guide", "accessible-valencia-complete-guide"],
    faqs: [
      { question: "How long are the Turia Gardens?", answer: "9 kilometres (5.6 miles) from Bioparc in the west to the City of Arts and Sciences in the east. Cycling takes about 40 minutes end to end; walking takes 2-3 hours at a leisurely pace." },
      { question: "Is the Turia park free?", answer: "Yes, completely free, open 24 hours, 365 days a year. Individual attractions within or beside it (Bioparc, Botanical Garden) have their own admission fees." },
      { question: "Can you cycle in Turia Gardens?", answer: "Yes — there are dedicated cycling lanes running the full length. Use Valenbisi (city bike share, €2/day) or rent from a local shop. It's flat and car-free." },
      { question: "Is the Gulliver playground free?", answer: "Yes, completely free. Open daily from approximately 10am-8pm (hours vary seasonally). No age restrictions — adults can climb too. Best visited early morning or late afternoon to avoid crowds." },
    ],
  },

  // ===== EL ENSANCHE =====
  {
    slug: "el-ensanche",
    name: "El Ensanche",
    type: "neighbourhood",
    tagline: "Wide boulevards, designer shopping, and Valencia's most elegant dining quarter",
    heroImage: "/discover/el-ensanche-hero.webp",
    heroImageAlt: "The colourful Valencian Modernist facade of Mercado de Colón in the Ensanche district",
    heroImageProvenance: {
      status: "licensed",
      creator: "acediscovery",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Mercat-de-Col%C3%B3n_Valencia.jpg",
      license: "CC BY 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
    title: "El Ensanche Valencia: Shopping & Dining Guide",
    description: "Explore El Ensanche in Valencia, including Calle Colón, Mercado de Colón, restaurants, transport links and practical advice on staying in the district.",
    keywords: ["El Ensanche Valencia", "Calle Colón Valencia", "shopping Valencia", "Mercado de Colón", "Valencia shopping guide"],
    date: "2026-06-20",
    lastUpdated: "2026-06-20",
    audiences: ["families", "couples", "elderly", "luxury"],
    region: "Central Valencia",
    hubs: ["neighbourhoods"],
    overview: {
      paragraphs: [
        "El Ensanche (\"the expansion\") is Valencia's 19th-century grid district — the Eixample to El Carmen's Gothic Quarter. Built when Valencia outgrew its medieval walls, El Ensanche is defined by wide tree-lined boulevards, elegant Art Nouveau and Modernista facades, and Calle Colón, one of Spain's busiest shopping streets.",
        "This is Valencia's most polished neighbourhood. The streets are wide and flat (excellent for wheelchairs and strollers), the shops range from Zara to luxury boutiques, and the dining scene spans Michelin-starred restaurants to the stunning Mercado de Colón — an Art Nouveau gem converted into an upmarket food hall.",
        "For visitors, El Ensanche is the safe, comfortable, centrally-located option. You're equidistant from El Carmen (10 min walk north), Ruzafa (10 min south), and the Turia Gardens (5 min east). Hotels here tend to be higher-end, and the neighbourhood feels calm and well-maintained — a welcome contrast to the beautiful chaos of the old town.",
      ],
      quickFacts: [
        { label: "Getting there", value: "Metro L3/L5/L7 Colón (city centre)" },
        { label: "Best for", value: "Shopping, fine dining, first-time visitors" },
        { label: "Vibe", value: "Elegant, modern, polished" },
        { label: "Key street", value: "Calle Colón — Valencia's main shopping artery" },
      ],
    },
    highlights: [
      {
        name: "Calle Colón",
        description: "Valencia's premier shopping street — a wide, pedestrian-friendly boulevard lined with Spanish and international brands. From Zara and Mango to El Corte Inglés (Spain's iconic department store), this is where Valencians shop.",
        icon: "🛍️",
        tip: "Sales seasons (rebajas) start in January and July. El Corte Inglés has a great rooftop restaurant with city views.",
        googleMapsUrl: "https://maps.google.com/?q=Calle+Colón+Valencia",
      },
      {
        name: "Mercado de Colón",
        description: "A breathtaking Art Nouveau market building from 1916, restored and converted into an upmarket food hall. The ceramic-tiled facade and iron-and-glass interior are architectural wonders. Inside: gourmet coffee, wine bars, tapas, and Valencia's best horchata.",
        icon: "🏛️",
        tip: "Come for mid-morning coffee or an aperitivo. The horchata at Daniel is outstanding. The building is worth visiting for the architecture alone.",
        googleMapsUrl: "https://maps.google.com/?q=Mercado+de+Colón+Valencia",
      },
      {
        name: "Calle Jorge Juan",
        description: "Valencia's most fashionable street for independent boutiques, art galleries, and upscale dining. Quieter and more refined than Calle Colón. The side streets hide some of the city's best restaurants.",
        icon: "✨",
        tip: "The stretch between Colón and Ruzafa has the best boutiques. Thursday and Friday evenings are the most atmospheric for a paseo (evening stroll).",
      },
      {
        name: "Plaza del Ayuntamiento",
        description: "Valencia's grand main square, anchored by the imposing City Hall with its ornate facade and clock tower. The square hosts the Mascletà during Fallas — the deafening daytime fireworks that shake windows across the city.",
        icon: "🏛️",
        tip: "Visit the City Hall balcony for views (free entry, limited hours). The square has a large fountain that's beautifully lit at night.",
        googleMapsUrl: "https://maps.google.com/?q=Plaza+del+Ayuntamiento+Valencia",
      },
    ],
    gettingThere: {
      summary: "You're probably already here — El Ensanche is the geographical centre of modern Valencia.",
      options: [
        { mode: "metro", description: "Colón (L3/L5/L7) is in the heart of El Ensanche. Xàtiva (L3/L5) covers the southern end.", duration: "Direct", cost: "€1.50" },
        { mode: "walk", description: "10 minutes from El Carmen, 10 minutes from Ruzafa. Central to everything.", duration: "10 min from most areas" },
        { mode: "bus", description: "Dozens of bus lines pass through. Any bus heading to 'Centro' or 'Colón' will work.", duration: "Varies", cost: "€1.50" },
      ],
      parkingNotes: "Underground parking at Calle Colón and Plaza del Ayuntamiento. Expect €15-20/day. Traffic in the centre is slow — metro or walking is faster.",
    },
    bestTimeToVisit: {
      summary: "Year-round, but the shopping and outdoor dining are best in spring and autumn.",
      seasons: [
        { season: "spring", description: "Perfect temperatures for strolling and outdoor dining. Fallas in March transforms the area.", rating: 5 },
        { season: "summer", description: "Hot but air-conditioned shops provide relief. El Corte Inglés and Mercado de Colón are cool retreats.", rating: 3 },
        { season: "autumn", description: "Ideal — pleasant weather, fashion season, terrace dining still comfortable.", rating: 5 },
        { season: "winter", description: "Christmas lights along Calle Colón are stunning. Mild enough for outdoor coffee.", rating: 4 },
      ],
    },
    whatToBring: {
      bring: ["Comfortable walking shoes", "Shopping bags (or buy one)", "Appetite for Mercado de Colón"],
      dontBring: ["Heavy luggage", "Impatience (shops close 2-5pm for siesta)"],
      rentInstead: ["Stroller for family shopping trips", "Wheelchair for comfortable exploring"],
    },
    accessibility: {
      overallRating: 5,
      summary: "El Ensanche is Valencia's most accessible neighbourhood. The 19th-century grid layout means wide, flat pavements, dropped kerbs at every crossing, and step-free access to most shops and restaurants.",
      wheelchairNotes: "Excellent throughout. Wide pavements, flat terrain, step-free shop entrances on Calle Colón. Mercado de Colón and El Corte Inglés are fully accessible.",
      strollerNotes: "The easiest neighbourhood for strollers. Wide, flat pavements without cobblestones. Lifts in metro stations and department stores.",
      publicTransportAccess: "Metro Colón has lifts. All bus stops on the main routes have low-floor vehicles.",
    },
    foodAndDrink: {
      summary: "El Ensanche has Valencia's widest range of dining — from Michelin-starred restaurants to the gorgeous Mercado de Colón food hall.",
      recommendations: [
        { name: "Mercado de Colón", type: "Food hall & terraces", priceRange: "€€", tip: "Individual businesses set their own hours, so check the venue you want before travelling.", familyFriendly: true, sourceNote: "Official market site confirms the food, drink and terrace businesses operating inside the modernist building.", sourceUrl: "https://mercadocolon.es/", sourceCheckedAt: "2026-07-19" },
        { name: "Canalla Bistro by Ricard Camarena", type: "Creative global bistro", priceRange: "€€€", tip: "Reserve ahead for dinner and consult the current fixed-menu and à-la-carte options.", familyFriendly: false, sourceNote: "Official site confirms this is Ricard Camarena's informal international bistro; it is not presented as a Michelin-starred venue.", sourceUrl: "https://www.canallabistro.com/en/home/", sourceCheckedAt: "2026-07-19" },
        { name: "La Plaça at El Corte Inglés Colón", type: "Food hall / city views", priceRange: "€€", tip: "Check department-store opening hours and the current restaurant offer before visiting.", familyFriendly: true, sourceNote: "El Corte Inglés confirms La Plaça on the sixth floor of its Colón store and panoramic city views.", sourceUrl: "https://www.elcorteingles.es/hosteleria/nuevos-conceptos/la-plasa-valencia-colon/", sourceCheckedAt: "2026-07-19" },
        { name: "Horchatería Daniel", type: "Traditional horchata", priceRange: "€", tip: "Try horchata with fartons and confirm the Mercado de Colón kiosk hours on the day.", familyFriendly: true, sourceNote: "Official Horchatería Daniel and Mercado de Colón pages confirm the market location and horchata focus.", sourceUrl: "https://horchateria-daniel.es/", sourceCheckedAt: "2026-07-19" },
      ],
      localSpeciality: "Horchata and fartons at Mercado de Colón — Valencia's signature sweet drink made from tiger nuts, served ice-cold with sugar-glazed pastries.",
    },
    stayingHere: {
      summary: "El Ensanche is the best base for first-time visitors who want comfort, convenience, and easy access to everything. Hotels tend to be modern and well-equipped. You can walk to El Carmen, Ruzafa, and the Turia in minutes.",
      pros: ["Central location — walk everywhere", "Wide, accessible streets", "Best shopping in the city", "High-quality hotels and restaurants", "Safe, polished, comfortable"],
      cons: ["More expensive than Ruzafa or Benimaclet", "Less atmospheric than El Carmen", "Can feel corporate/generic in parts", "Limited nightlife"],
      gettingElsewhere: ["Walk to El Carmen: 10 min", "Walk to Ruzafa: 10 min", "Walk to Turia Gardens: 5 min", "Metro to beach: 15 min"],
    },
    visitingHere: {
      summary: "El Ensanche is best combined with other areas. Spend a morning shopping and having coffee at Mercado de Colón, then walk into El Carmen or Ruzafa for the afternoon.",
      idealDuration: "2-3 hours",
      bestTimeOfDay: "Morning for shopping (10am-2pm), evening for dining",
      tips: [
        "Start at Mercado de Colón for coffee, then walk Calle Colón for shopping.",
        "Shops close 2-5pm for siesta — plan lunch or visit El Carmen during this window.",
        "Evening: Calle Jorge Juan and its side streets for upscale dining.",
      ],
    },
    practicalTips: [
      "Spanish shops close 2-5pm for siesta. Department stores (El Corte Inglés) stay open all day.",
      "Sales seasons (rebajas) start in January and July — prices drop 30-70% across all shops.",
      "Mercado de Colón is not a traditional market — don't expect cheap produce. It's a food hall experience.",
      "The area around Plaza del Ayuntamiento can be very crowded during Fallas (March).",
    ],
    audienceTips: [
      {
        audience: "families",
        tips: [
          "El Corte Inglés has a children's floor with toys, clothes, and a family-friendly restaurant.",
          "Mercado de Colón has high chairs and space for strollers — one of the easier family dining spots.",
          "The Turia Gardens (Gulliver playground) is a 5-minute walk east — perfect afternoon activity.",
        ],
      },
      {
        audience: "elderly",
        tips: [
          "The flat, wide pavements make this Valencia's easiest neighbourhood to navigate.",
          "Mercado de Colón has seating, air conditioning, and accessible toilets.",
          "El Corte Inglés has lifts to every floor and accessible facilities throughout.",
        ],
      },
    ],
    productWidgets: [
      { categorySlug: "mobility", heading: "Exploring Valencia in comfort?", afterSection: "Accessibility" },
      { categorySlug: "baby-gear", heading: "Shopping trip with little ones?", afterSection: "Practical Tips" },
    ],
    relatedDestinations: ["el-carmen", "ruzafa", "turia-gardens"],
    relatedBlogPosts: ["valencia-with-kids-complete-guide"],
    faqs: [
      { question: "What is the main shopping street in Valencia?", answer: "Calle Colón in the Ensanche district. It's a wide, pedestrian-friendly boulevard with Spanish and international brands, plus El Corte Inglés department store." },
      { question: "Is Mercado de Colón a real market?", answer: "Not in the traditional sense — it's a beautifully restored Art Nouveau building converted into an upscale food hall with cafés, wine bars, and gourmet stalls. Worth visiting for the architecture alone." },
      { question: "Where is the best area to stay in Valencia for first-time visitors?", answer: "El Ensanche (around Calle Colón) is ideal — central, safe, accessible, with easy walking access to El Carmen, Ruzafa, and the Turia Gardens." },
    ],
  },

  // ===== SAGUNTO =====
  {
    slug: "sagunto",
    name: "Sagunto",
    type: "day-trip",
    tagline: "Ancient hilltop castle, Roman theatre, and a charming old town — 30 minutes from Valencia",
    heroImage: "/discover/sagunto-hero.webp",
    heroImageAlt: "Panoramic view over Sagunto and the surrounding mountains from the hilltop castle",
    heroImageProvenance: {
      status: "licensed",
      creator: "José Luis Filpo Cabana",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Sagunto._Panor%C3%A1mica.jpg",
      license: "CC BY 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
    title: "Sagunto Day Trip from Valencia: Castle & Roman Theatre",
    description: "Plan a Sagunto day trip from Valencia, with train guidance and practical tips for visiting the hilltop castle, Roman theatre and historic old town.",
    keywords: ["Sagunto day trip", "Sagunto castle", "Sagunto from Valencia", "Roman theatre Sagunto", "day trips from Valencia"],
    date: "2026-06-20",
    lastUpdated: "2026-06-20",
    audiences: ["families", "couples", "budget"],
    region: "Camp de Morvedre",
    distanceFromValencia: "30 km north",
    hubs: ["day-trips"],
    overview: {
      paragraphs: [
        "Sagunto is the easiest and most rewarding day trip from Valencia. Just 30 minutes by regional train (Cercanías), this ancient town has been inhabited for over 2,000 years. The Iberian settlement here famously resisted Hannibal's siege in 219 BC, triggering the Second Punic War between Rome and Carthage. Those layers of history are visible everywhere.",
        "The town is dominated by its hilltop castle — or rather, the sprawling ruins of multiple fortifications built by Iberians, Romans, Moors, and Christians over two millennia. The 1-kilometre-long walls offer breathtaking 360° views of the surrounding orange groves, the Mediterranean coast, and the Sierra Calderona mountains. Below the castle, the beautifully restored Roman theatre hosts summer performances.",
        "Beyond the headline sights, Sagunto's old town is a delightful tangle of narrow streets, the medieval Jewish quarter (Judería), small museums, and local restaurants serving paella at half Valencia's tourist prices. It's a genuine small Spanish town — unhurried, affordable, and deeply atmospheric.",
      ],
      quickFacts: [
        { label: "Distance", value: "30 km north of Valencia (30 min train)" },
        { label: "Train", value: "Cercanías C-5/C-6 from Valencia Nord to Sagunto" },
        { label: "Cost", value: "~€3.60 return train fare" },
        { label: "Time needed", value: "Half day (4-5 hours)" },
      ],
    },
    highlights: [
      {
        name: "Sagunto Castle",
        description: "A massive hilltop fortification stretching nearly 1km along the ridge. Built and rebuilt over 2,000 years by Iberians, Romans, Moors, and Christians. The views from the walls are extraordinary — coast to mountains in every direction.",
        icon: "🏰",
        tip: "Start from the Roman theatre and walk up. The climb takes 15-20 minutes. Bring water. Go early in summer — there's no shade on the walls.",
        googleMapsUrl: "https://maps.google.com/?q=Castillo+de+Sagunto",
      },
      {
        name: "Roman Theatre",
        description: "A beautifully restored 1st-century Roman theatre that still hosts summer performances (the Sagunt a Escena festival in August). The semicircular auditorium seats 4,000 and the mountain backdrop is stunning.",
        icon: "🏛️",
        tip: "Free entry. If you're visiting in August, check for evening performances — watching theatre in a 2,000-year-old venue is unforgettable.",
        googleMapsUrl: "https://maps.google.com/?q=Teatro+Romano+Sagunto",
      },
      {
        name: "Jewish Quarter (Judería)",
        description: "One of the best-preserved medieval Jewish quarters in Spain. Narrow alleys, arched passageways, and the remains of a medieval mikveh (ritual bath). The Jewish community here was one of the largest in medieval Valencia.",
        icon: "✡️",
        tip: "The Centro de Interpretación de la Judería has a small but excellent exhibit explaining the community's history. Ask about the medieval Hebrew inscriptions.",
      },
      {
        name: "Old Town & Plaça Major",
        description: "Sagunto's old town is a quiet, atmospheric collection of narrow streets, small churches, and local shops. The Plaça Major has café terraces perfect for a post-castle coffee. The Museo Histórico has archaeological finds from the Iberian to Moorish periods.",
        icon: "🏘️",
        tip: "Have lunch in the old town — the restaurants serve excellent local food at prices much lower than Valencia. Try arroz al horno (oven-baked rice).",
      },
    ],
    gettingThere: {
      summary: "The Cercanías commuter train is the easiest way. Runs every 15-30 minutes, costs less than €4 return.",
      options: [
        { mode: "train", description: "Cercanías C-5 or C-6 from Valencia Nord (Estació del Nord) to Sagunto station", duration: "30 min", cost: "~€3.60 return" },
        { mode: "car", description: "A-7 motorway north. Free parking available near the old town.", duration: "25-30 min", cost: "Free (toll-free route)" },
      ],
      parkingNotes: "Free street parking around the base of the old town. Parking near the Roman theatre is limited but usually available outside summer weekends.",
    },
    bestTimeToVisit: {
      summary: "Spring and autumn are perfect. Summer is brutally hot on the exposed castle walls — go early morning.",
      seasons: [
        { season: "spring", description: "Ideal — orange blossoms in the surrounding groves, comfortable temperatures for the castle climb.", rating: 5 },
        { season: "summer", description: "Very hot (35°C+). The castle has zero shade. Go at opening time (10am) and descend before noon. Summer performances at the Roman theatre are magical.", rating: 3 },
        { season: "autumn", description: "Perfect weather. Orange harvest season. Fewer visitors. The golden light on the castle walls is stunning.", rating: 5 },
        { season: "winter", description: "Mild but can be windy on the castle ridge. Few tourists. A peaceful, atmospheric visit.", rating: 4 },
      ],
    },
    whatToBring: {
      bring: ["Water (essential — no shops on the castle hill)", "Comfortable shoes with grip", "Sun hat and sun cream in summer", "Camera"],
      dontBring: ["Heels or sandals (the castle path is rough)", "Heavy bags"],
      rentInstead: ["Compact stroller (leave big buggies — the old town has steps)"],
    },
    accessibility: {
      overallRating: 2,
      summary: "The castle and old town are challenging for wheelchairs and heavy strollers. The castle climb is steep and uneven. The Roman theatre is accessible at ground level. The train station is flat.",
      wheelchairNotes: "The castle is not wheelchair accessible — the path is steep, uneven, and unpaved in sections. The Roman theatre and old town are partially accessible on the main streets.",
      strollerNotes: "A compact, lightweight stroller works for the old town streets. Leave it at the theatre entrance before climbing to the castle — the path is too steep and rough.",
      publicTransportAccess: "Sagunto train station is step-free. The walk to the old town is flat (10 minutes). The climb to the castle begins at the theatre.",
    },
    foodAndDrink: {
      summary: "Sagunto combines informal old-town cafés with a small number of destination restaurants. Choose between a flexible post-castle stop and a pre-booked meal before travelling.",
      recommendations: [
        { name: "Arrels", type: "Contemporary Valencian tasting menus", priceRange: "€€€", tip: "This is a reservation-led special-occasion meal, not a quick stop after the castle.", familyFriendly: true, sourceNote: "Official restaurant and Michelin Guide pages confirm the Castell 18 location, tasting-menu format and current service schedule.", sourceUrl: "https://www.restaurantarrels.com/", sourceCheckedAt: "2026-07-19" },
        { name: "Cafés around Plaça Major", type: "Café / terrace", priceRange: "€", tip: "Treat this as a flexible refreshment stop and check the venue you choose on arrival.", familyFriendly: true, sourceNote: "Valencia provincial tourism confirms Sagunto's old-town visitor area and local gastronomy; this is area guidance rather than one endorsed business.", sourceUrl: "https://turisme.dival.es/en/destino/sagunto/", sourceCheckedAt: "2026-07-19" },
      ],
      localSpeciality: "Arroz al horno — oven-baked rice with chickpeas, blood sausage, and pork. A Camp de Morvedre speciality you won't find easily in Valencia city.",
    },
    visitingHere: {
      summary: "A half day is perfect. Take the morning train, climb the castle, visit the theatre, lunch in the old town, afternoon train back.",
      idealDuration: "4-5 hours",
      bestTimeOfDay: "Morning (arrive by 10am, avoid midday heat on the castle)",
      tips: [
        "Take the 9:30-10am Cercanías from Valencia Nord. You'll be at the castle by 11am.",
        "Visit the Roman theatre first (free), then climb to the castle (20 min uphill).",
        "Descend via the Jewish quarter and old town. Have lunch at Plaça Major.",
        "Take the afternoon train back (runs every 15-30 min). You'll be in Valencia by 3pm.",
      ],
    },
    practicalTips: [
      "The castle is free to enter and open daily. Check winter hours (may close earlier).",
      "Bring at least 1 litre of water per person — there are no facilities on the castle hill.",
      "The castle climb is moderate (20 min) but exposed. In summer, start early or you'll be climbing in full sun.",
      "The train station is a 10-minute flat walk from the old town. Follow signs to 'Centro Histórico'.",
    ],
    audienceTips: [
      {
        audience: "families",
        tips: [
          "Kids love the castle — it's like a real-life adventure playground. The walls are safe to walk on but supervise closely.",
          "The Roman theatre is a great spot for kids to run around. Free entry, open space.",
          "Pack snacks and water — options on the hill are zero.",
        ],
      },
    ],
    productWidgets: [
      { categorySlug: "baby-gear", heading: "Day trip with little ones?", afterSection: "Practical Tips" },
    ],
    relatedDestinations: ["albufera", "city-of-arts-and-sciences"],
    relatedBlogPosts: ["valencia-with-kids-complete-guide"],
    faqs: [
      { question: "How do I get to Sagunto from Valencia?", answer: "Take the Cercanías commuter train (C-5 or C-6) from Valencia Nord station. It runs every 15-30 minutes, takes 30 minutes, and costs about €3.60 return." },
      { question: "Is Sagunto Castle worth visiting?", answer: "Absolutely. The 1km-long hilltop ruins with 360° views are spectacular. Combined with the Roman theatre and charming old town, it's Valencia's best half-day trip." },
      { question: "Is Sagunto Castle free?", answer: "Yes, completely free to enter. Open daily, though winter hours may be shorter. The Roman theatre below is also free." },
    ],
  },

  // ===== REQUENA =====
  {
    slug: "requena",
    name: "Requena",
    type: "day-trip",
    tagline: "Medieval wine town with underground caves, Bobal vineyards, and unforgettable gastronomy",
    heroImage: "/discover/requena-hero.webp",
    heroImageAlt: "Historic rooftops and church towers in Requena's Barrio de la Villa",
    heroImageProvenance: {
      status: "licensed",
      creator: "19Tarrestnom65",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Vista_de_Requena.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
    title: "Requena Day Trip from Valencia: Wine & Caves",
    description: "Plan a Requena day trip from Valencia, with transport guidance and practical tips for exploring wine caves, Bobal wineries and the medieval old town.",
    keywords: ["Requena day trip", "Requena wine", "Valencia wine country", "Bobal wine", "day trips from Valencia"],
    date: "2026-06-20",
    lastUpdated: "2026-06-20",
    audiences: ["couples", "luxury", "budget"],
    region: "Utiel-Requena",
    distanceFromValencia: "70 km west (1 hour)",
    hubs: ["day-trips"],
    overview: {
      paragraphs: [
        "Requena is Valencia's wine country — a fortified medieval town perched on a plateau 70km inland, surrounded by vineyards that produce Spain's finest Bobal wines. While tourists crowd the coast, this atmospheric little city offers underground Arabic caves, a beautifully preserved old quarter (La Villa), excellent restaurants, and wine tastings that cost a fraction of comparable experiences in Tuscany or Napa.",
        "The town's secret weapon is its underground cave network — the Cuevas de la Villa. During Moorish rule, these interconnected cellars beneath the old town were used for wine storage and, legend has it, for hiding during sieges. Today you can tour them with a guide, wandering through atmospheric tunnels that maintain a constant cool temperature even in summer.",
        "Beyond the caves, Requena rewards wandering. The medieval quarter has a Moorish castle, Gothic churches, and streets so narrow you can touch both walls. The surrounding DO Utiel-Requena wine region produces excellent reds and rosados from the indigenous Bobal grape — visit a bodega for a tasting and you'll discover a wine most visitors have never heard of.",
      ],
      quickFacts: [
        { label: "Distance", value: "70 km west (1 hour by car or train)" },
        { label: "Transport", value: "Cercanías C-3 from Valencia or A-3 motorway" },
        { label: "Best for", value: "Wine lovers, couples, foodies, history" },
        { label: "Time needed", value: "Full day recommended" },
      ],
    },
    highlights: [
      {
        name: "Cuevas de la Villa",
        description: "An underground network of caves beneath Requena's old town, dating from Moorish times. Used for centuries as wine cellars, storage, and refuge. Guided tours take you through atmospheric tunnels with constant cool temperatures.",
        icon: "🕳️",
        tip: "Book the guided tour at the tourist office in Plaza del Albornoz. Tours run several times daily. In summer, the caves are a refreshing 15°C — bring a light layer.",
      },
      {
        name: "La Villa (Medieval Quarter)",
        description: "Requena's walled old town — a tangle of narrow medieval streets, the Moorish alcázar ruins, Gothic churches, and noble houses with ornate doorways. Remarkably well-preserved and almost empty of tourists.",
        icon: "🏰",
        tip: "Enter through the Arco de la Villa gateway. The Iglesia de El Salvador has a beautifully carved Gothic portal. Don't miss the views from the castle ruins.",
      },
      {
        name: "Wine Tastings & Bodegas",
        description: "The DO Utiel-Requena wine region surrounds the town. Several bodegas offer tastings, from boutique family operations to larger estates. The indigenous Bobal grape produces outstanding reds and rosados.",
        icon: "🍷",
        tip: "Bodega Murviedro and Bodegas Vegalfaro are excellent and offer tours in English. Book ahead. Expect to pay €10-15 for a tasting with 4-5 wines.",
      },
      {
        name: "Museo del Vino",
        description: "A well-curated wine museum inside the Palacio del Cid, explaining the history of winemaking in the region from Roman times. Includes tastings and a shop with local wines at bodega prices.",
        icon: "🏛️",
        tip: "Good starting point to understand Bobal before visiting a bodega. The shop has excellent wines at €5-15 a bottle — much cheaper than Valencia.",
      },
    ],
    gettingThere: {
      summary: "Car gives the most flexibility for visiting bodegas. The train works for the town itself.",
      options: [
        { mode: "train", description: "Cercanías C-3 from Valencia Nord to Requena-Utiel", duration: "1 hour 10 min", cost: "~€5 return" },
        { mode: "car", description: "A-3 motorway west. Fast, easy drive through orange groves and vineyards.", duration: "1 hour", cost: "Toll-free" },
      ],
      parkingNotes: "Free parking outside the old town walls. The streets inside La Villa are too narrow for cars.",
    },
    bestTimeToVisit: {
      summary: "Autumn (harvest season) is magical, but spring is equally lovely with comfortable temperatures.",
      seasons: [
        { season: "spring", description: "Vineyards are green, temperatures perfect for walking the old town. Wildflowers in the countryside.", rating: 5 },
        { season: "summer", description: "Hot inland (38°C+), but the caves are a cool 15°C. Go early, taste wine, hide in caves during afternoon heat.", rating: 3 },
        { season: "autumn", description: "Harvest season (vendimia) — September/October. Bodegas buzz with activity. Grape-treading festivals. The best time to visit.", rating: 5 },
        { season: "winter", description: "Cold for Spain (5-10°C). Few tourists. Wine bars and restaurants are cosy. Good for a focused wine weekend.", rating: 3 },
      ],
    },
    whatToBring: {
      bring: ["Light layer for the caves (15°C inside)", "Comfortable shoes", "Designated driver or train tickets", "Appetite"],
      dontBring: ["Expectations of Napa-style glitz — this is rustic, authentic Spain"],
      rentInstead: ["Car (if you want to visit rural bodegas outside town)"],
    },
    accessibility: {
      overallRating: 2,
      summary: "The medieval old town has steep, narrow streets and uneven surfaces. The caves have steps. The newer part of town is flat and accessible.",
      wheelchairNotes: "La Villa is largely inaccessible — steep cobblestone streets and no ramps. The Museo del Vino and some bodegas outside town are accessible.",
      strollerNotes: "Very difficult in the old town. Leave the buggy at the car and carry. The newer town is fine.",
      publicTransportAccess: "Requena-Utiel train station has step-free access. Taxi or walk to old town (15 min).",
    },
    foodAndDrink: {
      summary: "Requena's food is hearty inland Valencian cuisine, with cured meats, rice dishes, seasonal produce and regional wine. Reserve destination restaurants and confirm transport if dining outside the old town.",
      recommendations: [
        { name: "Hotel La Villa restaurant", type: "Traditional regional", priceRange: "€€", tip: "Its old-town location is convenient for the caves; confirm current restaurant service with the hotel.", familyFriendly: true, sourceNote: "The Requena tourism guide lists Hotel La Villa Restaurante at Plaza del Albornoz 8 in the historic quarter.", sourceUrl: "https://guiasturisticasct.com/wp-content/uploads/Guia-REQUENA-2023.pdf", sourceCheckedAt: "2026-07-19" },
        { name: "La Posada de Águeda", type: "Traditional regional", priceRange: "€€", tip: "Located outside the pedestrian old-town circuit, so plan transport and reserve before visiting.", familyFriendly: true, sourceNote: "Michelin Guide confirms the Requena location, traditional local cooking and current lunch-only schedule.", sourceUrl: "https://guide.michelin.com/us/en/comunidad-valenciana/requena/restaurant/la-posada-de-agueda", sourceCheckedAt: "2026-07-19" },
      ],
      localSpeciality: "Embutidos (cured meats) and gazpachos manchegos — a hearty game stew with unleavened bread, not to be confused with the cold Andalusian soup.",
    },
    visitingHere: {
      summary: "A full day lets you explore the old town, tour the caves, taste wine, and have a proper long lunch. You can do a shorter half-day focused on the caves and old town.",
      idealDuration: "Full day (6-8 hours)",
      bestTimeOfDay: "Morning for the old town and caves, lunch by 2pm, afternoon for bodega visits",
      tips: [
        "Start with the Cuevas de la Villa tour (book at tourist office in Plaza del Albornoz).",
        "Wander La Villa medieval quarter after the caves — it's compact and beautiful.",
        "Confirm your chosen lunch venue before travelling; old-town and out-of-town restaurants require different transport plans.",
        "Afternoon: visit a bodega outside town (need car) or browse the Museo del Vino.",
      ],
    },
    practicalTips: [
      "If driving, designate a non-drinking driver or plan to spit at tastings. Spanish drink-driving limits are strict.",
      "The caves maintain 15°C year-round — bring a light jacket even in summer.",
      "Book bodega visits in advance, especially on weekends. Many are family-run with limited capacity.",
      "The town is very quiet on Mondays — some restaurants and the museum may be closed.",
    ],
    audienceTips: [
      {
        audience: "couples",
        tips: [
          "This is one of the most romantic day trips from Valencia. Wine tasting, medieval streets, long lunches.",
          "Book a private bodega tour for two — several offer this with cheese and charcuterie pairings.",
          "Stay for sunset over the vineyards if you have a car. The light is extraordinary.",
        ],
      },
    ],
    productWidgets: [],
    relatedDestinations: ["sagunto", "albufera"],
    relatedBlogPosts: [],
    faqs: [
      { question: "How do I get to Requena from Valencia?", answer: "Drive the A-3 motorway west (1 hour, toll-free) or take the Cercanías C-3 train from Valencia Nord (1 hour 10 min, ~€5 return). Car is better if you want to visit rural bodegas." },
      { question: "What wine is Requena known for?", answer: "The indigenous Bobal grape — Spain's third most planted red variety. It produces excellent reds and rosados. The DO Utiel-Requena region is increasingly recognized as one of Spain's best-value wine areas." },
      { question: "Are the Requena caves worth visiting?", answer: "Absolutely. The underground cave network beneath the medieval old town is unique. Tours take about 45 minutes and the constant 15°C temperature is a welcome escape from summer heat." },
    ],
  },

  // ===== PATACONA BEACH =====
  {
    slug: "patacona-beach",
    name: "Patacona Beach",
    type: "beach",
    tagline: "Valencia's quieter, more local beach — families, volleyball, and sunset paella",
    heroImage: "/discover/patacona-hero.webp",
    heroImageAlt: "Wide sandy Patacona Beach with colourful beach huts and the Mediterranean Sea",
    heroImageProvenance: {
      status: "licensed",
      creator: "JaGa9480",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Playa_de_la_Patacona.jpg",
      license: "CC BY-SA 4.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
    title: "Patacona Beach Valencia: Local Visitor Guide",
    description: "Plan a day at Patacona Beach in Valencia, with practical guidance on access, facilities, family visits, beach restaurants and nearby Malvarrosa.",
    keywords: ["Patacona beach Valencia", "best beaches Valencia", "quiet beach Valencia", "Alboraya beach", "Valencia beaches guide"],
    date: "2026-06-20",
    lastUpdated: "2026-06-20",
    audiences: ["families", "couples", "digital-nomads", "budget"],
    region: "Alboraya / North Coast",
    hubs: ["beaches"],
    overview: {
      paragraphs: [
        "Patacona is the beach Valencians recommend when tourists ask where to go. Just north of the city's main Las Arenas and Malvarrosa beaches, Patacona technically belongs to the municipality of Alboraya but is seamlessly connected — you can walk here from Malvarrosa in 15 minutes along the promenade.",
        "The difference is immediately noticeable: wider sand, fewer sunbeds-for-rent, more space between towels, and a distinctly local atmosphere. Families set up camp for the day with cooler boxes and beach games. Beach volleyball nets line the southern end. The chiringuitos (beach bars) are friendlier and less corporate. And the paella restaurants along the seafront serve some of the best rice dishes in the region.",
        "Patacona is where you come when you want a proper beach day without the tourist intensity of Las Arenas. The water is the same clean Mediterranean blue, the sand is the same golden quality, but the vibe is noticeably more relaxed. For families with kids, it's the best beach in the Valencia area.",
      ],
      quickFacts: [
        { label: "Getting there", value: "Tram L4/L6 to La Patacona or walk from Malvarrosa (15 min)" },
        { label: "Best for", value: "Families, locals, beach volleyball, paella" },
        { label: "Vibe", value: "Relaxed, local, spacious" },
        { label: "Facilities", value: "Chiringuitos, showers, lifeguards (summer)" },
      ],
    },
    highlights: [
      {
        name: "Wide, Spacious Beach",
        description: "Patacona's beach is noticeably wider and less crowded than the city beaches to the south. Even in peak summer, you can find space. The sand is clean and golden, the water shallow and safe for children.",
        icon: "🏖️",
        tip: "The northern end (towards Alboraya) is the quietest. Walk past the volleyball nets for the most space.",
      },
      {
        name: "Beach Volleyball Hub",
        description: "The southern end of Patacona has permanent volleyball nets and is Valencia's unofficial beach volleyball capital. Pick-up games happen every evening in summer. There's usually room to join.",
        icon: "🏐",
        tip: "Evening games start around 6-7pm. Bring your own ball or ask to join — the regulars are welcoming.",
      },
      {
        name: "Seafront Paella Restaurants",
        description: "Rice restaurants and Mediterranean terraces line the Paseo Marítimo, making lunch easy to combine with a beach day when booked separately.",
        icon: "🥘",
        tip: "Casa Patacona and La Chipirona both publish current venue information online. Reserve weekend rice lunches directly.",
      },
      {
        name: "Horchata in Alboraya",
        description: "Patacona borders Alboraya, the town where horchata was invented. The surrounding farms still grow the tiger nuts (chufas) used to make Valencia's signature drink. Several traditional horchaterías are a short walk from the beach.",
        icon: "🥛",
        tip: "Horchatería Daniel (the original, not the Mercado de Colón branch) is a 10-minute walk into Alboraya. The horchata is made fresh from locally-grown chufas.",
      },
    ],
    gettingThere: {
      summary: "Walk from Malvarrosa, take the tram, or cycle the promenade.",
      options: [
        { mode: "tram", description: "Lines L4/L6 to La Patacona stop — direct from the city centre via Pont de Fusta", duration: "20 min from centre", cost: "€1.50" },
        { mode: "walk", description: "Walk north along the promenade from Malvarrosa beach. Flat, paved, scenic.", duration: "15 min from Malvarrosa" },
        { mode: "bike", description: "Flat cycle along the seafront. Valenbisi stations available. One of Valencia's best rides.", duration: "25 min from centre", cost: "€2 (Valenbisi)" },
      ],
      parkingNotes: "Free street parking in the residential streets behind the beach. Easier to find than at Las Arenas, especially on weekdays.",
    },
    bestTimeToVisit: {
      summary: "June-September for swimming. May and October still warm enough for comfortable beach days without the crowds.",
      seasons: [
        { season: "spring", description: "Warm enough for sunbathing from May. Beach is quiet. Water still cool for swimming.", rating: 4 },
        { season: "summer", description: "Peak season. Arrive before 10am for the best spot. Water is warm and perfect. Lifeguards on duty.", rating: 5 },
        { season: "autumn", description: "September-October is the secret season — warm water, empty beach, golden light. Locals' favourite time.", rating: 5 },
        { season: "winter", description: "Cool but sunny. Pleasant for walks along the promenade. Some chiringuitos close.", rating: 2 },
      ],
    },
    whatToBring: {
      bring: ["Sun cream", "Water and snacks", "Beach towel", "Cash for chiringuitos"],
      dontBring: ["Valuables (no lockers)", "Glass bottles (banned on all Valencia beaches)"],
      rentInstead: ["Beach umbrella and chairs set", "Stroller for the promenade", "Beach toys for kids"],
    },
    accessibility: {
      overallRating: 4,
      summary: "The promenade is fully paved and accessible. The beach has wooden walkways extending to the sand in summer. The tram stop has step-free access.",
      wheelchairNotes: "The promenade is excellent. Wooden beach walkways provide access to the sand line. Some chiringuitos have accessible terraces.",
      strollerNotes: "Very easy. Flat promenade, wide paths, no obstacles. One of the best beaches for buggies.",
      publicTransportAccess: "Tram stop La Patacona has step-free platform access.",
    },
    foodAndDrink: {
      summary: "Patacona's seafront has rice restaurants, cafés and beach-adjacent terraces. Reserve a rice lunch separately from your beach setup and check current service hours before travelling.",
      recommendations: [
        { name: "Casa Patacona", type: "Mediterranean rice restaurant", priceRange: "€€€", tip: "Reserve rice dishes for weekend lunch and confirm the current menu directly.", familyFriendly: true, sourceNote: "Official site confirms the Paseo Marítimo 14 location, Mediterranean menu and Valencian rice focus.", sourceUrl: "https://casapatacona.com/", sourceCheckedAt: "2026-07-19" },
        { name: "La Chipirona", type: "Beachfront restaurant & terrace", priceRange: "€€€", tip: "Check current meal service and reserve if the terrace is important to your plans.", familyFriendly: true, sourceNote: "Official venue site confirms the active beachfront hotel and restaurant at La Patacona.", sourceUrl: "https://www.lachipirona.com/", sourceCheckedAt: "2026-07-19" },
      ],
      localSpeciality: "Arroz a banda — a rich fish stock rice dish where the fish is served separately. A fisherman's dish originally from this coast, and it's outstanding here.",
    },
    visitingHere: {
      summary: "A beach day at Patacona is a full-day affair. Arrive mid-morning, swim, eat paella for lunch, siesta on the sand, sunset drinks.",
      idealDuration: "Half day to full day",
      bestTimeOfDay: "Arrive by 10am in summer, stay for sunset",
      tips: [
        "Arrive early in summer to claim your spot. The northern end is always quietest.",
        "Book a seafront paella lunch for 1:30-2pm — the traditional time.",
        "After lunch, walk into Alboraya for horchata at the original Daniel horchatería.",
        "Stay for sunset — Patacona faces east but the evening light on the water is beautiful.",
      ],
    },
    practicalTips: [
      "Glass bottles are banned on all Valencia beaches. Bring cans or plastic.",
      "Lifeguards are on duty June-September. Red flag = no swimming, yellow = caution, green = safe.",
      "The water is shallow for a long way out — excellent for kids but you need to wade far to swim properly.",
      "Jellyfish occasionally appear in late summer. Check the flag system at lifeguard towers.",
    ],
    audienceTips: [
      {
        audience: "families",
        tips: [
          "Patacona is Valencia's best family beach — wider, calmer, and more spacious than Las Arenas.",
          "The shallow water extends far out, making it very safe for small children.",
          "Rent a beach set (umbrella + chairs + toys) and you're sorted for the day.",
        ],
      },
      {
        audience: "digital-nomads",
        tips: [
          "Morning work at a café in Alboraya, afternoon beach break at Patacona — the nomad dream.",
          "Several chiringuitos have Wi-Fi, but it's unreliable. Bring a hotspot for serious work.",
          "Long-term rentals near Patacona are cheaper than Cabanyal and quieter.",
        ],
      },
    ],
    productWidgets: [
      { categorySlug: "travel-outdoors", heading: "Beach day sorted", afterSection: "Highlights" },
      { categorySlug: "baby-gear", heading: "Beach day with the little ones?", afterSection: "Practical Tips" },
    ],
    relatedDestinations: ["malvarrosa-beach", "cabanyal", "turia-gardens"],
    relatedBlogPosts: ["valencia-with-kids-complete-guide"],
    faqs: [
      { question: "Is Patacona Beach better than Malvarrosa?", answer: "For families and anyone wanting more space, yes. Patacona is wider, less crowded, and has a more local atmosphere. Malvarrosa is closer to the city and has more nightlife. Both have the same water quality." },
      { question: "How do I get to Patacona from Valencia centre?", answer: "Tram L4/L6 to La Patacona (20 min from centre), or walk north along the promenade from Malvarrosa (15 min). Cycling the seafront is also easy and enjoyable." },
      { question: "Are there restaurants at Patacona Beach?", answer: "Yes — a row of excellent paella and seafood restaurants line the seafront. They're less touristy than the Las Arenas strip and serve to a primarily local crowd." },
    ],
  },

  // ===== XÀTIVA =====
  {
    slug: "xativa",
    name: "Xàtiva",
    type: "day-trip",
    tagline: "Dramatic hilltop castle, Borgia family history, and one of Spain's most beautiful small towns",
    heroImage: "/discover/xativa-hero.webp",
    heroImageAlt: "Xàtiva Castle walls and towers extending along the rocky mountain ridge",
    heroImageProvenance: {
      status: "licensed",
      creator: "Manuel pino",
      sourceUrl: "https://commons.wikimedia.org/wiki/File:Castillo_de_x%C3%A1tiva_-_panoramio.jpg",
      license: "CC BY-SA 3.0",
      licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/",
      verifiedAt: "2026-07-19",
      modifications: "Cropped and resized to 16:9 WebP.",
    },
    title: "Xàtiva Day Trip from Valencia: Castle Guide",
    description: "Plan a Xàtiva day trip from Valencia, with train guidance and practical tips for visiting the hilltop castle, Borgia landmarks and historic old town.",
    keywords: ["Xàtiva day trip", "Xàtiva castle", "Xàtiva from Valencia", "Borgia family", "day trips Valencia Spain"],
    date: "2026-06-20",
    lastUpdated: "2026-06-20",
    audiences: ["families", "couples", "budget"],
    region: "La Costera",
    distanceFromValencia: "60 km south (1 hour)",
    hubs: ["day-trips"],
    overview: {
      paragraphs: [
        "Xàtiva (pronounced 'SHA-tee-va') is arguably the most spectacular day trip from Valencia. This ancient city, birthplace of two Borgia popes and once the second city of the Kingdom of Valencia, is crowned by a jaw-dropping castle that stretches along an entire mountain ridge — one of the most dramatic fortifications in Spain.",
        "The castle alone would justify the trip, but Xàtiva's old town is equally rewarding. The Colegiata basilica, the narrow streets climbing towards the castle, the Almudín (medieval grain exchange) housing a museum, and the famous upside-down portrait of Philip V in the town museum — hung inverted as revenge for his burning of the city in 1707 and never righted since.",
        "Xàtiva sits in a fertile valley surrounded by mountains, orange groves, and rice paddies. The town has excellent restaurants serving local cuisine (the arnadí dessert is unique to the area), and the pace of life is wonderfully slow. The Cercanías train from Valencia takes about an hour and costs under €6 return.",
      ],
      quickFacts: [
        { label: "Distance", value: "60 km south (1 hour by train)" },
        { label: "Train", value: "Cercanías C-2 from Valencia Nord to Xàtiva" },
        { label: "Cost", value: "~€5.50 return + €6 castle entry" },
        { label: "Time needed", value: "Full day recommended" },
      ],
    },
    highlights: [
      {
        name: "Xàtiva Castle",
        description: "One of Spain's most spectacular castles — actually two linked fortifications (Castell Menor and Castell Major) stretching along a dramatic rocky ridge. Views from the walls encompass the entire Valencian plain from the mountains to the sea. Hannibal reportedly passed through, and the Borgias were born in its shadow.",
        icon: "🏰",
        tip: "The castle is a 30-minute steep uphill walk from the old town, or take the tourist road train (€3 return). Go early morning in summer — there's limited shade. Bring water.",
        googleMapsUrl: "https://maps.google.com/?q=Castillo+de+Xàtiva",
      },
      {
        name: "The Upside-Down Portrait",
        description: "In the Museo de Bellas Artes, a portrait of King Philip V hangs deliberately upside down — Xàtiva's centuries-long protest against his order to burn the city during the War of Spanish Succession in 1707. The museum has refused to right it ever since. It's petty, magnificent, and very Spanish.",
        icon: "🖼️",
        tip: "The museum is in the Almudín (medieval grain exchange). The building itself is beautiful. Ask the staff about the portrait — they love telling the story.",
      },
      {
        name: "Colegiata Basílica",
        description: "A massive Renaissance basilica that was never finished — the planned nave was to be the largest in Spain. What exists is still imposing: a beautiful apse, carved stonework, and a serene interior. The views from the square outside are lovely.",
        icon: "⛪",
        tip: "Free entry. The basilica is on the walking route from town to castle — perfect for a rest stop on the way up.",
        googleMapsUrl: "https://maps.google.com/?q=Colegiata+de+Xàtiva",
      },
      {
        name: "Old Town & Fountains",
        description: "Xàtiva is famous for its 25 historic fountains scattered through the old town. The main street (Calle Montcada) is lined with noble houses, and the climb towards the castle passes through increasingly atmospheric medieval streets.",
        icon: "⛲",
        tip: "Pick up a fountain walking route map from the tourist office. The Fuente de los 25 Caños (25 Spouts Fountain) at the town entrance is the most photogenic.",
      },
    ],
    gettingThere: {
      summary: "The Cercanías train runs hourly from Valencia Nord. Easy, comfortable, and scenic.",
      options: [
        { mode: "train", description: "Cercanías C-2 from Valencia Nord to Xàtiva. Scenic ride through orange groves and rice paddies.", duration: "1 hour", cost: "~€5.50 return" },
        { mode: "car", description: "A-7 motorway south, then CV-40 to Xàtiva. Easy drive.", duration: "50 min", cost: "Toll-free" },
      ],
      parkingNotes: "Free parking near the Alameda park at the base of town. The old town streets are narrow — park and walk.",
    },
    bestTimeToVisit: {
      summary: "Spring and autumn are ideal. Summer is very hot — the castle climb in full sun is gruelling after 11am.",
      seasons: [
        { season: "spring", description: "Perfect — wildflowers on the castle hill, comfortable climbing temperatures, orange blossoms in the valley.", rating: 5 },
        { season: "summer", description: "Brutally hot (38°C+). The castle climb is exposed. Go at 9am opening or don't go. The tourist train helps.", rating: 2 },
        { season: "autumn", description: "Excellent — golden light, comfortable temperatures, harvest season in the surrounding fields.", rating: 5 },
        { season: "winter", description: "Mild (8-15°C). Clear views from the castle. The town is quiet and atmospheric. Some restaurants close Monday.", rating: 4 },
      ],
    },
    whatToBring: {
      bring: ["Water (1L minimum per person)", "Comfortable shoes with grip", "Sun protection in summer", "Camera"],
      dontBring: ["Heels or flip-flops (the castle path is rough)", "Heavy bags"],
      rentInstead: ["Compact stroller (only useful in the flat old town, not the castle)"],
    },
    accessibility: {
      overallRating: 2,
      summary: "The castle is not accessible — steep climb with uneven terrain. The old town is partially accessible on main streets. The tourist road train makes the castle approachable for those with limited mobility.",
      wheelchairNotes: "The castle is not wheelchair accessible. The flat parts of the old town (Calle Montcada, Plaça del Mercat) are manageable. The tourist road train reaches the castle car park — from there, the castle grounds are rough.",
      strollerNotes: "The old town is fine with a compact stroller. Don't attempt the castle walk with a pushchair — it's too steep and rough. The tourist train is the alternative.",
      publicTransportAccess: "Xàtiva train station has step-free access. The walk to the old town is flat (10 minutes).",
    },
    foodAndDrink: {
      summary: "Xàtiva's traditional restaurants are a useful place to try local rice dishes and desserts after the castle. Opening days vary, so reserve or confirm service before travelling.",
      recommendations: [
        { name: "Casa La Abuela", type: "Traditional Valencian", priceRange: "€€", tip: "Reserve for lunch and ask which Xàtiva specialities are available that day.", familyFriendly: true, sourceNote: "Xàtiva tourism and current local reporting confirm the Reina 17 restaurant, its long history and arròs al forn tradition.", sourceUrl: "https://xativaturismo.com/wp-content/uploads/2021/10/fira-gastro-quadrat.pdf", sourceCheckedAt: "2026-07-19" },
        { name: "El Cullerot", type: "Traditional Mediterranean & rice", priceRange: "€€", tip: "Check its limited opening days and reserve rice dishes in advance.", familyFriendly: true, sourceNote: "Official restaurant site confirms the Plaça del Mercat 10 location, current hours and rice-focused menu.", sourceUrl: "https://elcullerot.com/", sourceCheckedAt: "2026-07-19" },
      ],
      localSpeciality: "Arnadí — a unique Xàtiva dessert made from pumpkin, almonds, sugar, and egg. Found almost nowhere else. Also try the coca de llanda (simple sponge cake) that every bakery makes.",
    },
    visitingHere: {
      summary: "Start early (especially in summer), see the castle, then descend through the old town for lunch. The tourist road train saves energy for the castle itself.",
      idealDuration: "5-7 hours (full day)",
      bestTimeOfDay: "Arrive by 10am, castle first (before heat), old town and lunch after descending",
      tips: [
        "Take the tourist road train (trenecito) up, walk down through the old town. Saves energy for exploring the castle itself.",
        "The castle has two sections — Castell Menor (ruined, atmospheric) and Castell Major (restored, museum). Both are worth exploring.",
        "Descend through the old town streets (not the road). Stop at the Colegiata and museum on the way down.",
        "Reserve lunch at a currently operating old-town restaurant and ask whether arnadí or another local dessert is available.",
      ],
    },
    practicalTips: [
      "Castle entry is €6 adults, free under 12. The tourist road train is €3 return (runs from near the tourist office).",
      "The castle is open 10am-6pm (winter) / 10am-7pm (summer). Closed Mondays.",
      "Bring at least 1L of water per person. There's a small café at the castle with drinks and snacks.",
      "The walk from train station to old town is flat (10 min). From old town to castle is 30 min uphill.",
      "Ask the museum staff about the upside-down portrait — they take genuine pride in telling the story.",
    ],
    audienceTips: [
      {
        audience: "families",
        tips: [
          "Kids love the castle — it's massive, explorable, and feels like a real adventure. The views keep them engaged.",
          "The tourist train up is fun for children and saves the climb for exploring the castle itself.",
          "Pack a picnic — the castle grounds have spots with views where you can eat.",
        ],
      },
      {
        audience: "couples",
        tips: [
          "One of the most romantic day trips from Valencia. The castle views are breathtaking, the old town is atmospheric.",
          "Reserve a current old-town restaurant for lunch and leave enough time to walk down from the castle.",
          "The walk down from the castle through the medieval streets at golden hour is magical.",
        ],
      },
    ],
    productWidgets: [
      { categorySlug: "baby-gear", heading: "Day trip with little ones?", afterSection: "Practical Tips" },
    ],
    relatedDestinations: ["sagunto", "requena", "albufera"],
    relatedBlogPosts: ["valencia-with-kids-complete-guide"],
    faqs: [
      { question: "How do I get to Xàtiva from Valencia?", answer: "Take the Cercanías C-2 train from Valencia Nord station. It runs hourly, takes about 1 hour, and costs ~€5.50 return. The scenic ride passes through orange groves and rice paddies." },
      { question: "Is Xàtiva Castle worth visiting?", answer: "Absolutely — it's one of Spain's most dramatic castles. The twin fortifications stretch along an entire mountain ridge with 360° views from mountains to sea. Combined with the charming old town and Borgia history, it's the best full-day trip from Valencia." },
      { question: "What is the upside-down portrait in Xàtiva?", answer: "A portrait of King Philip V in the town museum, hung deliberately upside down since the 18th century. It's Xàtiva's protest against his order to burn the city in 1707 during the War of Spanish Succession. The museum has never righted it." },
    ],
  },
];
