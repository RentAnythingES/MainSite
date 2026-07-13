import { NextRequest, NextResponse } from "next/server";
import { unauthorizedResponse, verifyAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("system_incidents")
    .update({ resolved_at: new Date().toISOString(), resolved_by: user.id })
    .eq("id", id)
    .is("resolved_at", null)
    .select("id, resolved_at")
    .maybeSingle();

  if (error) {
    console.error("[admin/incidents] Failed to resolve incident:", error);
    return NextResponse.json({ error: "Failed to resolve incident" }, { status: 500 });
  }

  if (!data) return NextResponse.json({ error: "Incident not found or already resolved" }, { status: 404 });
  return NextResponse.json({ incident: data });
}
