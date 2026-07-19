import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase-admin";
import { isMissingBookingReviewsTable } from "@/lib/booking-reviews";

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const status = new URL(request.url).searchParams.get("status");
  const supabase = createAdminClient();
  let query = supabase
    .from("booking_reviews")
    .select(`
      *,
      booking:bookings!inner (
        booking_ref,
        customer_name,
        customer_email,
        completed_at,
        product:products (name, slug)
      )
    `)
    .order("submitted_at", { ascending: false, nullsFirst: false });

  if (status && status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (isMissingBookingReviewsTable(error)) {
    return NextResponse.json({ error: "Apply the verified booking reviews migration first" }, { status: 503 });
  }
  if (error) {
    console.error("[admin/reviews] GET failed", error);
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }

  return NextResponse.json({ reviews: data || [] });
}
