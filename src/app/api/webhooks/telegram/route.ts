import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import {
  answerTelegramCallbackQuery,
  editTelegramMessageText,
  isTelegramDeliveryGroupMember,
  sendDeliveryDetailsDirectMessage,
  sendTelegramToChatId,
} from "@/lib/telegram";
import { rejectBookingWithStripeRefund } from "@/lib/booking-rejection-refund";

/**
 * POST /api/webhooks/telegram — Telegram bot webhook.
 *
 * Handles the Confirm/Reject inline-keyboard buttons sent with short-notice booking
 * alerts (see sendShortNoticeBookingTelegramNotification), plus courier-group
 * "I'll take it / I can't" buttons posted by the due-date cron. Telegram must be
 * configured to call this endpoint via `setWebhook`, with `secret_token` set to
 * TELEGRAM_WEBHOOK_SECRET so this handler can verify the request came from Telegram.
 */

interface TelegramCallbackQuery {
  id: string;
  from?: { id: number; username?: string; first_name?: string };
  message?: { message_id: number; chat: { id: number } };
  data?: string;
}

interface TelegramMessageUpdate {
  message_id: number;
  text?: string;
  chat: { id: number };
  from?: { id: number; username?: string; first_name?: string };
}

interface TelegramChatMemberUpdate {
  chat: { id: number };
  from?: { id: number; username?: string; first_name?: string };
  new_chat_member?: { status?: string; user?: { id: number; username?: string; first_name?: string } };
}

function actorLabel(from?: { id: number; username?: string; first_name?: string }) {
  if (from?.username) return `@${from.username}`;
  if (from?.first_name) return from.first_name;
  return `user ${from?.id ?? "unknown"}`;
}

type DeliveryRequestRow = {
  id: string;
  booking_id: string;
  event_type: "delivery" | "pickup";
  event_date: string;
  status: "open" | "claimed" | "cancelled";
  group_chat_id: string | null;
  group_message_id: number | null;
  claimed_by_label: string | null;
  claimed_by_telegram_user_id: number | null;
};

type BookingDetailsRow = {
  id: string;
  booking_ref: string;
  customer_name: string;
  customer_phone: string | null;
  delivery_address: string | null;
  collection_address: string | null;
  delivery_notes: string | null;
  collection_notes: string | null;
  product: { name: string } | { name: string }[] | null;
};

async function loadRequestWithBooking(supabase: ReturnType<typeof createAdminClient>, requestId: string) {
  const { data: requestRow, error: requestError } = await supabase
    .from("delivery_requests")
    .select("id,booking_id,event_type,event_date,status,group_chat_id,group_message_id,claimed_by_label,claimed_by_telegram_user_id")
    .eq("id", requestId)
    .maybeSingle();
  if (requestError || !requestRow) return null;

  const request = requestRow as DeliveryRequestRow;
  const { data: bookingRow } = await supabase
    .from("bookings")
    .select("id,booking_ref,customer_name,customer_phone,delivery_address,collection_address,delivery_notes,collection_notes,product:products(name)")
    .eq("id", request.booking_id)
    .maybeSingle();

  return { request, booking: (bookingRow as BookingDetailsRow | null) || null };
}

async function sendDetailsToCourier(
  supabase: ReturnType<typeof createAdminClient>,
  requestId: string,
  telegramUserId: number,
) {
  const loaded = await loadRequestWithBooking(supabase, requestId);
  if (!loaded?.booking) return { ok: false as const, error: "Request no longer exists" };
  const { request, booking } = loaded;
  if (request.claimed_by_telegram_user_id !== telegramUserId) {
    return { ok: false as const, error: "This request is assigned to someone else" };
  }

  const product = Array.isArray(booking.product) ? booking.product[0] : booking.product;
  const address = request.event_type === "delivery"
    ? booking.delivery_address || booking.collection_address
    : booking.collection_address || booking.delivery_address;

  return sendDeliveryDetailsDirectMessage(telegramUserId, {
    bookingId: booking.id,
    bookingRef: booking.booking_ref,
    eventType: request.event_type,
    productName: product?.name || "Rental item",
    customerName: booking.customer_name,
    customerPhone: booking.customer_phone,
    address: address || "Address on file — see admin",
    notes: request.event_type === "delivery" ? booking.delivery_notes : booking.collection_notes,
  });
}

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const providedSecret = request.headers.get("x-telegram-bot-api-secret-token");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const update = await request.json().catch(() => null) as {
    callback_query?: TelegramCallbackQuery;
    message?: TelegramMessageUpdate;
    chat_member?: TelegramChatMemberUpdate;
  } | null;

  if (update?.chat_member) {
    await handleDriverGroupMembership(update.chat_member);
    return NextResponse.json({ ok: true });
  }

  if (update?.message) {
    await handleMessage(update.message);
    return NextResponse.json({ ok: true });
  }

  const callbackQuery = update?.callback_query;

  // Always acknowledge quickly; only callback_query updates matter here.
  if (!callbackQuery || !callbackQuery.data) {
    return NextResponse.json({ ok: true });
  }

  const [action, bookingId] = callbackQuery.data.split(":");
  if ((action !== "bkconfirm" && action !== "bkreject" && action !== "dvclaim" && action !== "dvskip") || !bookingId) {
    await answerTelegramCallbackQuery(callbackQuery.id, "Unrecognized action");
    return NextResponse.json({ ok: true });
  }

  try {
    if (action === "dvclaim" || action === "dvskip") {
      await handleDeliveryCallback(callbackQuery, action, bookingId);
    } else {
      await handleConfirmationCallback(callbackQuery, action, bookingId);
    }
  } catch (err) {
    console.error("[webhooks/telegram] Failed to process callback:", err);
    await answerTelegramCallbackQuery(callbackQuery.id, "Something went wrong, please try again");
  }

  return NextResponse.json({ ok: true });
}

