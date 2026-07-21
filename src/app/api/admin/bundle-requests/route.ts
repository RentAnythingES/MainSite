import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { isBundleRequestStatus, isMissingBundleRequestsTable } from "@/lib/bundle-requests";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const status = new URL(request.url).searchParams.get("status");
  const supabase = createAdminClient();
  let query = supabase
    .from("bundle_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    if (!isBundleRequestStatus(status)) {
      return NextResponse.json({ error: "Invalid request status" }, { status: 400 });
    }
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (isMissingBundleRequestsTable(error)) {
    return NextResponse.json({ error: "Apply the bundle requests migration first" }, { status: 503 });
  }
  if (error) {
    console.error("[admin/bundle-requests] GET failed", error);
    return NextResponse.json({ error: "Failed to load kit requests" }, { status: 500 });
  }

  return NextResponse.json({ requests: data || [] }, { headers: { "Cache-Control": "no-store" } });
}
