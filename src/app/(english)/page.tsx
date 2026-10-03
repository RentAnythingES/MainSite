import type { Metadata } from "next";
import HomePageBody from "@/components/HomePageBody";

export const metadata: Metadata = {
  title: "Rent Equipment in Valencia | Rent&Roll",
  description:
    "Short-term rental of strollers, cribs, wheelchairs, mobility scooters, remote work gear and more in Valencia. Check availability for your dates.",
  alternates: {
    canonical: "https://rentandroll.com",
    languages: {
      en: "https://rentandroll.com",
      es: "https://rentandroll.com/es",
      "x-default": "https://rentandroll.com",
    },
  },
};

export default function HomePage() { return <HomePageBody locale="en" />; }