async function handleConfirmationCallback(
  callbackQuery: TelegramCallbackQuery,
  action: "bkconfirm" | "bkreject",
  bookingId: string,
) {
  const decision = action === "bkconfirm" ? "approved" : "rejected";
  const actor = `telegram:${actorLabel(callbackQuery.from)}`;

  const supabase = createAdminClient();
  if (decision === "rejected") {
    try {
      const result = await rejectBookingWithStripeRefund(supabase, {
        bookingId,
        actor,
      });
      await answerTelegramCallbackQuery(
        callbackQuery.id,
        result.alreadyHandled ? "Already rejected and refunded" : "Booking rejected and refunded",
      );
      if (callbackQuery.message) {
        const resultLine = result.alreadyHandled
          ? "❌ Already rejected and refunded"
          : `❌ Rejected and refunded by ${actorLabel(callbackQuery.from)}`;
        await editTelegramMessageText(
          callbackQuery.message.chat.id,
          callbackQuery.message.message_id,
          `${resultLine}\nBooking ${result.booking.booking_ref}`,
        );
      }
    } catch (error) {
      console.error("[webhooks/telegram] Booking rejection refund failed:", error);
      await answerTelegramCallbackQuery(callbackQuery.id, "Refund failed — booking was not rejected");
    }
    return;
  }

  const { data: updated, error } = await supabase
    .from("bookings")
    .update({
      confirmation_status: decision,
      confirmed_at: new Date().toISOString(),
      confirmed_by: actor,
    })
    .eq("id", bookingId)
    .eq("confirmation_status", "pending")
    .select("booking_ref")
    .maybeSingle();

  if (error) throw error;

  if (!updated) {
    await answerTelegramCallbackQuery(callbackQuery.id, "Already handled");
    return;
  }

  await answerTelegramCallbackQuery(
    callbackQuery.id,
    decision === "approved" ? "Booking confirmed" : "Booking rejected",
  );

  if (callbackQuery.message) {
    const resultLine = decision === "approved"
      ? `✅ Confirmed by ${actorLabel(callbackQuery.from)}`
      : `❌ Rejected by ${actorLabel(callbackQuery.from)}`;
    await editTelegramMessageText(
      callbackQuery.message.chat.id,
      callbackQuery.message.message_id,
      `${resultLine}\nBooking ${(updated as { booking_ref: string }).booking_ref}`,
    );
  }
}

