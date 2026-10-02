import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Rent&Roll in Valencia",
  description:
    "Contact Rent&Roll about Valencia equipment rentals, existing bookings, custom requests or local partnerships by WhatsApp, email or form.",
  alternates: {
    canonical: "https://rentandroll.com/contact",
    languages: {
      en: "https://rentandroll.com/contact",
      es: "https://rentandroll.com/es/contact",
      "x-default": "https://rentandroll.com/contact",
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": "https://rentandroll.com/contact#page",
  url: "https://rentandroll.com/contact",
  name: "Contact Rent&Roll",
  inLanguage: "en",
  about: { "@id": "https://rentandroll.com/#organization" },
};

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Contact Rent&Roll</h1>
            <p className="text-lg text-neutral-600">
              Ask about an item, an existing booking, a custom rental or a local partnership in Valencia.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <a
              href="https://wa.me/34684708013?text=Hi!%20I%20have%20a%20question%20about%20renting%20in%20Valencia"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-8 text-center hover:border-[#25D366]/30 group"
              id="contact-whatsapp"
            >
              <span className="text-4xl block mb-4">💬</span>
              <h2 className="font-bold text-lg mb-2 group-hover:text-[#25D366] transition-colors">WhatsApp</h2>
              <p className="text-sm text-neutral-500 mb-3">Direct help with dates, products and active bookings</p>
              <span className="text-sm font-semibold text-[#25D366]">Open WhatsApp →</span>
            </a>

            <a href="mailto:hello@rentandroll.com" className="card p-8 text-center hover:border-brand/30 group" id="contact-email">
              <span className="text-4xl block mb-4">📧</span>
              <h2 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">Email</h2>
              <p className="text-sm text-neutral-500 mb-3">Useful for detailed requests and partnerships</p>
              <span className="text-sm font-semibold text-brand">hello@rentandroll.com</span>
            </a>

            <div className="card p-8 text-center" id="contact-location">
              <span className="text-4xl block mb-4">📍</span>
              <h2 className="font-bold text-lg mb-2">Valencia, Spain</h2>
              <p className="text-sm text-neutral-500 mb-3">Escalera Labs S.L.</p>
              <span className="text-sm text-neutral-400">Available pickup options appear during booking</span>
            </div>
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
