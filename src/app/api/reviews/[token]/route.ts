import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";
import { isMissingBookingReviewsTable } from "@/lib/booking-reviews";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function cleanText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\s+/g, " ");
  return cleaned ? cleaned.slice(0, maxLength) : null;
}

async function findReview(token: string) {
  const supabase = createServiceClient();
  return supabase
    .from("booking_reviews")
    .select(`
      id,
      booking_id,
      status,
      rating,
      consent_to_publish,
      booking:bookings!inner (
        status,
        product:products (name, slug)
      )
    `)
    .eq("public_token", token)
    .maybeSingle();
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!UUID_PATTERN.test(token)) {
    return NextResponse.json({ error: "Feedback link not found" }, { status: 404 });
  }

  const { data, error } = await findReview(token);
  if (isMissingBookingReviewsTable(error)) {
    return NextResponse.json({ error: "Feedback is not available yet" }, { status: 503 });
  }
  if (error || !data) {
    return NextResponse.json({ error: "Feedback link not found" }, { status: 404 });
  }

  const booking = data.booking as unknown as {
    status?: string;
    product?: { name?: string; slug?: string } | null;
  };
  if (booking?.status !== "completed") {
    return NextResponse.json({ error: "This rental is not complete yet" }, { status: 409 });
  }

  return NextResponse.json(
    {
      productName: booking.product?.name || "Rental equipment",
      productSlug: booking.product?.slug || null,
      submitted: data.status !== "invited",
      rating: data.rating,
      consentToPublish: data.consent_to_publish,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  if (!UUID_PATTERN.test(token)) {
    return NextResponse.json({ error: "Feedback link not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const rating = Number(body?.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Choose a rating from 1 to 5" }, { status: 400 });
  }

  const title = cleanText(body?.title, 120);
  const reviewBody = cleanText(body?.reviewBody, 2000);
  const displayName = cleanText(body?.displayName, 80);
  const consentToPublish = body?.consentToPublish === true;

  if (!reviewBody || reviewBody.length < 10) {
    return NextResponse.json({ error: "Please add at least 10 characters of feedback" }, { status: 400 });
  }

  const { data: review, error: reviewError } = await findReview(token);
  if (isMissingBookingReviewsTable(reviewError)) {
    return NextResponse.json({ error: "Feedback is not available yet" }, { status: 503 });
  }
  if (reviewError || !review) {
    return NextResponse.json({ error: "Feedback link not found" }, { status: 404 });
  }

  const booking = review.booking as unknown as { status?: string };
  if (booking?.status !== "completed") {
    return NextResponse.json({ error: "This rental is not complete yet" }, { status: 409 });
  }
  if (review.status !== "invited") {
    return NextResponse.json({ error: "Feedback has already been submitted" }, { status: 409 });
  }

  const now = new Date().toISOString();
  const supabase = createServiceClient();
  const { data: updatedReview, error: updateError } = await supabase
    .from("booking_reviews")
    .update({
      rating,
      title,
      review_body: reviewBody,
      display_name: displayName,
      consent_to_publish: consentToPublish,
      status: "submitted",
      submitted_at: now,
      updated_at: now,
    })
    .eq("id", review.id)
    .eq("status", "invited")
    .select("id")
    .maybeSingle();

  if (updateError) {
    console.error("[reviews] Feedback submission failed", updateError);
    return NextResponse.json({ error: "Could not save feedback" }, { status: 500 });
  }

  if (!updatedReview) {
    return NextResponse.json({ error: "Feedback has already been submitted" }, { status: 409 });
  }

  return NextResponse.json({ submitted: true });
}
