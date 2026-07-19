import type { Metadata } from "next";
import ReviewForm from "@/components/ReviewForm";

export const metadata: Metadata = {
  title: "Share Rental Feedback",
  description: "Private post-rental feedback form for a completed RentAnything.es booking.",
  robots: { index: false, follow: false, nocache: true },
};

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <section className="bg-gradient-to-br from-neutral-50 to-teal-50/30 py-12 md:py-20">
      <div className="container-site max-w-2xl">
        <div className="mb-8 text-center">
          <span className="badge badge-brand">Completed rental feedback</span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight">How did everything go?</h1>
          <p className="mt-3 text-neutral-600">Your feedback helps us improve equipment, handovers, and local support.</p>
        </div>
        <ReviewForm token={token} />
      </div>
    </section>
  );
}
