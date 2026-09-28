import type { Product } from "@/data/products";
import type { Locale } from "@/i18n/config";

export const editorialNoteLabels: Record<Locale, readonly string[]> = {
  en: [
    "What's included",
    "Good to know",
    "Delivery and setup",
    "Care and hygiene",
  ],
  es: [
    "Incluye",
    "Información útil",
    "Entrega y preparación",
    "Cuidado e higiene",
  ],
  de: [
    "Im Mietumfang enthalten",
    "Gut zu wissen",
    "Lieferung und Aufbau",
    "Pflege und Hygiene",
  ],
};

/** The same copy sections are used by public product pages and private review. */
export default function ProductEditorialNotes({
  product,
  locale,
}: {
  product: Pick<
    Product,
    "includesText" | "constraintsText" | "deliverySetupNote" | "careNote"
  >;
  locale: Locale;
}) {
  const values = [
    product.includesText,
    product.constraintsText,
    product.deliverySetupNote,
    product.careNote,
  ];
  if (!values.some(Boolean)) return null;
  return (
    <div lang={locale} className="grid sm:grid-cols-2 gap-4 mb-8">
      {values.map((value, index) =>
        value ? (
          <div
            key={index}
            className="rounded-xl bg-neutral-50 border border-border p-4"
          >
            <h2 className="font-bold text-sm text-neutral-800 mb-2">
              {editorialNoteLabels[locale][index]}
            </h2>
            <p className="text-sm text-neutral-600 whitespace-pre-line">
              {value}
            </p>
          </div>
        ) : null,
      )}
    </div>
  );
}
