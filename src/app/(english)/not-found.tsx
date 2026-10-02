import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section bg-gradient-to-br from-neutral-50 to-teal-50/20 flex-1 flex items-center">
      <div className="container-site text-center py-20">
        <span className="text-7xl block mb-6">🔍</span>
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          404
        </h1>
        <p className="text-xl text-neutral-600 mb-2">Page not found</p>
        <p className="text-neutral-500 mb-10 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/" className="btn btn-primary btn-lg">
            Back to Home
          </Link>
          <Link href="/valencia" className="btn btn-outline btn-lg">
            Browse Rentals
          </Link>
        </div>
      </div>
    </section>
  );
}
