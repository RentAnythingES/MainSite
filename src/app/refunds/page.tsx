import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refunds & Cancellations",
  description: "Our refund and cancellation policy for rental bookings in Valencia. Free cancellation up to 48 hours before delivery.",
  alternates: { canonical: "https://rentanything.es/refunds" },
};

export default function RefundsPage() {
  return (
    <section className="section bg-white">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Refunds & Cancellations</h1>
        <p className="text-sm text-neutral-400 mb-10">Last updated: June 2026</p>

        <div className="space-y-8 text-[15px] leading-relaxed">
          <div className="bg-brand/5 rounded-xl p-6 border border-brand/10">
            <h2 className="text-lg font-bold text-brand mb-2">Our Promise</h2>
            <p className="text-neutral-600">
              We want you to book with confidence. That&apos;s why we offer free cancellation up to 48 hours
              before your scheduled delivery.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4">Cancellation Policy</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-xl p-5 border border-green-100 text-center">
                <p className="text-2xl font-bold text-green-600 mb-1">100%</p>
                <p className="text-sm font-semibold text-green-700">Full Refund</p>
                <p className="text-xs text-green-600 mt-1">48+ hours before delivery</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 text-center">
                <p className="text-2xl font-bold text-amber-600 mb-1">50%</p>
                <p className="text-sm font-semibold text-amber-700">Partial Refund</p>
                <p className="text-xs text-amber-600 mt-1">24–48 hours before</p>
              </div>
              <div className="bg-red-50 rounded-xl p-5 border border-red-100 text-center">
                <p className="text-2xl font-bold text-red-600 mb-1">0%</p>
                <p className="text-sm font-semibold text-red-700">No Refund</p>
                <p className="text-xs text-red-600 mt-1">Less than 24 hours</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Deposits and damage</h2>
            <p className="text-neutral-600">
              Our current online checkout does not automatically add a security deposit. If a future rental
              requires one, the amount, authorization method, return conditions, and any proposed deduction
              will be disclosed clearly before payment and documented with you.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">How to Cancel</h2>
            <p className="text-neutral-600 mb-3">You can cancel your booking via:</p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>WhatsApp — fastest response</li>
              <li>Email to <a href="mailto:hello@rentanything.es" className="text-brand hover:underline">hello@rentanything.es</a></li>
              <li>The contact form on our <Link href="/contact" className="text-brand hover:underline">Contact page</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">Refund Processing</h2>
            <p className="text-neutral-600">
              Refunds are processed to the original payment method. Please allow 5–10 business days for the
              refund to appear on your statement, depending on your bank or card issuer.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
