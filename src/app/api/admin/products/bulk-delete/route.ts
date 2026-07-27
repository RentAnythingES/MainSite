import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { invalidatePublicProductCache } from "@/lib/product-cache";
import { deleteProductAndRelations } from "@/lib/admin-product-delete";

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json().catch(() => null) as { ids?: unknown } | null;
    const ids = Array.isArray(body?.ids)
      ? body.ids.filter((id): id is string => typeof id === "string" && id.trim().length > 0)
      : [];

    if (!ids.length) {
      return NextResponse.json({ error: "No products selected" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const slugs: string[] = [];

    for (const id of ids) {
      const slug = await deleteProductAndRelations(supabase, id);
      if (slug) slugs.push(slug);
    }

    if (slugs.length) {
      invalidatePublicProductCache(Array.from(new Set(slugs)));
    }

    return NextResponse.json({ success: true, deletedCount: ids.length });
  } catch (err) {
    console.error("[admin/products] bulk delete error:", err);
    return NextResponse.json({ error: "Failed to delete selected products" }, { status: 500 });
  }
}
