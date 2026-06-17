import { Product } from "@/data/products";

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "RentAnything.es",
    description:
      "Short-term rental of baby gear, mobility aids, remote work equipment & more in Valencia, Spain. Delivered to your accommodation.",
    url: "https://rentanything.es",
    telephone: "+34600000000",
    email: "hello@rentanything.es",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Valencia",
      addressRegion: "Comunidad Valenciana",
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 39.4699,
      longitude: -0.3763,
    },
    areaServed: {
      "@type": "City",
      name: "Valencia",
    },
    priceRange: "€€",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "09:00",
      closes: "20:00",
    },
    sameAs: [
      "https://instagram.com/rentanything.es",
      "https://facebook.com/rentanything.es",
    ],
  };
}

export function getProductJsonLd(product: Product) {
  const lowestPrice = product.pricing[product.pricing.length - 1].perDay;
  const highestPrice = product.pricing[0].perDay;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "EUR",
      lowPrice: lowestPrice,
      highPrice: highestPrice,
      offerCount: product.pricing.length,
      availability: "https://schema.org/InStock",
      areaServed: {
        "@type": "City",
        name: "Valencia",
      },
    },
    url: `https://rentanything.es/product/${product.slug}`,
  };
}

export function getFaqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function getBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
