import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Rental Bookings, Delivery, Hygiene & Policies",
  description:
    "Everything you need to know about renting baby gear, mobility aids & tech in Valencia. Delivery areas, cancellations & more.",
};

const faqSections = [
  {
    title: "Booking & Payment",
    items: [
      {
        q: "How do I make a booking?",
        a: "Browse our product catalog, select your rental dates, add items to your cart, and checkout securely with Stripe. You'll receive an instant confirmation email with all the details.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay through our secure Stripe payment system. All transactions are encrypted.",
      },
      {
        q: "Is a deposit required?",
        a: "Yes, a refundable security deposit is held on your card at the time of booking. The amount varies by product. It is automatically released within 5 business days after the rental ends, provided the equipment is returned in good condition.",
      },
      {
        q: "How far in advance should I book?",
        a: "We recommend booking at least 48 hours in advance, especially during peak season (Fallas in March, summer June–September, and Christmas). Same-day availability may be possible for select items — contact us on WhatsApp to check.",
      },
      {
        q: "Can I modify or cancel my booking?",
        a: "Yes. Free cancellation is available up to 48 hours before your delivery date. Modifications to dates or items can be made anytime via WhatsApp or email. See our Refunds & Cancellations policy for full details.",
      },
    ],
  },
  {
    title: "Delivery & Pickup",
    items: [
      {
        q: "Where do you deliver?",
        a: "We deliver across Valencia city centre, El Carmen, Ruzafa, the beach areas (Malvarrosa, Patacona, El Cabanyal), and surrounding neighbourhoods. For locations outside central Valencia, please contact us.",
      },
      {
        q: "What are the delivery hours?",
        a: "Standard delivery is available between 9:00 AM and 8:00 PM, seven days a week. Evening deliveries can be arranged on request.",
      },
      {
        q: "Is there a delivery fee?",
        a: "Delivery within central Valencia is free for orders over €50. A small delivery fee applies for smaller orders or locations outside the core delivery zone. The exact amount is shown at checkout.",
      },
      {
        q: "Can I pick up items instead?",
        a: "Yes! Self-pickup is available from our Valencia location. You'll receive the address after booking. This option is free regardless of order value.",
      },
      {
        q: "How does return work?",
        a: "We collect items from your accommodation at the end of your rental period. Just leave them inside your accommodation and we'll coordinate a pickup time. No cleaning required — we handle all sanitisation.",
      },
    ],
  },
  {
    title: "Products & Hygiene",
    items: [
      {
        q: "Are the products safe and clean?",
        a: "Absolutely. Every item is deep-cleaned and sanitised between rentals using professional-grade cleaning products. Safety-critical items (car seats, cribs, wheelchairs) are inspected against manufacturer guidelines before every rental.",
      },
      {
        q: "What brands do you stock?",
        a: "We carry premium brands including Cybex, Stokke, BabyBjörn, Maxi-Cosi, Kinderkraft, Invacare, Dyson, and more. We believe in quality over quantity.",
      },
      {
        q: "What if an item is damaged during my rental?",
        a: "Normal wear and tear is expected and covered. For significant damage, the repair or replacement cost may be deducted from your security deposit. We'll always contact you first and provide photos before any charges.",
      },
      {
        q: "Can I request a specific product not listed?",
        a: "Yes! We're constantly expanding our catalog. Contact us on WhatsApp with what you need and we'll do our best to source it for you.",
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
        a: "Currently we serve Valencia only. Barcelona and Madrid are on our roadmap — sign up for our newsletter to be the first to know when we expand.",
      },
      {
        q: "Do you work with hotels and property managers?",
        a: "Yes! We offer B2B partnerships for hotels, Airbnb hosts, and property managers. Contact us for bulk rates and dedicated support.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
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
