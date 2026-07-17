import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";

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
    default: "Rent Equipment in Valencia | RentAnything.es",
    template: "%s",
  },
  description:
    "Short-term rental of strollers, cribs, wheelchairs, mobility scooters, remote work gear and more in Valencia. Check availability for your dates.",
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
    title: "Rent Equipment in Valencia | RentAnything.es",
    description:
      "Short-term rental of strollers, cribs, wheelchairs, mobility scooters, remote work gear & more. Delivered to your accommodation in Valencia.",
    images: [
      {
        url: "/hero/valencia-1.webp",
        alt: "RentAnything.es equipment rental delivery in Valencia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
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
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-page-locale") === "es" ? "es" : "en";

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <GoogleAnalytics />
        <CookieConsent />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
