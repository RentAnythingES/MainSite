import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { runDriverDispatch } from "@/lib/driver-dispatch";
import { recordSystemIncident } from "@/lib/system-incidents";

export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const result = await runDriverDispatch(createAdminClient());
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
