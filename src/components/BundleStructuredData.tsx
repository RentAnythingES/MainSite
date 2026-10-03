import type { RentalBundle } from '@/data/bundles';
import type { Locale } from '@/i18n/config';
import { customerPrefix } from '@/i18n/customer-path';
import { BUSINESS_SCHEMA_ID, getBreadcrumbJsonLd } from '@/lib/jsonld';
export default function BundleStructuredData({bundle,locale}: {bundle:RentalBundle;locale:Locale}) {
  const prefix = customerPrefix(locale), base='https://rentandroll.com'+prefix, url=base+'/valencia/kits/'+bundle.slug;
  const labels={en:{home:'Home',kits:'Kits'},es:{home:'Inicio',kits:'Kits'},de:{home:'Startseite',kits:'Mietpakete'}}[locale];
  const product={'@context':'https://schema.org','@type':'Product',name:bundle.name,description:bundle.seo.description,image:'https://rentandroll.com'+bundle.image,url,mainEntityOfPage:{'@type':'WebPage','@id':url},brand:{'@type':'Brand',name:'Rent&Roll'},areaServed:{'@type':'City',name:'Valencia'},category:bundle.eyebrow,seller:{'@id':BUSINESS_SCHEMA_ID}};
  const faq={'@context':'https://schema.org','@type':'FAQPage',inLanguage:locale,mainEntity:bundle.faqs.map(item=>({'@type':'Question',name:item.question,acceptedAnswer:{'@type':'Answer',text:item.answer}}))};
  const breadcrumbs=getBreadcrumbJsonLd([{name:labels.home,url:base},{name:'Valencia',url:base+'/valencia'},{name:labels.kits,url:base+'/valencia/kits'},{name:bundle.shortName,url}]);
  return <>{[product,faq,breadcrumbs].map((schema,index)=><script key={index} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema)}} />)}</>;
}
