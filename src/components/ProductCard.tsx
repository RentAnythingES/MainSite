import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";
import { localeRegistry, type Locale } from "@/i18n/config";

interface ProductCardProps {
  product: Product;
  id?: string;
  basePath?: string;
  unoptimized?: boolean;
  locale?: Locale;
}

export default function ProductCard({ product, id, basePath = "/product", unoptimized = false, locale = basePath.startsWith("/es/") ? "es" : "en" }: ProductCardProps) {
  const shouldBypassOptimization = unoptimized || product.image.includes(".supabase.co/storage/");
  const tier = product.pricing.at(-1);
  const text = {
    en: { perDay: "/ day", fromDays: (days: number) => `(from ${days}+ days)`, onRequest: "Price on request" },
    es: { perDay: "/ día", fromDays: (days: number) => `(a partir de ${days}+ días)`, onRequest: "Precio a consultar" },
    de: { perDay: "/ Tag", fromDays: (days: number) => days === 1 ? "(ab 1 Tag)" : `(ab ${days} Tagen)`, onRequest: "Preis auf Anfrage" },
  }[locale];

  return (
    <Link
      href={`${basePath}/${product.slug}`}
      className="card group bg-white"
      id={id}
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.imageAlt || product.name}
          fill
          unoptimized={shouldBypassOptimization}
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="badge badge-brand">{product.subcategory}</span>
        </div>
        <h3 className="font-bold text-neutral-800 mb-0.5 group-hover:text-brand transition-colors">
          {product.name}
        </h3>
        {product.brand.trim() && (
          <p className="text-xs text-neutral-400 mb-2">{product.brand.trim()}</p>
        )}
        {tier ? <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-brand">
            {new Intl.NumberFormat(localeRegistry[locale].format, { style: "currency", currency: "EUR" }).format(tier.perDay)}
          </span>
          <span className="text-sm text-neutral-400">{text.perDay}</span>
          <span className="text-xs text-neutral-300 ml-1">
            {text.fromDays(tier.days)}
          </span>
        </div> : <p className="text-sm text-neutral-500">{text.onRequest}</p>}
      </div>
    </Link>
  );
}
