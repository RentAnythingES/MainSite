import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";

type CategoryProductCatalogueProps = {
  products: Product[];
  locale?: "en" | "es";
};

export default function CategoryProductCatalogue({
  products,
  locale = "en",
}: CategoryProductCatalogueProps) {
  const basePath = locale === "es" ? "/es/product" : "/product";

  return (
    <section id="products" className="bg-white scroll-mt-24">
      <div className="container-site">
        <div className="flex items-baseline gap-2 border-b border-border py-4">
          <h2 className="text-xl font-bold">
            {locale === "es" ? "Productos disponibles" : "Available products"}
          </h2>
          <span className="text-sm text-neutral-500">
            {locale === "es" ? `${products.length} en Valencia` : `${products.length} in Valencia`}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:py-8">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              id={`cat-product-${product.slug}`}
              basePath={basePath}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
