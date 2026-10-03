import { reviewCopy } from "@/i18n/review";
import type { Locale } from "@/i18n/config";
import ReviewForm from "@/components/ReviewForm";

export default function RentalReviewPage({token, locale}: {token: string; locale: Locale}) {
  const t = reviewCopy[locale];
  return <section className="bg-gradient-to-br from-neutral-50 to-teal-50/30 py-12 md:py-20">
    <div className="container-site max-w-2xl">
      <div className="mb-8 text-center">
        <span className="badge badge-brand">{t.completed}</span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight">{t.heading}</h1>
        <p className="mt-3 text-neutral-600">{t.intro}</p>
      </div>
      <ReviewForm token={token} initialLocale={locale} />
    </div>
  </section>;
}
