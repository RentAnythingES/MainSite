import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Rent&Roll | Valencia Rental Service",
  description:
    "Learn why Rent&Roll helps visitors travel lighter with practical equipment rentals, local pickup and delivery options in Valencia.",
  alternates: {
    canonical: "https://rentandroll.com/about",
    languages: {
      en: "https://rentandroll.com/about",
      es: "https://rentandroll.com/es/about",
      "x-default": "https://rentandroll.com/about",
    },
  },
};

const values = [
  {
    icon: "♻️",
    title: "Thoughtful reuse",
    description: "Renting makes practical equipment available to more visitors without every trip requiring another purchase.",
  },
  {
    icon: "🔎",
    title: "Clear product information",
    description: "We identify brands, models and verified specifications so you can choose equipment that suits your stay.",
  },
  {
    icon: "🧼",
    title: "Cleaned and checked",
    description: "Items are cleaned and checked between rentals as part of our operating process.",
  },
  {
    icon: "💬",
    title: "Human support",
    description: "Contact us directly when you need help choosing an item, arranging fulfilment or changing a booking.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://rentandroll.com/about#page",
      url: "https://rentandroll.com/about",
      name: "About Rent&Roll",
      inLanguage: "en",
      about: { "@id": "https://rentandroll.com/#organization" },
    },
    {
      "@type": "Organization",
      "@id": "https://rentandroll.com/#organization",
      name: "Rent&Roll",
      legalName: "Escalera Labs S.L.",
      url: "https://rentandroll.com",
      email: "hello@rentandroll.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Burjassot",
        addressRegion: "Valencia",
        postalCode: "46100",
        addressCountry: "ES",
      },
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl">
            <span className="badge badge-brand mb-4">About us</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Travel light. <span className="text-brand">Feel at home.</span>
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Rent&Roll helps visitors spend less of their trip carrying, buying and storing bulky equipment. Choose the practical items you need and arrange an available pickup or delivery option in Valencia.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why we built Rent&Roll</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  Families, remote workers and travellers with accessibility needs often require useful equipment for only part of a stay. Bringing it from home can mean extra luggage, while buying it locally creates cost and waste.
                </p>
                <p>
                  We are building a Valencia-first rental catalogue where visitors can compare real products, check availability for their dates and choose from the fulfilment options currently offered at checkout.
                </p>
                <p>
                  Our aim is simple: make temporary access to practical equipment clearer, more convenient and supported by people who know the local service.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand/5 to-accent/5 rounded-2xl p-12 flex items-center justify-center aspect-square md:aspect-auto md:h-full">
              <div className="text-center">
                <span className="text-6xl block mb-4">📍</span>
                <p className="text-2xl font-bold text-brand">Valencia, Spain</p>
                <p className="text-neutral-500 text-sm mt-1">Our first service area</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold text-center mb-12">How we approach the service</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl border border-border p-6 text-center hover:shadow-lg transition-all">
                <span className="text-4xl block mb-4">{value.icon}</span>
                <h3 className="font-bold text-lg mb-2">{value.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-6">Company details</h2>
          <div className="bg-neutral-50 rounded-xl border border-border p-8">
            <p className="text-neutral-700 font-semibold mb-1">Escalera Labs S.L.</p>
            <p className="text-sm text-neutral-500 mb-4">CIF ESB22961221 · Registered in Spain</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-neutral-600">
              <span>📍 Burjassot, Valencia</span>
              <span>📧 hello@rentandroll.com</span>
              <span>💬 WhatsApp support</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-brand py-16">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-4">How can we help?</h2>
          <p className="text-teal-100 mb-8">Ask about a product, booking or partnership.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-accent btn-lg">Contact us</Link>
            <Link href="/faq" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">Read the FAQ</Link>
          </div>
        </div>
      </section>
    </>
  );
}
