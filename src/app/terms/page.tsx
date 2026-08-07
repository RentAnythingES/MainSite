import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rental Terms and Conditions | Rent&Roll",
  description: "Terms for Rent&Roll equipment bookings in Valencia, including payment, fulfilment, cancellation, extensions, care and customer responsibilities.",
  alternates: {
    canonical: "https://rentandroll.com/terms",
    languages: {
      en: "https://rentandroll.com/terms",
      es: "https://rentandroll.com/es/terms",
      "x-default": "https://rentandroll.com/terms",
    },
  },
};

export default function TermsPage() {
  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Rental Terms and Conditions</h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: 20 July 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3">1. Operator and scope</h2>
            <p className="text-neutral-600">
              Rent&Roll is operated by <strong>Escalera Labs S.L.</strong> (CIF ESB22961221), Calle Obispo Muñoz 73, 46100 Burjassot, Valencia, Spain. These terms apply to equipment rentals and related fulfilment services booked through Rent&Roll.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">2. Availability and booking confirmation</h2>
            <p className="text-neutral-600">
              Availability is checked for the selected product and rental window before payment. A booking is confirmed when payment succeeds and we issue a booking confirmation. If an operational problem makes fulfilment impossible, we will contact you and offer an appropriate alternative or refund the affected amount.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. Prices, IVA and payment</h2>
            <p className="text-neutral-600">
              Prices shown to consumers include applicable IVA unless expressly stated otherwise. Checkout displays the rental price, selected fulfilment fees and total before payment. Payment is processed securely by Stripe. Our current online checkout does not automatically add a security deposit. If a future booking requires one, its amount and conditions must be shown before payment.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. Cancellation and refunds</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li><strong>48 hours or more before fulfilment:</strong> full refund.</li>
              <li><strong>Between 24 and 48 hours:</strong> 50% refund.</li>
              <li><strong>Less than 24 hours:</strong> no refund, except where mandatory law requires otherwise.</li>
            </ul>
            <p className="text-neutral-600 mt-2">The complete operational policy, including early returns and our cancellation procedure, appears in our <Link href="/refunds" className="text-brand hover:underline">Refunds and Cancellations Policy</Link>.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Pickup, delivery and collection</h2>
            <p className="text-neutral-600">
              The booking form shows the pickup locations, service zones, time choices and fees currently available. You are responsible for providing accurate contact and address details and for being available at the agreed handover times. A custom delivery request is not confirmed until we approve it and any additional charge is paid.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">6. Rental period, changes and late return</h2>
            <p className="text-neutral-600">
              Keep the equipment only for the confirmed rental window. Extensions and fulfilment changes depend on inventory and operational availability and may require additional payment. Contact us before the agreed return time. Unapproved late returns may be charged for the additional period and any documented loss caused to a subsequent booking.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">7. Care, loss and damage</h2>
            <p className="text-neutral-600">
              Use the equipment for its intended purpose, follow the manufacturer instructions supplied or linked with the item, and keep it reasonably secure. Normal wear is expected. You may be responsible for documented repair or replacement costs caused by loss, theft, misuse or damage beyond normal wear. We will explain the evidence and amount before seeking payment.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">8. Safety and liability</h2>
            <p className="text-neutral-600">
              Check that the selected product is suitable for the intended user and purpose, including any size, weight, age or installation limits. Stop using an item and contact us if you identify damage or a safety concern. Nothing in these terms excludes or limits liability where doing so would be prohibited by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">9. Consumer rights and complaints</h2>
            <p className="text-neutral-600">
              Nothing in these terms affects mandatory consumer rights under Spanish or EU law. To raise a complaint, contact <a href="mailto:hello@rentandroll.com" className="text-brand hover:underline">hello@rentandroll.com</a>. Official consumer complaint forms are available through the applicable Spanish consumer authorities.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">10. Governing law</h2>
            <p className="text-neutral-600">
              These terms are governed by Spanish law. Any mandatory rules on consumer jurisdiction remain unaffected.
            </p>
          </div>

          <div className="bg-neutral-50 rounded-xl p-6 border border-border">
            <p className="text-sm text-neutral-500">
              Questions about these terms? <Link href="/contact" className="text-brand hover:underline">Contact us</Link> or email <a href="mailto:hello@rentandroll.com" className="text-brand hover:underline">hello@rentandroll.com</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
