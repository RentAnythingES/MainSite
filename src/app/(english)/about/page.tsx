import type { Metadata } from "next";
import AboutPageBody from "@/components/AboutPageBody";
export const metadata: Metadata = {
  title: "About Rent&Roll | Valencia Rental Service",
  description:
    "Learn why Rent&Roll helps visitors travel lighter with practical equipment rentals, local pickup and delivery options in Valencia.",
  alternates: {
    canonical: "https://rentandroll.com/about",
    languages: {
      en: "https://rentandroll.com/about",
      es: "https://rentandroll.com/es/about",
      "x-default": "https://rentandroll.com/about",
    },
  },
};

export default function Page() { return <AboutPageBody locale="en" />; }
