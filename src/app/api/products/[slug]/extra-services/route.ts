import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

/**
 * GET /api/products/[slug]/extra-services — Public, enabled-only extra services
 * (assembly & set-up, disassembly) with their current fee, for the product page.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const supabase = createServiceClient();

  const { data: product } = await supabase
    .from("products")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!product) {
    return NextResponse.json({ extraServices: [] });
  }

  const { data, error } = await supabase
    .from("product_extra_services")
    .select("service_type, fee_cents")
    .eq("product_id", product.id)
    .eq("is_enabled", true);

  if (error) {
    return NextResponse.json({ extraServices: [] });
  }

  return NextResponse.json({
    extraServices: (data || []).map((service) => ({
      serviceType: service.service_type,
      feeCents: service.fee_cents,
    })),
  });
}
