import Link from "next/link";

export default function NotFound() {
  return <section className="section bg-white">
    <div className="container-site text-center">
      <h1 className="text-4xl font-bold mb-4">Seite nicht verfügbar</h1>
      <p className="mb-6">Diese Seite ist in der privaten deutschen Vorschau nicht verfügbar.</p>
      <Link href="/internal/localization/de" className="btn btn-primary">Zur Vorschau</Link>
    </div>
  </section>;
}
