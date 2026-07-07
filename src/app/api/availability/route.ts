import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { areOnlineBookingsPaused } from "@/lib/booking-mode";

/**
 * GET /api/availability?slug=compact-stroller&start=2026-07-01&end=2026-07-07
 * 
 * Returns availability info for a product in a date range.
 * Public endpoint (no auth required) — uses anon key with RLS.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!slug || !start || !end) {
    return NextResponse.json(
      { error: "Missing required params: slug, start, end" },
      { status: 400 }
    );
  }

  if (areOnlineBookingsPaused()) {
    return NextResponse.json({
      available: false,
      blockedDates: [],
      paused: true,
      slug,
      start,
      end,
    });
  }

  try {
    // Get product ID from slug
    const { data: product, error: productError } = await supabase
      .from("products")
      .select("id, stock_total, stock_available")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const productId = (product as { id: string }).id;
    const stockTotal = (product as { stock_total: number }).stock_total;

    // Get all blocked dates in range
    const { data: blockedRows, error: blockedError } = await supabase
      .from("blocked_dates")
      .select("blocked_date, reason")
      .eq("product_id", productId)
      .gte("blocked_date", start)
      .lte("blocked_date", end);

    if (blockedError) throw blockedError;

    const blockedDates = (blockedRows || []).map((r: { blocked_date: string }) => r.blocked_date);

    // Count how many unique bookings overlap each date
    // For single-stock items, any blocked date = unavailable
    // For multi-stock, we'd need to count concurrent bookings (future enhancement)
    const available = blockedDates.length === 0;

    return NextResponse.json({
      available,
      blockedDates,
      stockTotal,
      slug,
      start,
      end,
    });
  } catch (err) {
    console.error("[availability] Error:", err);
    return NextResponse.json(
      { error: "Failed to check availability" },
      { status: 500 }
    );
  }
}
