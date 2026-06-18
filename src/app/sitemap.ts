import type { MetadataRoute } from "next";
import { products } from "@/data/products";
import { getPublishedPosts } from "@/content/blog";
import { getPublishedDestinations } from "@/content/destinations";

const BASE_URL = "https://rentanything.es";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/valencia`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  // Category pages
  const categories = ["baby-gear", "mobility", "remote-work", "home-living", "travel-outdoors"];
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/rental/${cat}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Product pages
  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
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
    { url: `${BASE_URL}/discover`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/discover/neighbourhoods`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/discover/day-trips`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/discover/attractions`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
    { url: `${BASE_URL}/discover/events`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 },
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
    { url: `${BASE_URL}/es`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/es/valencia`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  // Spanish product pages
  const spanishProductPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/es/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  // Spanish category pages
  const spanishCategoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${BASE_URL}/es/rental/${cat}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...blogPages, ...discoverHubs, ...discoverPages, ...spanishStaticPages, ...spanishProductPages, ...spanishCategoryPages];
}
