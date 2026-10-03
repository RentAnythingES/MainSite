import Link from 'next/link';
import { cache } from 'react';
import { notFound, redirect } from 'next/navigation';
import ProductPageBody from '@/components/ProductPageBody';
import ProductPlanningLinks from '@/components/ProductPlanningLinks';
import CategoryLandingPage from '@/components/CategoryLandingPage';
import ProductFamilyLandingPage from '@/components/ProductFamilyLandingPage';
import BundleHub from '@/components/BundleHub';
import BundleLandingPage from '@/components/BundleLandingPage';
import BundleConfigurator from '@/components/BundleConfigurator';
import ExplorerDetails from '@/components/ExplorerDetails';
import InformationPage from '@/components/InformationPage';
import ContactForm from '@/components/ContactForm';
import NewsletterSignup from '@/components/NewsletterSignup';
import { germanCategories } from '@/content/german-categories';
import { germanFamilies } from '@/content/german-families';
import { germanInformation } from '@/content/german-information';
import { germanRentalBundles, getGermanBundleBySlug } from '@/data/bundles-de';
import { productFamilies, getProductFamily } from '@/data/product-families';
import { publishedGermanProducts, publishedGermanCategory } from '@/lib/german-catalogue';
import { germanRouteCandidate, germanPageMetadata, germanPublicContext } from '@/lib/german-publication';
import { getProductJsonLd, getBreadcrumbJsonLd, getFaqJsonLd } from '@/lib/jsonld';
import { SITE_URL, SITE_IDENTITY } from '@/config/site';
import { germanCustomerPage } from '@/components/GermanCustomerPage';
import { getProductSeoState } from '@/lib/product-service';
import { productPageMetadata } from '@/lib/product-page-metadata';

