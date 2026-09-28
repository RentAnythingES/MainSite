import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { AGENT_COOKIE, agentSession, emailField, field, hashSession, issueAgentSession, json, limited, sameOrigin } from "@/lib/agent-auth";

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  try {
    if (await limited(request, "agent-login", 20)) return json({ error: "Too many attempts. Try again later." }, 429);
    const input = await request.json();
    const email = emailField(input.email), password = field(input.password, 200);
    if (await limited(request, "agent-login-account", 20, email)) return json({ error: "Too many attempts. Try again later." }, 429);
    const db = createAdminClient();
    // Read the version before authentication so a concurrent reset invalidates this login.
    const { data: before } = await db.from("rental_agents").select("security_version").eq("email", email).maybeSingle();
    const auth = await createAdminClient().auth.signInWithPassword({ email, password });
    if (auth.error || auth.data.user?.app_metadata.role !== "agent") return json({ error: "Invalid email or password." }, 401);
    const { data: agent } = await db.from("rental_agents").select("id,is_active,security_version,auth_locked").eq("user_id", auth.data.user.id).maybeSingle();
    if (!agent?.is_active || agent.auth_locked || agent.security_version !== before?.security_version) return json({ error: "Account unavailable. Contact Rentandroll." }, 403);
    return issueAgentSession(agent.id, agent.security_version);
  } catch { return json({ error: "Unable to sign in. Check your details and try again." }, 400); }
}
export async function DELETE(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const token = request.cookies.get(AGENT_COOKIE)?.value;
  if (token) await createAdminClient().from("agent_sessions").delete().eq("token_hash", hashSession(token));
  const response = json({ ok: true }); response.cookies.delete(AGENT_COOKIE); return response;
}
export async function PATCH(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "Invalid request origin." }, 403);
  const agent = await agentSession(request);
  if (!agent) return json({ error: "Please sign in." }, 401);
  try {
    if (await limited(request, "agent-password", 10, agent.id)) return json({ error: "Too many attempts. Try later." }, 429);
    const input = await request.json();
    const current = field(input.currentPassword, 200), password = field(input.password, 200);
    if (password.length < 12 || password === current) return json({ error: "Choose a new password with at least 12 characters." }, 400);
    const auth = await createAdminClient().auth.signInWithPassword({ email: agent.email, password: current });
    if (auth.error || auth.data.user?.id !== agent.user_id) return json({ error: "Current password is incorrect." }, 400);
    const db = createAdminClient();
    const lock = await db.from("rental_agents").update({ auth_locked: true, security_version: agent.security_version + 1 }).eq("id", agent.id).eq("security_version", agent.security_version).eq("auth_locked", false).select("id").single();
    if (lock.error) throw lock.error;
    const { error } = await db.auth.admin.updateUserById(agent.user_id, { password });
    if (error) throw error;
    const updated = await db.from("rental_agents").update({ must_change_password: false, auth_locked: false }).eq("id", agent.id).eq("security_version", agent.security_version + 1).select("id").single();
    if (updated.error) throw updated.error;
    await db.from("agent_sessions").delete().eq("agent_id", agent.id);
    return issueAgentSession(agent.id, agent.security_version + 1);
  } catch { return json({ error: "Could not change password. Please sign in again or ask the admin to reset it." }, 400); }
}
