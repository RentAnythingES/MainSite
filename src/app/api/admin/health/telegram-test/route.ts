import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import {
  getTelegramBookingConfigurationIssues,
  isTelegramBookingNotificationConfigured,
  sendTestBookingPaidTelegramNotification,
} from "@/lib/telegram";

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  if (!isTelegramBookingNotificationConfigured()) {
    return NextResponse.json({
      ok: false,
      error: "Telegram booking notifications are not configured",
      issues: getTelegramBookingConfigurationIssues(),
    }, { status: 400 });
  }

  const ok = await sendTestBookingPaidTelegramNotification();
  if (!ok) {
    return NextResponse.json({
      ok: false,
      error: "Telegram test notification failed",
      issues: getTelegramBookingConfigurationIssues(),
    }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    message: "Test Telegram notification sent",
  });
}