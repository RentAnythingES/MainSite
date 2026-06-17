import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  id?: string;
}

export default function ProductCard({ product, id }: ProductCardProps) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="card group bg-white"
      id={id}
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
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
        <p className="text-xs text-neutral-400 mb-2">{product.brand}</p>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-brand">
            €{product.pricing[product.pricing.length - 1].perDay}
          </span>
          <span className="text-sm text-neutral-400">/ day</span>
          <span className="text-xs text-neutral-300 ml-1">
            (from {product.pricing[product.pricing.length - 1].days}+ days)
          </span>
        </div>
      </div>
    </Link>
  );
}
