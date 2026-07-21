import { products, type Product } from "./products";

export interface BundleItem {
  name: string;
  quantity?: string;
  note?: string;
  productSlug?: string;
}

export interface BundleAddon {
  name: string;
  note: string;
  productSlug?: string;
}

export interface BundleFAQ {
  question: string;
  answer: string;
}

export interface RentalBundle {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  tagline: string;
  description: string;
  image: string;
  accent: "teal" | "amber" | "blue" | "green";
  bestFor: string[];
  includedItems: BundleItem[];
  addons: BundleAddon[];
  relatedProductSlugs: string[];
  relatedGuideSlugs: string[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  faqs: BundleFAQ[];
}

export const rentalBundles: RentalBundle[] = [
  {
    slug: "family-beach-kit",
    name: "Family Beach Kit Valencia",
    shortName: "Family Beach Kit",
    eyebrow: "Beach & Outdoor",
    tagline: "Shade, cold drinks, toys, and a way to carry it all.",
    description:
      "A ready-to-go beach setup for Malvarrosa, Patacona, Cabanyal, and El Saler days with children. Start with the essentials, then add baby or toddler extras if you need them.",
    image: "/categories/travel-outdoors.webp",
    accent: "amber",
    bestFor: ["Beach days with children", "Malvarrosa or Patacona stays", "Families without a car", "Hot July and August trips"],
    includedItems: [
      { name: "Beach trolley or wagon", note: "For towels, shade, toys, and drinks" },
      { name: "Beach umbrella or shade tent", productSlug: "beach-umbrella-set" },
      { name: "Cooler bag or box" },
      { name: "Beach chairs or mat", quantity: "2-4" },
      { name: "Sand toys", note: "Age-appropriate starter set" },
      { name: "Waterproof pouch", note: "For phones, keys, and small valuables" },
    ],
    addons: [
      { name: "Compact stroller", note: "Useful for tired toddlers after the beach", productSlug: "compact-stroller" },
      { name: "Beach umbrella set", note: "Extra shade for larger families", productSlug: "beach-umbrella-set" },
      { name: "Portable fan", note: "For naps, terraces, and hot apartments" },
      { name: "Toddler toy pack", note: "For downtime back at the apartment" },
    ],
    relatedProductSlugs: ["beach-umbrella-set", "compact-stroller"],
    relatedGuideSlugs: ["best-beaches-valencia-families", "valencia-summer-survival-guide", "valencia-with-kids-complete-guide"],
    seo: {
      title: "Family Beach Kit Rental in Valencia",
      description:
        "Rent a Valencia family beach kit with trolley, shade, cooler, chairs, toys, and add-ons delivered to your hotel, Airbnb, or apartment.",
      keywords: ["family beach kit Valencia", "beach equipment rental Valencia", "beach trolley rental Valencia"],
    },
    faqs: [
      {
        question: "Can you deliver the kit before our beach day?",
        answer:
          "Yes. The intended flow is delivery to your accommodation before you go, with collection after your rental window.",
      },
      {
        question: "Can we customise the beach kit?",
        answer:
          "Yes. The bundle layer is designed for add-ons and substitutions, especially for baby, toddler, shade, and cooling needs.",
      },
    ],
  },
  {
    slug: "baby-arrival-kit",
    name: "Baby Arrival Kit Valencia",
    shortName: "Baby Arrival Kit",
    eyebrow: "Baby & Toddler",
    tagline: "The core baby setup ready at your apartment before arrival.",
    description:
      "A practical starter kit for parents arriving in Valencia with babies or young toddlers. Built around sleep, feeding, stroller, bath, and apartment comfort.",
    image: "/categories/baby-gear.webp",
    accent: "teal",
    bestFor: ["Babies and toddlers", "Hotels and Airbnbs", "1-4 week family stays", "Parents who want to pack lighter"],
    includedItems: [
      { name: "Travel cot", note: "With fitted sheet where available", productSlug: "travel-crib" },
      { name: "High chair", productSlug: "high-chair" },
      { name: "Compact stroller", productSlug: "compact-stroller" },
      { name: "Baby bath" },
      { name: "Play mat" },
      { name: "Baby monitor", note: "Subject to stock and apartment layout" },
    ],
    addons: [
      { name: "Double stroller", note: "For twins or siblings", productSlug: "double-stroller" },
      { name: "Infant car seat", note: "High-trust item; requires careful confirmation", productSlug: "car-seat-infant" },
      { name: "Blackout blind", note: "Helpful for naps in bright apartments" },
      { name: "Baby carrier", note: "Useful for old-town streets and short trips" },
    ],
    relatedProductSlugs: ["travel-crib", "compact-stroller", "high-chair", "car-seat-infant"],
    relatedGuideSlugs: ["valencia-with-kids-complete-guide"],
    seo: {
      title: "Baby Arrival Kit Rental in Valencia",
      description:
        "Rent a baby arrival kit in Valencia with cot, high chair, stroller, baby bath, play mat, and optional baby add-ons.",
      keywords: ["baby equipment rental Valencia", "baby kit Valencia", "travel cot rental Valencia"],
    },
    faqs: [
      {
        question: "Is this meant to replace packing baby gear?",
        answer:
          "It is designed to cover the bulky essentials so parents can fly with less and still have a practical baby setup ready locally.",
      },
      {
        question: "Can we remove items we do not need?",
        answer:
          "Yes. The long-term bundle model should support optional items, substitutions, and staff-reviewed custom requests.",
      },
    ],
  },
  {
    slug: "toddler-city-kit",
    name: "Toddler City Kit Valencia",
    shortName: "Toddler City Kit",
    eyebrow: "Kids & Family",
    tagline: "For park days, beach promenades, Turia Gardens, and tired legs.",
    description:
      "A city-friendly kit for toddlers and young children exploring Valencia with parents. It connects stroller backup, movement, snacks, and small play moments.",
    image: "/categories/baby-gear.webp",
    accent: "green",
    bestFor: ["Toddlers", "Turia Gardens days", "Long city walks", "Families staying near the centre or beach"],
    includedItems: [
      { name: "Compact stroller", productSlug: "compact-stroller" },
      { name: "Kids scooter or balance bike", note: "Subject to age and stock" },
      { name: "Helmet" },
      { name: "Snack tray or small travel accessory" },
      { name: "Toy pack" },
      { name: "Beach toys add-on option" },
    ],
    addons: [
      { name: "Beach umbrella set", note: "For beach days", productSlug: "beach-umbrella-set" },
      { name: "Travel cot", note: "If the trip also needs sleep gear", productSlug: "travel-crib" },
      { name: "Double stroller", note: "For siblings", productSlug: "double-stroller" },
    ],
    relatedProductSlugs: ["compact-stroller", "double-stroller", "beach-umbrella-set"],
    relatedGuideSlugs: ["valencia-with-kids-complete-guide", "best-beaches-valencia-families"],
    seo: {
      title: "Toddler City Kit Rental in Valencia",
      description:
        "Rent toddler-friendly Valencia gear with stroller, scooter or balance bike, helmet, toy pack, and beach add-ons.",
      keywords: ["Valencia with toddlers", "kids scooter rental Valencia", "stroller rental Valencia"],
    },
    faqs: [
      {
        question: "Is this different from the Baby Arrival Kit?",
        answer:
          "Yes. Baby Arrival is for sleep and baby setup. Toddler City is for movement, play, and exploring Valencia with small children.",
      },
    ],
  },
  {
    slug: "remote-work-apartment-kit",
    name: "Remote Work Apartment Kit Valencia",
    shortName: "Remote Work Kit",
    eyebrow: "Remote Work",
    tagline: "Turn a short-stay apartment into a real work setup.",
    description:
      "A practical workstation bundle for digital nomads, founders, and remote employees staying in Valencia apartments for more than a few days.",
    image: "/categories/remote-work.webp",
    accent: "blue",
    bestFor: ["Digital nomads", "Long-stay professionals", "Couples working remotely", "Apartments without proper desks"],
    includedItems: [
      { name: "External monitor", note: "27-inch where available", productSlug: "monitor-27" },
      { name: "Laptop stand" },
      { name: "Keyboard and mouse" },
      { name: "USB-C hub or cable kit" },
      { name: "Ergonomic chair", note: "Optional depending on apartment and delivery constraints", productSlug: "ergonomic-chair" },
    ],
    addons: [
      { name: "Standing desk", note: "For longer stays", productSlug: "standing-desk" },
      { name: "Second monitor", note: "For heavier work setups", productSlug: "monitor-27" },
      { name: "Webcam or lighting", note: "For calls and content work" },
    ],
    relatedProductSlugs: ["monitor-27", "standing-desk", "ergonomic-chair"],
    relatedGuideSlugs: ["digital-nomad-guide-valencia"],
    seo: {
      title: "Remote Work Equipment Rental in Valencia",
      description:
        "Rent a remote work apartment kit in Valencia with monitor, laptop stand, keyboard, mouse, cables, and optional ergonomic chair.",
      keywords: ["remote work equipment Valencia", "monitor rental Valencia", "digital nomad equipment Valencia"],
    },
    faqs: [
      {
        question: "Is this better than coworking?",
        answer:
          "For many long-stay visitors it complements or replaces coworking by making the apartment comfortable for focused calls and deep work.",
      },
    ],
  },
  {
    slug: "summer-apartment-survival-kit",
    name: "Summer Apartment Survival Kit Valencia",
    shortName: "Summer Apartment Kit",
    eyebrow: "Apartment Comfort",
    tagline: "Cooling and comfort for hot Valencia apartments.",
    description:
      "A seasonal kit for July, August, and heat-wave stays where the apartment has weak AC, bright bedrooms, or poor air movement.",
    image: "/categories/home-living.webp",
    accent: "amber",
    bestFor: ["July and August stays", "Apartments with weak AC", "Families with naps", "Long-stay guests"],
    includedItems: [
      { name: "Portable AC or fan", note: "Selected based on room and availability" },
      { name: "Blackout blind", note: "Helpful for bedrooms and naps" },
      { name: "Air purifier", note: "Useful during dust or allergy periods", productSlug: "air-purifier" },
      { name: "Cooler or beach shade add-on" },
    ],
    addons: [
      { name: "Portable AC", note: "Best for bedrooms with window venting", productSlug: "portable-ac" },
      { name: "Air purifier", note: "For air quality and allergies", productSlug: "air-purifier" },
      { name: "Beach umbrella set", note: "For shade away from the apartment", productSlug: "beach-umbrella-set" },
    ],
    relatedProductSlugs: ["portable-ac", "air-purifier", "beach-umbrella-set"],
    relatedGuideSlugs: ["valencia-summer-survival-guide", "best-beaches-valencia-families"],
    seo: {
      title: "Summer Apartment Comfort Rental in Valencia",
      description:
        "Rent cooling and apartment comfort gear in Valencia, including portable AC, fans, blackout help, air purifiers, and beach shade.",
      keywords: ["portable AC rental Valencia", "summer apartment Valencia", "fan rental Valencia"],
    },
    faqs: [
      {
        question: "Can every apartment use a portable AC?",
        answer:
          "No. Portable AC units need venting through a window or balcony door, so we should confirm the room setup before promising one.",
      },
    ],
  },
  {
    slug: "accessible-valencia-kit",
    name: "Accessible Valencia Kit",
    shortName: "Accessible Valencia Kit",
    eyebrow: "Mobility & Accessibility",
    tagline: "Mobility support for longer Valencia days.",
    description:
      "A careful, support-led kit for visitors who need mobility help around Turia Gardens, the City of Arts and Sciences, beach promenades, and accessible accommodation.",
    image: "/categories/mobility.webp",
    accent: "teal",
    bestFor: ["Reduced mobility", "Senior travellers", "Accessible sightseeing", "Long walking days"],
    includedItems: [
      { name: "Wheelchair or rollator", note: "Selected based on user needs" },
      { name: "Shower chair" },
      { name: "Raised toilet seat", note: "Where suitable" },
      { name: "Mobility scooter option", note: "Requires fit, battery, and delivery confirmation" },
    ],
    addons: [
      { name: "Lightweight transport wheelchair", note: "For reliable companion-assisted support", productSlug: "transport-wheelchair" },
      { name: "Mobility scooter", note: "For longer distances", productSlug: "mobility-scooter-lightweight" },
      { name: "Portable ramp", note: "Only where dimensions and safety are confirmed" },
    ],
    relatedProductSlugs: ["transport-wheelchair", "mobility-scooter-lightweight", "rollator-walker"],
    relatedGuideSlugs: ["wheelchair-accessibility-valencia"],
    seo: {
      title: "Accessible Valencia Kit Rental",
      description:
        "Rent mobility and accessibility support in Valencia with wheelchair, rollator, shower chair, raised toilet seat, and scooter options.",
      keywords: ["wheelchair rental Valencia", "mobility scooter rental Valencia", "accessible Valencia"],
    },
    faqs: [
      {
        question: "Do mobility items need extra confirmation?",
        answer:
          "Yes. Mobility and accessibility rentals should be confirmed carefully around fit, apartment access, battery needs, delivery, and safe use.",
      },
    ],
  },
  {
    slug: "grandparents-visiting-kit",
    name: "Grandparents Visiting Kit Valencia",
    shortName: "Grandparents Visiting Kit",
    eyebrow: "Mobility & Accessibility",
    tagline: "Comfort, mobility, and heat support for older visitors.",
    description:
      "A practical support kit for families hosting parents or grandparents in Valencia. It combines light mobility help, bathroom support, cooling, and comfort items for easier days out and calmer apartment time.",
    image: "/categories/mobility.webp",
    accent: "green",
    bestFor: ["Older visitors", "Multi-generation family trips", "Summer stays", "Longer sightseeing days"],
    includedItems: [
      { name: "Rollator or wheelchair", note: "Selected based on the visitor's needs" },
      { name: "Shower chair" },
      { name: "Raised toilet seat option" },
      { name: "Fan or cooling support", note: "Especially useful in July and August" },
      { name: "Comfort add-ons", note: "Based on apartment setup and stay length" },
    ],
    addons: [
      { name: "Rollator walker", note: "For stable walking support", productSlug: "rollator-walker" },
      { name: "Lightweight transport wheelchair", note: "For companion-assisted longer days out", productSlug: "transport-wheelchair" },
      { name: "Portable AC", note: "For hot bedrooms where setup allows it", productSlug: "portable-ac" },
      { name: "Mobility scooter", note: "For longer distances after careful confirmation", productSlug: "mobility-scooter-lightweight" },
    ],
    relatedProductSlugs: ["rollator-walker", "transport-wheelchair", "portable-ac"],
    relatedGuideSlugs: ["wheelchair-accessibility-valencia", "valencia-summer-survival-guide"],
    seo: {
      title: "Grandparents Visiting Kit Rental in Valencia",
      description:
        "Rent mobility, bathroom safety, cooling, and comfort support for grandparents or older visitors staying in Valencia.",
      keywords: ["Valencia with grandparents", "senior travel Valencia", "mobility aid rental Valencia"],
    },
    faqs: [
      {
        question: "Is this only for people with major mobility needs?",
        answer:
          "No. It is also useful for older visitors who can walk but need comfort, stability, cooling, or backup support for longer Valencia days.",
      },
    ],
  },
  {
    slug: "long-stay-kitchen-upgrade-kit",
    name: "Long-Stay Kitchen Upgrade Kit Valencia",
    shortName: "Kitchen Upgrade Kit",
    eyebrow: "Apartment Comfort",
    tagline: "Make a temporary apartment easier to actually live in.",
    description:
      "A long-stay comfort kit for families, remote workers, and guests frustrated by under-equipped Airbnb kitchens. It starts with practical appliance and dining upgrades, then adapts to the stay.",
    image: "/categories/home-living.webp",
    accent: "blue",
    bestFor: ["Long-stay apartments", "Families cooking at home", "Remote workers", "Airbnbs with minimal kitchen gear"],
    includedItems: [
      { name: "Air fryer or multicooker option", note: "Demand-tested before overstocking" },
      { name: "Blender or coffee upgrade option" },
      { name: "Child-friendly dinnerware option" },
      { name: "Kitchen basics add-on list", note: "Confirmed based on what the apartment lacks" },
    ],
    addons: [
      { name: "Air purifier", note: "For apartment air quality", productSlug: "air-purifier" },
      { name: "Portable AC", note: "For hot kitchen/living spaces where suitable", productSlug: "portable-ac" },
      { name: "High chair", note: "For family long stays", productSlug: "high-chair" },
    ],
    relatedProductSlugs: ["air-purifier", "portable-ac", "high-chair"],
    relatedGuideSlugs: ["digital-nomad-guide-valencia", "valencia-with-kids-complete-guide"],
    seo: {
      title: "Long-Stay Kitchen Equipment Rental in Valencia",
      description:
        "Rent practical kitchen and apartment comfort upgrades in Valencia for long-stay apartments, Airbnbs, families, and remote workers.",
      keywords: ["kitchen equipment rental Valencia", "long stay apartment Valencia", "Airbnb equipment Valencia"],
    },
    faqs: [
      {
        question: "Will every kitchen item be stocked from day one?",
        answer:
          "No. This is a demand-tested bundle surface: it helps capture requests before we buy too much long-tail inventory.",
      },
    ],
  },
];

export function getBundleBySlug(slug: string): RentalBundle | undefined {
  return rentalBundles.find((bundle) => bundle.slug === slug);
}

export function getBundleProducts(bundle: RentalBundle): Product[] {
  return bundle.relatedProductSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is Product => Boolean(product));
}
