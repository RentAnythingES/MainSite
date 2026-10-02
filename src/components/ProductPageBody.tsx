import type { ReactNode } from "react";
import type { Product } from "@/data/products";
import type { Locale } from "@/i18n/config";
import ProductDetail from "./ProductDetail";
import ProductCard from "./ProductCard";

const titles = {
  en: { faq: "Frequently Asked Questions", related: "You Might Also Need" },
  es: { faq: "Preguntas frecuentes", related: "Productos relacionados" },
  de: { faq: "Häufige Fragen", related: "Das könnte auch passen" },
};

/** One product body for every locale; route metadata and editorial slots stay explicit. */
export default function ProductPageBody({product, locale, related, heading, relatedHeading, productBasePath, children}: {
  product: Product; locale: Locale; related: Product[]; heading?: string;
  relatedHeading?: string; productBasePath?: string; children?: ReactNode;
}) {
  return <>
    <ProductDetail product={product} locale={locale} heading={heading} />
    {children}
    {!!product.faqs?.length && <section className="section bg-white">
      <div className="container-site"><div className="max-w-3xl">
        <h2 className="text-2xl font-bold mb-6">{titles[locale].faq}</h2>
        <div className="space-y-4">{product.faqs.map((faq,index)=><div key={index} className="card p-5">
          <h3 className="font-semibold mb-2">{faq.question}</h3>
          <p className="text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
        </div>)}</div>
      </div></div>
    </section>}
    {related.length > 0 && <section className="section bg-neutral-50">
      <div className="container-site">
        <h2 className="text-2xl font-bold mb-6">{relatedHeading ?? titles[locale].related}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {related.map(item=><ProductCard key={item.slug} product={item} locale={locale} basePath={productBasePath ?? (locale === "es" ? "/es/product" : "/product")} />)}
        </div>
      </div>
    </section>}
  </>;
}
