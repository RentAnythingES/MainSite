import type { Metadata } from "next";
import PartnershipsPage from "@/components/PartnershipsPage";

export const metadata: Metadata = {
  title: "Valencia Rental Partnerships | RentAnything.es",
  description:
    "Partner with RentAnything.es on guest referrals, accommodation support, or focused product pilots that make Valencia stays easier.",
  alternates: {
    canonical: "https://rentanything.es/partners",
    languages: {
      en: "https://rentanything.es/partners",
      es: "https://rentanything.es/es/colaboraciones",
      "x-default": "https://rentanything.es/partners",
    },
  },
};

export default function PartnersRoute() {
  return <PartnershipsPage locale="en" />;
}
