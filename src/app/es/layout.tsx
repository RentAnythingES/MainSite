import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Alquiler de Cochecitos, Sillas de Ruedas y Equipos en Valencia | RentAnything.es",
    template: "%s | RentAnything.es",
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
  metadataBase: new URL("https://rentanything.es"),
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: "en_US",
    siteName: "RentAnything.es",
    title: "Alquiler de Cochecitos, Sillas de Ruedas y Equipos en Valencia | RentAnything.es",
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

export default function SpanishLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
