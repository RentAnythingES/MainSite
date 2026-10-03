import { cache } from "react";
import { supabase } from './supabase';
import { resolveMarketContext } from './market-context';
import { mapPublicProductSource, getProductsFromDB, getProductsByCategoryFromDB } from './product-service';
import { translationReadiness, type TranslationEntry } from './translation-workflow';
import { withProductTranslation } from './product-translation';
import { germanCategories, germanSubcategories } from '@/content/german-categories';
import { localeRegistry } from '@/i18n/config';
import type { Product } from '@/data/products';

const germanCategoryNames:Record<string,string>={"baby-gear":"Babys und Kleinkinder","kids-family":"Kinder und Familie","mobility":"Mobilität und Barrierefreiheit","remote-work":"Arbeiten unterwegs","home-living":"Wohnen und Haushalt","travel-outdoors":"Strand und Outdoor","fitness-wellness":"Sport und Fitness","events-celebrations":"Feiern und Veranstaltungen"};

/** New languages have no static/English fallback and never read offline drafts. */
const requestCatalogue = cache(loadPublishedGermanProducts);

export async function publishedGermanProducts(): Promise<Product[]> {
  return requestCatalogue();
}

/** Reuse one approved snapshot across product sections in the same server render. */
async function loadPublishedGermanProducts(): Promise<Product[]> {
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
      const category = germanCategories[source.categorySlug] ? germanCategoryNames[source.categorySlug] : undefined;
      if (!category) continue;
      products.push(withProductTranslation(source, entry.translation_content!, {
        category, subcategory: germanSubcategories[source.subcategorySlug] || 'Mietartikel',
      }));
    }
    if (!data || data.length < 200) break;
  }
  // Content remains revision-gated German; merchandising order and media follow the original catalogue.
  const reference = await getProductsFromDB("valencia", "en");
  const positions = new Map(reference.map((item,index)=>[item.slug,index]));
  const media = new Map(reference.map(item=>[item.slug,item.image]));
  if (products.some(item=>!positions.has(item.slug))) throw Error("German catalogue source parity is unavailable");
  const originals = new Map(reference.map(item=>[item.slug,item]));
  return products.map(item=>{
    const original=originals.get(item.slug)!;
    // Original source presence controls section geometry; visible text stays approved German.
    return {...item,image:media.get(item.slug)!,
      detailDescription:original.detailDescription?item.detailDescription:undefined,
      includesText:original.includesText?item.includesText:undefined,
      constraintsText:original.constraintsText?item.constraintsText:undefined,
      deliverySetupNote:original.deliverySetupNote?item.deliverySetupNote:undefined,
      careNote:original.careNote?item.careNote:undefined};
  }).sort((a,b)=>positions.get(a.slug)!-positions.get(b.slug)!);
}

/** Membership and merchandising follow the same database-backed reference used by the original page. */
export async function publishedGermanCategory(categorySlug: string, catalogueOrder = false) {
  const products = await publishedGermanProducts();
  if (!products.length) return [];
  const reference = await getProductsByCategoryFromDB(categorySlug, "en");
  const translatedById = new Map(products.map(product=>[product.id,product]));
  // Only revision-approved German text is returned. English rows supply identity/order, never copy.
  const canonicalOrder=catalogueOrder?[...reference].sort((a,b)=>a.subcategory.localeCompare(b.subcategory,"en-GB") || a.name.localeCompare(b.name,"en-GB") || (a.pricing.length?Math.min(...a.pricing.map(tier=>tier.perDay)):0)-(b.pricing.length?Math.min(...b.pricing.map(tier=>tier.perDay)):0)):reference;
  return canonicalOrder.flatMap(source => {
    const translated = translatedById.get(source.id);
    return translated && translated.slug === source.slug ? [translated] : [];
  });
}
