import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import {
  cleanInquiryDate,
  cleanInquiryText,
  isInquiryLanguage,
  isInquiryLossReason,
  isInquirySource,
  isInquiryStatus,
  isMissingMobilityInquiriesTable,
} from "@/lib/mobility-inquiries";
import { createAdminClient } from "@/lib/supabase-admin";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const status = new URL(request.url).searchParams.get("status");
  const supabase = createAdminClient();
  let query = supabase.from("mobility_inquiries").select("*").order("created_at", { ascending: false });

  if (status && status !== "all") {
    if (!isInquiryStatus(status)) return NextResponse.json({ error: "Invalid inquiry status" }, { status: 400 });
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (isMissingMobilityInquiriesTable(error)) {
    return NextResponse.json({ error: "Apply the mobility inquiries migration first" }, { status: 503 });
  }
  if (error) {
    console.error("[admin/mobility-inquiries] GET failed", error);
    return NextResponse.json({ error: "Failed to load mobility inquiries" }, { status: 500 });
  }

  return NextResponse.json({ inquiries: data || [] }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid inquiry" }, { status: 400 });

  const itemRequested = cleanInquiryText(body.itemRequested, 200);
  const language = body.language;
  const sourceChannel = body.sourceChannel;
  const status = body.status || "new";
  const lossReason = cleanInquiryText(body.lossReason, 40);
  const startDate = cleanInquiryDate(body.startDate);
  const endDate = cleanInquiryDate(body.endDate);

  if (!itemRequested) return NextResponse.json({ error: "Item requested is required" }, { status: 400 });
  if (!isInquiryLanguage(language)) return NextResponse.json({ error: "Choose a valid language" }, { status: 400 });
  if (!isInquirySource(sourceChannel)) return NextResponse.json({ error: "Choose a valid source" }, { status: 400 });
  if (!isInquiryStatus(status)) return NextResponse.json({ error: "Choose a valid status" }, { status: 400 });
  if (lossReason && !isInquiryLossReason(lossReason)) return NextResponse.json({ error: "Choose a valid loss reason" }, { status: 400 });
  if (status !== "lost" && lossReason) return NextResponse.json({ error: "Loss reason requires lost status" }, { status: 400 });
  if ((body.startDate && !startDate) || (body.endDate && !endDate)) return NextResponse.json({ error: "Use valid inquiry dates" }, { status: 400 });
  if (startDate && endDate && endDate <= startDate) return NextResponse.json({ error: "End date must be after start date" }, { status: 400 });

  const supabase = createAdminClient();
  const { data, error } = await supabase.from("mobility_inquiries").insert({
    item_requested: itemRequested,
    start_date: startDate,
    end_date: endDate,
    location: cleanInquiryText(body.location, 240),
    language,
    source_channel: sourceChannel,
    landing_page: cleanInquiryText(body.landingPage, 500),
    source_detail: cleanInquiryText(body.sourceDetail, 500),
    customer_name: cleanInquiryText(body.customerName, 120),
    customer_contact: cleanInquiryText(body.customerContact, 254),
    status,
    outcome: cleanInquiryText(body.outcome, 500),
    loss_reason: status === "lost" ? lossReason : null,
    admin_notes: cleanInquiryText(body.adminNotes, 2000),
    created_by: user.id,
  }).select("*").single();

  if (isMissingMobilityInquiriesTable(error)) {
    return NextResponse.json({ error: "Apply the mobility inquiries migration first" }, { status: 503 });
  }
  if (error) {
    console.error("[admin/mobility-inquiries] POST failed", error);
    return NextResponse.json({ error: "Failed to save mobility inquiry" }, { status: 500 });
  }

  return NextResponse.json({ inquiry: data }, { status: 201 });
}
