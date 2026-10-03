import type { Product } from "@/data/products";
import { getBreadcrumbJsonLd, getCategoryCollectionJsonLd, getFaqJsonLd } from "@/lib/jsonld";

export default function GermanCollectionStructuredData({category, family, name, description, products, faqs, categoryLabel}: {
  category:string; family?:string; name:string; description:string; products:Product[];
  faqs?:Array<{question:string;answer:string}>; categoryLabel?:string;
}) {
  const base="https://rentandroll.com/de";
  const categoryUrl=base+"/rental/"+category;
  const url=family?categoryUrl+"/"+family:categoryUrl;
  const crumbs=[{name:"Startseite",url:base},{name:"Valencia",url:base+"/valencia"},
    ...(family?[{name:categoryLabel || name,url:categoryUrl}]:[]),{name,url}];
  const data=[getCategoryCollectionJsonLd({name,description,url,locale:"de",products}),getBreadcrumbJsonLd(crumbs),
    ...(faqs?.length?[getFaqJsonLd(faqs.map(faq=>({q:faq.question,a:faq.answer})))]:[])];
  return <>{data.map((value,index)=><script key={index} type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(value).replace(/</g,"\u003c")}} />)}</>;
}
