import { blogCategoryLabel } from "@/i18n/blog-category";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import BundleCard from "@/components/BundleCard";
import ProductCard from "@/components/ProductCard";
import type { RentalBundle } from "@/data/bundles";
import type { Product } from "@/data/products";
import { localeRegistry, type Locale } from "@/i18n/config";

const copy = {
  en: { home: "Home", kits: "Kits", request: "Request this package", configure: "Configure this kit", compare: "Compare kits", illustration: "Illustrated day out · equipment appearance may vary", tailored: "A starting point we can tailor around your stay.", explorerItems: "Your Explorer equipment", includes: "What this kit can include", bestFor: "Best for", products: "Related individual items", guides: "Related Valencia guides", read: "Read guide →", questions: "Questions about this kit", more: "More kits", other: "Other ways to start", all: "View all kits →", view: "View kit →" },
  es: { home: "Inicio", kits: "Kits", request: "Solicitar este paquete", configure: "Configurar este kit", compare: "Comparar kits", illustration: "Día ilustrado · el aspecto del equipo puede variar", tailored: "Un punto de partida que adaptamos a tu estancia.", explorerItems: "El equipo del Explorador", includes: "Qué puede incluir este kit", bestFor: "Recomendado para", products: "Artículos relacionados", guides: "Guías relacionadas de Valencia", read: "Leer guía →", questions: "Preguntas sobre este kit", more: "Más kits", other: "Otras formas de empezar", all: "Ver todos los kits →", view: "Ver kit →" },
  de: { home: "Startseite", kits: "Mietpakete", request: "Dieses Paket anfragen", configure: "Paket zusammenstellen", compare: "Pakete vergleichen", illustration: "Beispielhafter Ausflug · das Aussehen der Mietartikel kann abweichen", tailored: "Ein Ausgangspunkt, den wir an deinen Aufenthalt anpassen können.", explorerItems: "Deine Artikel für den Ausflug", includes: "Was dieses Paket enthalten kann", bestFor: "Passend für", products: "Passende einzelne Mietartikel", guides: "Passende Valencia-Ratgeber", read: "Ratgeber lesen →", questions: "Fragen zu diesem Paket", more: "Weitere Pakete", other: "Weitere Möglichkeiten für deinen Aufenthalt", all: "Alle Pakete ansehen →", view: "Paket ansehen →" },
} satisfies Record<Locale, Record<string, string>>;

const accentClasses = {
  teal: "bg-brand/10 text-brand border-brand/20",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  blue: "bg-sky-100 text-sky-700 border-sky-200",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
};


export default function BundleLandingPage({ bundle, locale, prefix = localeRegistry[locale].prefix, relatedProducts, relatedGuides, otherBundles, explorerDetails, configurator, familyLinks }: {
  bundle: RentalBundle; locale: Locale; prefix?: string; relatedProducts: Product[];
  relatedGuides: Array<{ slug: string; category: string; title: string; excerpt: string }>;
  otherBundles: RentalBundle[]; explorerDetails?: ReactNode; configurator: ReactNode; familyLinks?: ReactNode;
}) {
  const text = copy[locale];
  const isExplorer = bundle.slug === "turia-beach-explorer";
  return <>
      <nav className="bg-neutral-50 border-b border-border py-3">
        <div className="container-site">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <li><Link href={prefix || "/"} className="hover:text-brand transition-colors">{text.home}</Link></li>
            <li>/</li>
            <li><Link href={`${prefix}/valencia`} className="hover:text-brand transition-colors">Valencia</Link></li>
            <li>/</li>
            <li><Link href={`${prefix}/valencia/kits`} className="hover:text-brand transition-colors">{text.kits}</Link></li>
            <li>/</li>
            <li className="text-neutral-800 font-medium">{bundle.shortName}</li>
          </ol>
        </div>
      </nav>

      <section className="section bg-white">
        <div className="container-site">
          <div className="grid lg:grid-cols-2 gap-10 items-center [&>div]:min-w-0">
            <div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${accentClasses[bundle.accent]}`}>
                {bundle.eyebrow}
              </span>
              <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight break-words">
                {bundle.name}
              </h1>
              <p className="mt-4 text-xl text-neutral-700 font-semibold">
                {bundle.tagline}
              </p>
              <p className="mt-4 text-neutral-600 leading-relaxed max-w-xl">
                {bundle.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#configure-kit" className="btn btn-primary btn-lg">
                  {isExplorer ? text.request : text.configure}
                </a>
                <Link href={`${prefix}/valencia/kits`} className="btn btn-outline btn-lg">
                  {text.compare}
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-neutral-100 shadow-lg">
              <Image
                src={bundle.image}
                alt={bundle.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-white text-lg font-bold" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                  {isExplorer ? text.illustration : text.tailored}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50">
        <div className="container-site">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-6 md:p-8 bg-white">
              <h2 className="text-2xl font-bold mb-6">{isExplorer ? text.explorerItems : text.includes}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {bundle.includedItems.map((item) => (
                  <div key={item.name} className="rounded-2xl border border-border bg-neutral-50 p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-1 h-5 w-5 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold">✓</span>
                      <div>
                        <p className="font-semibold text-neutral-800">
                          {item.quantity ? `${item.quantity} ${item.name}` : item.name}
                        </p>
                        {item.note && <p className="mt-1 text-sm text-neutral-500">{item.note}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <aside className="card p-6 bg-white">
              <h2 className="text-xl font-bold mb-4">{text.bestFor}</h2>
              <ul className="space-y-3">
                {bundle.bestFor.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-neutral-600">
                    <span className="text-brand">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {explorerDetails}
      {configurator}

      {familyLinks}

      {relatedProducts.length > 0 && (
        <section className="section bg-neutral-50">
          <div className="container-site">
            <h2 className="text-3xl font-bold mb-6">{text.products}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.slug} product={product} locale={locale} basePath={`${prefix}/product`} id={`bundle-product-${product.slug}`} unoptimized />
              ))}
            </div>
          </div>
        </section>
      )}

      {relatedGuides.length > 0 && (
        <section className="section bg-white">
          <div className="container-site">
            <h2 className="text-3xl font-bold mb-6">{text.guides}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedGuides.map((guide) => (
                <Link key={guide.slug} href={`${prefix}/blog/${guide.slug}`} className="card p-6 bg-white hover:shadow-md transition-shadow group">
                  <span className="badge badge-brand capitalize mb-3">{blogCategoryLabel(locale, guide.category)}</span>
                  <h3 className="font-bold text-lg group-hover:text-brand transition-colors">{guide.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500 leading-relaxed">{guide.excerpt}</p>
                  <span className="mt-4 inline-block text-sm font-bold text-brand">{text.read}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section bg-neutral-50">
        <div className="container-site">
          <h2 className="text-3xl font-bold mb-6">{text.questions}</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {bundle.faqs.map((faq) => (
              <div key={faq.question} className="card p-6 bg-white">
                <h3 className="font-bold text-neutral-800">{faq.question}</h3>
                <p className="mt-2 text-sm text-neutral-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-site">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <span className="badge badge-brand mb-3">{text.more}</span>
              <h2 className="text-3xl font-bold">{text.other}</h2>
            </div>
            <Link href={`${prefix}/valencia/kits`} className="hidden sm:inline-block text-sm font-bold text-brand">
              {text.all}
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {otherBundles.map((item) => (
              <BundleCard key={item.slug} bundle={item} compact basePath={`${prefix}/valencia/kits`} ctaLabel={text.view} />
            ))}
          </div>
        </div>
      </section>
  </>;
}
