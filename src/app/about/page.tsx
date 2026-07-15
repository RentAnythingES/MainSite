import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Our Story",
  description:
    "We built RentAnything.es to take the stress out of travel. Premium baby gear, mobility aids, tech and more, delivered across Valencia.",
  alternates: { canonical: "https://rentanything.es/about" },
};

const values = [
  {
    icon: "🌱",
    title: "Sustainability First",
    description: "Renting reduces waste. Every item we circulate is one less manufactured, shipped, and discarded.",
  },
  {
    icon: "✨",
    title: "Premium Quality",
    description: "We stock brands you trust — Cybex, Stokke, Dyson, Invacare. No generic knockoffs.",
  },
  {
    icon: "🧼",
    title: "Hospital-Grade Clean",
    description: "Every item is deep-sanitised between rentals. We follow strict hygiene protocols.",
  },
  {
    icon: "💬",
    title: "Human Support",
    description: "Real people on WhatsApp, not chatbots. We respond in minutes, not days.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl">
            <span className="badge badge-brand mb-4">About Us</span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
              Travel light.{" "}
              <span className="text-brand">Live fully.</span>
            </h1>
            <p className="text-lg text-neutral-600 leading-relaxed">
              We started RentAnything.es because we believe nobody should have to lug heavy
              equipment through airports just to have a comfortable trip. Whether you&apos;re
              travelling with toddlers, need mobility support, or want a proper remote work
              setup — we deliver it to your door in Valencia.
            </p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-white">
        <div className="container-site">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-neutral-600 leading-relaxed">
                <p>
                  The idea was simple: why buy things you only need for a week? Inspired by
                  the growing sharing economy across Europe, we launched in Valencia — a city
                  that welcomes millions of tourists, digital nomads, and expats every year.
                </p>
                <p>
                  We noticed that families were paying airline overweight fees for strollers,
                  remote workers were hunched over laptop screens in beautiful apartments, and
                  visitors with mobility needs struggled to find reliable short-term equipment.
                </p>
                <p>
                  So we built a one-stop rental platform. Premium brands, delivered and collected
                  from your accommodation. No stress, no heavy luggage, no compromise on quality.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-brand/5 to-accent/5 rounded-2xl p-12 flex items-center justify-center aspect-square md:aspect-auto md:h-full">
              <div className="text-center">
                <span className="text-6xl block mb-4">🌍</span>
                <p className="text-2xl font-bold text-brand">Valencia, Spain</p>
                <p className="text-neutral-500 text-sm mt-1">Our home base</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold text-center mb-12">What We Stand For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-xl border border-border p-6 text-center hover:shadow-lg transition-all">
                <span className="text-4xl block mb-4">{v.icon}</span>
                <h3 className="font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="section bg-white">
        <div className="container-site max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-6">Company Details</h2>
          <div className="bg-neutral-50 rounded-xl border border-border p-8">
            <p className="text-neutral-700 font-semibold mb-1">Escalera Labs S.L.</p>
            <p className="text-sm text-neutral-500 mb-4">Registered in Spain</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-neutral-600">
              <span>📍 Valencia, Spain</span>
              <span>📧 hello@rentanything.es</span>
              <span>💬 WhatsApp available</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-16">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Questions?</h2>
          <p className="text-teal-100 mb-8">We&apos;d love to hear from you.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-accent btn-lg">Contact Us</Link>
            <Link href="/faq" className="btn btn-lg bg-white/15 text-white hover:bg-white/25 border border-white/20">
              Read FAQ
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
