import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Alquiler de Equipamiento en Valencia | RentAnything.es",
    template: "%s",
  },
  description:
    "Alquiler a corto plazo de cochecitos, cunas, sillas de ruedas, scooters de movilidad, equipos de teletrabajo y más. Entrega en tu alojamiento en Valencia.",
  keywords: [
    "alquiler Valencia",
    "alquiler cochecito Valencia",
    "alquiler silla de ruedas Valencia",
    "artículos bebé alquiler España",
    "alquiler scooter movilidad Valencia",
    "alquiler equipo teletrabajo Valencia",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: "en_US",
    siteName: "RentAnything.es",
    images: [
      {
        url: "/hero/valencia-1.webp",
        alt: "Alquiler y entrega de equipamiento de RentAnything.es en Valencia",
      },
    ],
    title: "Alquiler de Equipamiento en Valencia | RentAnything.es",
    description:
      "Alquiler a corto plazo de cochecitos, cunas, sillas de ruedas, scooters de movilidad, equipos de teletrabajo y más. Entrega en tu alojamiento en Valencia.",
  },
  alternates: {
    canonical: "https://rentanything.es/es",
    languages: {
      en: "https://rentanything.es",
      es: "https://rentanything.es/es",
    },
  },
};

/**
 * Spanish layout — metadata-only wrapper.
 * Header, Footer, fonts, and <html>/<body> are provided by the root layout (app/layout.tsx).
 * The Header/Footer auto-detect the /es/ prefix and switch labels accordingly.
 */
export default function SpanishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
