import type { Metadata } from "next";
import RefundsPageBody from "@/components/RefundsPageBody";
export const metadata: Metadata = {
  title: "Refunds & Cancellations",
  description: "Our refund and cancellation policy for rental bookings in Valencia. Free cancellation up to 48 hours before delivery.",
  alternates: {
    canonical: "https://rentandroll.com/refunds",
    languages: {
      en: "https://rentandroll.com/refunds",
      es: "https://rentandroll.com/es/refunds",
      "x-default": "https://rentandroll.com/refunds",
    },
  },
};

export default function Page() { return <RefundsPageBody locale="en" />; }
