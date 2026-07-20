import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | RentAnything.es",
  description: "How Escalera Labs S.L. collects, uses, stores and protects personal data for RentAnything.es enquiries, bookings and website analytics.",
  alternates: {
    canonical: "https://rentanything.es/privacy",
    languages: {
      en: "https://rentanything.es/privacy",
      es: "https://rentanything.es/es/privacy",
      "x-default": "https://rentanything.es/privacy",
    },
  },
};

export default function PrivacyPage() {
  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: 20 July 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3">1. Data controller</h2>
            <p className="text-neutral-600">
              RentAnything.es is operated by <strong>Escalera Labs S.L.</strong> (CIF ESB22961221), Calle Obispo Muñoz 73, 46100 Burjassot, Valencia, Spain. Escalera Labs S.L. is responsible for personal data collected through this service.
            </p>
            <p className="text-neutral-600 mt-2">
              Privacy enquiries: <a href="mailto:hello@rentanything.es" className="text-brand hover:underline">hello@rentanything.es</a>
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">2. Data we collect</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>Contact details such as your name, email address and phone number.</li>
              <li>Booking details, rental dates, selected products and fulfilment instructions.</li>
              <li>Pickup, delivery and collection addresses when needed for the chosen service.</li>
              <li>Payment references and transaction status from Stripe; we do not store full card details.</li>
              <li>Messages, support requests, newsletter consent and review publication consent.</li>
              <li>Website usage data when you choose to allow Google Analytics.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. Purposes and legal bases</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li><strong>Contract and pre-contract steps:</strong> checking availability, taking payment, fulfilling rentals, handling changes, refunds and customer documents.</li>
              <li><strong>Legal obligations:</strong> accounting, invoicing, tax records and responding to lawful requests.</li>
              <li><strong>Legitimate interests:</strong> preventing misuse, securing the service, resolving incidents and improving operational support.</li>
              <li><strong>Consent:</strong> optional analytics, marketing email and publication of customer feedback. You may withdraw consent at any time.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. Service providers and recipients</h2>
            <p className="text-neutral-600">
              We do not sell personal data. We use service providers only where needed to operate RentAnything.es, including Stripe for payments, Supabase for application data and storage, Vercel for hosting, Resend for transactional email, and Google Analytics only after analytics consent. Fulfilment details may be shared with an authorised delivery provider when required to complete your booking.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Retention</h2>
            <p className="text-neutral-600">
              We keep booking, payment and invoice records for the periods required by applicable tax, accounting and commercial law. Enquiries and operational records are kept only as long as reasonably needed to provide support, establish what occurred, protect legal claims and meet legal obligations. Consent records are retained so we can demonstrate your choice until they are no longer needed.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">6. Your rights</h2>
            <p className="text-neutral-600">Where applicable, you may request access, rectification, deletion, restriction, objection and portability of your personal data, and withdraw consent without affecting earlier lawful processing.</p>
            <p className="text-neutral-600 mt-2">
              Send your request to <a href="mailto:hello@rentanything.es" className="text-brand hover:underline">hello@rentanything.es</a>. You may also lodge a complaint with the <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">Spanish Data Protection Agency (AEPD)</a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">7. Cookies and analytics</h2>
            <p className="text-neutral-600">
              Optional Google Analytics does not load until you allow analytics. Your choice is stored in your browser. See our <Link href="/cookies" className="text-brand hover:underline">Cookie Policy</Link> for the current technologies and controls.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">8. Changes to this policy</h2>
            <p className="text-neutral-600">
              We may update this policy when the service, providers or legal requirements change. The latest version and update date will remain available on this page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
