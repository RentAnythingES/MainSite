import type { Metadata } from "next";
import PartnershipsPage from "@/components/PartnershipsPage";

export const metadata: Metadata = {
  title: "Colaboraciones de Alquiler en Valencia",
  description:
    "Colabora con Rent&Roll en recomendaciones a huéspedes, apoyo a alojamientos o pilotos de producto concretos en Valencia.",
  alternates: {
    canonical: "https://rentandroll.com/es/colaboraciones",
    languages: {
      en: "https://rentandroll.com/partners",
      es: "https://rentandroll.com/es/colaboraciones",
      "x-default": "https://rentandroll.com/partners",
    },
  },
};

export default function SpanishPartnersRoute() {
  return <PartnershipsPage locale="es" />;
}
