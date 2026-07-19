import { createServiceClient } from "@/lib/supabase";
import { isMissingBookingReviewsTable } from "@/lib/booking-reviews";

type PublishedReview = {
  id: string;
  rating: number;
  title: string | null;
  review_body: string;
  display_name: string | null;
  booking: { status: string; product: { name: string } | null };
};

export default async function VerifiedReviews({ locale }: { locale: "en" | "es" }) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("booking_reviews")
    .select(`
      id, rating, title, review_body, display_name, published_at,
      booking:bookings!inner (status, product:products (name))
    `)
    .eq("status", "approved")
    .eq("consent_to_publish", true)
    .eq("locale", locale)
    .eq("booking.status", "completed")
    .order("published_at", { ascending: false })
    .limit(6);

  if (error) {
    if (!isMissingBookingReviewsTable(error)) console.error("[reviews] Public review fetch failed", error);
    return null;
  }

  const reviews = (data || []) as unknown as PublishedReview[];
  if (reviews.length === 0) return null;

  const text = locale === "es"
    ? {
        badge: "Opiniones verificadas",
        title: "Experiencias de alquiler reales",
        intro: "Comentarios publicados con permiso del cliente después de una reserva completada.",
        verified: "Alquiler completado verificado",
        customer: "Cliente verificado",
      }
    : {
        badge: "Verified feedback",
        title: "Real rental experiences",
        intro: "Feedback published with customer permission after a completed booking.",
        verified: "Verified completed rental",
        customer: "Verified customer",
      };

  return (
    <section className="section bg-neutral-50" id="verified-reviews">
      <div className="container-site">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge badge-brand">{text.badge}</span>
          <h2 className="mt-3 text-3xl font-bold">{text.title}</h2>
          <p className="mt-3 text-neutral-600">{text.intro}</p>
        </div>
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <article key={review.id} className="card p-6">
              <div className="text-amber-500" aria-label={`${review.rating} out of 5 stars`}>
                {"★".repeat(review.rating)}<span className="text-neutral-200">{"★".repeat(5 - review.rating)}</span>
              </div>
              {review.title && <h3 className="mt-4 text-lg font-bold">{review.title}</h3>}
              <blockquote className="mt-3 leading-relaxed text-neutral-600">“{review.review_body}”</blockquote>
              <div className="mt-5 border-t border-neutral-200 pt-4">
                <p className="font-semibold text-neutral-900">{review.display_name || text.customer}</p>
                <p className="mt-1 text-xs text-neutral-500">{text.verified}{review.booking.product?.name ? ` · ${review.booking.product.name}` : ""}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
