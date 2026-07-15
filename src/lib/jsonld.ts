import { Product } from "@/data/products";

export function getLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "RentAnything.es",
    description:
      "Short-term rental of baby gear, mobility aids, remote work equipment & more in Valencia, Spain. Delivered to your accommodation.",
    url: "https://rentanything.es",
    telephone: "+34684708013",
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

type ProductJsonLdOptions = {
  locale?: "en" | "es";
  availability?: "InStock" | "OutOfStock" | "LimitedAvailability";
};

export function getProductJsonLd(
  product: Product,
  options: ProductJsonLdOptions = {}
) {
  const locale = options.locale || "en";
  const availability = options.availability || "LimitedAvailability";
  const lowestPrice = product.pricing.at(-1)?.perDay;
  const highestPrice = product.pricing[0]?.perDay;
  const productUrl = `https://rentanything.es${locale === "es" ? "/es" : ""}/product/${product.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    inLanguage: locale,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    category: product.category,
    seller: {
      "@type": "Organization",
      name: "RentAnything.es",
      url: "https://rentanything.es",
    },
    ...(lowestPrice !== undefined && highestPrice !== undefined
      ? {
          offers: {
            "@type": "AggregateOffer",
            priceCurrency: "EUR",
            lowPrice: lowestPrice,
            highPrice: highestPrice,
            offerCount: product.pricing.length,
            availability: `https://schema.org/${availability}`,
            url: productUrl,
            areaServed: {
              "@type": "City",
              name: "Valencia",
            },
          },
        }
      : {}),
    url: productUrl,
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

export function getCategoryCollectionJsonLd({
  name,
  description,
  url,
  locale,
  products,
}: {
  name: string;
  description: string;
  url: string;
  locale: "en" | "es";
  products: Product[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name,
    description,
    url,
    inLanguage: locale,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: product.name,
        url: `https://rentanything.es${locale === "es" ? "/es" : ""}/product/${product.slug}`,
      })),
    },
  };
}
