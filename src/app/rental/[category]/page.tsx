import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategory } from "@/data/products";
import { getPublishedPosts } from "@/content/blog";
import ProductCard from "@/components/ProductCard";

interface CategoryContent {
  title: string;
  description: string;
  emoji: string;
  editorialHeading: string;
  editorialParagraphs: string[];
  blogTags: string[];
}

const categoryMeta: Record<string, CategoryContent> = {
  "baby-gear": {
    title: "Baby & Children Gear Rental in Valencia",
    description: "Rent strollers, cribs, car seats, high chairs & more in Valencia. Premium brands delivered to your accommodation.",
    emoji: "👶",
    editorialHeading: "Why Rent Baby Gear in Valencia?",
    editorialParagraphs: [
      "Travelling with a baby or toddler means packing strategically. Strollers, car seats, and travel cribs are bulky, heavy, and expensive to check as airline luggage — plus there's always the risk of damage in transit.",
      "Renting locally solves all of this. We deliver premium baby equipment directly to your hotel, Airbnb, or holiday apartment before you arrive. Everything is cleaned and inspected between rentals. When you're done, we collect it from your door. No queues, no luggage carousels, no stress.",
      "Valencia is one of Europe's most family-friendly cities — flat streets for strollers, gentle beaches for toddlers, and a culture that genuinely welcomes children everywhere. The right gear makes it even better.",
    ],
    blogTags: ["family", "kids"],
  },
  "mobility": {
    title: "Wheelchair & Mobility Scooter Rental in Valencia",
    description: "Rent wheelchairs, mobility scooters, walkers & daily aids in Valencia. Delivered to your hotel or Airbnb.",
    emoji: "♿",
    editorialHeading: "Exploring Valencia with Mobility Equipment",
    editorialParagraphs: [
      "Valencia is one of Spain's most accessible cities. The flat terrain, fully accessible metro system, and wide promenades make it ideal for wheelchair users and visitors with reduced mobility.",
      "Renting mobility equipment locally means you avoid the risk of airline damage to your own wheelchair or scooter. We deliver directly to your accommodation — whether that's a hotel in the old town, a beach apartment in Malvarrosa, or an Airbnb in Ruzafa.",
      "Our lightweight mobility scooters are especially popular with visitors who want independence to explore the 9km Turia Gardens, the City of Arts and Sciences, and the accessible beaches with their assisted bathing services.",
    ],
    blogTags: ["mobility", "accessibility"],
  },
  "remote-work": {
    title: "Remote Work Equipment Rental in Valencia",
    description: "Rent monitors, standing desks, ergonomic chairs & tech gear in Valencia. Perfect for digital nomads.",
    emoji: "💻",
    editorialHeading: "Set Up Your Perfect Valencia Workspace",
    editorialParagraphs: [
      "Valencia has become one of Europe's top digital nomad destinations — 300 sunny days, fibre-optic internet exceeding 240 Mbps, and a cost of living well below Barcelona or Lisbon. The only problem? Most rental apartments come with a tiny desk and a wobbly chair.",
      "Our remote work equipment fills that gap. A proper 27-inch monitor, an ergonomic chair, or a height-adjustable standing desk transforms any holiday rental into a genuinely productive workspace. We deliver everything to your apartment and collect it when you leave.",
      "Unlike a coworking space (€120-160/month plus commute time), having your own setup means you work on your terms — on the terrace in the morning, at the desk in the afternoon, and at the beach by 6pm.",
    ],
    blogTags: ["digital nomad", "remote work"],
  },
  "home-living": {
    title: "Home & Living Equipment Rental in Valencia",
    description: "Rent air purifiers, portable AC units, kitchen appliances & more in Valencia.",
    emoji: "🏠",
    editorialHeading: "Make Your Valencia Accommodation Comfortable",
    editorialParagraphs: [
      "Not every holiday rental comes with everything you need. Valencia summers can be intense — temperatures regularly hit 35-40°C in July and August — and many apartments lack air conditioning or have a single underpowered unit.",
      "A portable AC unit (locals call them pinguinos) can transform your summer stay. An air purifier helps during calima days when Saharan dust reduces air quality. These aren't luxuries — they're comfort essentials that make the difference between enduring your holiday and enjoying it.",
      "We deliver and collect everything, so you don't need to buy equipment you'll use for one trip and then leave behind.",
    ],
    blogTags: ["summer", "seasonal"],
  },
  "travel-outdoors": {
    title: "Beach & Outdoor Gear Rental in Valencia",
    description: "Rent beach umbrellas, camping gear & outdoor equipment in Valencia. Ready for Malvarrosa beach.",
    emoji: "🏖️",
    editorialHeading: "Beach-Ready Without the Baggage",
    editorialParagraphs: [
      "Valencia's urban beaches — Malvarrosa, Patacona, El Cabanyal — are some of the Mediterranean's best. Wide sandy stretches, shallow warm water, and a promenade packed with restaurants and bars.",
      "Sunbed and umbrella rental at the chiringuitos runs about €9-10 each, but the areas fill up fast in peak season and you're limited to their roped-off sections. Having your own beach set means you can set up wherever you want, arrive whenever suits you, and have proper UV protection for the whole family.",
      "We deliver beach gear to your accommodation so it's waiting when you arrive. No hunting for shops, no carrying bulky umbrellas through the streets.",
    ],
    blogTags: ["summer", "beach"],
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
  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `https://rentanything.es/rental/${category}`,
    },
  };
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

  // Find related blog posts
  const relatedPosts = getPublishedPosts()
    .filter((post) => post.tags.some((tag) => meta.blogTags.includes(tag)))
    .slice(0, 2);

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

      {/* Editorial Content */}
      <section className="section bg-neutral-50">
        <div className="container-site">
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">{meta.editorialHeading}</h2>
            {meta.editorialParagraphs.map((p, i) => (
              <p key={i} className="text-neutral-600 leading-relaxed mb-4">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Related Guides */}
      {relatedPosts.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <h2 className="text-2xl font-bold mb-6">Related Guides</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <span className="badge badge-brand capitalize mb-2">{post.category}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{post.excerpt}</p>
                  <span className="text-sm font-semibold text-brand mt-3 inline-block">Read guide →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
