import Link from "next/link";
import type { Product } from "@/data/products";

interface CompactProductLinkProps {
  product: Product;
  basePath?: string;
  locale?: "en" | "es";
}

export default function CompactProductLink({
  product,
  basePath = "/product",
  locale = "en",
}: CompactProductLinkProps) {
  const lowestDailyRate = product.pricing[product.pricing.length - 1];

  return (
    <Link
      href={`${basePath}/${product.slug}`}
      className="card flex items-center justify-between gap-4 bg-white p-4 hover:shadow-md transition-shadow group"
    >
      <span className="min-w-0">
        <span className="block font-semibold text-neutral-800 group-hover:text-brand transition-colors">
          {product.name}
        </span>
        <span className="block text-xs text-neutral-500 mt-1">{product.subcategory}</span>
      </span>
      <span className="flex-shrink-0 text-right">
        <span className="block font-bold text-brand">€{lowestDailyRate.perDay}</span>
        <span className="block text-xs text-neutral-400">
          {locale === "es" ? `desde ${lowestDailyRate.days} días` : `from ${lowestDailyRate.days} days`}
        </span>
      </span>
    </Link>
  );
}
