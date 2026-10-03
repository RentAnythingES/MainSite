import { bundleRelatedProducts } from "@/lib/bundle-related-products";
import GermanCollectionStructuredData from "@/components/GermanCollectionStructuredData";
import DiscoverIndexPage from "@/components/DiscoverIndexPage";
import { getPublishedGermanDestinations } from "@/content/destinations-de";
import BeachesHubPage from "@/components/BeachesHubPage";
import beachesCopy from "@/i18n/discover-hubs/beaches-de.json";
import DayTripsHubPage from "@/components/DayTripsHubPage";
import dayTripsCopy from "@/i18n/discover-hubs/day-trips-de.json";
import EventsHubPage from "@/components/EventsHubPage";
import eventsCopy from "@/i18n/discover-hubs/events-de.json";
import AttractionsHubPage from "@/components/AttractionsHubPage";
import attractionsCopy from "@/i18n/discover-hubs/attractions-de.json";
import NeighbourhoodsHubPage from "@/components/NeighbourhoodsHubPage";
import neighbourhoodCopy from "@/i18n/discover-hubs/neighbourhoods-de.json";
import MobilityFamilyLinks from "@/components/MobilityFamilyLinks";
import BundleStructuredData from "@/components/BundleStructuredData";
import DestinationGuidePage from "@/components/DestinationGuidePage";
import { getGermanDestinationBySlug } from "@/content/destinations-de";
import { getGermanDestinationGovernance } from "@/content/destination-governance-de";
import BlogPageBody from "@/components/blog/BlogPageBody";
import GermanBlogArticle from "@/components/blog/GermanBlogArticle";
import { getPublishedGermanPosts, getGermanBlogPostBySlug } from "@/content/blog-de";
import ProductDetailPage from "@/components/ProductDetailPage";
import NetworkPage from "@/components/agents/NetworkPage";
import HostServicesPage from "@/components/HostServicesPage";
import PartnershipsPage from "@/components/PartnershipsPage";
import ValenciaPageBody from "@/components/ValenciaPageBody";
import AboutPageBody from '@/components/AboutPageBody';
import ContactPageBody from '@/components/ContactPageBody';
import FaqPageBody from '@/components/FaqPageBody';
import HowItWorksPageBody from '@/components/HowItWorksPageBody';
import PrivacyPageBody from '@/components/PrivacyPageBody';
import TermsPageBody from '@/components/TermsPageBody';
import RefundsPageBody from '@/components/RefundsPageBody';
import CookiesPageBody from '@/components/CookiesPageBody';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import CategoryLandingPage from '@/components/CategoryLandingPage';
import ProductFamilyLandingPage from '@/components/ProductFamilyLandingPage';
import BundleHub from '@/components/BundleHub';
import BundleLandingPage from '@/components/BundleLandingPage';
import BundleConfigurator from '@/components/BundleConfigurator';
import ExplorerDetails from '@/components/ExplorerDetails';
import { germanCategories } from '@/content/german-categories';
import { germanFamilies } from '@/content/german-families';
import { germanInformation } from '@/content/german-information';
import { germanRentalBundles, getGermanBundleBySlug } from '@/data/bundles-de';
import { getProductFamily } from '@/data/product-families';
import { publishedGermanProducts, publishedGermanCategory } from '@/lib/german-catalogue';
import { germanRouteCandidate, germanPageMetadata, germanPublicContext } from '@/lib/german-publication';
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
  if (path[0] === 'booking' || path[0] === 'review' || route === '/newsletter/unsubscribe') return { title: path[1] === 'messages' ? 'Privates Gespräch | Rent&Roll' : 'Deine Miete | Rent&Roll', robots: {index:false,follow:false,nocache:true}, referrer: 'no-referrer' as const };
  const context = await germanPublicContext();
  if (!context || !germanRouteCandidate(route)) return { robots: { index: false, follow: false }, title: 'Rent&Roll' };
  if (route === "/discover/neighbourhoods") return {...germanPageMetadata(route, neighbourhoodCopy.metadata.title, neighbourhoodCopy.metadata.description, context.isIndexable), alternates:neighbourhoodCopy.metadata.alternates};
  if (route === "/discover/attractions") return {...germanPageMetadata(route, attractionsCopy.metadata.title, attractionsCopy.metadata.description, context.isIndexable), alternates:attractionsCopy.metadata.alternates};
  if (route === "/discover/events") return {...germanPageMetadata(route, eventsCopy.metadata.title, eventsCopy.metadata.description, context.isIndexable), alternates:eventsCopy.metadata.alternates};
  if (route === "/discover/beaches") return {...germanPageMetadata(route, beachesCopy.metadata.title, beachesCopy.metadata.description, context.isIndexable), alternates:beachesCopy.metadata.alternates, openGraph:{...beachesCopy.metadata.openGraph,locale:"de_DE"}};
  if (route === "/discover/day-trips") return {...germanPageMetadata(route, dayTripsCopy.metadata.title, dayTripsCopy.metadata.description, context.isIndexable), alternates:dayTripsCopy.metadata.alternates};
  if (route === "/discover") return germanPageMetadata(route,"Valencia entdecken: Viertel, Strände und Ausflüge","Dein Reiseführer für Valencia: Entdecke Viertel, Tagesausflüge, Strände, Sehenswürdigkeiten und lokale Veranstaltungen mit ehrlichen Tipps von Menschen vor Ort.",context.isIndexable);
  if (path[0] === 'discover' && path.length === 2) {
    const dest = getGermanDestinationBySlug(path[1]);
    if (!dest) return {robots:{index:false,follow:false}};
    return {...germanPageMetadata(route,dest.title,dest.description,context.isIndexable), keywords:dest.keywords, openGraph:{title:dest.title,description:dest.description,url:'https://rentandroll.com/de'+route,locale:'de_DE',images:[{url:dest.heroImage || '/hero/valencia-1.webp',alt:dest.heroImageAlt || dest.title}]}};
  }
  if (route === '/blog') return germanPageMetadata('/blog', 'Valencia: Reisetipps und Reiseführer | Rent&Roll', 'Praktische Tipps für Valencia: Reiseführer für Familien, barrierefreies Reisen, digitale Nomaden und mehr vom Rent&Roll-Team.', context.isIndexable);
  if (path[0] === 'blog' && path.length === 2) {
    const post = getGermanBlogPostBySlug(path[1]);
    if (!post) return {robots:{index:false,follow:false}};
    return { ...germanPageMetadata(route, post.title, post.description, context.isIndexable), keywords:post.keywords, openGraph:{ title:post.title,description:post.description,type:'article' as const,publishedTime:post.date,locale:'de_DE',images:[{url:post.heroImage || '/hero/valencia-1.webp',alt:post.heroImageAlt || post.title}]} };
  }
  if (route === '/valencia') return germanPageMetadata('/valencia', 'Kinderwagen, Rollstühle & mehr mieten in Valencia', 'Miete Babyausstattung, Mobilitätshilfen, Arbeits- und Strandausstattung in Valencia. Prüfe die Verfügbarkeit und wähle Abholung oder Lieferung.', context.isIndexable);
  if (path[0] === 'product') {
    const product = (await products()).find(item => item.slug === path[1]);
    if (!product) return { robots: { index: false, follow: false } };
    return productPageMetadata(product.slug, 'de', product, await getProductSeoState(product.slug));
  }
  const title = path[0] === 'rental' ? path.length === 3 ? germanFamilies[path[2]]?.title : `${germanCategories[path[1]]?.title} mieten in Valencia`
    : path[0] === 'valencia' && path[1] === 'kits' ? path[2] ? getGermanBundleBySlug(path[2])?.seo.title : 'Mietpakete in Valencia | Rent&Roll'
    : path[0] === 'contact' ? 'Kontakt zu Rent&Roll in Valencia'
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
  if (route === "/discover/neighbourhoods") return <NeighbourhoodsHubPage locale="de" />;
  if (route === "/discover/attractions") return <AttractionsHubPage locale="de" />;
  if (route === "/discover/events") return <EventsHubPage locale="de" />;
  if (route === "/discover/beaches") return <BeachesHubPage locale="de" />;
  if (route === "/discover/day-trips") return <DayTripsHubPage locale="de" />;
  if (route === "/discover") return <DiscoverIndexPage locale="de" destinations={getPublishedGermanDestinations()} />;
  if (path[0] === 'discover' && path.length === 2) {
    const dest = getGermanDestinationBySlug(path[1]);
    if (!dest) notFound();
    return <DestinationGuidePage dest={dest} governance={getGermanDestinationGovernance(dest.slug)} locale="de" />;
  }
  if (route === '/blog') return <BlogPageBody locale="de" />;
  if (path[0] === 'blog' && path.length === 2) {
    const post = getGermanBlogPostBySlug(path[1]);
    if (!post) notFound();
    return <GermanBlogArticle post={post} />;
  }
  if (route === '/valencia') return <ValenciaPageBody locale="de" />;
  if (path[0] === 'product' && path.length === 2) {
    const product = (await products()).find(item => item.slug === path[1]);
    if (!product) notFound();
    const related = (await categoryProducts(product.categorySlug)).filter(item => item.categorySlug === product.categorySlug && item.slug !== product.slug).slice(0, 3);
    return <ProductDetailPage product={product} related={related} locale="de" />;
  }
  if (path[0] === 'rental') {
    const category = path[1];
    if (!Object.hasOwn(germanCategories, category)) notFound();
    const catalogue = await categoryProducts(category);
    if (path.length === 3) {
      const family = getProductFamily(category, path[2]);
      if (!family || !Object.hasOwn(germanFamilies, family.slug)) notFound();
      const content=germanFamilies[family.slug];
      const members=catalogue.filter(item => family.productSlugs.includes(item.slug));
      return <><GermanCollectionStructuredData category={category} family={family.slug} name={content.eyebrow} description={content.description} categoryLabel={content.categoryLabel} products={members} faqs={content.faqs} /><ProductFamilyLandingPage family={family} content={content} locale="de" prefix={prefix} products={members} /></>;
    }
    const orderedCatalogue = await categoryProducts(category, true);
    const meta = germanCategories[category];
    const relatedPosts = getPublishedGermanPosts().filter(post=>post.tags.some(tag=>(meta.blogTags || []).includes(tag))).slice(0,2);
    return <><GermanCollectionStructuredData category={category} name={meta.heading ?? meta.title} description={meta.introDescription ?? meta.description} products={orderedCatalogue} faqs={meta.faqs} /><CategoryLandingPage meta={meta} products={orderedCatalogue} locale="de" prefix={prefix} relatedPosts={relatedPosts} /></>;
  }
  if (route === '/valencia/kits') return <BundleHub bundles={germanRentalBundles} locale="de" prefix={prefix} />;
  if (path[0] === 'valencia' && path[1] === 'kits' && path.length === 3) {
    const bundle = getGermanBundleBySlug(path[2]);
    if (!bundle) notFound();
    return <><BundleStructuredData bundle={bundle} locale="de" /><BundleLandingPage bundle={bundle} locale="de" prefix={prefix} relatedProducts={bundleRelatedProducts(bundle, await products())} relatedGuides={bundle.relatedGuideSlugs.map(slug=>getGermanBlogPostBySlug(slug)).filter(post=>post!==undefined)} otherBundles={germanRentalBundles.filter(item => item.slug !== bundle.slug).slice(0, 3)} explorerDetails={bundle.slug === 'turia-beach-explorer' ? <ExplorerDetails locale="de" /> : undefined} configurator={<BundleConfigurator bundle={bundle} locale="de" prefix={prefix} />} familyLinks={bundle.slug === "accessible-valencia-kit" ? <MobilityFamilyLinks locale="de" /> : undefined} /></>;
  }
  if (route === '/valencia/host-services') return <HostServicesPage locale="de" />;
  if (route === '/agent-network') return <NetworkPage locale="de" />;
  if (route === '/partners') return <PartnershipsPage locale="de" />;
  if (route === '/about') return <AboutPageBody locale="de" />;
  if (route === '/contact') return <ContactPageBody locale="de" />;
  if (route === '/faq') return <FaqPageBody locale="de" />;
  if (route === '/how-it-works') return <HowItWorksPageBody locale="de" />;
  if (route === '/privacy') return <PrivacyPageBody locale="de" />;
  if (route === '/terms') return <TermsPageBody locale="de" />;
  if (route === '/refunds') return <RefundsPageBody locale="de" />;
  if (route === '/cookies') return <CookiesPageBody locale="de" />;
  notFound();
}
