import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { germanCommercialPaths } from '@/i18n/german-paths';
import { germanPublicContext, germanIndexingAllowed } from './german-publication';
import { publishedGermanProducts } from './german-catalogue';
import { getIndexableProductsForSeo } from './product-service';

/** Sitemap annotations are reciprocal and derived from URLs that actually exist. */
export async function addGermanSitemap(existing: MetadataRoute.Sitemap): Promise<MetadataRoute.Sitemap> {
  if (!germanIndexingAllowed()) return existing;
  const context = await germanPublicContext();
  if (!context?.isIndexable) return existing;
  const [products, seoStates] = await Promise.all([publishedGermanProducts(), getIndexableProductsForSeo()]);
  const indexable = new Set(seoStates.filter(state => state.indexableDe).map(state => state.slug));
  const paths = [...germanCommercialPaths.filter(path => !['/valencia', '/newsletter'].includes(path)),
    ...products.filter(product => indexable.has(product.slug)).map(product => `/product/${product.slug}`)];
  const existingUrls = new Set(existing.map(page => page.url));
  const groups = new Map<string, Record<string, string>>();
  const german: MetadataRoute.Sitemap = paths.map(path => {
    const en = `${SITE_URL}${path === '/' ? '' : path}`;
    const es = `${SITE_URL}/es${path === '/' ? '' : path}`;
    const de = `${SITE_URL}/de${path === '/' ? '' : path}`;
    const languages: Record<string, string> = { de };
    if (existingUrls.has(en)) { languages.en = en; languages['x-default'] = en; }
    if (existingUrls.has(es)) languages.es = es;
    for (const url of Object.values(languages)) groups.set(url, languages);
    return { url: de, changeFrequency: 'weekly', priority: 0.6, alternates: { languages } };
  });
  return [...existing.map(page => groups.has(page.url) ? { ...page, alternates: { languages: groups.get(page.url)! } } : page), ...german];
}
