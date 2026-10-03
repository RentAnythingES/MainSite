import type { Metadata } from "next";
import RefundsPageBody from "@/components/RefundsPageBody";
export const metadata: Metadata = {
  title: "Reembolsos y Cancelaciones",
  description:
    "Política de reembolsos y cancelaciones para alquileres en Valencia: reembolso completo con 48 horas o más de antelación.",
  alternates: {
    canonical: "https://rentandroll.com/es/refunds",
    languages: {
      en: "https://rentandroll.com/refunds",
      es: "https://rentandroll.com/es/refunds",
      "x-default": "https://rentandroll.com/refunds",
    },
  },
};

export default function Page() { return <RefundsPageBody locale="es" />; }
