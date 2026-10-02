import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CustomBookingQuotePage from "@/components/CustomBookingQuotePage";
import { privateQuoteLocale } from "@/lib/private-quote-locale";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";

export const metadata: Metadata = { title: "Dein persönliches Mietangebot | Rent&Roll" };

export default async function GermanQuoteRoute({ params }: { params: Promise<{ token: string }> }) {
  if (!privateGermanPreviewEnabled()) notFound();
  const { token } = await params;
  if (await privateQuoteLocale("custom", token) !== "de") notFound();
  return <CustomBookingQuotePage token={token} initialLocale="de" />;
}
