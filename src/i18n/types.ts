export type Locale = "en" | "es";

export interface Dictionary {
  // Global
  locale: Locale;
  siteName: string;
  
  // Navigation
  nav: {
    browse: string;
    valencia: string;
    discover: string;
    howItWorks: string;
    about: string;
    faq: string;
    blog: string;
    rentNow: string;
  };

  // Homepage
  home: {
    badge: string;
    headline: string;
    headlineAccent: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    categoriesTitle: string;
    categoriesSubtitle: string;
    trustStats: { number: string; label: string }[];
    featuredTitle: string;
    featuredSubtitle: string;
    viewAll: string;
    howItWorksTitle: string;
    howItWorksSubtitle: string;
    howItWorksSteps: { title: string; description: string }[];
    startBrowsing: string;
    ctaBannerTitle: string;
    ctaBannerSubtitle: string;
    browseRentals: string;
    contactUs: string;
  };

  // Categories
  categories: {
    babyGear: { name: string; desc: string };
    mobility: { name: string; desc: string };
    remoteWork: { name: string; desc: string };
    homeLiving: { name: string; desc: string };
    travelOutdoors: { name: string; desc: string };
    pregnancy: { name: string; desc: string };
  };

  // Product page
  product: {
    from: string;
    perDay: string;
    features: string;
    specs: string;
    pricing: string;
    days: string;
    bookNow: string;
    relatedProducts: string;
    faqTitle: string;
    deliveryNote: string;
  };

  // Valencia page
  valencia: {
    badge: string;
    headline: string;
    headlineAccent: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    deliveryBar: string[];
    browseByCategory: string;
    allProducts: string;
  };

  // Common
  common: {
    home: string;
    viewAll: string;
    explore: string;
    learnMore: string;
    backTo: string;
  };
}
