import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id } = await params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const status = body?.status;
  const moderationNotes = typeof body?.moderationNotes === "string"
    ? body.moderationNotes.trim().slice(0, 1000) || null
    : null;

  if (status !== "approved" && status !== "rejected") {
    return NextResponse.json({ error: "Choose approved or rejected" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { data: review, error: fetchError } = await supabase
    .from("booking_reviews")
    .select("id,status,rating,review_body,consent_to_publish")
    .eq("id", id)
    .single();

  if (fetchError || !review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }
  if (review.status === "invited") {
    return NextResponse.json({ error: "Feedback has not been submitted" }, { status: 409 });
  }
  if (status === "approved" && !review.consent_to_publish) {
    return NextResponse.json({ error: "The customer did not consent to public display" }, { status: 409 });
  }
  if (status === "approved" && (!review.rating || !review.review_body)) {
    return NextResponse.json({ error: "Incomplete feedback cannot be approved" }, { status: 409 });
  }

  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("booking_reviews")
    .update({
      status,
      moderation_notes: moderationNotes,
      moderated_at: now,
      moderated_by: user.id,
      published_at: status === "approved" ? now : null,
      updated_at: now,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("[admin/reviews] moderation failed", error);
    return NextResponse.json({ error: "Could not update review" }, { status: 500 });
  }

  revalidatePath("/");
  revalidatePath("/es");

  return NextResponse.json({ review: data });
}
