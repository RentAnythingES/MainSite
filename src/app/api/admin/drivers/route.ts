import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function parseTelegramUserId(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { data, error } = await createAdminClient()
    .from("delivery_drivers")
    .select("*")
    .order("is_active", { ascending: false })
    .order("full_name", { ascending: true });
  if (error) {
    if (["42P01", "PGRST205"].includes(error.code || "")) {
      return NextResponse.json({ error: "Apply the delivery drivers migration first" }, { status: 503 });
    }
    return NextResponse.json({ error: "Could not load drivers" }, { status: 500 });
  }
  return NextResponse.json({ drivers: data || [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const fullName = cleanText(body?.fullName, 120);
  const telegramUserId = parseTelegramUserId(body?.telegramUserId);
  if (fullName.length < 2) return NextResponse.json({ error: "Driver name must contain at least two characters" }, { status: 400 });
  if (!telegramUserId) return NextResponse.json({ error: "Enter the driver's Telegram user ID" }, { status: 400 });

  const { data, error } = await createAdminClient().from("delivery_drivers").insert({
    full_name: fullName,
    phone: cleanText(body?.phone, 40) || null,
    telegram_user_id: telegramUserId,
    telegram_username: cleanText(body?.telegramUsername, 64) || null,
    is_active: true,
    group_membership_status: "invited",
  }).select("*").single();
  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "That Telegram user ID is already registered" }, { status: 409 });
    return NextResponse.json({ error: "Could not add driver" }, { status: 500 });
  }
  return NextResponse.json({ driver: data }, { status: 201 });
}
