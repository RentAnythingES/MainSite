import Image from "next/image";
import type { Product } from "@/data/products";
import type { Locale } from "@/i18n/config";
import { localeRegistry } from "@/i18n/config";
import { getDictionary } from "@/i18n/getDictionary";
import BookingWidget from "@/components/BookingWidget";
import ProductEditorialNotes from "@/components/ProductEditorialNotes";

const copy: Record<Locale, { oneDay: string; details: string; pricingNote: string }> = {
  en: { oneDay: "1 day", details: "Rental details", pricingNote: "Daily rates depend on the rental period shown." },
  es: { oneDay: "1 día", details: "Detalles del alquiler", pricingNote: "La tarifa diaria depende del periodo de alquiler indicado." },
  de: { oneDay: "1 Tag", details: "Details zur Miete", pricingNote: "Der Tagespreis richtet sich nach dem angezeigten Mietzeitraum." },
};

/** Shared commercial detail layout; callers supply copy in the requested language. */
export default function ProductDetail({
  product, locale, heading,
}: { product: Product; locale: Locale; heading?: string }) {
  const t = getDictionary(locale);
  const labels = copy[locale];
  const currency = new Intl.NumberFormat(localeRegistry[locale].format, {
    style: "currency", currency: "EUR",
  });
  return (
      <section className="section bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Left: Product Info (2 cols) */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Image */}
                <div className="bg-gradient-to-br from-neutral-100 to-neutral-50 rounded-2xl flex items-center justify-center aspect-square relative overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.imageAlt || product.name}
                    fill
                    unoptimized={product.image.includes(".supabase.co/storage/")}
                    className="object-contain p-6"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    priority
                  />
                </div>

                {/* Core Info */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge badge-brand">{product.subcategory}</span>
                    {product.brand.trim() && (
                      <span className="text-xs text-neutral-400">{product.brand.trim()}</span>
                    )}
                  </div>

                  <h1 className="text-3xl font-extrabold tracking-tight mb-4">
                    {heading ?? product.name}
                  </h1>

                  <p className="text-neutral-600 leading-relaxed mb-6">
                    {product.description}
                  </p>

                  {/* Pricing Table */}
                  <div className="bg-neutral-50 rounded-xl p-5">
                    <h3 className="font-bold text-sm text-neutral-800 mb-3">{t.product.pricing}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.pricing.map((tier) => (
                        <div
                          key={tier.days}
                          className="bg-white rounded-lg border border-border p-2.5 text-center hover:border-brand/30 transition-colors"
                        >
                          <p className="text-xs text-neutral-500 mb-0.5">
                            {tier.days === 1 ? labels.oneDay : `${tier.days}+ ${t.product.days}`}
                          </p>
                          <p className="text-lg font-bold text-brand">{currency.format(tier.perDay)}</p>
                          <p className="text-xs text-neutral-400">{t.product.perDay}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-neutral-400 mt-2">
                      {labels.pricingNote}
                    </p>
                  </div>
                </div>
              </div>

              {product.detailDescription && (
                <div className="mb-8">
                  <h2 className="font-bold text-neutral-800 mb-3">{labels.details}</h2>
                  <p className="text-neutral-600 leading-relaxed whitespace-pre-line">
                    {product.detailDescription}
                  </p>
                </div>
              )}

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-bold text-neutral-800 mb-3">{t.product.features}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                      <span className="w-5 h-5 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 text-xs">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <ProductEditorialNotes product={product} locale={locale} />

              {/* Specs */}
              <div>
                <h3 className="font-bold text-neutral-800 mb-3">{t.product.specs}</h3>
                <dl className="divide-y divide-border">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="flex justify-between py-2.5 text-sm">
                      <dt className="text-neutral-500">{key}</dt>
                      <dd className="font-medium text-neutral-800">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>

            {/* Right: Booking Widget (sticky) */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <BookingWidget product={product} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>
  );
}
