import type { Metadata } from "next";
import CookiesPageBody from "@/components/CookiesPageBody";
export const metadata: Metadata = {
  title: "Cookie Policy | Rent&Roll",
  description: "Which browser storage and third-party cookies Rent&Roll uses, when Google Analytics loads, and how to change your consent choice.",
  alternates: {
    canonical: "https://rentandroll.com/cookies",
    languages: {
      en: "https://rentandroll.com/cookies",
      es: "https://rentandroll.com/es/cookies",
      "x-default": "https://rentandroll.com/cookies",
    },
  },
};

export default function Page() { return <CookiesPageBody locale="en" />; }
