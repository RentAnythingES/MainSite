import Image from "next/image";
import type { Metadata } from "next";
import BookingWidget from "@/components/BookingWidget";
import type { Product } from "@/data/products";

const testProduct: Product = {
  slug: "stripe-test-rental",
  name: "Stripe Test Rental",
  brand: "RentAnything",
  category: "Internal Testing",
  subcategory: "Payment Flow",
  categorySlug: "internal",
  subcategorySlug: "stripe-test",
  description:
    "Private checkout test item for validating the complete booking, Stripe payment, webhook, email, and admin flow before reopening online payments.",
  features: [
    "Uses the real booking widget",
    "Creates a real booking draft",
    "Redirects through Stripe Checkout",
    "Exercises the live webhook",
  ],
  specs: {
    Visibility: "Private, unlisted, noindex",
    "Required Supabase slug": "stripe-test-rental",
    "Recommended price": "€1.00 to €2.00",
    "Recommended stock": "1 unit",
  },
  pricing: [
    { days: 1, perDay: 1 },
    { days: 3, perDay: 1 },
    { days: 7, perDay: 1 },
    { days: 14, perDay: 1 },
  ],
  emoji: "🧪",
  image: "/products/compact-stroller.png",
  city: "valencia",
};

export const metadata: Metadata = {
  title: "Stripe Test Checkout | RentAnything.es",
  description: "Private noindex checkout test page for RentAnything.es.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function StripeTestPage() {
  return (
    <main className="bg-neutral-50">
      <section className="border-b border-amber-200 bg-amber-50 py-4">
        <div className="container-site">
          <p className="text-sm font-semibold text-amber-900">Private payment test page</p>
          <p className="mt-1 max-w-3xl text-sm text-amber-800">
            This page is not linked from the site or included in the sitemap. Use it only after
            creating an active Supabase product with slug <code>stripe-test-rental</code> and a
            low live price.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-50">
                  <Image
                    src={testProduct.image}
                    alt={testProduct.name}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <span className="badge badge-brand">{testProduct.subcategory}</span>
                    <span className="text-xs text-neutral-400">{testProduct.brand}</span>
                  </div>

                  <h1 className="mb-4 text-3xl font-extrabold tracking-tight">
                    {testProduct.name}
                  </h1>

                  <p className="mb-6 leading-relaxed text-neutral-600">
                    {testProduct.description}
                  </p>

                  <div className="rounded-xl bg-neutral-50 p-5">
                    <h2 className="mb-3 text-sm font-bold text-neutral-800">What this validates</h2>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      {testProduct.features.map((feature) => (
                        <li key={feature} className="flex gap-2">
                          <span className="text-brand">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="mb-3 font-bold text-neutral-800">Test setup requirements</h2>
                <dl className="divide-y divide-border">
                  {Object.entries(testProduct.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between gap-4 py-2.5 text-sm">
                      <dt className="text-neutral-500">{key}</dt>
                      <dd className="text-right font-medium text-neutral-800">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <BookingWidget product={testProduct} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
