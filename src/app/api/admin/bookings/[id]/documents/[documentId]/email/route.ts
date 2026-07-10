import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { verifyAdmin, unauthorizedResponse } from "@/lib/admin-auth";
import {
  ensureCustomerDocumentAccess,
  getCustomerDocumentUrl,
  markCustomerDocumentSent,
  type BookingDocument,
} from "@/lib/booking-documents";
import { sendBookingDocumentLink } from "@/lib/email";

function documentLabel(type: string) {
  if (type === "refund_receipt") return "Refund receipt";
  if (type === "rental_agreement") return "Rental agreement";
  return "Invoice";
}

export async function POST(
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

    const documentWithAccess = await ensureCustomerDocumentAccess(
      supabase,
      document as BookingDocument
    );
    const documentUrl = getCustomerDocumentUrl(documentWithAccess);

    if (!documentWithAccess || !documentUrl) {
      return NextResponse.json({ error: "Could not create document link" }, { status: 500 });
    }

    const bookingRecord = booking as Record<string, unknown>;
    const product = bookingRecord.product as { name?: string | null } | null;
    const sent = await sendBookingDocumentLink({
      customerName: (bookingRecord.customer_name as string) || "there",
      customerEmail: bookingRecord.customer_email as string,
      bookingRef: bookingRecord.booking_ref as string,
      productName: product?.name || "Rental equipment",
      documentLabel: documentLabel(documentWithAccess.document_type),
      documentNumber: documentWithAccess.document_number,
      documentUrl,
    });

    if (!sent) {
      return NextResponse.json({ error: "Failed to send document email" }, { status: 500 });
    }

    await markCustomerDocumentSent(supabase, documentWithAccess.id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[admin/bookings/documents/email] POST error:", err);
    return NextResponse.json({ error: "Failed to email booking document" }, { status: 500 });
  }
}
