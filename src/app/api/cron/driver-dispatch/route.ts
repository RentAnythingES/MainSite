import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { createAdminClient } from "@/lib/supabase-admin";
import { runDriverDispatch } from "@/lib/driver-dispatch";
import { recordSystemIncident } from "@/lib/system-incidents";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const authorization = request.headers.get("authorization") || "";
  if (!authorization.startsWith("Bearer ") || authorization.length < 16) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createAdminClient();
  const { data: authorized, error: authError } = await supabase.rpc("verify_driver_dispatch_token", {
    p_token_hash: createHash("sha256").update(authorization.slice(7)).digest("hex"),
  });
  if (authError) return NextResponse.json({ error: "Scheduler authentication unavailable" }, { status: 503 });
  if (!authorized) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const result = await runDriverDispatch(supabase);
    if (result.errors.length) {
      await recordSystemIncident({ source: "driver_dispatch", eventType: "dispatch_failed", message: result.errors.join("; ") });
    }
    return NextResponse.json(result, { status: result.errors.length ? 500 : 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await recordSystemIncident({ source: "driver_dispatch", eventType: "dispatch_failed", message });
    return NextResponse.json({ error: "Driver dispatch failed" }, { status: 500 });
  }
}
