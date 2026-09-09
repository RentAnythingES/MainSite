import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import {
  cleanInquiryText,
  isInquiryLossReason,
  isInquiryStatus,
  isMissingMobilityInquiriesTable,
} from "@/lib/mobility-inquiries";
import { createAdminClient } from "@/lib/supabase-admin";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;
  if (!UUID_PATTERN.test(id)) return NextResponse.json({ error: "Invalid inquiry ID" }, { status: 400 });

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body || !isInquiryStatus(body.status)) {
    return NextResponse.json({ error: "Choose a valid status" }, { status: 400 });
  }

  const lossReason = cleanInquiryText(body.lossReason, 40);
  if (lossReason && !isInquiryLossReason(lossReason)) {
    return NextResponse.json({ error: "Choose a valid loss reason" }, { status: 400 });
  }
  if (body.status === "lost" && !lossReason) {
    return NextResponse.json({ error: "Record why this inquiry was lost" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("mobility_inquiries").update({
    status: body.status,
    outcome: cleanInquiryText(body.outcome, 500),
    loss_reason: body.status === "lost" ? lossReason : null,
    admin_notes: cleanInquiryText(body.adminNotes, 2000),
    updated_at: new Date().toISOString(),
  }).eq("id", id).select("*").maybeSingle();

  if (isMissingMobilityInquiriesTable(error)) {
    return NextResponse.json({ error: "Apply the mobility inquiries migration first" }, { status: 503 });
  }
  if (error) {
    console.error("[admin/mobility-inquiries] PATCH failed", error);
    return NextResponse.json({ error: "Failed to update mobility inquiry" }, { status: 500 });
  }
  if (!data) return NextResponse.json({ error: "Mobility inquiry not found" }, { status: 404 });

  return NextResponse.json({ inquiry: data });
}
