import type { Metadata } from "next";
import TermsPageBody from "@/components/TermsPageBody";
export const metadata: Metadata = {
  title: "Rental Terms and Conditions | Rent&Roll",
  description: "Terms for Rent&Roll equipment bookings in Valencia, including payment, fulfilment, cancellation, extensions, care and customer responsibilities.",
  alternates: {
    canonical: "https://rentandroll.com/terms",
    languages: {
      en: "https://rentandroll.com/terms",
      es: "https://rentandroll.com/es/terms",
      "x-default": "https://rentandroll.com/terms",
    },
  },
};

export default function Page() { return <TermsPageBody locale="en" />; }
