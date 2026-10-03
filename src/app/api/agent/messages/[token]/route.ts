import { customerConversationAccess } from "@/lib/customer-conversation-access";
import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { field, json, limited, sameOrigin, uuid } from "@/lib/agent-auth";

type Context = { params: Promise<{ token: string }> };
export async function GET(request: NextRequest, context: Context) {
  try {
    if (await limited(request, "agent-thread-read", 120)) return json({ error: "Try again later." }, 429);
    const assignment = await customerConversationAccess((await context.params).token);
    if (!assignment) return json({ error: "This conversation is no longer available. Please contact Rentandroll." }, 404);
    const { data, error } = await createAdminClient().from("agent_messages").select("id,direction,body,created_at").eq("booking_id", assignment.booking_id).eq("agent_id", assignment.agent_id).in("status", ["sent", "received"]).order("created_at").limit(500);
    if (error) throw error;
    return json({ messages: data, locale: assignment.locale });
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
