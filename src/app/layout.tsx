import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
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
    default: "Rent Baby Gear, Mobility & Tech in Valencia | RentAnything.es",
    template: "%s | RentAnything.es",
  },
  description:
    "Short-term rental of strollers, cribs, wheelchairs, mobility scooters, remote work gear & more. Delivered to your accommodation in Valencia. Book today!",
  keywords: [
    "rental Valencia",
    "stroller rental Valencia",
    "wheelchair rental Valencia",
    "baby gear rental Spain",
    "mobility scooter rental Valencia",
    "remote work equipment Valencia",
  ],
  metadataBase: new URL("https://rentanything.es"),
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_ES",
    siteName: "RentAnything.es",
    title: "Rent Baby Gear, Mobility & Tech in Valencia | RentAnything.es",
    description:
      "Short-term rental of strollers, cribs, wheelchairs, mobility scooters, remote work gear & more. Delivered to your accommodation in Valencia.",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://rentanything.es",
    languages: {
      en: "https://rentanything.es",
      es: "https://rentanything.es/es",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
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
