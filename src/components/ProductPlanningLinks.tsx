import Link from "next/link";
import { getProductSeoPathways } from "@/data/product-seo-pathways";
import { getProductFamilyForProduct } from "@/data/product-families";

interface ProductPlanningLinksProps {
  categoryName: string;
  categorySlug: string;
  productSlug?: string;
  locale?: "en" | "es";
}

export default function ProductPlanningLinks({
  categoryName,
  categorySlug,
  productSlug,
  locale = "en",
}: ProductPlanningLinksProps) {
  const pathways = getProductSeoPathways(categorySlug, locale);
  const family = productSlug ? getProductFamilyForProduct(productSlug) : undefined;
  const familyContent = family?.content[locale];
  const categoryHref = `${locale === "es" ? "/es" : ""}/rental/${categorySlug}`;
  const copy = locale === "es"
    ? {
        heading: "Planifica tu alquiler en Valencia",
        description: "Compara más productos de esta categoría o completa tu estancia con un kit y una guía local.",
        categoryEyebrow: "Ver toda la categoría",
        categoryTitle: `Alquiler de ${categoryName} en Valencia`,
        categoryDescription: "Compara el equipamiento disponible y elige lo que mejor se adapta a tus fechas.",
        action: "Ver opciones",
      }
    : {
        heading: "Plan your Valencia rental",
        description: "Compare more equipment in this category or complete your stay with a practical kit and local guide.",
        categoryEyebrow: "Browse the category",
        categoryTitle: `${categoryName} rental in Valencia`,
        categoryDescription: "Compare available equipment and choose what best fits your dates and stay.",
        action: "Explore options",
      };

  const links = [
    {
      eyebrow: copy.categoryEyebrow,
      title: copy.categoryTitle,
      description: copy.categoryDescription,
      href: categoryHref,
    },
    ...(family && familyContent ? [{
      eyebrow: locale === "es" ? "Comparar opciones" : "Compare options",
      title: familyContent.productHeading,
      description: familyContent.productDescription,
      href: `${locale === "es" ? "/es" : ""}/rental/${family.categorySlug}/${family.slug}`,
    }] : []),
    ...pathways,
  ];

  const gridClassName = links.length > 3
    ? "grid gap-5 md:grid-cols-2 xl:grid-cols-4"
    : "grid gap-5 md:grid-cols-3";

  return (
    <section className="section bg-neutral-50">
      <div className="container-site">
        <div className="max-w-2xl mb-7">
          <h2 className="text-2xl font-bold mb-2">{copy.heading}</h2>
          <p className="text-neutral-600">{copy.description}</p>
        </div>
        <div className={gridClassName}>
          {links.map((pathway) => (
            <Link
              key={pathway.href}
              href={pathway.href}
              className="card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-brand">
                {pathway.eyebrow}
              </span>
              <h3 className="font-bold text-lg mt-2 mb-2 group-hover:text-brand transition-colors">
                {pathway.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{pathway.description}</p>
              <span className="text-sm font-semibold text-brand mt-4 inline-block">
                {copy.action} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
