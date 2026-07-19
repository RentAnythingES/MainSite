import type { Metadata } from "next";
import HostServicesPage from "@/components/HostServicesPage";

export const metadata: Metadata = {
  title: "Equipamiento para Alojamientos en Valencia",
  description:
    "Equipamiento para huéspedes de alojamientos en Valencia: bebé, movilidad, confort, teletrabajo y playa, sujeto a fechas e inventario.",
  alternates: {
    canonical: "https://rentanything.es/es/valencia/servicios-anfitriones",
    languages: {
      en: "https://rentanything.es/valencia/host-services",
      es: "https://rentanything.es/es/valencia/servicios-anfitriones",
      "x-default": "https://rentanything.es/valencia/host-services",
    },
  },
};

export default function SpanishHostServicesRoute() {
  return <HostServicesPage locale="es" />;
}
