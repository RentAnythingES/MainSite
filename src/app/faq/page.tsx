import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Rental Bookings, Delivery, Hygiene & Policies",
  description:
    "Everything you need to know about renting baby gear, mobility aids & tech in Valencia. Delivery areas, cancellations & more.",
  alternates: {
    canonical: "https://rentanything.es/faq",
    languages: {
      en: "https://rentanything.es/faq",
      es: "https://rentanything.es/es/faq",
      "x-default": "https://rentanything.es/faq",
    },
  },
};

const faqSections = [
  {
    title: "Booking & Payment",
    items: [
      {
        q: "How do I make a booking?",
        a: "Open a product, choose your start and end date and time, select pickup or an available delivery option, and check availability. If the item is available, enter your details and continue to secure Stripe Checkout. We email the booking details after payment is confirmed.",
      },
      {
        q: "What payment methods do you accept?",
        a: "Online bookings are paid through Stripe. The payment methods available to you are shown securely in Stripe Checkout and can vary by device, browser, and account configuration.",
      },
      {
        q: "Is a deposit required?",
        a: "Our current online checkout does not automatically add a security deposit. If a particular rental requires one in the future, the amount and return conditions will be disclosed before you pay.",
      },
      {
        q: "How far in advance should I book?",
        a: "We recommend booking at least 48 hours in advance, especially during peak season (Fallas in March, summer June–September, and Christmas). Same-day availability may be possible for select items — contact us on WhatsApp to check.",
      },
      {
        q: "Can I modify or cancel my booking?",
        a: "Contact us by WhatsApp or email as soon as possible. Changes depend on inventory and operational availability. Free cancellation is available 48 or more hours before the scheduled handover; see our Refunds & Cancellations policy for the complete terms.",
      },
    ],
  },
  {
    title: "Delivery & Pickup",
    items: [
      {
        q: "Where do you deliver?",
        a: "The booking form shows the Valencia service zones currently available for online delivery. If your address is outside those zones, contact us and we can assess a custom-distance quote.",
      },
      {
        q: "What are the delivery hours?",
        a: "Available handover times depend on the selected dates, service zone, and operational schedule. Choose your preferred start and end time in the booking form; we confirm the practical handover details with your booking.",
      },
      {
        q: "Is there a delivery fee?",
        a: "Delivery and collection fees depend on the selected service zone and service type. The exact charge is calculated from the active configuration and shown before Stripe Checkout. Custom-distance requests are quoted separately.",
      },
      {
        q: "Can I pick up items instead?",
        a: "Yes. Free self-pickup is available from the active pickup points shown in the booking form, currently including Burjassot and Paterna. Select the location that suits you before checking availability.",
      },
      {
        q: "How does return work?",
        a: "Return follows the fulfillment option in your booking: bring the item back to the agreed pickup point, or hand it over at the collection address and time if you paid for collection. Your confirmation messages contain the relevant instructions.",
      },
      {
        q: "Can I change from self-pickup to delivery after booking?",
        a: "Contact us before handover. If the confirmed or paid booking is still eligible and delivery is operationally available, we can send a private, expiring quote. You pay only the added transport fee through Stripe before the booking is updated.",
      },
    ],
  },
  {
    title: "Products & Hygiene",
    items: [
      {
        q: "Are the products safe and clean?",
        a: "We clean and check items between rentals. Safety-critical products are reviewed using the available manufacturer information and our operational process before handover.",
      },
      {
        q: "What brands do you stock?",
        a: "Our catalogue includes different brands and models according to current inventory. Each product page identifies the brand and verified specifications when known.",
      },
      {
        q: "What if an item is damaged during my rental?",
        a: "Normal wear and tear is expected. If significant damage occurs, contact us promptly. We inspect the item and explain any documented repair or replacement cost before requesting an additional payment; the current checkout does not rely on an automatic security deposit.",
      },
      {
        q: "Can I request a specific product not listed?",
        a: "Yes. Send us the item, dates, and location on WhatsApp. We can check whether a suitable alternative can be sourced, but we do not promise inventory until it is confirmed.",
      },
    ],
  },
  {
    title: "About Our Service",
    items: [
      {
        q: "Who runs RentAnything.es?",
        a: "We're operated by Escalera Labs S.L., a company registered in Spain. Our team is based in Valencia and we know the city inside out.",
      },
      {
        q: "Do you serve other cities?",
        a: "We currently focus on Valencia. We will expand coverage only when we can support a reliable local operation.",
      },
      {
        q: "Do you work with hotels and property managers?",
        a: "Yes. We can discuss defined equipment and handover arrangements with hotels, holiday apartments, relocation agencies, and property managers. See our host-services page for the current scope.",
      },
    ],
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqSections.flatMap((section) =>
    section.items.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  ),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }}
      />
      {/* Hero */}
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Everything you need to know about renting with us in Valencia.
            Can&apos;t find your answer? <Link href="/contact" className="text-brand font-semibold hover:underline">Get in touch</Link>.
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="section bg-white">
        <div className="container-site max-w-3xl">
          <div className="space-y-12">
            {faqSections.map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-bold mb-6 pb-3 border-b border-border">
                  {section.title}
                </h2>
                <div className="space-y-3">
                  {section.items.map((faq) => (
                    <details
                      key={faq.q}
                      className="group bg-neutral-50 rounded-xl p-5 cursor-pointer hover:bg-neutral-100/80 transition-colors"
                    >
                      <summary className="flex items-center justify-between font-semibold text-neutral-800 list-none text-[15px]">
                        {faq.q}
                        <span className="text-neutral-400 group-open:rotate-45 transition-transform text-xl ml-4 flex-shrink-0">
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
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-50 py-16">
        <div className="container-site text-center">
          <h2 className="text-2xl font-bold mb-3">Still have questions?</h2>
          <p className="text-neutral-500 mb-6">We respond within minutes on WhatsApp.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn btn-primary">Contact Us</Link>
            <a
              href="https://wa.me/34684708013"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
