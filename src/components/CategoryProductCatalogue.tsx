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
  const groups = Array.from(
    products.reduce((grouped, product) => {
      const existing = grouped.get(product.subcategorySlug);
      if (existing) {
        existing.products.push(product);
      } else {
        grouped.set(product.subcategorySlug, {
          name: product.subcategory,
          slug: product.subcategorySlug,
          products: [product],
        });
      }
      return grouped;
    }, new Map<string, { name: string; slug: string; products: Product[] }>()),
  ).map(([, group]) => group);

  return (
    <section id="products" className="section bg-white scroll-mt-24">
      <div className="container-site">
        <div className="mb-8">
          <h2 className="text-3xl font-bold">
            {locale === "es" ? "Productos disponibles" : "Available products"}
          </h2>
          <p className="mt-2 text-neutral-600">
            {locale === "es"
              ? `${products.length} productos disponibles en Valencia. Todos aparecen a continuación.`
              : `${products.length} products available in Valencia. Every item is shown below.`}
          </p>
        </div>

        {groups.length > 1 && (
          <nav
            className="mb-10 border-y border-border py-4"
            aria-label={locale === "es" ? "Ir al tipo de producto" : "Jump to product type"}
          >
            <p className="mb-3 text-sm font-semibold text-neutral-700">
              {locale === "es" ? "Ir al tipo de producto:" : "Jump to product type:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <a
                  key={group.slug}
                  href={`#subcategory-${group.slug}`}
                  className="rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-teal-50 hover:text-brand"
                >
                  {group.name} ({group.products.length})
                </a>
              ))}
            </div>
          </nav>
        )}

        <div className="space-y-14">
          {groups.map((group) => (
            <section
              key={group.slug}
              id={`subcategory-${group.slug}`}
              className="scroll-mt-28"
              aria-labelledby={groups.length > 1 ? `subcategory-${group.slug}-heading` : undefined}
            >
              {groups.length > 1 && (
                <div className="mb-5 flex items-baseline justify-between gap-4 border-b border-border pb-3">
                  <h3 id={`subcategory-${group.slug}-heading`} className="text-2xl font-bold">
                    {group.name}
                  </h3>
                  <span className="text-sm text-neutral-500">{group.products.length}</span>
                </div>
              )}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.products.map((product) => (
                  <ProductCard
                    key={product.slug}
                    product={product}
                    id={`cat-product-${product.slug}`}
                    basePath={basePath}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
