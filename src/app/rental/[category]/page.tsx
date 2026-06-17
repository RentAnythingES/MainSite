import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const categoryMeta: Record<string, { title: string; description: string; emoji: string }> = {
  "baby-gear": {
    title: "Baby & Children Gear Rental in Valencia",
    description: "Rent strollers, cribs, car seats, high chairs & more in Valencia. Premium brands delivered to your accommodation.",
    emoji: "👶",
  },
  "mobility": {
    title: "Wheelchair & Mobility Scooter Rental in Valencia",
    description: "Rent wheelchairs, mobility scooters, walkers & daily aids in Valencia. Delivered to your hotel or Airbnb.",
    emoji: "♿",
  },
  "remote-work": {
    title: "Remote Work Equipment Rental in Valencia",
    description: "Rent monitors, standing desks, ergonomic chairs & tech gear in Valencia. Perfect for digital nomads.",
    emoji: "💻",
  },
  "home-living": {
    title: "Home & Living Equipment Rental in Valencia",
    description: "Rent air purifiers, portable AC units, kitchen appliances & more in Valencia.",
    emoji: "🏠",
  },
  "travel-outdoors": {
    title: "Beach & Outdoor Gear Rental in Valencia",
    description: "Rent beach umbrellas, camping gear & outdoor equipment in Valencia. Ready for Malvarrosa beach.",
    emoji: "🏖️",
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return Object.keys(categoryMeta).map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category];
  if (!meta) return { title: "Category Not Found" };
  return { title: meta.title, description: meta.description };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const meta = categoryMeta[category];
  if (!meta) notFound();

  const categoryProducts = getProductsByCategory(category);

  // Get unique subcategories
  const subcategories = Array.from(
    new Map(categoryProducts.map((p) => [p.subcategorySlug, { name: p.subcategory, slug: p.subcategorySlug }])).values()
  );

  return (
    <>
      {/* Breadcrumb */}
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex items-center gap-2 text-sm text-neutral-500">
            <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
            <li>/</li>
            <li><Link href="/valencia" className="hover:text-brand transition-colors">Valencia</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{meta.title.split(" Rental")[0]}</li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-12 md:py-16">
        <div className="container-site">
          <span className="text-5xl block mb-4">{meta.emoji}</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            {meta.title}
          </h1>
          <p className="text-neutral-600 max-w-2xl">{meta.description}</p>
        </div>
      </section>

      {/* Subcategory Filters */}
      {subcategories.length > 1 && (
        <section className="bg-white border-b border-border py-4">
          <div className="container-site">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-sm text-neutral-500 flex-shrink-0">Filter:</span>
              <span className="px-3 py-1.5 rounded-full bg-brand text-white text-sm font-medium cursor-pointer">
                All ({categoryProducts.length})
              </span>
              {subcategories.map((sub) => (
                <span
                  key={sub.slug}
                  className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium hover:bg-neutral-200 cursor-pointer transition-colors flex-shrink-0"
                >
                  {sub.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Products Grid */}
      <section className="section bg-white">
        <div className="container-site">
          <p className="text-sm text-neutral-500 mb-6">{categoryProducts.length} products available in Valencia</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
                id={`cat-product-${product.slug}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-50 py-12">
        <div className="container-site text-center">
          <h2 className="text-2xl font-bold mb-3">Can&apos;t find what you need?</h2>
          <p className="text-neutral-500 mb-6">We&apos;re constantly adding new products. Message us!</p>
          <a
            href="https://wa.me/34600000000"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            💬 WhatsApp Us
          </a>
        </div>
      </section>
    </>
  );
}
