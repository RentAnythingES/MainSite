import type { Metadata } from "next";
import HowItWorksPageBody from "@/components/HowItWorksPageBody";
export const metadata: Metadata = {
  title: "How It Works — Browse, Book, Deliver, Return",
  description:
    "Renting is simple. Browse our range, pick your dates, choose delivery or pickup, and we handle the rest. Delivered to your door in Valencia.",
  alternates: {
    canonical: "https://rentandroll.com/how-it-works",
    languages: {
      en: "https://rentandroll.com/how-it-works",
      es: "https://rentandroll.com/es/how-it-works",
      "x-default": "https://rentandroll.com/how-it-works",
    },
  },
};

export default function Page() { return <HowItWorksPageBody locale="en" />; }
