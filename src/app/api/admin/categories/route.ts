import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";

/**
 * GET /api/admin/categories — List all categories (for dropdowns)
 */
export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");

    if (error) throw error;
    return NextResponse.json({ categories: data });
  } catch (err) {
    console.error("[admin/categories] GET error:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
