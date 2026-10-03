import type { Metadata } from "next";
import FaqPageBody from "@/components/FaqPageBody";
export const metadata: Metadata = {
  title: "Preguntas Frecuentes sobre Alquileres en Valencia",
  description:
    "Respuestas sobre reservas, pagos, recogida, entrega, higiene y cambios al alquilar equipamiento con Rent&Roll en Valencia.",
  alternates: {
    canonical: "https://rentandroll.com/es/faq",
    languages: {
      en: "https://rentandroll.com/faq",
      es: "https://rentandroll.com/es/faq",
      "x-default": "https://rentandroll.com/faq",
    },
  },
};

export default function Page() { return <FaqPageBody locale="es" />; }
