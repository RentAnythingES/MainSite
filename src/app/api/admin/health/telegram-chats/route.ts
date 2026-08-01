import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { getTelegramRecentChatCandidates } from "@/lib/telegram";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const limitParam = request.nextUrl.searchParams.get("limit");
  const parsed = Number(limitParam || "10");
  const limit = Number.isFinite(parsed) ? Math.max(1, Math.min(50, parsed)) : 10;

  try {
    const chats = await getTelegramRecentChatCandidates(limit);
    return NextResponse.json({ ok: true, chats });
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: error instanceof Error ? error.message : "Could not read Telegram updates",
    }, { status: 502 });
  }
}