import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { privateGermanPreviewEnabled } from "@/lib/localization-preview";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false, nocache: true } };

export default function GermanPreviewLayout({ children }: { children: React.ReactNode }) {
  if (!privateGermanPreviewEnabled()) notFound();
  return <div lang="de">
    <aside className="bg-amber-50 border-b border-amber-200">
      <div className="container-site py-3 text-sm">
        Private deutsche Vorschau · Alle Texte sind Entwürfe und noch nicht freigegeben. Nur lokale Testdaten verwenden.
      </div>
    </aside>
    {children}
    <nav className="container-site py-6 flex flex-wrap gap-5" aria-label="Informationen und Kontakt">
      {[["valencia/kits", "Mietpakete"], ["contact", "Kontakt"], ["how-it-works", "So funktioniert’s"], ["faq", "Häufige Fragen"], ["about", "Über uns"], ["privacy", "Datenschutz"], ["cookies", "Cookies"], ["terms", "Mietbedingungen"], ["refunds", "Erstattungen und Stornierungen"]].map(([path, title]) =>
        <Link className="text-brand underline" key={path} href={`/internal/localization/de/${path}`}>{title}</Link>)}
    </nav>
  </div>;
}
