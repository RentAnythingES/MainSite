import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { fetchBookingDocumentByCustomerToken } from "@/lib/booking-documents";
import { buildBookingDocumentPdf } from "@/lib/document-pdf";

const safeFilename = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  if (!token || token.length < 32) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  try {
    const supabase = createAdminClient();
    const { data: document } = await fetchBookingDocumentByCustomerToken(supabase, token);

    if (!document || document.status !== "issued") {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (
      document.customer_access_expires_at &&
      new Date(document.customer_access_expires_at).getTime() < Date.now()
    ) {
      return NextResponse.json({ error: "Document link expired" }, { status: 410 });
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*, product:products (name, brand)")
      .eq("id", document.booking_id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const pdf = buildBookingDocumentPdf(document, booking as Record<string, unknown>);
    const documentNumber = document.document_number || "document";
    const filename = `${safeFilename(documentNumber)}.pdf`;
    const body = new ArrayBuffer(pdf.byteLength);
    new Uint8Array(body).set(pdf);

    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (err) {
    console.error("[documents/pdf] GET error:", err);
    return NextResponse.json({ error: "Failed to generate document PDF" }, { status: 500 });
  }
}
