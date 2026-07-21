import "server-only";

import { revalidatePath, revalidateTag } from "next/cache";

export const PUBLIC_PRODUCT_CACHE_TAG = "public-products";

export function invalidatePublicProductCache(productSlugs: string[] = []) {
  revalidateTag(PUBLIC_PRODUCT_CACHE_TAG, { expire: 0 });
  revalidatePath("/");
  revalidatePath("/es");
  revalidatePath("/valencia");
  revalidatePath("/es/valencia");
  revalidatePath("/sitemap.xml");

  for (const slug of new Set(productSlugs.filter(Boolean))) {
    revalidatePath(`/product/${slug}`);
    revalidatePath(`/es/product/${slug}`);
  }
}
