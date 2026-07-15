import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for renting equipment from RentAnything.es. Booking, cancellation, damage, and liability policies.",
  alternates: { canonical: "https://rentanything.es/terms" },
};

export default function TermsPage() {
  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Terms & Conditions</h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div>
            <h2 className="text-xl font-bold mb-3">1. General</h2>
            <p className="text-neutral-600">
              These terms govern your use of RentAnything.es and any rental bookings made through the platform.
              By making a booking, you agree to these terms. The service is operated by Escalera Labs S.L.,
              registered in Spain.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">2. Bookings</h2>
            <p className="text-neutral-600">
              All bookings are subject to availability. A booking is confirmed once payment is processed
              and you receive a confirmation email. We reserve the right to cancel bookings if equipment
              becomes unavailable due to unforeseen circumstances, in which case a full refund will be issued.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">3. Pricing & Payment</h2>
            <p className="text-neutral-600">
              All prices are displayed in Euros (€) and include IVA (VAT) at the applicable Spanish rate.
              Payment is processed securely via Stripe. A refundable security deposit may be held on your
              card for certain items. The deposit amount is shown before checkout.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">4. Cancellation & Refunds</h2>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li><strong>48+ hours before delivery:</strong> Full refund</li>
              <li><strong>24–48 hours before delivery:</strong> 50% refund</li>
              <li><strong>Less than 24 hours:</strong> No refund</li>
              <li>Extensions can be arranged via WhatsApp at the applicable daily rate</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">5. Delivery & Returns</h2>
            <p className="text-neutral-600">
              We deliver to addresses within our Valencia service area. Delivery times are agreed during
              booking. Items must be available for collection at the agreed time on the final day of your
              rental. Late returns may incur additional charges at the standard daily rate.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">6. Care of Equipment</h2>
            <p className="text-neutral-600">
              You are responsible for the equipment during the rental period. Normal wear and tear is
              expected and covered. Significant damage, loss, or theft may result in charges deducted
              from your security deposit. We will always contact you with photographic evidence before
              making any deductions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">7. Liability</h2>
            <p className="text-neutral-600">
              All equipment is professionally maintained and safety-checked. However, RentAnything.es
              is not liable for injury or damage arising from misuse of equipment. Users are responsible
              for using equipment in accordance with manufacturer instructions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">8. Consumer Rights</h2>
            <p className="text-neutral-600">
              As a consumer in Spain, you have rights under the Ley General para la Defensa de los
              Consumidores y Usuarios. You may file complaints via the official{" "}
              <a href="https://www.hojasderereclamaciones.com/" target="_blank" rel="noopener noreferrer" className="text-brand hover:underline">
                Hojas de Reclamaciones
              </a>{" "}
              system. Nothing in these terms affects your statutory rights.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">9. Governing Law</h2>
            <p className="text-neutral-600">
              These terms are governed by the laws of Spain. Any disputes shall be subject to the
              jurisdiction of the courts of Valencia, without prejudice to your right to bring claims
              in your country of residence under EU consumer law.
            </p>
          </div>

          <div className="bg-neutral-50 rounded-xl p-6 border border-border">
            <p className="text-sm text-neutral-500">
              Questions about these terms? Contact us at{" "}
              <a href="mailto:hello@rentanything.es" className="text-brand hover:underline">hello@rentanything.es</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
