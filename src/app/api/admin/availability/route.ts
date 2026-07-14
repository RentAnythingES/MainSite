import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";

type AvailabilityBody = {
  action?: string;
  productId?: string;
  productIds?: string[];
  dates?: string[];
  startDate?: string;
  endDate?: string;
  reason?: string;
};

function getErrorMessage(err: unknown) {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message: unknown }).message);
  }
  return "Unknown error";
}

function isDateOnly(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function buildDateRange(startDate: string, endDate: string) {
  if (!isDateOnly(startDate) || !isDateOnly(endDate)) {
    throw new Error("Dates must use YYYY-MM-DD format");
  }

  const start = new Date(`${startDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    throw new Error("End date must be the same as or after start date");
  }

  const dates: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

function resolveDates(body: AvailabilityBody) {
  if (body.startDate && body.endDate) {
    return buildDateRange(body.startDate, body.endDate);
  }

  if (body.dates && Array.isArray(body.dates) && body.dates.length > 0) {
    if (body.dates.some((date) => typeof date !== "string" || !isDateOnly(date))) {
      throw new Error("Dates must use YYYY-MM-DD format");
    }
    return [...new Set(body.dates)].sort();
  }

  throw new Error("Missing dates or startDate/endDate");
}

async function resolveProductIds(
  supabase: ReturnType<typeof createAdminClient>,
  body: AvailabilityBody
) {
  if (body.productIds && Array.isArray(body.productIds) && body.productIds.length > 0) {
    return [...new Set(body.productIds)];
  }

  if (body.productId === "all") {
    const { data, error } = await supabase
      .from("products")
      .select("id")
      .eq("is_active", true);

    if (error) throw error;
    return (data || []).map((product: { id: string }) => product.id);
  }

  if (body.productId) return [body.productId];

  throw new Error("Missing productId or productIds");
}

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

  const today = new Date().toISOString().slice(0, 10);
  const [productResult, legacyResult] = await Promise.all([
    supabase.from("products").select("stock_total,stock_available").eq("id", productId).single(),
    supabase.from("blocked_dates").select("id", { count: "exact", head: true }).eq("product_id", productId).eq("reason", "booking").gte("blocked_date", today),
  ]);
  return NextResponse.json({ blockedDates: data, bookings, productState: productResult.data, futureLegacyBookingDates: legacyResult.count || 0 });
}

export async function PUT(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();
  const body = await request.json() as AvailabilityBody;
  if (body.action !== "restore_online_availability" || !body.productId || body.productId === "all") return NextResponse.json({ error: "Invalid availability action" }, { status: 400 });
  const supabase = createAdminClient();
  const now = new Date().toISOString();
  const [product, drafts, blocks, bookings] = await Promise.all([
    supabase.from("products").select("id,stock_total").eq("id", body.productId).single(),
    supabase.from("booking_drafts").select("id", { count: "exact", head: true }).eq("product_id", body.productId).in("status", ["draft", "checkout_created"]).gt("expires_at", now),
    supabase.from("booking_inventory_blocks").select("id", { count: "exact", head: true }).eq("product_id", body.productId).gt("ends_at", now),
    supabase.from("bookings").select("id", { count: "exact", head: true }).eq("product_id", body.productId).in("status", ["pending", "confirmed", "paid", "delivering", "active", "returning"]),
  ]);
  if (product.error) return NextResponse.json({ error: "Product not found" }, { status: 404 });
  if (drafts.error || blocks.error || bookings.error) return NextResponse.json({ error: "Could not verify booking safety" }, { status: 500 });
  if (drafts.count || blocks.count || bookings.count) return NextResponse.json({ error: "Cannot restore availability while active bookings or holds exist" }, { status: 409 });
  const { count, error: deleteError } = await supabase.from("blocked_dates").delete({ count: "exact" }).eq("product_id", body.productId).eq("reason", "booking").is("booking_id", null);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });
  const { error: stockError } = await supabase.from("products").update({ stock_available: product.data.stock_total }).eq("id", body.productId);
  if (stockError) return NextResponse.json({ error: stockError.message }, { status: 500 });
  return NextResponse.json({ success: true, stockAvailable: product.data.stock_total, deletedLegacyDates: count || 0 });
}

export async function POST(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json() as AvailabilityBody;
    const supabase = createAdminClient();
    const validReason = body.reason === "maintenance" ? "maintenance" : "manual";
    const [productIds, dates] = await Promise.all([
      resolveProductIds(supabase, body),
      Promise.resolve(resolveDates(body)),
    ]);

    if (productIds.length === 0 || dates.length === 0) {
      return NextResponse.json({ error: "No products or dates selected" }, { status: 400 });
    }

    // Upsert: insert dates, ignore duplicates
    const { data, error } = await supabase
      .from("blocked_dates")
      .upsert(
        productIds.flatMap((productId) =>
          dates.map((date) => ({
            product_id: productId,
            blocked_date: date,
            reason: validReason,
            booking_id: null,
          }))
        ),
        { onConflict: "product_id,blocked_date", ignoreDuplicates: true }
      )
      .select();

    if (error) {
      console.error("[admin/availability] POST error:", error);
      return NextResponse.json(
        { error: `Failed to block dates: ${getErrorMessage(error)}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      blocked: data?.length || 0,
      productCount: productIds.length,
      dateCount: dates.length,
    });
  } catch (err) {
    console.error("[admin/availability] POST error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  try {
    const body = await request.json() as AvailabilityBody;
    const supabase = createAdminClient();
    const [productIds, dates] = await Promise.all([
      resolveProductIds(supabase, body),
      Promise.resolve(resolveDates(body)),
    ]);

    if (productIds.length === 0 || dates.length === 0) {
      return NextResponse.json({ error: "No products or dates selected" }, { status: 400 });
    }

    // Only delete manual/maintenance blocks — never delete booking-linked blocks
    const { error } = await supabase
      .from("blocked_dates")
      .delete()
      .in("product_id", productIds)
      .in("blocked_date", dates)
      .is("booking_id", null); // Safety: only unlink manual blocks

    if (error) {
      console.error("[admin/availability] DELETE error:", error);
      return NextResponse.json(
        { error: `Failed to unblock dates: ${getErrorMessage(error)}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, productCount: productIds.length, dateCount: dates.length });
  } catch (err) {
    console.error("[admin/availability] DELETE error:", err);
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 });
  }
}