type Props = { params: Promise<{ path: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> };
const products = cache(publishedGermanProducts);
const categoryProducts = cache(publishedGermanCategory);
const prefix = '/de';

export async function generateMetadata({ params }: Props) {
  const { path } = await params;
  const route = '/' + path.join('/');
  const context = await germanPublicContext();
  if (!context || !germanRouteCandidate(route)) return { robots: { index: false, follow: false }, title: 'Rent&Roll' };
  if (route === '/valencia') return germanPageMetadata('/', 'Mietartikel in Valencia | Rent&Roll', undefined, false);
  if (path[0] === 'product') {
    const product = (await products()).find(item => item.slug === path[1]);
    if (!product) return { robots: { index: false, follow: false } };
    return productPageMetadata(product.slug, 'de', product, await getProductSeoState(product.slug));
  }
  const title = path[0] === 'rental' ? path.length === 3 ? germanFamilies[path[2]]?.title : `${germanCategories[path[1]]?.title} mieten in Valencia`
    : path[0] === 'valencia' && path[1] === 'kits' ? path[2] ? getGermanBundleBySlug(path[2])?.seo.title : 'Mietpakete in Valencia | Rent&Roll'
    : path[0] === 'contact' ? 'Kontakt zu Rent&Roll in Valencia'
    : path[0] === 'newsletter' ? 'Neuigkeiten aus Valencia | Rent&Roll'
    : germanInformation[path[0]]?.title || 'Mietartikel in Valencia | Rent&Roll';
  const description = path[0] === 'rental' ? path.length === 3 ? germanFamilies[path[2]]?.description : germanCategories[path[1]]?.description
    : path[0] === 'valencia' && path[1] === 'kits' ? path[2] ? getGermanBundleBySlug(path[2])?.seo.description : 'Stelle passende Mietartikel für deinen Aufenthalt in Valencia zusammen und frage unser Team nach Verfügbarkeit und Übergabe.'
    : germanInformation[path[0]]?.intro || germanInformation[path[0]]?.sections[0]?.paragraphs?.[0];
  return germanPageMetadata(route, title || 'Rent&Roll', description, context.isIndexable);
}

export default async function Page({ params, searchParams }: Props) {
  const { path } = await params;
  const customer = await germanCustomerPage(path, await searchParams);
  if (customer) return customer;
  const route = '/' + path.join('/');
  if (!germanRouteCandidate(route)) notFound();
  if (route === '/valencia') redirect('/de');
  if (path[0] === 'product' && path.length === 2) {
    const product = (await products()).find(item => item.slug === path[1]);
    if (!product) notFound();
    const related = (await categoryProducts(product.categorySlug)).filter(item => item.slug !== product.slug).slice(0, 3);
    const url = `${SITE_URL}${prefix}${route}`;
    return <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getProductJsonLd(product, { locale: 'de' })).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbJsonLd([{ name: 'Startseite', url: `${SITE_URL}/de` }, { name: product.category, url: `${SITE_URL}/de/rental/${product.categorySlug}` }, { name: product.name, url }])).replace(/</g, '\\u003c') }} />
      {!!product.faqs?.length && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getFaqJsonLd(product.faqs.map(faq => ({ q: faq.question, a: faq.answer })))).replace(/</g, '\\u003c') }} />}
      <nav className="container-site py-5" aria-label="Seitennavigation"><Link className="text-brand underline" href={`${prefix}/rental/${product.categorySlug}`}>{product.category}</Link></nav>
      <ProductPageBody product={product} locale="de" related={related} productBasePath={`${prefix}/product`}><ProductPlanningLinks categoryName={product.category} categorySlug={product.categorySlug} productSlug={product.slug} locale="de" /></ProductPageBody>
    </>;
  }
  if (path[0] === 'rental') {
    const category = path[1];
    if (!Object.hasOwn(germanCategories, category)) notFound();
    const catalogue = await categoryProducts(category);
    if (path.length === 3) {
      const family = getProductFamily(category, path[2]);
      if (!family || !Object.hasOwn(germanFamilies, family.slug)) notFound();
      return <ProductFamilyLandingPage family={family} content={germanFamilies[family.slug]} locale="de" prefix={prefix} products={catalogue.filter(item => family.productSlugs.includes(item.slug))} />;
    }
    const meta = { ...germanCategories[category], familyHeading: 'Modelle und Möglichkeiten vergleichen', familyDescription: 'Diese Übersichten helfen dir bei der Auswahl für deinen Aufenthalt.',
      familyPathways: productFamilies.filter(family => family.published && family.categorySlug === category && germanFamilies[family.slug]).map(family => ({ eyebrow: germanFamilies[family.slug].categoryLabel, title: germanFamilies[family.slug].eyebrow, description: germanFamilies[family.slug].productDescription, href: `${prefix}/rental/${category}/${family.slug}` })) };
    return <CategoryLandingPage meta={meta} products={catalogue} locale="de" prefix={prefix} />;
  }
  if (route === '/valencia/kits') return <BundleHub bundles={germanRentalBundles} locale="de" prefix={prefix} />;
  if (path[0] === 'valencia' && path[1] === 'kits' && path.length === 3) {
    const bundle = getGermanBundleBySlug(path[2]);
    if (!bundle) notFound();
    return <BundleLandingPage bundle={bundle} locale="de" prefix={prefix} relatedProducts={(await products()).filter(item => bundle.relatedProductSlugs.includes(item.slug))} relatedGuides={[]} otherBundles={germanRentalBundles.filter(item => item.slug !== bundle.slug).slice(0, 3)} explorerDetails={bundle.slug === 'turia-beach-explorer' ? <ExplorerDetails locale="de" /> : undefined} configurator={<BundleConfigurator bundle={bundle} locale="de" prefix={prefix} />} />;
  }
  if (route === '/contact') return <section className="section bg-white"><div className="container-site max-w-3xl"><h1 className="text-4xl font-bold mb-5">Kontakt zu Rent&Roll</h1><p className="mb-6 text-neutral-600">Frag uns zu einem Mietartikel, deiner Buchung oder einer individuellen Anfrage in Valencia.</p><p className="mb-6"><a className="text-brand underline" href={`mailto:${SITE_IDENTITY.contactEmail}`}>{SITE_IDENTITY.contactEmail}</a></p><ContactForm locale="de" /></div></section>;
  if (route === '/newsletter') return <section className="section bg-white"><div className="container-site max-w-3xl"><h1 className="text-4xl font-bold mb-5">Neuigkeiten aus Valencia</h1><NewsletterSignup source="german-newsletter" locale="de" /></div></section>;
  if (path.length === 1 && Object.hasOwn(germanInformation, path[0])) return <InformationPage content={{ ...germanInformation[path[0]], reviewNotes: [] }} locale="de" />;
  notFound();
}
