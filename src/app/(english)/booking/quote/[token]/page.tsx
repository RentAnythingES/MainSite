import type { Metadata } from "next";
import CustomBookingQuotePage from "@/components/CustomBookingQuotePage";
import { privateQuoteLocale } from "@/lib/private-quote-locale";
import { redirect } from "next/navigation";
import { transactionPath } from "@/lib/transaction-path";

export const metadata: Metadata = {
  title: "Your Custom Rental Quote | Rent&Roll",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function CustomBookingQuoteRoute({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const locale = await privateQuoteLocale("custom", token);
  if (locale === "de") redirect(transactionPath(locale, `/booking/quote/${token}`));
  return <CustomBookingQuotePage token={token} initialLocale={locale ?? "en"} />;
}
