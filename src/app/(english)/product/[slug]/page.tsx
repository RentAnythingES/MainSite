import ProductDetailPage from "@/components/ProductDetailPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs } from "@/data/products";
import {
  getProductBySlugFromDB,
  getProductsByCategoryFromDB,
  getProductSeoState,
} from "@/lib/product-service";

import { productPageMetadata } from "@/lib/product-page-metadata";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const [product, seoState] = await Promise.all([
    getProductBySlugFromDB(slug, "en"), getProductSeoState(slug),
  ]);
  return productPageMetadata(slug, "en", product, seoState);
}


export default async function Page({ params }: Props) {
 const { slug } = await params;
 const product = await getProductBySlugFromDB(slug, "en");
 if (!product) notFound();
 const related = (await getProductsByCategoryFromDB(product.categorySlug, "en")).filter(item=>item.categorySlug===product.categorySlug && item.slug!==product.slug).slice(0,3);
 return <ProductDetailPage product={product} related={related} locale="en" />;
}
