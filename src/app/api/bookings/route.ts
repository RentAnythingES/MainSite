import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      productId,
      customerName,
      customerEmail,
      customerPhone,
      startDate,
      endDate,
      rentalDays,
      perDayCents,
      subtotalCents,
      deliveryFeeCents,
      totalCents,
      deliveryType,
      deliveryAddress,
      deliveryNotes,
    } = body;

    // Validate required fields
    if (!productId || !customerName || !customerEmail || !startDate || !endDate || !deliveryAddress) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createServiceClient();

    // Check availability
    const { data: blocked } = await supabase
      .from("blocked_dates")
      .select("blocked_date")
      .eq("product_id", productId)
      .gte("blocked_date", startDate)
      .lte("blocked_date", endDate);

    if (blocked && blocked.length > 0) {
      return NextResponse.json(
        { error: "Product not available for selected dates", blockedDates: blocked },
        { status: 409 }
      );
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        product_id: productId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone || null,
        customer_whatsapp: customerPhone || null,
        start_date: startDate,
        end_date: endDate,
        rental_days: rentalDays,
        per_day_cents: perDayCents,
        subtotal_cents: subtotalCents,
        delivery_fee_cents: deliveryFeeCents || 0,
        total_cents: totalCents,
        delivery_type: deliveryType || "standard",
        delivery_address: deliveryAddress,
        delivery_city: "valencia",
        delivery_notes: deliveryNotes || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Booking creation failed:", error);
      return NextResponse.json(
        { error: "Failed to create booking" },
        { status: 500 }
      );
    }

    // Block dates for this product
    const dates: string[] = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    while (current < end) {
      dates.push(current.toISOString().split("T")[0]);
      current.setDate(current.getDate() + 1);
    }

    if (dates.length > 0) {
      await supabase.from("blocked_dates").insert(
        dates.map((d) => ({
          product_id: productId,
          blocked_date: d,
          reason: "booking",
          booking_id: (booking as { id: string }).id,
        }))
      );
    }

    return NextResponse.json({
      success: true,
      bookingRef: (booking as { booking_ref: string }).booking_ref,
      bookingId: (booking as { id: string }).id,
    });
  } catch (err) {
    console.error("Booking API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
