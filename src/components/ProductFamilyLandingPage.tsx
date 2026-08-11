import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import type { ProductFamilyContent, ProductFamilyDefinition, ProductFamilyLocale } from "@/data/product-families";

type ProductFamilyLandingPageProps = {
  family: ProductFamilyDefinition;
  locale: ProductFamilyLocale;
  products: Product[];
};

function ProductOptionCard({
  product,
  content,
  locale,
}: {
  product: Product;
  content: ProductFamilyContent;
  locale: ProductFamilyLocale;
}) {
  const href = `${locale === "es" ? "/es" : ""}/product/${product.slug}`;
  const lowestTier = product.pricing.at(-1);

  return (
    <article className="card overflow-hidden bg-white">
      <div className="relative aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-50">
        <Image
          src={product.image}
          alt={product.imageAlt || content.productLabels[product.slug] || product.name}
          fill
          unoptimized
          className="object-contain p-5"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-neutral-900">
          {content.productLabels[product.slug] || product.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">{product.description}</p>
        {lowestTier && (
          <p className="mt-4 text-sm text-neutral-500">
            {content.priceFrom}{" "}
            <span className="text-lg font-bold text-brand">€{lowestTier.perDay}</span>{" "}
            {content.priceUnit}
          </p>
        )}
        <Link href={href} className="btn btn-primary mt-5 w-full text-center">
          {content.productAction}
        </Link>
      </div>
    </article>
  );
}

export default function ProductFamilyLandingPage({ family, locale, products }: ProductFamilyLandingPageProps) {
  const content = family.content[locale];
  const homeHref = locale === "es" ? "/es" : "/";
  const valenciaHref = locale === "es" ? "/es/valencia" : "/valencia";
  const categoryHref = `${locale === "es" ? "/es" : ""}/rental/${family.categorySlug}`;
  const categoryLabel = locale === "es" ? "Movilidad y accesibilidad" : "Mobility & Accessibility";

  return (
    <>
      <nav className="border-b border-border bg-neutral-50 py-3" aria-label={locale === "es" ? "Migas de pan" : "Breadcrumb"}>
        <div className="container-site">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <li><Link href={homeHref} className="hover:text-brand">{locale === "es" ? "Inicio" : "Home"}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={valenciaHref} className="hover:text-brand">Valencia</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link href={categoryHref} className="hover:text-brand">{categoryLabel}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="font-medium text-neutral-800">{content.eyebrow}</li>
          </ol>
        </div>
      </nav>

      <header className="bg-gradient-to-br from-neutral-50 to-teal-50/30 py-14 md:py-20">
        <div className="container-site max-w-4xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand">{categoryLabel}</p>
          <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 md:text-5xl">{content.eyebrow}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-neutral-600">{content.intro}</p>
        </div>
      </header>

      <section className="section bg-white" aria-labelledby="family-products-heading">
        <div className="container-site">
          <div className="mb-8 max-w-3xl">
            <h2 id="family-products-heading" className="text-3xl font-bold">{content.productHeading}</h2>
            <p className="mt-3 leading-relaxed text-neutral-600">{content.productDescription}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <ProductOptionCard key={product.slug} product={product} content={content} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50" aria-labelledby="family-choice-heading">
        <div className="container-site">
          <div className="mb-8 max-w-3xl">
            <h2 id="family-choice-heading" className="text-3xl font-bold">{content.choiceHeading}</h2>
            <p className="mt-3 leading-relaxed text-neutral-600">{content.choiceIntro}</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {content.choices.map((choice) => (
              <article key={choice.title} className="card bg-white p-6">
                <h3 className="text-lg font-bold text-neutral-900">{choice.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-neutral-600">{choice.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="family-checklist-heading">
        <div className="container-site grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h2 id="family-checklist-heading" className="text-3xl font-bold">{content.checklistHeading}</h2>
            <p className="mt-3 leading-relaxed text-neutral-600">{content.checklistIntro}</p>
          </div>
          <ul className="space-y-3">
            {content.checklist.map((item) => (
              <li key={item} className="flex gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-neutral-700">
                <span className="mt-0.5 font-bold text-brand" aria-hidden="true">✓</span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section bg-neutral-50" aria-labelledby="family-local-heading">
        <div className="container-site max-w-4xl">
          <h2 id="family-local-heading" className="text-3xl font-bold">{content.localHeading}</h2>
          <div className="mt-5 space-y-4 text-neutral-600">
            {content.localParagraphs.map((paragraph) => (
              <p key={paragraph} className="leading-relaxed">{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white" aria-labelledby="family-links-heading">
        <div className="container-site">
          <div className="mb-8 max-w-3xl">
            <h2 id="family-links-heading" className="text-3xl font-bold">{content.linksHeading}</h2>
            <p className="mt-3 leading-relaxed text-neutral-600">{content.linksIntro}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {content.links.map((link) => (
              <Link key={link.href} href={link.href} className="card group bg-neutral-50 p-6 transition-shadow hover:shadow-md">
                <span className="text-xs font-semibold uppercase tracking-wide text-brand">{link.eyebrow}</span>
                <h3 className="mt-2 text-lg font-bold group-hover:text-brand">{link.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{link.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-neutral-50" aria-labelledby="family-faq-heading">
        <div className="container-site max-w-5xl">
          <h2 id="family-faq-heading" className="text-3xl font-bold">{content.faqHeading}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {content.faqs.map((faq) => (
              <article key={faq.question} className="card bg-white p-6">
                <h3 className="text-lg font-semibold">{faq.question}</h3>
                <p className="mt-3 leading-relaxed text-neutral-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
