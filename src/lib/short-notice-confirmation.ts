import type { SupabaseClient } from "@supabase/supabase-js";
import { sendBookingLifecycleNotification } from "@/lib/booking-status-notifications";

export type ShortNoticeConfirmationResult = {
  booking: Record<string, unknown> | null;
  confirmed: boolean;
  emailSent: boolean;
};

/**
 * Atomically approves a pending short-notice booking, then sends the customer
 * confirmation email. Both the admin panel and Telegram callbacks use this path.
 */
export async function confirmShortNoticeBooking(
  supabase: SupabaseClient,
  bookingId: string,
  actor: string,
): Promise<ShortNoticeConfirmationResult> {
  const { data, error } = await supabase
    .from("bookings")
    .update({
      confirmation_status: "approved",
      confirmed_at: new Date().toISOString(),
      confirmed_by: actor,
    })
    .eq("id", bookingId)
    .eq("confirmation_status", "pending")
    .select("*,product:products(name)")
    .maybeSingle();

  if (error) throw error;
  if (!data) return { booking: null, confirmed: false, emailSent: false };

  let emailSent = false;
  try {
    emailSent = await sendBookingLifecycleNotification(
      supabase,
      data as Record<string, unknown>,
      "confirmed",
    );
  } catch (error) {
    console.error("[short-notice-confirmation] Failed to send customer confirmation email:", error);
  }

  return { booking: data as Record<string, unknown>, confirmed: true, emailSent };
}
