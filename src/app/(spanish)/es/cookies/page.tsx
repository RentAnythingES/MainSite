import type { Metadata } from "next";
import CookiesPageBody from "@/components/CookiesPageBody";
export const metadata: Metadata = {
  title: "Política de Cookies | Rent&Roll",
  description: "Qué almacenamiento y cookies de terceros utiliza Rent&Roll, cuándo se carga Google Analytics y cómo cambiar tu consentimiento.",
  alternates: {
    canonical: "https://rentandroll.com/es/cookies",
    languages: {
      en: "https://rentandroll.com/cookies",
      es: "https://rentandroll.com/es/cookies",
      "x-default": "https://rentandroll.com/cookies",
    },
  },
};

export default function Page() { return <CookiesPageBody locale="es" />; }
