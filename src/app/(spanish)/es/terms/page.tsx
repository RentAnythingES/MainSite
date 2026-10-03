import type { Metadata } from "next";
import TermsPageBody from "@/components/TermsPageBody";
export const metadata: Metadata = {
  title: "Condiciones de Alquiler | Rent&Roll",
  description: "Condiciones para reservas de equipamiento en Valencia: pago, entrega o recogida, cancelación, ampliaciones, cuidado y responsabilidades.",
  alternates: {
    canonical: "https://rentandroll.com/es/terms",
    languages: {
      en: "https://rentandroll.com/terms",
      es: "https://rentandroll.com/es/terms",
      "x-default": "https://rentandroll.com/terms",
    },
  },
};

export default function Page() { return <TermsPageBody locale="es" />; }
