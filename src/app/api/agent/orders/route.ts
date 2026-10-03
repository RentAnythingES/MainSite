import { NextRequest } from "next/server";
import { Resend } from "resend";
import { createAdminClient } from "@/lib/supabase-admin";
import { agentSession, field, json, limited, sameOrigin, uuid } from "@/lib/agent-auth";
import { isLocale } from "@/i18n/config";
import { customerTokenPath } from "@/i18n/customer-path";
import { agentMessageEmail } from "@/i18n/agent-message";
import { SITE_URL } from "@/config/site";
import { sendBookingLifecycleNotification } from "@/lib/booking-status-notifications";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const agent = await agentSession(request, true);
  if (!agent) return json({ error: "Sign in and complete onboarding first." }, 401);
  try {
    const input = await request.json(), db = createAdminClient();
    const bookingId = uuid(input.bookingId), action = field(input.action, 20);
    if (!["accept", "decline", "status", "schedule", "note", "message"].includes(action)) throw new Error("Unsupported action.");
    if (action === "message") {
      if (!process.env.RESEND_API_KEY) throw new Error("Customer email is not configured. Please contact the admin.");
      if (await limited(request, "agent-message", 40, agent.id)) return json({ error: "Message limit reached. Please try later." }, 429);
      input.messageId = uuid(input.messageId);
      input.body = field(input.body, 5000);
    }
    const result = await db.rpc("agent_order_action", { p_agent_id: agent.id, p_booking_id: bookingId, p_action: action, p_payload: input });
    if (result.error) throw new Error(result.error.message);
    if (action === "status") {
      const { data: booking } = await db.from("bookings").select("*,product:products(name)").eq("id", bookingId).single();
      if (booking) {
        try { await sendBookingLifecycleNotification(db, booking, input.status); }
        catch { return json({ ok: true, warning: "Order status saved. The automatic customer update could not be sent; please follow up from the conversation." }); }
      }
    }
    if (action === "message") {
      const { data: message } = await db.from("agent_messages").select("*").eq("id", input.messageId).eq("agent_id", agent.id).eq("booking_id", bookingId).eq("direction", "agent").single();
      if (!message || message.body !== input.body) throw new Error("Message reference is invalid.");
      if (message.status === "sent") return json({ ok: true });
      const { data: assignment } = await db.from("agent_order_assignments").select("customer_token,bookings(customer_email,booking_ref,market_id,locale)").eq("booking_id", bookingId).eq("agent_id", agent.id).eq("status", "accepted").single();
      const booking = assignment?.bookings as unknown as { customer_email: string; booking_ref: string; market_id: string; locale?: string } | undefined;
      if (!booking) throw new Error("Assignment changed. Refresh your orders.");
      const locale = isLocale(booking.locale) ? booking.locale : "en";
      const replyUrl = SITE_URL + customerTokenPath(locale, "/booking/messages/" + assignment!.customer_token);
      const email = agentMessageEmail(locale, booking.booking_ref, agent.full_name, message.body, replyUrl);
      const sent = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.FROM_EMAIL || "Rentandroll <bookings@rentandroll.com>",
        to: booking.customer_email,
        subject: email.subject,
        text: email.text,
      }, { idempotencyKey: `agent-message-${message.id}` });
      await db.from("agent_messages").update({ status: sent.error ? "failed" : "sent", provider_id: sent.data?.id || null }).eq("id", message.id);
      if (sent.error) return json({ error: "Message saved but email could not be sent. Use Retry on this message." }, 502);
    }
    return json({ ok: true });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Could not update order." }, 400); }
}
