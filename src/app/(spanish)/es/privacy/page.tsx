import type { Metadata } from "next";
import PrivacyPageBody from "@/components/PrivacyPageBody";
export const metadata: Metadata = {
  title: "Política de Privacidad | Rent&Roll",
  description: "Cómo Escalera Labs S.L. recoge, utiliza, conserva y protege los datos personales de consultas, reservas y analítica de Rent&Roll.",
  alternates: {
    canonical: "https://rentandroll.com/es/privacy",
    languages: {
      en: "https://rentandroll.com/privacy",
      es: "https://rentandroll.com/es/privacy",
      "x-default": "https://rentandroll.com/privacy",
    },
  },
};

export default function Page() { return <PrivacyPageBody locale="es" />; }
