import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategoryFromDB } from "@/lib/product-service";
import { getPublishedPosts } from "@/content/blog";
import ProductCard from "@/components/ProductCard";
import { getBreadcrumbJsonLd, getCategoryCollectionJsonLd } from "@/lib/jsonld";

interface CategoryContent {
  title: string;
  description: string;
  emoji: string;
  editorialHeading: string;
  editorialParagraphs: string[];
  blogTags: string[];
  featuredHeading?: string;
  featuredDescription?: string;
  featuredPathways?: Array<{
    eyebrow: string;
    title: string;
    description: string;
    href: string;
  }>;
}

const categoryMeta: Record<string, CategoryContent> = {
  "baby-gear": {
    title: "Baby & Toddler Gear Rental in Valencia",
    description: "Rent travel cots, strollers, high chairs, baby baths & toddler gear in Valencia. Premium brands delivered to your accommodation.",
    emoji: "👶",
    editorialHeading: "Why Rent Baby Gear in Valencia?",
    editorialParagraphs: [
      "Travelling with a baby or toddler means packing strategically. Strollers, car seats, and travel cribs are bulky, heavy, and expensive to check as airline luggage — plus there's always the risk of damage in transit.",
      "Renting locally solves all of this. We deliver premium baby equipment directly to your hotel, Airbnb, or holiday apartment before you arrive. Everything is cleaned and inspected between rentals. When you're done, we collect it from your door. No queues, no luggage carousels, no stress.",
      "Valencia is one of Europe's most family-friendly cities — flat streets for strollers, gentle beaches for toddlers, and a culture that genuinely welcomes children everywhere. The right gear makes it even better.",
    ],
    blogTags: ["family", "kids"],
  },
  "kids-family": {
    title: "Kids & Family Equipment Rental in Valencia",
    description: "Rent balance bikes, toys and practical family equipment in Valencia. Flexible pickup and delivery options for your stay.",
    emoji: "🧸",
    editorialHeading: "Useful Gear for Family Stays in Valencia",
    editorialParagraphs: [
      "Family holidays are easier when children have age-appropriate equipment without every bulky item travelling through the airport. Renting locally keeps luggage lighter and lets you choose what fits the stay rather than what fits the suitcase.",
      "This collection covers practical equipment for older toddlers, children and shared family activities. Individual product pages explain the relevant size, age guidance, included parts and rental conditions so you can check suitability before booking.",
      "Whether you are staying near the Turia Gardens, the beach or in a Valencia apartment, we can help coordinate pickup or delivery around your accommodation and rental dates.",
    ],
    blogTags: ["family", "kids"],
  },
  "mobility": {
    title: "Mobility & Accessibility Rental in Valencia",
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
    description: "Rent monitors, standing desks and ergonomic office equipment in Valencia, with delivery and collection for remote-work and longer stays.",
    emoji: "💻",
    editorialHeading: "Build a Practical Workspace in Your Valencia Apartment",
    editorialParagraphs: [
      "A temporary apartment may have reliable internet but still lack a comfortable place for focused work. Renting remote-work equipment in Valencia lets you add the screen, desk or chair you need without buying furniture for a short or medium-length stay.",
      "Choose an individual monitor, height-adjustable desk or ergonomic chair according to your working pattern and available space. Each product page explains connections, dimensions, adjustability and compatibility so you can confirm that the equipment suits your laptop and accommodation before booking.",
      "For a complete setup, the Remote Work Apartment Kit combines the core workstation items and optional add-ons in one request. Delivery and collection options are shown during booking, while access, placement and any assembly requirements can be confirmed with the apartment in advance.",
    ],
    blogTags: ["digital nomad", "remote work"],
    featuredHeading: "Plan Your Valencia Work Setup",
    featuredDescription: "Start with a complete apartment workstation or use our Valencia digital-nomad guide to plan where and how you want to work.",
    featuredPathways: [
      {
        eyebrow: "Workspace kit",
        title: "Configure a Remote Work Apartment Kit",
        description: "Combine a monitor, desk, ergonomic seating and practical accessories around your stay.",
        href: "/valencia/kits/remote-work-apartment-kit",
      },
      {
        eyebrow: "Valencia guide",
        title: "Plan a Remote-Work Stay in Valencia",
        description: "Compare apartment working, coworking and neighbourhood considerations for a productive stay.",
        href: "/blog/digital-nomad-guide-valencia",
      },
    ],
  },
  "home-living": {
    title: "Apartment Equipment Rental in Valencia",
    description: "Rent portable air conditioners, air purifiers and apartment comfort equipment in Valencia, with delivery and collection for short and long stays.",
    emoji: "🏠",
    editorialHeading: "Make Your Valencia Apartment Work for Your Stay",
    editorialParagraphs: [
      "Holiday apartments and temporary homes do not always include the equipment needed for a comfortable Valencia stay. Portable cooling, air-quality equipment and practical apartment upgrades can solve a specific problem without buying, storing or disposing of a bulky appliance after the trip.",
      "For summer stays, a portable air conditioner can make a bedroom or living area more comfortable when the property has limited cooling. These units need suitable window or balcony-door venting, so each product page explains room coverage, exhaust requirements, noise and setup considerations before availability is confirmed.",
      "Air purifiers can support guests who are sensitive to dust, pollen or indoor air quality. Choose an individual item below or start with the Summer Apartment Kit for a tailored combination. Delivery and collection options are shown during booking, with final setup details confirmed for the accommodation.",
    ],
    blogTags: ["summer", "seasonal"],
    featuredHeading: "Plan a More Comfortable Valencia Stay",
    featuredDescription: "Start with a seasonal apartment kit or use our practical summer guide to decide which cooling and comfort equipment fits your accommodation.",
    featuredPathways: [
      {
        eyebrow: "Apartment kit",
        title: "Configure a Summer Apartment Kit",
        description: "Combine suitable cooling and air-quality equipment for hot-weather stays in Valencia.",
        href: "/valencia/kits/summer-apartment-survival-kit",
      },
      {
        eyebrow: "Practical guide",
        title: "Prepare for Summer in Valencia",
        description: "Use local routines, apartment cooling strategies and beach timing to manage warmer days.",
        href: "/blog/valencia-summer-survival-guide",
      },
    ],
  },
  "travel-outdoors": {
    title: "Beach Equipment Rental in Valencia",
    description: "Rent beach umbrellas, shelters and family beach shade in Valencia, with pickup or delivery options for Malvarrosa, Patacona and nearby stays.",
    emoji: "🏖️",
    editorialHeading: "Rent Beach Gear for Valencia Days by the Sea",
    editorialParagraphs: [
      "Beach umbrellas and shelters are awkward to pack, difficult to carry through an airport and rarely supplied by holiday apartments. Renting beach equipment in Valencia gives you reliable shade without buying bulky gear for a short stay.",
      "Choose the product that fits your group and beach plans, from a traditional umbrella setup to a compact family shelter. Each product page records the verified dimensions, weight, included parts, setup guidance and important wind or care limitations before you check availability.",
      "Pickup and delivery options make the equipment practical for stays near Malvarrosa, Patacona, Cabanyal and the city centre. Families who need more than shade can also start with the Family Beach Kit and request the combination that suits their dates.",
    ],
    blogTags: ["summer", "beach"],
    featuredHeading: "Plan Your Valencia Beach Days",
    featuredDescription: "Connect your equipment choice with a family kit or a practical guide to the beach nearest your accommodation.",
    featuredPathways: [
      {
        eyebrow: "Beach kit",
        title: "Build a Family Beach Setup",
        description: "Combine shade with practical family add-ons for beach days during your Valencia stay.",
        href: "/valencia/kits/family-beach-kit",
      },
      {
        eyebrow: "Local guide",
        title: "Plan a Day at Malvarrosa",
        description: "Understand the promenade, family facilities and what to bring for Valencia's best-known urban beach.",
        href: "/discover/malvarrosa-beach",
      },
      {
        eyebrow: "Local guide",
        title: "Explore Patacona Beach",
        description: "Plan a slightly quieter beach day north of Malvarrosa and choose suitable equipment for your stay.",
        href: "/discover/patacona-beach",
      },
    ],
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

export const dynamic = "force-dynamic";

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
      languages: {
        en: `https://rentanything.es/rental/${category}`,
        es: `https://rentanything.es/es/rental/${category}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://rentanything.es/rental/${category}`,
      images: [{ url: `/categories/${category}.png`, alt: meta.title }],
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const meta = categoryMeta[category];
  if (!meta) notFound();

  const categoryProducts = await getProductsByCategoryFromDB(category);

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getCategoryCollectionJsonLd({
              name: meta.title,
              description: meta.description,
              url: `https://rentanything.es/rental/${category}`,
              locale: "en",
              products: categoryProducts,
            })
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getBreadcrumbJsonLd([
              { name: "Home", url: "https://rentanything.es" },
              { name: "Valencia", url: "https://rentanything.es/valencia" },
              { name: meta.title, url: `https://rentanything.es/rental/${category}` },
            ])
          ),
        }}
      />
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

      {meta.featuredPathways && meta.featuredPathways.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl font-bold mb-3">{meta.featuredHeading}</h2>
              <p className="text-neutral-600">
                {meta.featuredDescription}
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {meta.featuredPathways.map((pathway) => (
                <Link
                  key={pathway.href}
                  href={pathway.href}
                  className="card p-6 hover:shadow-md transition-shadow group"
                >
                  <span className="badge badge-brand mb-3">{pathway.eyebrow}</span>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">
                    {pathway.title}
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed mb-4">
                    {pathway.description}
                  </p>
                  <span className="text-sm font-semibold text-brand">Explore →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

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
            href="https://wa.me/34684708013"
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
