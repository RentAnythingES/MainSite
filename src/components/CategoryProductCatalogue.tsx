"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/data/products";
import { localeRegistry, type Locale } from "@/i18n/config";

type CategoryProductCatalogueProps = {
  products: Product[];
  locale?: Locale;
  productBasePath?: string;
};

// Lowest per-day rate across all pricing tiers, used as the price sort key.
function lowestPerDay(product: Product): number {
  return product.pricing.length ? Math.min(...product.pricing.map((tier) => tier.perDay)) : 0;
}

export default function CategoryProductCatalogue({
  products,
  locale = "en",
  productBasePath,
}: CategoryProductCatalogueProps) {
  const isEs = locale === "es";
  const isDe = locale === "de";
  const basePath = productBasePath ?? `${localeRegistry[locale].prefix}/product`;

  const subcategories = useMemo(() => {
    const bySlug = new Map<string, string>();
    for (const product of products) {
      if (!bySlug.has(product.subcategorySlug)) {
        bySlug.set(product.subcategorySlug, product.subcategory);
      }
    }
    return Array.from(bySlug, ([slug, name]) => ({ slug, name })).sort((a, b) =>
      a.name.localeCompare(b.name, localeRegistry[locale].format)
    );
  }, [products, locale]);

  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);

  // Rule: subcategory (A-Z) -> title (A-Z) -> price (low to high).
  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const subcategoryDiff = a.subcategory.localeCompare(b.subcategory, localeRegistry[locale].format);
      if (subcategoryDiff !== 0) return subcategoryDiff;
      const nameDiff = a.name.localeCompare(b.name, localeRegistry[locale].format);
      if (nameDiff !== 0) return nameDiff;
      return lowestPerDay(a) - lowestPerDay(b);
    });
  }, [products, locale]);

  const visibleProducts = useMemo(() => {
    if (selectedSubcategories.length === 0) return sortedProducts;
    return sortedProducts.filter((product) => selectedSubcategories.includes(product.subcategorySlug));
  }, [sortedProducts, selectedSubcategories]);

  const addFilter = (slug: string) => {
    if (!slug) return;
    setSelectedSubcategories((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  };

  const removeFilter = (slug: string) => {
    setSelectedSubcategories((prev) => prev.filter((s) => s !== slug));
  };

  return (
    <section id="products" className="bg-white scroll-mt-24">
      <div className="container-site">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border py-4">
          <div className="flex items-baseline gap-2">
            <h2 className="text-xl font-bold">
              {isDe ? "Mietartikel" : isEs ? "Productos disponibles" : "Available products"}
            </h2>
            <span className="text-sm text-neutral-500">
              {isEs ? `${visibleProducts.length} en Valencia` : `${visibleProducts.length} in Valencia`}
            </span>
          </div>

          {subcategories.length > 1 && (
            <label className="flex items-center gap-2 text-sm text-neutral-500">
              <span className="hidden sm:inline">{isDe ? "Produktgruppe" : isEs ? "Subcategoría" : "Subcategory"}</span>
              <select
                value=""
                onChange={(event) => addFilter(event.target.value)}
                className="rounded-lg border border-border bg-white px-3 py-1.5 text-sm text-neutral-700 focus:outline-none focus:ring-2 focus:ring-brand"
                aria-label={isDe ? "Nach Produktgruppe filtern" : isEs ? "Filtrar por subcategoría" : "Filter by subcategory"}
              >
                <option value="">{isDe ? "Alle Produktgruppen" : isEs ? "Todas las subcategorías" : "All subcategories"}</option>
                {subcategories
                  .filter((sub) => !selectedSubcategories.includes(sub.slug))
                  .map((sub) => (
                    <option key={sub.slug} value={sub.slug}>
                      {sub.name}
                    </option>
                  ))}
              </select>
            </label>
          )}
        </div>

        {selectedSubcategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-3">
            {selectedSubcategories.map((slug) => {
              const sub = subcategories.find((s) => s.slug === slug);
              if (!sub) return null;
              return (
                <span
                  key={slug}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1.5 text-sm font-medium text-brand"
                >
                  {sub.name}
                  <button
                    type="button"
                    onClick={() => removeFilter(slug)}
                    aria-label={isDe ? `Filter ${sub.name} entfernen` : isEs ? `Quitar filtro ${sub.name}` : `Remove ${sub.name} filter`}
                    className="rounded-full p-0.5 hover:bg-brand/20 transition-colors"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </span>
              );
            })}
            <button
              type="button"
              onClick={() => setSelectedSubcategories([])}
              className="text-sm text-neutral-500 underline hover:text-neutral-700"
            >
              {isDe ? "Alle Filter entfernen" : isEs ? "Limpiar todo" : "Clear all"}
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 py-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:py-8">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              id={`cat-product-${product.slug}`}
              basePath={basePath}
              locale={locale}
            />
          ))}
        </div>

        {visibleProducts.length === 0 && (
          <p className="py-10 text-center text-neutral-500">
            {isDe ? "Keine Mietartikel passen zu den gewählten Filtern." : isEs
              ? "No hay productos que coincidan con los filtros seleccionados."
              : "No products match the selected filters."}
          </p>
        )}
      </div>
    </section>
  );
}
