import Link from "next/link";
import { getProductSeoPathways } from "@/data/product-seo-pathways";

interface ProductPlanningLinksProps {
  categoryName: string;
  categorySlug: string;
  locale?: "en" | "es";
}

export default function ProductPlanningLinks({
  categoryName,
  categorySlug,
  locale = "en",
}: ProductPlanningLinksProps) {
  const pathways = getProductSeoPathways(categorySlug, locale);
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
    ...pathways,
  ];

  return (
    <section className="section bg-neutral-50">
      <div className="container-site">
        <div className="max-w-2xl mb-7">
          <h2 className="text-2xl font-bold mb-2">{copy.heading}</h2>
          <p className="text-neutral-600">{copy.description}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
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
