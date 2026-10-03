import type { Metadata } from "next";
import HowItWorksPageBody from "@/components/HowItWorksPageBody";
export const metadata: Metadata = {
  title: "Cómo Funciona el Alquiler de Equipamiento",
  description:
    "Elige el artículo y las fechas, selecciona recogida o entrega, paga de forma segura y devuelve el equipo según la modalidad acordada.",
  alternates: {
    canonical: "https://rentandroll.com/es/how-it-works",
    languages: {
      en: "https://rentandroll.com/how-it-works",
      es: "https://rentandroll.com/es/how-it-works",
      "x-default": "https://rentandroll.com/how-it-works",
    },
  },
};

export default function Page() { return <HowItWorksPageBody locale="es" />; }
