import { localeRegistry } from '@/i18n/config';
import { SITE_URL } from '@/config/site';
import { resolveMarketContext } from './market-context';
import { supabase } from './supabase';
import type { Metadata } from 'next';
import { publicLocaleHref } from './public-routes';
import { germanSeoOverrides } from '@/content/german-seo';
import { getProductMetadataTitle, getProductMetadataDescription } from './seo-metadata';
import { germanIndexingAllowed } from '@/i18n/german-indexing';
import { germanCommercialPaths as paths, germanRouteCandidate as candidate } from '@/i18n/german-paths';

/** Route inventory uses only completed German surfaces, never editorial placeholders. */
export function germanCommercialPaths() {
  return [...paths];
}
export function germanRouteCandidate(path: string) {
  return candidate(path);
}
export async function germanPublicContext() {
  if (!localeRegistry.de.public) return null;
  try { return await resolveMarketContext(supabase, { mode: 'public', marketSlug: 'valencia', locale: 'de' }); }
  catch { return null; }
}
export { germanIndexingAllowed } from '@/i18n/german-indexing';
export function germanPageMetadata(path: string, title: string, description?: string, indexable = true): Metadata {
  const override = germanSeoOverrides[path];
  title = override?.title || title;
  description = override?.description || description;
  const canonical = `${SITE_URL}/de${path === '/' ? '' : path}`;
  const languages = { en: `${SITE_URL}${publicLocaleHref(canonical.slice(SITE_URL.length), 'en')}`, es: `${SITE_URL}${publicLocaleHref(canonical.slice(SITE_URL.length), 'es')}`, de: canonical, 'x-default': `${SITE_URL}${publicLocaleHref(canonical.slice(SITE_URL.length), 'en')}` };
  const boundedTitle = getProductMetadataTitle({ name: title, customTitle: title, locale: 'de' });
  const boundedDescription = getProductMetadataDescription({ description: description || 'Mietartikel für deinen Aufenthalt in Valencia.', locale: 'de' });
  return { title: { absolute: boundedTitle }, description: boundedDescription, alternates: { canonical, languages },
    robots: { index: indexable && germanIndexingAllowed(), follow: true },
    openGraph: { title: boundedTitle, description: boundedDescription, url: canonical, locale: 'de_DE' } };
}
