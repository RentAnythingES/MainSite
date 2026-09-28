import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { agentSession, emailField, field, json, sameOrigin, uuid } from "@/lib/agent-auth";

export async function GET(request: NextRequest) {
  const agent = await agentSession(request);
  if (!agent) return json({ error: "Please sign in." }, 401);
  const db = createAdminClient();
  const territories = await db.from("agent_territories").select("market_id,markets(id,name,country_code,timezone)").eq("agent_id", agent.id);
  if (territories.error) return json({ error: "Could not load territories." }, 500);
  const base = { agent, territories: territories.data };
  if (agent.must_change_password || !agent.profile_completed_at) return json({ ...base, orders: [], drivers: [], messages: [], events: [], unavailable: [] });
  const [assignments, drivers, messages, events, unavailable] = await Promise.all([
    db.from("agent_order_assignments").select("*,bookings(id,booking_ref,product_id,quantity,start_date,end_date,status,fulfillment_mode,delivery_address,delivery_notes,collection_address,collection_notes,customer_name,customer_email,customer_phone,market_id,requires_confirmation,confirmation_status,products(name))").eq("agent_id", agent.id).order("assigned_at", { ascending: false }).limit(300),
    db.from("agent_drivers").select("*").eq("agent_id", agent.id).order("name"),
    db.from("agent_messages").select("*").eq("agent_id", agent.id).order("created_at", { ascending: false }).limit(500),
    db.from("agent_order_events").select("*").eq("agent_id", agent.id).order("created_at", { ascending: false }).limit(500),
    db.from("agent_unavailability").select("*").eq("agent_id", agent.id).order("start_date"),
  ]);
  if ([assignments, drivers, messages, events, unavailable].some(r => r.error)) return json({ error: "Could not load your workspace." }, 500);
  const marketIds = new Set(territories.data.map(t => t.market_id));
  const orders = (assignments.data || []).filter(o => o.bookings && marketIds.has(o.bookings.market_id)).map(o => {
    // Offers contain operational requirements only, never customer contact details.
    if (o.status !== "accepted") {
      const b = o.bookings;
      return { ...o, customer_token: undefined, bookings: { id: b.id, booking_ref: b.booking_ref, product_id: b.product_id, quantity: b.quantity, start_date: b.start_date, end_date: b.end_date, status: b.status, fulfillment_mode: b.fulfillment_mode, market_id: b.market_id, products: b.products } };
    }
    return o;
  });
  const accepted = new Set(orders.filter(o => o.status === "accepted").map(o => o.booking_id));
  return json({ ...base, orders, unavailable: unavailable.data, drivers: drivers.data, messages: messages.data?.filter(m => accepted.has(m.booking_id)), events: events.data?.filter(e => accepted.has(e.booking_id)) });
}
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const agent = await agentSession(request);
  if (!agent) return json({ error: "Please sign in." }, 401);
  try {
    const input = await request.json(), db = createAdminClient();
    if (input.action === "profile") {
      const profile = { full_name: field(input.full_name), phone: field(input.phone, 50), contact_email: emailField(input.contact_email), address: field(input.address, 1000), business_name: field(input.business_name || "", 200, false), area_of_operations: field(input.area_of_operations, 1000), languages: field(input.languages, 200), availability_notes: field(input.availability_notes, 1000), profile_completed_at: new Date().toISOString() };
      const { error } = await db.from("rental_agents").update(profile).eq("id", agent.id);
      if (error) throw error;
    } else if (input.action === "read_messages") {
      if (agent.must_change_password || !agent.profile_completed_at) return json({ error: "Complete onboarding first." }, 403);
      const ids = (Array.isArray(input.ids) ? input.ids : []).slice(0, 500).map(uuid);
      const { error } = await db.rpc("mark_agent_messages_read", { p_agent_id: agent.id, p_ids: ids });
      if (error) throw error;
    } else if (input.action === "availability") {
      const date = (value: unknown) => { const s = field(value, 10); if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) throw new Error("Choose valid dates."); return s; };
      const { error } = await db.rpc("agent_availability_action", { p_agent_id: agent.id, p_action: input.id ? "remove" : "add", p_id: input.id ? uuid(input.id) : null, p_start: input.id ? null : date(input.start_date), p_end: input.id ? null : date(input.end_date), p_reason: field(input.reason || "", 500, false) });
      if (error) return json({ error: error.message }, 400);
    } else if (input.action === "driver") {
      if (agent.must_change_password || !agent.profile_completed_at) return json({ error: "Complete onboarding first." }, 403);
      const driver = { name: field(input.name), phone: field(input.phone, 50), vehicle: field(input.vehicle || "", 200, false), is_active: input.is_active !== false };
      const result = input.id ? await db.from("agent_drivers").update(driver).eq("id", uuid(input.id)).eq("agent_id", agent.id).select("id").single() : await db.from("agent_drivers").insert({ ...driver, agent_id: agent.id });
      if (result.error) throw result.error;
    } else return json({ error: "Unsupported action." }, 400);
    return json({ ok: true });
  } catch { return json({ error: "Could not save. Check all required fields and try again." }, 400); }
}
