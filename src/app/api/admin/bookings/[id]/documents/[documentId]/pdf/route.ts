import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import { buildBookingDocumentPdf } from "@/lib/document-pdf";
import type { BookingDocument } from "@/lib/booking-documents";

const safeFilename = (value: string) => value.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; documentId: string }> }
) {
  const user = await verifyAdmin(request);
  if (!user) return unauthorizedResponse();

  const { id, documentId } = await params;

  try {
    const supabase = createAdminClient();

    const { data: document, error: documentError } = await supabase
      .from("booking_documents")
      .select("*")
      .eq("id", documentId)
      .eq("booking_id", id)
      .single();

    if (documentError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .select("*, product:products (name, brand)")
      .eq("id", id)
      .single();

    if (bookingError || !booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const pdf = buildBookingDocumentPdf(
      document as BookingDocument,
      booking as Record<string, unknown>
    );
    const documentNumber = (document as { document_number?: string | null }).document_number || "document";
    const filename = `${safeFilename(documentNumber)}.pdf`;
    const body = new ArrayBuffer(pdf.byteLength);
    new Uint8Array(body).set(pdf);

    return new NextResponse(body, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("[admin/bookings/documents/pdf] GET error:", err);
    return NextResponse.json({ error: "Failed to generate document PDF" }, { status: 500 });
  }
}
