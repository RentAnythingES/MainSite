import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works — Browse, Book, Deliver, Return",
  description:
    "Renting is simple. Browse our range, pick your dates, choose delivery or pickup, and we handle the rest. Delivered to your door in Valencia.",
};

const steps = [
  {
    number: "01",
    title: "Browse",
    description:
      "Explore our selection of premium rental gear by category or search. Filter by what you need — baby gear, mobility aids, remote work setups, and more.",
    details: [
      "Search by category, brand, or keyword",
      "Check real-time availability for your dates",
      "Review product details and rental pricing",
      "Ask us for local guidance when needed",
    ],
    icon: "🔍",
    color: "from-teal-500 to-teal-600",
  },
  {
    number: "02",
    title: "Book",
    description:
      "Select your rental dates, choose a pickup or delivery option, and complete payment through secure Stripe Checkout. We then email your booking details.",
    details: [
      "Pick your start and end dates",
      "Choose pickup or delivery",
      "Secure payment via Stripe (Visa, Mastercard, Apple Pay)",
      "Booking confirmation by email",
    ],
    icon: "📅",
    color: "from-amber-500 to-amber-600",
  },
  {
    number: "03",
    title: "Delivery or Pickup",
    description:
      "Choose a configured pickup point or an available Valencia delivery zone. We confirm the practical handover details for your booking.",
    details: [
      "Delivery options shown for configured service zones",
      "Pickup options in Burjassot and Paterna",
      "Start and end times included in your booking",
      "Item condition checked before handover",
    ],
    icon: "🚚",
    color: "from-blue-500 to-blue-600",
  },
  {
    number: "04",
    title: "Use & Return",
    description:
      "Use the item for your confirmed rental period, then return it at the agreed pickup point or hand it back during the booked collection.",
    details: [
      "Contact us if your plans change",
      "Extensions depend on the next booking",
      "Collection is included when selected at checkout",
      "Return instructions are included in booking messages",
    ],
    icon: "✨",
    color: "from-emerald-500 to-emerald-600",
  },
];

const faqs = [
  {
    q: "How far in advance should I book?",
    a: "We recommend booking at least 48 hours in advance, especially during peak season (June–September). Same-day delivery may be available for select items.",
  },
  {
    q: "What areas do you deliver to?",
    a: "We deliver across Valencia city centre, the beach areas (Malvarrosa, Patacona, El Cabanyal), and surrounding neighbourhoods. Contact us for locations outside central Valencia.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay via our secure Stripe checkout.",
  },
  {
    q: "What if I need to extend my rental?",
    a: "No problem! Just message us on WhatsApp or email and we'll extend your booking. You'll only be charged for the additional days.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            How It Works
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Four simple steps from browsing to enjoying your rental.
            No heavy luggage, no stress — just the gear you need, when you need it.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="section bg-white" id="steps">
        <div className="container-site">
          <div className="space-y-16 md:space-y-24">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-16`}
              >
                {/* Visual */}
                <div className="flex-1 w-full">
                  <div className={`bg-gradient-to-br ${step.color} rounded-2xl p-12 md:p-16 flex items-center justify-center`}>
                    <span className="text-7xl md:text-8xl">{step.icon}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <span className="text-sm font-bold text-brand tracking-widest uppercase">
                    Step {step.number}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                    {step.title}
                  </h2>
                  <p className="text-neutral-600 leading-relaxed mb-6">
                    {step.description}
                  </p>
                  <ul className="space-y-3">
                    {step.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-3">
                        <span className="mt-0.5 w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 text-xs">
                          ✓
                        </span>
                        <span className="text-sm text-neutral-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick FAQ */}
      <section className="section bg-neutral-50" id="how-it-works-faq">
        <div className="container-site max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-10">
            Common Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-white rounded-xl border border-border p-6 cursor-pointer"
              >
                <summary className="flex items-center justify-between font-semibold text-neutral-800 list-none">
                  {faq.q}
                  <span className="text-neutral-400 group-open:rotate-45 transition-transform text-xl">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-neutral-600 text-sm leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand py-16" id="how-it-works-cta">
        <div className="container-site text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-teal-100 mb-8 max-w-lg mx-auto">
            Browse our full range and book in minutes. Your gear will be waiting for you.
          </p>
          <Link href="/valencia" className="btn btn-accent btn-lg">
            Browse Valencia Rentals →
          </Link>
        </div>
      </section>
    </>
  );
}
