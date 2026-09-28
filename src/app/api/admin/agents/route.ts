import { randomBytes } from "node:crypto";
import { NextRequest } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { emailField, field, json, sameOrigin, uuid } from "@/lib/agent-auth";

export async function GET(request: NextRequest) {
  if (!await verifyAdmin(request)) return json({ error: "Unauthorized" }, 401);
  const db = createAdminClient();
  const [applications, agents, markets, bookings, assignments, events, messages] = await Promise.all([
    db.from("agent_applications").select("*").order("created_at", { ascending: false }).limit(500),
    db.from("rental_agents").select("*,agent_territories(market_id)").order("created_at", { ascending: false }),
    db.from("markets").select("id,name,country_code,timezone,is_booking_enabled").order("country_code").order("name"),
    db.from("bookings").select("id,booking_ref,customer_name,market_id,start_date,end_date,status,products(name)").in("status", ["paid", "delivering", "active", "returning"]).order("start_date").limit(500),
    db.from("agent_order_assignments").select("*").order("assigned_at", { ascending: false }).limit(500),
    db.from("agent_order_events").select("*").order("created_at", { ascending: false }).limit(200),
    db.from("agent_messages").select("*").order("created_at", { ascending: false }).limit(200),
  ]);
  if ([applications, agents, markets, bookings, assignments, events, messages].some(r => r.error)) return json({ error: "Agent Management is unavailable. Check the database migration." }, 503);
  return json({ applications: applications.data, agents: agents.data, markets: markets.data, bookings: bookings.data, assignments: assignments.data, events: events.data, messages: messages.data });
}
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const admin = await verifyAdmin(request);
  if (!admin) return json({ error: "Unauthorized" }, 401);
  const db = createAdminClient();
  try {
    const input = await request.json();
    let agentId: string | null = null;
    let password: string | undefined;
    if (input.action === "create") {
      const email = emailField(input.email), name = field(input.full_name);
      const marketIds = [...new Set((Array.isArray(input.marketIds) ? input.marketIds : []).map(uuid))];
      if (!marketIds.length) throw new Error("Choose at least one country/city.");
      const { data: markets, error: marketError } = await db.from("markets").select("id").in("id", marketIds);
      if (marketError || markets?.length !== marketIds.length) throw new Error("Choose valid territories.");
      const applicationId = input.applicationId ? uuid(input.applicationId) : null;
      if (applicationId) {
        const { data } = await db.from("agent_applications").select("id").eq("id", applicationId).single();
        if (!data) throw new Error("Application not found.");
      }
      password = randomBytes(24).toString("base64url") + "aA1!";
      const auth = await db.auth.admin.createUser({ email, password, email_confirm: true, app_metadata: { role: "agent" } });
      if (auth.error || !auth.data.user) throw new Error("Could not create account. This email may already be registered.");
      const created = await db.from("rental_agents").insert({ email, full_name: name, user_id: auth.data.user.id, application_id: applicationId }).select("id").single();
      if (created.error) { await db.auth.admin.deleteUser(auth.data.user.id); throw new Error("Could not save agent account."); }
      agentId = created.data.id;
      const territories = await db.rpc("set_agent_territories", { p_agent_id: agentId, p_markets: marketIds });
      if (territories.error) {
        await db.from("rental_agents").delete().eq("id", agentId);
        await db.auth.admin.deleteUser(auth.data.user.id);
        throw new Error("Could not assign territories. Account creation was cancelled.");
      }
      if (applicationId) await db.from("agent_applications").update({ status: "approved" }).eq("id", applicationId);
    } else if (input.action === "application") {
      const status = field(input.status, 20);
      if (!["new", "reviewing", "approved", "rejected"].includes(status)) throw new Error("Invalid application status.");
      const result = await db.from("agent_applications").update({ status, admin_notes: field(input.admin_notes || "", 3000, false) }).eq("id", uuid(input.id)).select("id").single();
      if (result.error) throw new Error("Could not update application.");
    } else if (input.action === "market") {
      const country = field(input.country_code, 2).toUpperCase(), name = field(input.name, 100), timezone = field(input.timezone, 100), currency = field(input.currency, 3).toLowerCase();
      if (!/^[A-Z]{2}$/.test(country) || !/^[a-z]{3}$/.test(currency)) throw new Error("Enter a two-letter country and three-letter currency code.");
      try { new Intl.DateTimeFormat("en", { timeZone: timezone }).format(); } catch { throw new Error("Enter an IANA time zone such as Europe/Madrid."); }
      const slug = field(input.slug, 80).toLowerCase();
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("Use lowercase words separated by hyphens for the city identifier.");
      const result = await db.from("markets").insert({ name, slug, country_code: country, timezone, currency, market_type: "city", is_active: false, is_public: false, is_booking_enabled: false, is_indexable: false });
      if (result.error) throw new Error("Could not add city. Its identifier may already exist.");
    } else if (input.action === "assign") {
      agentId = uuid(input.agentId);
      const result = await db.rpc("assign_agent_order", { p_agent_id: agentId, p_booking_id: uuid(input.bookingId), p_actor: admin.id });
      if (result.error) throw new Error(result.error.message);
    } else {
      agentId = uuid(input.id);
      const { data: agent } = await db.from("rental_agents").select("*").eq("id", agentId).single();
      if (!agent) throw new Error("Agent not found.");
      if (input.action === "territories") {
        const markets = [...new Set((Array.isArray(input.marketIds) ? input.marketIds : []).map(uuid))];
        if (!markets.length) throw new Error("Choose at least one city.");
        const result = await db.rpc("set_agent_territories", { p_agent_id: agentId, p_markets: markets });
        if (result.error) throw new Error(result.error.message);
      } else if (input.action === "active" || input.action === "reset") {
        const patch = input.action === "reset" ? { must_change_password: true, auth_locked: true, security_version: agent.security_version + 1 } : { is_active: input.is_active === true, security_version: agent.security_version + 1 };
        const update = await db.from("rental_agents").update(patch).eq("id", agentId).eq("security_version", agent.security_version).select("id").single();
        if (update.error) throw new Error("Account changed. Refresh and try again.");
        await db.from("agent_sessions").delete().eq("agent_id", agentId);
        if (input.action === "reset") {
          password = randomBytes(24).toString("base64url") + "aA1!";
          const reset = await db.auth.admin.updateUserById(agent.user_id, { password });
          if (reset.error) throw new Error("Password reset failed. Please retry.");
          const unlock = await db.from("rental_agents").update({ auth_locked: false }).eq("id", agentId).eq("security_version", agent.security_version + 1).select("id").single();
          if (unlock.error) throw new Error("Account changed during reset. Please reset the password again.");
        }
      } else throw new Error("Unsupported action.");
    }
    await db.from("agent_audit_events").insert({ agent_id: agentId, actor_user_id: admin.id, action: input.action, details: { recordId: input.id || input.bookingId || null } });
    return json({ ok: true, password, agentId });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Unable to save changes." }, 400); }
}
