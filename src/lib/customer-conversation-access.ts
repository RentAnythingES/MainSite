import { createAdminClient } from "@/lib/supabase-admin";
import { uuid } from "@/lib/agent-auth";
import { storedBookingLocale } from "@/lib/booking-locale";

/** Keep the existing assignment, booking, agent and territory checks for every token read. */
export async function customerConversationAccess(token: string) {
  const db = createAdminClient();
  const { data } = await db.from("agent_order_assignments").select("booking_id,agent_id,bookings(status,market_id,locale),rental_agents(is_active)").eq("customer_token", uuid(token)).eq("status", "accepted").maybeSingle();
  if (!data) return null;
  const booking = data.bookings as unknown as { status: string; market_id: string; locale: unknown };
  const agent = data.rental_agents as unknown as { is_active: boolean };
  if (!agent?.is_active || !["paid", "delivering", "active", "returning"].includes(booking?.status)) return null;
  const territory = await db.from("agent_territories").select("market_id").eq("agent_id", data.agent_id).eq("market_id", booking.market_id).maybeSingle();
  if (!territory.data) return null;
  return { ...data, locale: storedBookingLocale(booking.locale) };
}
