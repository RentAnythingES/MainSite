import Image from "next/image";
import Link from "next/link";
import type { RentalBundle } from "@/data/bundles";

interface BundleCardProps {
  bundle: RentalBundle;
  id?: string;
  compact?: boolean;
}

const accentClasses = {
  teal: "bg-brand/10 text-brand border-brand/20",
  amber: "bg-amber-100 text-amber-700 border-amber-200",
  blue: "bg-sky-100 text-sky-700 border-sky-200",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function BundleCard({ bundle, id, compact = false }: BundleCardProps) {
  const previewItems = bundle.includedItems.slice(0, compact ? 3 : 4);

  return (
    <Link href={`/valencia/kits/${bundle.slug}`} className="card group bg-white overflow-hidden" id={id}>
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-100">
        <Image
          src={bundle.image}
          alt={bundle.shortName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${accentClasses[bundle.accent]}`}>
            {bundle.eyebrow}
          </span>
          <h3 className="mt-2 text-xl font-bold text-white" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.45)" }}>
            {bundle.shortName}
          </h3>
        </div>
      </div>
      <div className="p-5">
        <p className="font-semibold text-neutral-800 mb-2">{bundle.tagline}</p>
        {!compact && <p className="text-sm text-neutral-500 leading-relaxed mb-4">{bundle.description}</p>}
        <ul className="space-y-1.5 mb-4">
          {previewItems.map((item) => (
            <li key={item.name} className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="h-1.5 w-1.5 rounded-full bg-brand flex-shrink-0" />
              {item.name}
            </li>
          ))}
        </ul>
        <span className="text-sm font-bold text-brand group-hover:text-brand-dark transition-colors">
          View kit →
        </span>
      </div>
    </Link>
  );
}
