import type { MetadataRoute } from "next";
import { rentalBundles } from "@/data/bundles";
import { getPublishedPosts } from "@/content/blog";
import { getPublishedSpanishPosts } from "@/content/blog-es";
import { getPublishedDestinations } from "@/content/destinations";
import { getIndexableProductsForSeo } from "@/lib/product-service";
import { seoCategorySlugs } from "@/data/seo-clusters";

const BASE_URL = "https://rentanything.es";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getIndexableProductsForSeo();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/valencia`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/valencia/kits`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/valencia/host-services`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/partners`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/how-it-works`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/refunds`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/cookies`, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Category pages
  const categories = seoCategorySlugs;
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/rental/${cat}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Product pages
  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/product/${product.slug}`,
    lastModified: product.updatedAt || undefined,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const bundlePages: MetadataRoute.Sitemap = rentalBundles.map((bundle) => ({
    url: `${BASE_URL}/valencia/kits/${bundle.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog posts (only published)
  const blogPages: MetadataRoute.Sitemap = getPublishedPosts().map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Discover hub pages
  const discoverHubs: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/discover`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/discover/neighbourhoods`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/discover/day-trips`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/discover/attractions`, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/discover/events`, changeFrequency: "weekly" as const, priority: 0.7 },
  ];

  // Discover destination pages (only published)
  const discoverPages: MetadataRoute.Sitemap = getPublishedDestinations().map((dest) => ({
    url: `${BASE_URL}/discover/${dest.slug}`,
    lastModified: dest.lastUpdated,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Spanish static pages
  const spanishStaticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/es`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/es/valencia`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/es/valencia/servicios-anfitriones`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/es/colaboraciones`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/es/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/es/how-it-works`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/es/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/es/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/es/contact`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/es/refunds`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const spanishBlogPages: MetadataRoute.Sitemap = getPublishedSpanishPosts().map((post) => ({
    url: `${BASE_URL}/es/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // Spanish product pages
  const spanishProductPages: MetadataRoute.Sitemap = products
    .filter((product) => product.indexableEs)
    .map((product) => ({
      url: `${BASE_URL}/es/product/${product.slug}`,
      lastModified: product.updatedAt || undefined,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  // Spanish category pages
  const spanishCategoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/es/rental/${cat}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...bundlePages, ...blogPages, ...discoverHubs, ...discoverPages, ...spanishStaticPages, ...spanishBlogPages, ...spanishProductPages, ...spanishCategoryPages];
}
