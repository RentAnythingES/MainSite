import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function requiredText(value: unknown, label: string, maxLength: number) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required`);
  return value.trim().slice(0, maxLength);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  if (!UUID_PATTERN.test(token)) return NextResponse.json({ error: "Quote not found" }, { status: 404 });

  try {
    const body = await request.json();
    const customerName = requiredText(body.customerName, "Name", 120);
    const customerEmail = requiredText(body.customerEmail, "Email", 254).toLowerCase();
    const customerPhone = typeof body.customerPhone === "string" ? body.customerPhone.trim().slice(0, 40) : null;
    const deliveryAddress = typeof body.deliveryAddress === "string" ? body.deliveryAddress.trim().slice(0, 500) : null;
    const collectionAddress = typeof body.collectionAddress === "string" ? body.collectionAddress.trim().slice(0, 500) : null;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) throw new Error("Enter a valid email address");

    const supabase = createAdminClient();
    const { data, error } = await supabase.rpc("accept_custom_booking_quote", {
      p_public_token: token,
      p_customer_name: customerName,
      p_customer_email: customerEmail,
      p_customer_phone: customerPhone,
      p_delivery_address: deliveryAddress,
      p_collection_address: collectionAddress,
    });

    if (error || !data) {
      const message = error?.message || "Could not accept this quote";
      const status = /not found/i.test(message) ? 404 : /expired|cancelled|paid|available|required/i.test(message) ? 409 : 500;
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json({ draftId: data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not accept this quote" },
      { status: 400 },
    );
  }
}
