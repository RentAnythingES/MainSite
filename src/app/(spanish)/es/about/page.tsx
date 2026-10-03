import type { Metadata } from "next";
import AboutPageBody from "@/components/AboutPageBody";
export const metadata: Metadata = {
  title: "Sobre Rent&Roll | Alquiler en Valencia",
  description:
    "Conoce por qué Rent&Roll ayuda a viajar más ligero con alquiler de equipamiento, recogida local y opciones de entrega en Valencia.",
  alternates: {
    canonical: "https://rentandroll.com/es/about",
    languages: {
      en: "https://rentandroll.com/about",
      es: "https://rentandroll.com/es/about",
      "x-default": "https://rentandroll.com/about",
    },
  },
};

export default function Page() { return <AboutPageBody locale="es" />; }
