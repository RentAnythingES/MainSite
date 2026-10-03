import type { RentalBundle } from "@/data/bundles";
import type { Product } from "@/data/products";
// Legacy kit references describe product types; use the current public catalogue for cards.
const replacements:Readonly<Record<string,string>>={"monitor-27":"32-inch-monitor-hdmi-cable","car-seat-infant":"maxi-cosi-pebble-360-pro2-infant-car-seat"};
export function bundleRelatedProducts(bundle:RentalBundle, catalogue:Product[]) {
  const bySlug=new Map(catalogue.map(product=>[product.slug,product]));
  return bundle.relatedProductSlugs.flatMap(slug=>{
    const product=bySlug.get(replacements[slug] || slug); return product?[product]:[];
  });
}
