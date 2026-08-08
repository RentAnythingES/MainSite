import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import CookieConsent from "@/components/CookieConsent";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import { SITE_IDENTITY, SITE_URL } from "@/config/site";

const isProductionDeployment = process.env.VERCEL_ENV === "production";

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
    default: `Rent Equipment in Valencia | ${SITE_IDENTITY.brandName}`,
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
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "es_ES",
    siteName: SITE_IDENTITY.brandName,
    title: `Rent Equipment in Valencia | ${SITE_IDENTITY.brandName}`,
    description:
      "Short-term rental of strollers, cribs, wheelchairs, mobility scooters, remote work gear & more. Delivered to your accommodation in Valencia.",
    images: [
      {
        url: SITE_IDENTITY.socialImagePath,
        width: 1200,
        height: 630,
        alt: `${SITE_IDENTITY.brandName} equipment rental in Valencia`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [SITE_IDENTITY.socialImagePath],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png", sizes: "64x64" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
  robots: isProductionDeployment
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : {
        index: false,
        follow: false,
        nocache: true,
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.lang=location.pathname==='/es'||location.pathname.startsWith('/es/')?'es':'en'",
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <GoogleAnalytics />
        <WebVitalsReporter />
        <CookieConsent />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
