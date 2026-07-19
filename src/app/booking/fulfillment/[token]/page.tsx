import type { Metadata } from "next";
import FulfillmentAmendmentPage from "@/components/FulfillmentAmendmentPage";

export const metadata: Metadata = {
  title: "Transport Quote | RentAnything.es",
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
  return <FulfillmentAmendmentPage token={token} paymentReturning={payment === "success"} />;
}
