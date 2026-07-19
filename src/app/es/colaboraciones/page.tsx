import type { Metadata } from "next";
import PartnershipsPage from "@/components/PartnershipsPage";

export const metadata: Metadata = {
  title: "Colaboraciones de Alquiler en Valencia",
  description:
    "Colabora con RentAnything.es en recomendaciones a huéspedes, apoyo a alojamientos o pilotos de producto concretos en Valencia.",
  alternates: {
    canonical: "https://rentanything.es/es/colaboraciones",
    languages: {
      en: "https://rentanything.es/partners",
      es: "https://rentanything.es/es/colaboraciones",
      "x-default": "https://rentanything.es/partners",
    },
  },
};

export default function SpanishPartnersRoute() {
  return <PartnershipsPage locale="es" />;
}
