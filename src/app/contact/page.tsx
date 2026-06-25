import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with RentAnything.es. WhatsApp, email, or use our contact form. We respond within minutes.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-neutral-50 to-teal-50/20 py-16 md:py-24">
        <div className="container-site">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-neutral-600">
              Have a question, need a custom rental, or want to partner with us?
              We&apos;d love to hear from you.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* WhatsApp */}
            <a
              href="https://wa.me/34684708013?text=Hi!%20I%20have%20a%20question%20about%20renting%20in%20Valencia"
              target="_blank"
              rel="noopener noreferrer"
              className="card p-8 text-center hover:border-[#25D366]/30 group"
              id="contact-whatsapp"
            >
              <span className="text-4xl block mb-4">💬</span>
              <h3 className="font-bold text-lg mb-2 group-hover:text-[#25D366] transition-colors">WhatsApp</h3>
              <p className="text-sm text-neutral-500 mb-3">Fastest response — usually within minutes</p>
              <span className="text-sm font-semibold text-[#25D366]">Chat Now →</span>
            </a>

            {/* Email */}
            <a
              href="mailto:hello@rentanything.es"
              className="card p-8 text-center hover:border-brand/30 group"
              id="contact-email"
            >
              <span className="text-4xl block mb-4">📧</span>
              <h3 className="font-bold text-lg mb-2 group-hover:text-brand transition-colors">Email</h3>
              <p className="text-sm text-neutral-500 mb-3">We reply within 24 hours</p>
              <span className="text-sm font-semibold text-brand">hello@rentanything.es</span>
            </a>

            {/* Location */}
            <div className="card p-8 text-center" id="contact-location">
              <span className="text-4xl block mb-4">📍</span>
              <h3 className="font-bold text-lg mb-2">Valencia, Spain</h3>
              <p className="text-sm text-neutral-500 mb-3">Escalera Labs S.L.</p>
              <span className="text-sm text-neutral-400">Self-pickup available by appointment</span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Send Us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}

