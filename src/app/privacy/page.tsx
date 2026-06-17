import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How RentAnything.es collects, uses, and protects your personal data. GDPR compliant.",
};

export default function PrivacyPage() {
  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: June 2026</p>

        <div className="prose prose-neutral max-w-none space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3">1. Who We Are</h2>
            <p className="text-neutral-600">
              RentAnything.es is operated by <strong>Escalera Labs S.L.</strong>, a company registered in Spain.
              We are the data controller for your personal information collected through this website.
            </p>
            <p className="text-neutral-600 mt-2">
              Contact: <a href="mailto:hello@rentanything.es" className="text-brand hover:underline">hello@rentanything.es</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">2. What Data We Collect</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>Name and email address (when you contact us or make a booking)</li>
              <li>Phone number (for delivery coordination)</li>
              <li>Delivery address (for order fulfillment)</li>
              <li>Payment information (processed securely by Stripe — we do not store card details)</li>
              <li>Usage data (pages visited, device type, via anonymous analytics)</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>To process and deliver your rental bookings</li>
              <li>To communicate about your order (confirmations, delivery updates)</li>
              <li>To respond to your enquiries via email or WhatsApp</li>
              <li>To improve our website and services</li>
              <li>To comply with legal obligations under Spanish and EU law</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. Legal Basis (GDPR)</h2>
            <p className="text-neutral-600">
              We process your data based on: (a) contractual necessity (to fulfill your rental booking),
              (b) legitimate interest (to improve our services), and (c) your consent (for marketing communications).
              You can withdraw consent at any time.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Data Sharing</h2>
            <p className="text-neutral-600">
              We do not sell your personal data. We share data only with: Stripe (payment processing),
              Vercel (website hosting), and delivery partners (for order fulfillment).
              All partners are GDPR compliant.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">6. Data Retention</h2>
            <p className="text-neutral-600">
              We retain your personal data for the duration of your relationship with us, plus any period
              required by Spanish tax and commercial law (typically 5 years for invoicing records).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">7. Your Rights</h2>
            <p className="text-neutral-600">Under GDPR, you have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600 mt-2">
              <li>Access your personal data</li>
              <li>Rectify inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Restrict or object to processing</li>
              <li>Data portability</li>
              <li>Lodge a complaint with the AEPD (Spanish Data Protection Agency)</li>
            </ul>
            <p className="text-neutral-600 mt-2">
              To exercise any right, email <a href="mailto:hello@rentanything.es" className="text-brand hover:underline">hello@rentanything.es</a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">8. Cookies</h2>
            <p className="text-neutral-600">
              We use essential cookies for site functionality and anonymous analytics cookies to understand
              how visitors use our site. See our <a href="/cookies" className="text-brand hover:underline">Cookie Policy</a> for details.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
