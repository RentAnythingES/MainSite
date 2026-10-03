import { customerTokenPath } from "@/i18n/customer-path";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import RentalReviewPage from "@/components/RentalReviewPage";
import { privateQuoteLocale } from "@/lib/private-quote-locale";
export const metadata: Metadata = { title: "Share Rental Feedback", robots: { index: false, follow: false, nocache: true } };
export default async function ReviewPage({params}: {params: Promise<{token: string}>}) {
  const {token} = await params;
  const locale = await privateQuoteLocale("review", token);
  if (locale === "de") redirect(customerTokenPath("de", `/review/${token}`));
  return <RentalReviewPage token={token} locale={locale ?? "en"} />;
}
