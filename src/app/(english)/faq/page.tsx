import type { Metadata } from "next";
import FaqPageBody from "@/components/FaqPageBody";
export const metadata: Metadata = {
  title: "FAQ — Rental Bookings, Delivery, Hygiene & Policies",
  description:
    "Everything you need to know about renting baby gear, mobility aids & tech in Valencia. Delivery areas, cancellations & more.",
  alternates: {
    canonical: "https://rentandroll.com/faq",
    languages: {
      en: "https://rentandroll.com/faq",
      es: "https://rentandroll.com/es/faq",
      "x-default": "https://rentandroll.com/faq",
    },
  },
};

export default function Page() { return <FaqPageBody locale="en" />; }
