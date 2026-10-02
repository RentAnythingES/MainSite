import type { Metadata } from "next";
import { notFound } from "next/navigation";
import FulfillmentAmendmentPage from "@/components/FulfillmentAmendmentPage";
import { privateQuoteLocale } from "@/lib/private-quote-locale";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";

export const metadata: Metadata = { title: "Dein Transportangebot | Rent&Roll" };

export default async function GermanAmendmentRoute({ params, searchParams }: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ payment?: string }>;
}) {
  if (!privateGermanPreviewEnabled()) notFound();
  const { token } = await params;
  if (await privateQuoteLocale("amendment", token) !== "de") notFound();
  const { payment } = await searchParams;
  return <FulfillmentAmendmentPage token={token} paymentReturning={payment === "success"} initialLocale="de" />;
}
