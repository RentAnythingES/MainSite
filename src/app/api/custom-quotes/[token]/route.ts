import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  if (!UUID_PATTERN.test(token)) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("booking_custom_quotes")
    .select(`
      public_token, status, quantity, customer_name, customer_email, customer_phone,
      rental_start_at, rental_end_at, timezone, fulfillment_mode, delivery_address,
      collection_address, delivery_notes, collection_notes, currency, line_items,
      total_cents, customer_terms, expires_at,
      product:products(id, name, slug, brand, image_url),
      pickup_location:pickup_locations(id, name, address, customer_instructions, pickup_instructions)
    `)
    .eq("public_token", token)
    .single();

  if (error || !data) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

  const expired = new Date(data.expires_at).getTime() <= Date.now();
  if (expired && data.status !== "paid" && data.status !== "cancelled") {
    await supabase.from("booking_custom_quotes").update({ status: "expired" }).eq("public_token", token);
    data.status = "expired";
  }

  return NextResponse.json({
    quote: {
      ...data,
      customer_email: data.customer_email || "",
      customer_phone: data.customer_phone || "",
    },
  }, { headers: { "Cache-Control": "no-store, private" } });
}
