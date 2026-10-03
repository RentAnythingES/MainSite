import type { Metadata } from "next";
import ValenciaPageBody from "@/components/ValenciaPageBody";
export const metadata: Metadata = {
  title: "Alquiler de Equipos en Valencia | Rent&Roll",
  description: "Alquila artículos de bebé, movilidad, teletrabajo y confort en Valencia, con recogida o entrega en hoteles, apartamentos y alojamientos.",
  alternates: {
    canonical: "https://rentandroll.com/es/valencia",
    languages: { en: "https://rentandroll.com/valencia", es: "https://rentandroll.com/es/valencia", "x-default": "https://rentandroll.com/valencia" },
  },
};
export default function Page() { return <ValenciaPageBody locale="es" />; }
