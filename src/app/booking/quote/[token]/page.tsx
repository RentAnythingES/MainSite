import type { Metadata } from "next";
import CustomBookingQuotePage from "@/components/CustomBookingQuotePage";

export const metadata: Metadata = {
  title: "Your Custom Rental Quote | RentAnything.es",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function CustomBookingQuoteRoute({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <CustomBookingQuotePage token={token} />;
}
