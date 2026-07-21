import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProductsByCategoryFromDB } from "@/lib/product-service";
import { getPublishedPosts } from "@/content/blog";
import ProductCard from "@/components/ProductCard";
import { getBreadcrumbJsonLd, getCategoryCollectionJsonLd, getFaqJsonLd } from "@/lib/jsonld";

interface CategoryContent {
  title: string;
  description: string;
  emoji: string;
  image?: string;
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
  searchIntentHeading?: string;
  searchIntentDescription?: string;
  searchIntents?: Array<{
    title: string;
    description: string;
  }>;
  faqHeading?: string;
  faqs?: Array<{
    question: string;
    answer: string;
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
    featuredHeading: "Plan a Smoother Valencia Stay with a Baby",
    featuredDescription: "Start with a complete arrival setup, choose a toddler-focused city kit, or use our family guide to plan around sleep, feeding and getting around.",
    featuredPathways: [
      {
        eyebrow: "Baby arrival kit",
        title: "Prepare Your Accommodation Before Arrival",
        description: "Combine sleep, feeding, bathing and mobility essentials around your baby's routine and stay.",
        href: "/valencia/kits/baby-arrival-kit",
      },
      {
        eyebrow: "Toddler city kit",
        title: "Configure a Toddler City Setup",
        description: "Choose practical mobility, outing and play equipment for exploring Valencia with a toddler.",
        href: "/valencia/kits/toddler-city-kit",
      },
      {
        eyebrow: "Valencia guide",
        title: "Plan Valencia with a Baby or Toddler",
        description: "Compare neighbourhoods, family activities, transport and the bulky equipment worth arranging locally.",
        href: "/blog/valencia-with-kids-complete-guide",
      },
      {
        eyebrow: "Decision guide",
        title: "Decide What to Bring, Rent or Buy",
        description: "Use a practical item-by-item framework for your trip length, transport plan and accommodation.",
        href: "/blog/rent-vs-buy-baby-gear-valencia",
      },
    ],
    faqHeading: "Baby Equipment Rental in Valencia: FAQs",
    faqs: [
      { question: "Can I rent a stroller or travel cot in Valencia?", answer: "Yes. Choose the relevant product, enter your dates and review the available pickup or delivery options before payment. Product pages list dimensions, included parts and suitability details." },
      { question: "Can baby equipment be delivered to my accommodation?", answer: "The booking flow shows the delivery and pickup options available for your address and dates. Access details, timing and any setup requirements can be confirmed before handover." },
      { question: "How is rental baby equipment prepared between bookings?", answer: "Equipment is checked and prepared between rentals. Product-specific care, hygiene and safety information is shown on the relevant listing, and you can contact us with any suitability question before booking." },
      { question: "Should I book individual items or a Baby Arrival Kit?", answer: "Choose individual products when you need one specific item. The Baby Arrival Kit is the simpler starting point when you need several sleep, feeding, bathing or mobility essentials for the same stay." },
    ],
  },
  "kids-family": {
    title: "Kids & Family Equipment Rental in Valencia",
    description: "Rent balance bikes, toys and practical family equipment in Valencia. Flexible pickup and delivery options for your stay.",
    emoji: "🧸",
    image: "/discover/turia-gardens-hero.webp",
    editorialHeading: "Useful Gear for Family Stays in Valencia",
    editorialParagraphs: [
      "Family holidays are easier when children have age-appropriate equipment without every bulky item travelling through the airport. Renting locally keeps luggage lighter and lets you choose what fits the stay rather than what fits the suitcase.",
      "This collection covers practical equipment for older toddlers, children and shared family activities. Individual product pages explain the relevant size, age guidance, included parts and rental conditions so you can check suitability before booking.",
      "Whether you are staying near the Turia Gardens, the beach or in a Valencia apartment, we can help coordinate pickup or delivery around your accommodation and rental dates.",
    ],
    blogTags: ["family", "kids"],
    featuredHeading: "Plan a Family-Friendly Valencia Stay",
    featuredDescription: "Connect individual equipment with a practical family kit or use our local guide to plan activities around your children and accommodation.",
    featuredPathways: [
      {
        eyebrow: "Toddler kit",
        title: "Configure a Toddler City Kit",
        description: "Combine practical mobility, play and outing essentials for exploring Valencia with a toddler.",
        href: "/valencia/kits/toddler-city-kit",
      },
      {
        eyebrow: "Family beach kit",
        title: "Build a Family Beach Setup",
        description: "Bring together shade, carrying, cooling and play equipment for Valencia beach days.",
        href: "/valencia/kits/family-beach-kit",
      },
      {
        eyebrow: "Valencia guide",
        title: "Plan Valencia with Children",
        description: "Use our practical family guide to choose neighbourhoods, activities and useful equipment for your stay.",
        href: "/blog/valencia-with-kids-complete-guide",
      },
    ],
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
    featuredHeading: "Plan Accessible Travel in Valencia",
    featuredDescription: "Choose a focused accessibility setup, prepare for a visit with older relatives, or use our local guide to understand routes and facilities.",
    featuredPathways: [
      {
        eyebrow: "Accessibility kit",
        title: "Configure an Accessible Valencia Kit",
        description: "Combine mobility equipment with practical bathroom and daily-living support for your accommodation.",
        href: "/valencia/kits/accessible-valencia-kit",
      },
      {
        eyebrow: "Family visit kit",
        title: "Prepare for Grandparents Visiting",
        description: "Build a tailored setup around walking support, comfort and Valencia's warmer conditions.",
        href: "/valencia/kits/grandparents-visiting-kit",
      },
      {
        eyebrow: "Accessibility guide",
        title: "Explore Accessible Valencia",
        description: "Plan transport, attractions, beaches and neighbourhood routes with practical accessibility context.",
        href: "/blog/wheelchair-accessibility-valencia",
      },
    ],
    faqHeading: "Mobility Equipment Rental in Valencia: FAQs",
    faqs: [
      { question: "Can I rent a wheelchair or mobility scooter in Valencia?", answer: "Yes. Published listings show the available wheelchair, scooter and walking-aid options. Enter your dates to check inventory and review pickup or delivery before payment." },
      { question: "How do I choose between a wheelchair, rollator and scooter?", answer: "Consider walking ability, transfer needs, travel distance, storage, transport and the accommodation entrance. Each product page lists dimensions and key specifications; contact us if you need help comparing options." },
      { question: "Can mobility equipment be delivered to a hotel or apartment?", answer: "Available delivery and pickup options are shown during booking. Tell us about steps, lifts, door widths or reception restrictions so the handover can be planned safely." },
      { question: "Is Valencia suitable for wheelchair and scooter users?", answer: "Many central routes, the Turia Gardens and the seafront are relatively level, but surfaces and access vary. Use our accessibility guide to plan routes and verify current transport or venue information directly." },
    ],
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
      {
        eyebrow: "Setup checklist",
        title: "Build a Reliable Apartment Workstation",
        description: "Check internet, dimensions, light, noise and the minimum equipment before your first working day.",
        href: "/blog/home-office-setup-valencia-apartment",
      },
    ],
    faqHeading: "Remote Work Equipment Rental in Valencia: FAQs",
    faqs: [
      { question: "Can I rent a monitor in Valencia for a short stay?", answer: "Yes. Select a published monitor, enter your dates and check availability. The product page lists screen size, ports and included accessories so you can confirm compatibility first." },
      { question: "Can you deliver office equipment to my apartment?", answer: "The booking flow shows available delivery and collection options for the address and rental window. Building access, lift dimensions and assembly needs can be confirmed before handover." },
      { question: "What do I need for a temporary home office?", answer: "A monitor, suitable desk height and supportive chair are the core items. Laptop stands, input devices or hubs depend on your equipment and working pattern. The Remote Work Apartment Kit provides a combined starting point." },
      { question: "Can I rent equipment for several weeks or months?", answer: "Enter the complete rental window on the product page. The pricing calculator applies the relevant duration tier and shows availability and the total before checkout." },
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
        eyebrow: "Long-stay kit",
        title: "Upgrade a Temporary Kitchen",
        description: "Combine practical kitchen equipment for a longer apartment stay without buying bulky appliances.",
        href: "/valencia/kits/long-stay-kitchen-upgrade-kit",
      },
      {
        eyebrow: "Practical guide",
        title: "Prepare for Summer in Valencia",
        description: "Use local routines, apartment cooling strategies and beach timing to manage warmer days.",
        href: "/blog/valencia-summer-survival-guide",
      },
    ],
    faqHeading: "Portable AC and Apartment Equipment Rental: FAQs",
    faqs: [
      { question: "Can I rent a portable air conditioner in Valencia?", answer: "Yes, when a published unit is available for your dates. Check the product page for room guidance, exhaust requirements, dimensions and noise information before booking." },
      { question: "Will a portable air conditioner work in my apartment?", answer: "The room needs a suitable window or balcony-door route for the exhaust hose and enough space around the unit. Review the listing and confirm the opening type with us if you are unsure." },
      { question: "Do you deliver and collect portable air conditioners?", answer: "Available delivery and collection options, timing and fees are shown during booking. Access restrictions and placement can be confirmed before handover because portable units are bulky." },
      { question: "Should I rent an air conditioner, fan or air purifier?", answer: "An air conditioner actively cools when it can vent outside. A fan moves air but does not lower room temperature. An air purifier addresses particles rather than heat. Choose according to the accommodation problem you need to solve." },
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
    searchIntentHeading: "Choose the Right Beach Setup",
    searchIntentDescription: "Use one Valencia beach-equipment hub to compare the setup you need rather than searching across separate, overlapping rental pages.",
    searchIntents: [
      {
        title: "Shade for a simple beach day",
        description: "Compare umbrellas and compact shelters by covered area, packed size, setup method and wind guidance before checking your dates.",
      },
      {
        title: "A complete family beach setup",
        description: "Start with the Family Beach Kit when you need shade plus practical extras such as cooling, towels, toys or easier transport.",
      },
      {
        title: "Equipment that is easier to carry",
        description: "Browse coolers, beach wagons, folding furniture and other published gear for Malvarrosa, Patacona and stays near Valencia's coast.",
      },
    ],
    faqHeading: "Beach Equipment Rental in Valencia: FAQs",
    faqs: [
      {
        question: "Can I rent beach equipment in Valencia?",
        answer: "Yes. Browse the published Beach & Outdoor catalogue, select your dates and check availability. Pickup or delivery options are shown during the booking flow before payment.",
      },
      {
        question: "Do you deliver beach equipment to Malvarrosa or Patacona?",
        answer: "Supported pickup and delivery options, timing and any applicable fee are shown for the address and dates entered during booking. Contact us if your accommodation sits outside the listed service areas.",
      },
      {
        question: "What beach equipment can I rent?",
        answer: "The published catalogue may include umbrellas, shelters, towels, coolers, wagons, folding furniture and beach games. Exact products and availability depend on your selected dates.",
      },
      {
        question: "Should I choose a beach umbrella or a shelter?",
        answer: "An umbrella is flexible and familiar for smaller groups. A shelter can provide a broader covered area for families. Compare dimensions, setup instructions and wind limitations on each product page.",
      },
      {
        question: "Can I book beach gear for a single day?",
        answer: "Enter your preferred start and end time on the relevant product page. The booking flow will show whether the item is available and calculate the applicable rental price for that period.",
      },
    ],
  },
};

