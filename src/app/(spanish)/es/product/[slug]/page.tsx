import ProductPageBody from "@/components/ProductPageBody";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs } from "@/data/products";
import {
  getProductBySlugFromDB,
  getProductsByCategoryFromDB,
  getProductSeoState,
} from "@/lib/product-service";
import { getProductJsonLd, getBreadcrumbJsonLd } from "@/lib/jsonld";

import ProductPlanningLinks from "@/components/ProductPlanningLinks";
import { productPageMetadata } from "@/lib/product-page-metadata";
import { getDictionary } from "@/i18n/getDictionary";

const t = getDictionary("es");

// Spanish category name mapping
const categoryNameES: Record<string, string> = {
  "baby-gear": "Bebé y Niños",
  "kids-family": "Niños y Familia",
  "mobility": "Movilidad",
  "remote-work": "Teletrabajo",
  "home-living": "Hogar y Confort",
  "travel-outdoors": "Playa y Aire Libre",
  "fitness-wellness": "Deporte y Bienestar",
  "pregnancy": "Embarazo",
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [product, seoState] = await Promise.all([
    getProductBySlugFromDB(slug, "es"), getProductSeoState(slug),
  ]);
  return productPageMetadata(slug, "es", product, seoState);
}

export default async function ProductPageES({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlugFromDB(slug, "es");
  if (!product) notFound();
  const pageHeading = product.slug === "mobility-power-wheelchair"
    ? "Alquiler de silla de ruedas eléctrica en Valencia"
    : product.name;

  const related = (await getProductsByCategoryFromDB(product.categorySlug, "es"))
    .filter((p) => p.categorySlug === product.categorySlug && p.slug !== product.slug)
    .slice(0, 3);

  const catNameES = categoryNameES[product.categorySlug] || product.category;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getProductJsonLd(product, { locale: "es", availability: "LimitedAvailability" })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Inicio", url: "https://rentandroll.com/es" },
              { name: "Valencia", url: "https://rentandroll.com/es/valencia" },
              { name: catNameES, url: `https://rentandroll.com/es/rental/${product.categorySlug}` },
              { name: product.name, url: `https://rentandroll.com/es/product/${product.slug}` },
            ])
          ),
        }}
      />
      {product.faqs && product.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: product.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
              })),
            }),
          }}
        />
      )}

      {/* Breadcrumb */}
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500 flex-wrap">
            <li><Link href="/es" className="hover:text-brand transition-colors">Inicio</Link></li>
            <li>/</li>
            <li><Link href="/es/valencia" className="hover:text-brand transition-colors">Valencia</Link></li>
            <li>/</li>
            <li><Link href={`/es/rental/${product.categorySlug}`} className="hover:text-brand transition-colors">{catNameES}</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{product.name}</li>
          </ol>
        </div>
      </nav>

      <ProductPageBody product={product} locale="es" heading={pageHeading} related={related} relatedHeading={t.product.relatedProducts}>

      <ProductPlanningLinks
        categoryName={catNameES}
        categorySlug={product.categorySlug}
        productSlug={product.slug}
        locale="es"
      />

      </ProductPageBody>
    </>
  );
}
