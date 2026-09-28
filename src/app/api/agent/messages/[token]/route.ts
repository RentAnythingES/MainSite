import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { field, json, limited, sameOrigin, uuid } from "@/lib/agent-auth";

type Context = { params: Promise<{ token: string }> };
async function thread(token: string) {
  const db = createAdminClient();
  const { data } = await db.from("agent_order_assignments").select("booking_id,agent_id,bookings(status,market_id),rental_agents(is_active)").eq("customer_token", uuid(token)).eq("status", "accepted").maybeSingle();
  if (!data) return null;
  const booking = data.bookings as unknown as { status: string; market_id: string };
  const agent = data.rental_agents as unknown as { is_active: boolean };
  if (!agent?.is_active || !["paid", "delivering", "active", "returning"].includes(booking?.status)) return null;
  const territory = await db.from("agent_territories").select("market_id").eq("agent_id", data.agent_id).eq("market_id", booking.market_id).maybeSingle();
  return territory.data ? data : null;
}
export async function GET(request: NextRequest, context: Context) {
  try {
    if (await limited(request, "agent-thread-read", 120)) return json({ error: "Try again later." }, 429);
    const assignment = await thread((await context.params).token);
    if (!assignment) return json({ error: "This conversation is no longer available. Please contact Rentandroll." }, 404);
    const { data, error } = await createAdminClient().from("agent_messages").select("id,direction,body,created_at").eq("booking_id", assignment.booking_id).eq("agent_id", assignment.agent_id).in("status", ["sent", "received"]).order("created_at").limit(500);
    if (error) throw error;
    return json({ messages: data });
  } catch { return json({ error: "Conversation unavailable." }, 404); }
}
export async function POST(request: NextRequest, context: Context) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  try {
    if (await limited(request, "agent-thread-reply", 20)) return json({ error: "Try again later." }, 429);
    const token = (await context.params).token;
    const input = await request.json();
    const result = await createAdminClient().rpc("reply_agent_message", { p_token: uuid(token), p_body: field(input.body, 5000), p_message_id: uuid(input.messageId) });
    if (result.error) throw result.error;
    return json({ ok: true });
  } catch { return json({ error: "Could not send your reply. The conversation may have closed." }, 400); }
}
