import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { answerTelegramCallbackQuery, editTelegramMessageText } from "@/lib/telegram";

/**
 * POST /api/webhooks/telegram — Telegram bot webhook.
 *
 * Handles the Confirm/Reject inline-keyboard buttons sent with short-notice booking
 * alerts (see sendShortNoticeBookingTelegramNotification). Telegram must be configured
 * to call this endpoint via `setWebhook`, with `secret_token` set to
 * TELEGRAM_WEBHOOK_SECRET so this handler can verify the request came from Telegram.
 */

interface TelegramCallbackQuery {
  id: string;
  from?: { id: number; username?: string; first_name?: string };
  message?: { message_id: number; chat: { id: number } };
  data?: string;
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const providedSecret = request.headers.get("x-telegram-bot-api-secret-token");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const update = await request.json().catch(() => null) as { callback_query?: TelegramCallbackQuery } | null;
  const callbackQuery = update?.callback_query;

  // Always acknowledge quickly; only callback_query updates matter here.
  if (!callbackQuery || !callbackQuery.data) {
    return NextResponse.json({ ok: true });
  }

  const [action, bookingId] = callbackQuery.data.split(":");
  if ((action !== "bkconfirm" && action !== "bkreject") || !bookingId) {
    await answerTelegramCallbackQuery(callbackQuery.id, "Unrecognized action");
    return NextResponse.json({ ok: true });
  }

  const decision = action === "bkconfirm" ? "approved" : "rejected";
  const actorLabel = callbackQuery.from?.username
    ? `telegram:@${callbackQuery.from.username}`
    : `telegram:${callbackQuery.from?.id ?? "unknown"}`;

  try {
    const supabase = createAdminClient();
    const { data: updated, error } = await supabase
      .from("bookings")
      .update({
        confirmation_status: decision,
        confirmed_at: new Date().toISOString(),
        confirmed_by: actorLabel,
      })
      .eq("id", bookingId)
      .eq("confirmation_status", "pending")
      .select("booking_ref")
      .maybeSingle();

    if (error) throw error;

    if (!updated) {
      await answerTelegramCallbackQuery(callbackQuery.id, "Already handled");
      return NextResponse.json({ ok: true });
    }

    await answerTelegramCallbackQuery(
      callbackQuery.id,
      decision === "approved" ? "Booking confirmed" : "Booking rejected",
    );

    if (callbackQuery.message) {
      const resultLine = decision === "approved"
        ? `✅ Confirmed by ${actorLabel}`
        : `❌ Rejected by ${actorLabel}`;
      await editTelegramMessageText(
        callbackQuery.message.chat.id,
        callbackQuery.message.message_id,
        `${resultLine}\nBooking ${(updated as { booking_ref: string }).booking_ref}`,
      );
    }
  } catch (err) {
    console.error("[webhooks/telegram] Failed to process callback:", err);
  }

  return NextResponse.json({ ok: true });
}
