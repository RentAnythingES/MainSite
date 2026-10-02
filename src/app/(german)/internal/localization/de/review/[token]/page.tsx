import { notFound } from "next/navigation";
import RentalReviewPage from "@/components/RentalReviewPage";
import { privateQuoteLocale } from "@/lib/private-quote-locale";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";
export const metadata = { title: "Dein Feedback | Rent&Roll" };
export default async function Page({params}: {params: Promise<{token: string}>}) {
  if (!privateGermanPreviewEnabled()) notFound();
  const {token} = await params;
  if (await privateQuoteLocale("review", token) !== "de") notFound();
  return <RentalReviewPage token={token} locale="de" />;
}
