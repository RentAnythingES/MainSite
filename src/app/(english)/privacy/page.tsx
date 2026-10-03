import type { Metadata } from "next";
import PrivacyPageBody from "@/components/PrivacyPageBody";
export const metadata: Metadata = {
  title: "Privacy Policy | Rent&Roll",
  description: "How Escalera Labs S.L. collects, uses, stores and protects personal data for Rent&Roll enquiries, bookings and website analytics.",
  alternates: {
    canonical: "https://rentandroll.com/privacy",
    languages: {
      en: "https://rentandroll.com/privacy",
      es: "https://rentandroll.com/es/privacy",
      "x-default": "https://rentandroll.com/privacy",
    },
  },
};

export default function Page() { return <PrivacyPageBody locale="en" />; }
