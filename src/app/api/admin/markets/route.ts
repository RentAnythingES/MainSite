import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createServiceClient } from "@/lib/supabase";
import { saveAdminMarket } from "@/lib/admin-markets";

export async function GET(request: NextRequest) {
  if (!await verifyAdmin(request)) return unauthorizedResponse();
  const page = Number(request.nextUrl.searchParams.get("page") ?? "0");
  if (!Number.isSafeInteger(page) || page < 0 || page > 10000) return NextResponse.json({ error: "Invalid page" }, { status: 400 });
  const { data, error } = await createServiceClient().from("markets").select("*")
    .order("is_default", { ascending: false }).order("name").order("id").range(page * 50, page * 50 + 50);
  if (error) {
    console.error("[admin-markets] List failed", { code: error.code });
    return NextResponse.json({ error: "Could not load cities" }, { status: 503 });
  }
  return NextResponse.json({ markets: (data ?? []).slice(0, 50), hasMore: (data?.length ?? 0) > 50 }, { headers: { "Cache-Control": "no-store" } });
}

export function POST(request: NextRequest) { return saveAdminMarket(request); }
