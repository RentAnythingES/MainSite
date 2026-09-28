import { createHash, randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { consumeRateLimits, getClientIp } from "@/lib/rate-limit";

export const AGENT_COOKIE = "rr-agent-session";
export const hashSession = (token: string) => createHash("sha256").update(token).digest("hex");
export const json = (data: unknown, status = 200) => NextResponse.json(data, { status, headers: { "Cache-Control": "no-store" } });
export function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  return !!origin && origin === new URL(request.url).origin;
}
export function field(value: unknown, max = 200, required = true): string {
  if (typeof value !== "string" || value.trim().length > max || (required && !value.trim())) throw new Error("Please complete all required fields within their length limits.");
  return value.trim();
}
export function emailField(value: unknown) {
  const email = field(value, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  return email;
}
export function uuid(value: unknown): string {
  if (typeof value !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw new Error("Invalid record identifier.");
  return value;
}
export async function limited(request: NextRequest, scope: string, limit: number, identifier?: string) {
  const result = await consumeRateLimits(createAdminClient(), [{ scope, identifier: identifier || getClientIp(request), limit, windowSeconds: 3600 }]);
  return !result.allowed;
}
export async function agentSession(request: NextRequest, operational = false) {
  const token = request.cookies.get(AGENT_COOKIE)?.value;
  if (!token) return null;
  const db = createAdminClient();
  const { data: session } = await db.from("agent_sessions").select("agent_id,security_version").eq("token_hash", hashSession(token)).gt("expires_at", new Date().toISOString()).maybeSingle();
  if (!session) return null;
  const { data: agent } = await db.from("rental_agents").select("*").eq("id", session.agent_id).eq("is_active", true).maybeSingle();
  if (!agent || agent.auth_locked || agent.security_version !== session.security_version || (operational && (agent.must_change_password || !agent.profile_completed_at))) return null;
  return agent;
}
export async function issueAgentSession(agentId: string, version: number) {
  const token = randomBytes(32).toString("hex");
  await createAdminClient().from("agent_sessions").delete().eq("agent_id", agentId).lt("expires_at", new Date().toISOString());
  const { error } = await createAdminClient().from("agent_sessions").insert({ token_hash: hashSession(token), agent_id: agentId, security_version: version, expires_at: new Date(Date.now() + 8 * 3600_000).toISOString() });
  if (error) throw new Error("Could not create a session.");
  const response = json({ ok: true });
  response.cookies.set(AGENT_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 8 * 3600 });
  return response;
}
