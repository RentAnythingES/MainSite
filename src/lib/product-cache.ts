import "server-only";

import { revalidateTag } from "next/cache";

export const PUBLIC_PRODUCT_CACHE_TAG = "public-products";

export function invalidatePublicProductCache() {
  revalidateTag(PUBLIC_PRODUCT_CACHE_TAG, { expire: 0 });
}
