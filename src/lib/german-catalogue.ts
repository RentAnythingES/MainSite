import { supabase } from './supabase';
import { resolveMarketContext } from './market-context';
import { mapPublicProductSource } from './product-service';
import { translationReadiness, type TranslationEntry } from './translation-workflow';
import { withProductTranslation } from './product-translation';
import { germanCategories, germanSubcategories } from '@/content/german-categories';
import { localeRegistry } from '@/i18n/config';
import type { Product } from '@/data/products';

/** New languages have no static/English fallback and never read offline drafts. */
export async function publishedGermanProducts(): Promise<Product[]> {
  if (!localeRegistry.de.public) return [];
  await resolveMarketContext(supabase, { mode: 'public', marketSlug: 'valencia', locale: 'de' });
  const products: Product[] = [];
  for (let page = 0; ; page++) {
    const { data, error } = await supabase.from('products')
      .select('*, pricing_tiers(*), category:categories!products_category_id_fkey(*), product_localizations(*)')
      .eq('city', 'valencia').eq('is_active', true).eq('product_localizations.locale', 'de')
      .order('id').range(page * 200, page * 200 + 199).abortSignal(AbortSignal.timeout(8000));
    if (error) throw new Error('German catalogue is unavailable', { cause: error });
    for (const row of data || []) {
      const entry = (row.product_localizations as TranslationEntry[]).find(item => item.locale === 'de');
      if (!entry || !Number.isSafeInteger(row.translation_source_revision) ||
        !translationReadiness(entry, row.translation_source_revision).published) continue;
      const source = mapPublicProductSource(row);
      const category = germanCategories[source.categorySlug]?.title;
      if (!category) continue;
      products.push(withProductTranslation(source, entry.translation_content!, {
        category, subcategory: germanSubcategories[source.subcategorySlug] || 'Mietartikel',
      }));
    }
    if (!data || data.length < 200) break;
  }
  return products.sort((a, b) => a.name.localeCompare(b.name, 'de'));
}

/** Category membership remains owned by the database, including secondary discovery. */
export async function publishedGermanCategory(categorySlug: string) {
  const products = await publishedGermanProducts();
  if (!products.length) return [];
  const { data: category, error } = await supabase.from('categories').select('id')
    .eq('slug', categorySlug).abortSignal(AbortSignal.timeout(8000)).maybeSingle();
  if (error) throw error;
  if (!category) return [];
  const { data: members, error: membershipError } = await supabase.from('product_category_memberships')
    .select('product_id').eq('category_id', category.id).abortSignal(AbortSignal.timeout(8000));
  if (membershipError) throw membershipError;
  const ids = new Set((members || []).map(item => item.product_id));
  return products.filter(item => ids.has(item.id));
}
