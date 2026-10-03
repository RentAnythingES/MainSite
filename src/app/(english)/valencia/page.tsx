import type { Metadata } from "next";
import ValenciaPageBody from "@/components/ValenciaPageBody";
export const metadata: Metadata = {
  title: "Rent Baby Gear, Wheelchairs & Tech in Valencia",
  description:
    "Browse our full range of rental equipment in Valencia. Strollers, wheelchairs, mobility scooters, remote work setups & more. Delivered to your door.",
  alternates: {
    canonical: "https://rentandroll.com/valencia",
    languages: {
      en: "https://rentandroll.com/valencia",
      es: "https://rentandroll.com/es/valencia",
      "x-default": "https://rentandroll.com/valencia",
    },
  },
};
export default function Page() { return <ValenciaPageBody locale="en" />; }
