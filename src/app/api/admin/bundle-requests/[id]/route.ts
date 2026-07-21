import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import {
  cleanBundleRequestText,
  isBundleRequestStatus,
  isMissingBundleRequestsTable,
  type BundleRequestStatus,
} from "@/lib/bundle-requests";
import { createAdminClient } from "@/lib/supabase-admin";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "Invalid request ID" }, { status: 400 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || !isBundleRequestStatus(body.status)) {
    return NextResponse.json({ error: "Choose a valid status" }, { status: 400 });
  }

  const now = new Date().toISOString();
  const lifecycleTimestamps: Partial<Record<BundleRequestStatus, string>> = {
    contacted: "contacted_at",
    quoted: "quoted_at",
    converted: "converted_at",
    closed: "closed_at",
  };
  const lifecycleTimestamp = lifecycleTimestamps[body.status];
  const updates: Record<string, unknown> = {
    status: body.status,
    admin_notes: cleanBundleRequestText(body.adminNotes, 2000),
    updated_at: now,
  };
  if (lifecycleTimestamp) updates[lifecycleTimestamp] = now;

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("bundle_requests")
    .update(updates)
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (isMissingBundleRequestsTable(error)) {
    return NextResponse.json({ error: "Apply the bundle requests migration first" }, { status: 503 });
  }
  if (error) {
    console.error("[admin/bundle-requests] PATCH failed", error);
    return NextResponse.json({ error: "Failed to update kit request" }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Kit request not found" }, { status: 404 });

  return NextResponse.json({ request: data });
}