async function handleDeliveryCallback(
  callbackQuery: TelegramCallbackQuery,
  action: "dvclaim" | "dvskip",
  requestId: string,
) {
  const supabase = createAdminClient();
  const courierId = callbackQuery.from?.id;
  const courier = actorLabel(callbackQuery.from);

  if (
    !callbackQuery.message ||
    String(callbackQuery.message.chat.id) !== process.env.TELEGRAM_DELIVERY_GROUP_ID
  ) {
    await answerTelegramCallbackQuery(callbackQuery.id, "This request must be claimed from the delivery group");
    return;
  }

  if (action === "dvskip") {
    await answerTelegramCallbackQuery(callbackQuery.id, "No problem — leaving it for others");
    return;
  }

  if (!courierId) {
    await answerTelegramCallbackQuery(callbackQuery.id, "Could not identify your Telegram user");
    return;
  }

  const { data: driver, error: driverError } = await supabase
    .from("delivery_drivers")
    .select("id,full_name,group_membership_status")
    .eq("telegram_user_id", courierId)
    .eq("is_active", true)
    .maybeSingle();
  if (driverError) throw driverError;
  if (!driver) {
    await answerTelegramCallbackQuery(callbackQuery.id, "Only registered Rent'n Roll drivers can claim requests");
    return;
  }

  const registeredDriver = driver as { id: string; full_name: string; group_membership_status: string };
  if (registeredDriver.group_membership_status !== "active") {
    const isGroupMember = await isTelegramDeliveryGroupMember(courierId);
    if (!isGroupMember) {
      await answerTelegramCallbackQuery(callbackQuery.id, "Join the delivery group using your personal invite before claiming work");
      return;
    }
    await supabase.from("delivery_drivers").update({
      group_membership_status: "active",
      joined_at: new Date().toISOString(),
      removed_at: null,
    }).eq("id", registeredDriver.id);
  }

  if (requestId.startsWith("telegram-test-delivery-")) {
    const testDetails = await sendDeliveryDetailsDirectMessage(courierId, {
      bookingRef: "TEST-DELIVERY",
      eventType: "delivery",
      productName: "Test delivery request",
      customerName: "Test customer — no journey required",
      address: "Test address, Valencia",
      notes: "This is a Telegram dispatch test. No customer or booking is attached.",
    });
    if (!testDetails.ok) {
      await answerTelegramCallbackQuery(callbackQuery.id, "Open the bot privately and press Start, then try the test again");
      return;
    }
    await answerTelegramCallbackQuery(callbackQuery.id, "Test claimed — test details sent privately");
    await editTelegramMessageText(
      callbackQuery.message.chat.id,
      callbackQuery.message.message_id,
      "🧪 <b>Test claimed</b>\nNo real delivery is assigned.",
    );
    return;
  }

  // Atomic claim: only one courier can win an open request.
  const { data: claimed, error: claimError } = await supabase
    .from("delivery_requests")
    .update({
      status: "claimed",
      claimed_by_telegram_user_id: courierId,
      claimed_by_label: registeredDriver.full_name || courier,
      claimed_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("status", "open")
    .select("id,group_chat_id,group_message_id")
    .maybeSingle();

  if (claimError) throw claimError;

  if (!claimed) {
    const { data: existing } = await supabase
      .from("delivery_requests")
      .select("claimed_by_label")
      .eq("id", requestId)
      .maybeSingle();
    await answerTelegramCallbackQuery(
      callbackQuery.id,
      existing?.claimed_by_label ? `Already claimed by ${existing.claimed_by_label}` : "No longer available",
    );
    return;
  }

  const details = await sendDetailsToCourier(supabase, requestId, courierId);
  if (!details.ok) {
    // The courier has never opened the bot privately, so Telegram refuses the DM.
    await supabase
      .from("delivery_requests")
      .update({ status: "open", claimed_by_telegram_user_id: null, claimed_by_label: null, claimed_at: null })
      .eq("id", requestId);
    await answerTelegramCallbackQuery(
      callbackQuery.id,
      `First open the bot in a private chat and press Start, then tap "I'll take it" again. Or send /start delivery_${requestId} to the bot.`,
    );
    return;
  }

  await answerTelegramCallbackQuery(callbackQuery.id, "It's yours — full details sent to your private chat");

  if (callbackQuery.message) {
    const { data: requestRow } = await supabase
      .from("delivery_requests")
      .select("booking:bookings(booking_ref)")
      .eq("id", requestId)
      .maybeSingle();
    const bookingJoin = (requestRow as { booking?: { booking_ref: string } | { booking_ref: string }[] | null } | null)?.booking;
    const bookingRef = Array.isArray(bookingJoin) ? bookingJoin[0]?.booking_ref : bookingJoin?.booking_ref;
    await editTelegramMessageText(
      callbackQuery.message.chat.id,
      callbackQuery.message.message_id,
      `✅ <b>Claimed</b>${bookingRef ? `\nRef: ${bookingRef}` : ""}`,
    );
  }
}

async function handleMessage(message: TelegramMessageUpdate) {
  const text = (message.text || "").trim();
  if (!text) return;

  if (text.startsWith("/chatid")) {
    await sendTelegramToChatId(String(message.chat.id), `This chat ID is: <code>${message.chat.id}</code>`);
    return;
  }

  const deliveryMatch = /^\/start(?:\s+delivery_([0-9a-f-]+))?/i.exec(text);
  if (deliveryMatch?.[1]) {
    const result = await sendDetailsToCourier(createAdminClient(), deliveryMatch[1], message.from?.id || 0);
    if (!result.ok) {
      await sendTelegramToChatId(String(message.chat.id), result.error || "No delivery is assigned to you yet.");
    }
    return;
  }
}

async function handleDriverGroupMembership(update: TelegramChatMemberUpdate) {
  if (String(update.chat.id) !== process.env.TELEGRAM_DELIVERY_GROUP_ID) return;
  const member = update.new_chat_member;
  const telegramUserId = member?.user?.id;
  if (!telegramUserId) return;

  const status = member?.status || "left";
  const isMember = ["member", "administrator", "creator", "owner"].includes(status);
  const supabase = createAdminClient();
  const { data: driver } = await supabase
    .from("delivery_drivers")
    .select("id,is_active")
    .eq("telegram_user_id", telegramUserId)
    .maybeSingle();
  if (!driver) return;

  if (isMember && (driver as { is_active: boolean }).is_active) {
    await supabase.from("delivery_drivers").update({
      group_membership_status: "active",
      telegram_username: member?.user?.username || null,
      joined_at: new Date().toISOString(),
      removed_at: null,
    }).eq("id", (driver as { id: string }).id);
    return;
  }

  await supabase.from("delivery_drivers").update({
    group_membership_status: "removed",
    removed_at: new Date().toISOString(),
  }).eq("id", (driver as { id: string }).id);
}
