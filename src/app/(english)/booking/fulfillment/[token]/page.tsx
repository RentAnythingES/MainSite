import type { Metadata } from "next";
import FulfillmentAmendmentPage from "@/components/FulfillmentAmendmentPage";
import { privateQuoteLocale } from "@/lib/private-quote-locale";
import { redirect } from "next/navigation";
import { transactionPath } from "@/lib/transaction-path";

export const metadata: Metadata = {
  title: "Transport Quote | Rent&Roll",
  robots: { index: false, follow: false, noarchive: true },
};

export default async function FulfillmentAmendmentRoute({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  const { token } = await params;
  const { payment } = await searchParams;
  const locale = await privateQuoteLocale("amendment", token);
  if (locale === "de") {
    const query = payment ? `?${new URLSearchParams({ payment })}` : "";
    redirect(`${transactionPath(locale, `/booking/fulfillment/${token}`)}${query}`);
  }
  return <FulfillmentAmendmentPage token={token} paymentReturning={payment === "success"} initialLocale={locale ?? "en"} />;
}