interface Props {
  params: Promise<{ category: string }>;
}

export const revalidate = 300;

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
        "x-default": `https://rentanything.es/rental/${category}`,
      },
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `https://rentanything.es/rental/${category}`,
      images: [{ url: meta.image ?? `/categories/${category}.webp`, alt: meta.title }],
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
      {meta.faqs && meta.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              getFaqJsonLd(meta.faqs.map((faq) => ({ q: faq.question, a: faq.answer })))
            ),
          }}
        />
      )}
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

      {meta.searchIntents && meta.searchIntents.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <div className="max-w-3xl mb-8">
              <h2 className="text-2xl font-bold mb-3">{meta.searchIntentHeading}</h2>
              <p className="text-neutral-600 leading-relaxed">{meta.searchIntentDescription}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {meta.searchIntents.map((intent) => (
                <div key={intent.title} className="card p-6 bg-white">
                  <h3 className="font-bold text-lg mb-2">{intent.title}</h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{intent.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

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

      {meta.faqs && meta.faqs.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold mb-8">{meta.faqHeading}</h2>
              <div className="grid md:grid-cols-2 gap-5">
                {meta.faqs.map((faq) => (
                  <div key={faq.question} className="card p-6 bg-white">
                    <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                    <p className="text-neutral-600 leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
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
