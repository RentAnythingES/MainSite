import type { Metadata } from "next";
import PartnershipsPage from "@/components/PartnershipsPage";

export const metadata: Metadata = {
  title: "Valencia Rental Partnerships | Rent&Roll",
  description:
    "Partner with Rent&Roll on guest referrals, accommodation support, or focused product pilots that make Valencia stays easier.",
  alternates: {
    canonical: "https://rentandroll.com/partners",
    languages: {
      en: "https://rentandroll.com/partners",
      es: "https://rentandroll.com/es/colaboraciones",
      "x-default": "https://rentandroll.com/partners",
    },
  },
};

export default function PartnersRoute() {
  return <PartnershipsPage locale="en" />;
}
