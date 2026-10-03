import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

export const PUBLIC_PRODUCT_CACHE_TAG = "public-products";
// Start a fresh namespace for source corrections committed outside the admin UI.
export const PUBLIC_PRODUCT_CACHE_VERSION = "german-parity-20261003";

export function invalidatePublicProductCache(productSlugs: string[] = []) {
  revalidateTag(PUBLIC_PRODUCT_CACHE_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/es");
  revalidatePath("/de");
  revalidatePath("/valencia");
  revalidatePath("/es/valencia");
  revalidatePath("/de/valencia");
  revalidatePath("/sitemap.xml");

  for (const slug of new Set(productSlugs.filter(Boolean))) {
    revalidatePath(`/product/${slug}`);
    revalidatePath(`/es/product/${slug}`);
    revalidatePath(`/de/product/${slug}`);
  }
}
