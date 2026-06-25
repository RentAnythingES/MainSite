import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";

/**
 * GET /api/admin/availability?product_id=xxx&month=2026-07
 * Returns all blocked dates for a product in a given month.
 *
 * POST /api/admin/availability
 * Manually block dates for a product.
 * Body: { productId, dates: ["2026-07-01", ...], reason: "maintenance" | "manual" }
 *
 * DELETE /api/admin/availability
 * Remove manual blocks.
 * Body: { productId, dates: ["2026-07-01", ...] }
 */

export async function GET(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("product_id");
  const month = searchParams.get("month"); // e.g. "2026-07"

  if (!productId) {
    return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Build date range for the month (or all if no month specified)
  let query = supabase
    .from("blocked_dates")
    .select("id, blocked_date, reason, booking_id")
    .eq("product_id", productId)
    .order("blocked_date", { ascending: true });

  if (month) {
    const start = `${month}-01`;
    // Get last day of month
    const [y, m] = month.split("-").map(Number);
    const lastDay = new Date(y, m, 0).getDate();
    const end = `${month}-${String(lastDay).padStart(2, "0")}`;
    query = query.gte("blocked_date", start).lte("blocked_date", end);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[admin/availability] GET error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  // Also fetch bookings that overlap to show booking details
  const bookingIds = [...new Set((data || [])
    .filter((d: { booking_id: string | null }) => d.booking_id)
    .map((d: { booking_id: string | null }) => d.booking_id as string))];

  let bookings: Record<string, { booking_ref: string; customer_name: string; status: string }> = {};

  if (bookingIds.length > 0) {
    const { data: bookingRows } = await supabase
      .from("bookings")
      .select("id, booking_ref, customer_name, status")
      .in("id", bookingIds);

    if (bookingRows) {
      bookings = Object.fromEntries(
        bookingRows.map((b: { id: string; booking_ref: string; customer_name: string; status: string }) => [
          b.id,
          { booking_ref: b.booking_ref, customer_name: b.customer_name, status: b.status },
        ])
      );
    }
  }

  return NextResponse.json({ blockedDates: data, bookings });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const { productId, dates, reason } = await request.json();

    if (!productId || !dates || !Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json({ error: "Missing productId or dates" }, { status: 400 });
    }

    const validReason = reason === "maintenance" ? "maintenance" : "manual";

    const supabase = createAdminClient();

    // Upsert: insert dates, ignore duplicates
    const { data, error } = await supabase
      .from("blocked_dates")
      .upsert(
        dates.map((d: string) => ({
          product_id: productId,
          blocked_date: d,
          reason: validReason,
          booking_id: null,
        })),
        { onConflict: "product_id,blocked_date", ignoreDuplicates: true }
      )
      .select();

    if (error) {
      console.error("[admin/availability] POST error:", error);
      return NextResponse.json({ error: "Failed to block dates" }, { status: 500 });
    }

    return NextResponse.json({ success: true, blocked: data?.length || 0 });
  } catch (err) {
    console.error("[admin/availability] POST error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const { productId, dates } = await request.json();

    if (!productId || !dates || !Array.isArray(dates) || dates.length === 0) {
      return NextResponse.json({ error: "Missing productId or dates" }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Only delete manual/maintenance blocks — never delete booking-linked blocks
    const { error } = await supabase
      .from("blocked_dates")
      .delete()
      .eq("product_id", productId)
      .in("blocked_date", dates)
      .is("booking_id", null); // Safety: only unlink manual blocks

    if (error) {
      console.error("[admin/availability] DELETE error:", error);
      return NextResponse.json({ error: "Failed to unblock dates" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/availability] DELETE error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
