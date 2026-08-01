import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import {
  getWhatsAppBookingConfigurationIssues,
  getWhatsAppNotificationMode,
  isWhatsAppBookingNotificationConfigured,
  sendTestBookingPaidWhatsAppNotification,
} from "@/lib/whatsapp";

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  if (!isWhatsAppBookingNotificationConfigured()) {
    return NextResponse.json({
      ok: false,
      error: "WhatsApp booking notifications are not configured",
      mode: getWhatsAppNotificationMode(),
      issues: getWhatsAppBookingConfigurationIssues(),
    }, { status: 400 });
  }

  const ok = await sendTestBookingPaidWhatsAppNotification();
  if (!ok) {
    return NextResponse.json({
      ok: false,
      error: "WhatsApp test notification failed",
      mode: getWhatsAppNotificationMode(),
      issues: getWhatsAppBookingConfigurationIssues(),
    }, { status: 502 });
  }

  return NextResponse.json({
    ok: true,
    mode: getWhatsAppNotificationMode(),
    message: "Test WhatsApp notification sent",
  });
}