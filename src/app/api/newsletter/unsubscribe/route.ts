import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    const normalizedToken = String(token || "").trim();
    if (!/^[0-9a-f-]{36}$/i.test(normalizedToken)) return NextResponse.json({ error: "Invalid unsubscribe link" }, { status: 400 });
    const supabase = createAdminClient();
    const { data, error } = await supabase.from("newsletter_subscribers").update({ is_active: false, unsubscribed_at: new Date().toISOString() }).eq("unsubscribe_token", normalizedToken).select("id").maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "This unsubscribe link was not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[newsletter] Unsubscribe error:", error);
    return NextResponse.json({ error: "Could not update subscription" }, { status: 500 });
  }
}
