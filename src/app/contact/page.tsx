import Link from "next/link";
import type { Metadata } from "next";

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
              href="https://wa.me/34600000000?text=Hi!%20I%20have%20a%20question%20about%20renting%20in%20Valencia"
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
            <form className="space-y-5" id="contact-form">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1.5">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                >
                  <option value="">Select a topic...</option>
                  <option value="booking">Booking enquiry</option>
                  <option value="product">Product question</option>
                  <option value="b2b">B2B / Partnership</option>
                  <option value="support">Support / Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-neutral-50 text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              <button type="submit" className="btn btn-primary btn-lg w-full" id="contact-submit">
                Send Message
              </button>
              <p className="text-xs text-neutral-400 text-center">
                By submitting, you agree to our <Link href="/privacy" className="underline hover:text-brand">Privacy Policy</Link>.
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
