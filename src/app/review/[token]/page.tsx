import { reviewCopy } from "@/i18n/review";
import { isLocale } from "@/i18n/config";
import type { Metadata } from "next";
import ReviewForm from "@/components/ReviewForm";

export const metadata: Metadata = {
  title: "Share Rental Feedback",
  description: "Private post-rental feedback form for a completed Rent&Roll booking.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ReviewPage({
  params, searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{locale?: string}>;
}) {
  const { token } = await params;
  const query = await searchParams;
  const locale = isLocale(query.locale) ? query.locale : "en";
  const t = reviewCopy[locale];

  return (
    <section className="bg-gradient-to-br from-neutral-50 to-teal-50/30 py-12 md:py-20">
      <div className="container-site max-w-2xl">
        <div className="mb-8 text-center">
          <span className="badge badge-brand">{t.completed}</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">{t.heading}</h1>
          <p className="mt-3 text-neutral-600">{t.intro}</p>
        </div>
        <ReviewForm token={token} initialLocale={locale} />
      </div>
    </section>
  );
}
