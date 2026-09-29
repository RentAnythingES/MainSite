import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { driverDispatchStartsAt, getDriverDispatchActions, type DispatchState } from "@/lib/driver-dispatch-policy";
import { getOperationsDate } from "@/lib/booking-operations";
import { formatCustomerFulfillmentWindow } from "@/lib/fulfillment-windows";
import { sendDeliveryGroupRequest, sendUnclaimedJobAdminAlert } from "@/lib/telegram";
import { recordDeliveryTripAccounting } from "@/lib/delivery-accounting";

type Booking = {
  id: string; booking_ref: string; created_at: string; status: string;
  fulfillment_mode: string; rental_start_at: string | null; rental_end_at: string | null;
  delivery_address: string | null; collection_address: string | null;
};
type Request = DispatchState & { id: string; group_message_id: number | null };
const BOOKING_FIELDS = "id,booking_ref,created_at,status,fulfillment_mode,rental_start_at,rental_end_at,delivery_address,collection_address";

function windowLabel(value: string) {
  const date = new Date(value);
  const day = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", weekday: "short", day: "numeric", month: "short" }).format(date);
  const time = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(date);
  return `${day} · ${formatCustomerFulfillmentWindow(time)}`;
}

export async function runDriverDispatch(supabase: SupabaseClient, bookingId?: string, now = new Date()) {
  const results = { initialSent: 0, remindersSent: 0, urgentAlertsSent: 0, errors: [] as string[] };
  if (!process.env.TELEGRAM_DELIVERY_GROUP_ID) {
    results.errors.push("TELEGRAM_DELIVERY_GROUP_ID is not configured");
    return results;
  }
  const bookings: Booking[] = [];
  for (let offset = 0; ; offset += 500) {
    let query = supabase.from("bookings").select(BOOKING_FIELDS)
      .in("status", ["paid", "delivering", "active", "returning"]).order("id").range(offset, offset + 499);
    if (bookingId) query = query.eq("id", bookingId);
    const { data, error } = await query;
    if (error) throw error;
    bookings.push(...(data || []) as Booking[]);
    if (!data || data.length < 500) break;
  }
  for (const booking of bookings) {
    const events: Array<{ type: "delivery" | "pickup"; at: string | null; address: string | null }> = [];
    if (["delivery_only", "delivery_and_collection"].includes(booking.fulfillment_mode)) {
      events.push({ type: "delivery", at: booking.rental_start_at, address: booking.delivery_address });
    }
    if (booking.fulfillment_mode === "delivery_and_collection") {
      events.push({ type: "pickup", at: booking.rental_end_at, address: booking.collection_address || booking.delivery_address });
    }
    for (const event of events) {
      if (!event.at || !event.address || !Number.isFinite(Date.parse(event.at))) continue;
      if (now.getTime() < driverDispatchStartsAt(booking.created_at, event.at)) continue;
      const eventDate = getOperationsDate(event.at)!;
      try {
        const { data: existing, error: findError } = await supabase.from("delivery_requests")
          .select("*").eq("booking_id", booking.id).eq("event_type", event.type).eq("event_date", eventDate).maybeSingle();
        if (findError) throw findError;
        // Do not resurrect historic jobs that were never broadcast by the old system.
        if (!existing && Date.parse(event.at) < now.getTime()) continue;
        if (!existing) {
          const { error } = await supabase.from("delivery_requests").upsert({
            booking_id: booking.id, event_type: event.type, event_date: eventDate,
          }, { onConflict: "booking_id,event_type,event_date", ignoreDuplicates: true });
          if (error) throw error;
        }
        const { data: row, error: rowError } = await supabase.from("delivery_requests")
          .select("*").eq("booking_id", booking.id).eq("event_type", event.type).eq("event_date", eventDate).single();
        if (rowError) throw rowError;
        const actions = getDriverDispatchActions(row as Request, booking.created_at, event.at, now);
        if (!actions.notifyDrivers && !actions.alertAdmin) continue;
        const token = randomUUID();
        const { data: locked, error: lockError } = await supabase.rpc("acquire_driver_dispatch", { p_request_id: row.id, p_token: token });
        if (lockError) throw lockError;
        const request = locked?.[0] as Request | undefined;
        if (!request) continue;
        try {
          const eligible = getDriverDispatchActions(request, booking.created_at, event.at, now);
          const persist = async (values: Record<string, unknown>) => {
            const { error } = await supabase.from("delivery_requests").update(values).eq("id", request.id).eq("dispatch_lock_token", token);
            if (error) throw error;
          };
          if (eligible.notifyDrivers) {
            const sent = await sendDeliveryGroupRequest({
              requestId: request.id, eventType: event.type, windowLabel: windowLabel(event.at),
              postalCode: /\b\d{5}\b/.exec(event.address)?.[0] || "Not provided",
              reminder: Boolean(request.first_notified_at),
            });
            if (!sent.ok) {
              results.errors.push(`${booking.booking_ref} ${event.type}: ${sent.error}`);
            } else {
              await persist({ first_notified_at: request.first_notified_at || now.toISOString(),
                last_notified_at: now.toISOString(), group_chat_id: process.env.TELEGRAM_DELIVERY_GROUP_ID,
                group_message_id: sent.messageId });
              if (request.first_notified_at) results.remindersSent += 1;
              else results.initialSent += 1;
              if (!request.first_notified_at) {
                try {
                  await recordDeliveryTripAccounting(supabase, { deliveryRequestId: request.id, bookingId: booking.id,
                    eventType: event.type, eventDate, destinationAddress: event.address });
                } catch (error) {
                  results.errors.push(`Trip accounting ${booking.booking_ref}: ${error instanceof Error ? error.message : String(error)}`);
                }
              }
            }
          }
          if (eligible.alertAdmin) {
            // A driver may have claimed the job while the group message was sent.
            const { data: latest, error } = await supabase.from("delivery_requests").select("status").eq("id", request.id).single();
            if (error) throw error;
            if (latest.status === "open") {
              const sent = await sendUnclaimedJobAdminAlert({ bookingId: booking.id, bookingRef: booking.booking_ref,
                eventType: event.type, windowLabel: windowLabel(event.at) });
              if (!sent.ok) results.errors.push(`Urgent alert ${booking.booking_ref}: ${sent.error}`);
              else { await persist({ admin_alerted_at: now.toISOString() }); results.urgentAlertsSent += 1; }
            }
          }
        } finally {
          const { error } = await supabase.from("delivery_requests").update({ dispatch_lock_until: null, dispatch_lock_token: null })
            .eq("id", request.id).eq("dispatch_lock_token", token);
          if (error) results.errors.push(`Dispatch lock release ${request.id}: ${error.message}`);
        }
      } catch (error) {
        results.errors.push(`${booking.booking_ref} ${event.type}: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
      }
    }
  }
  return results;
}
