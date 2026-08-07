import type { Metadata } from "next";
import { SITE_IDENTITY, SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: {
    default: `Alquiler de Equipamiento en Valencia | ${SITE_IDENTITY.brandName}`,
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
    siteName: SITE_IDENTITY.brandName,
    images: [
      {
        url: SITE_IDENTITY.socialImagePath,
        width: 1200,
        height: 630,
        alt: `Alquiler y entrega de equipamiento de ${SITE_IDENTITY.brandName} en Valencia`,
      },
    ],
    title: `Alquiler de Equipamiento en Valencia | ${SITE_IDENTITY.brandName}`,
    description:
      "Alquiler a corto plazo de cochecitos, cunas, sillas de ruedas, scooters de movilidad, equipos de teletrabajo y más. Entrega en tu alojamiento en Valencia.",
  },
  alternates: {
    canonical: `${SITE_URL}/es`,
    languages: {
      en: SITE_URL,
      es: `${SITE_URL}/es`,
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
