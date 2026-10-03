import type { Metadata } from "next";
import HomePageBody from "@/components/HomePageBody";
import { getDictionary } from "@/i18n/getDictionary";
const t = getDictionary("es");

export const metadata: Metadata = {
  title: "Alquiler de Equipamiento en Valencia | Rent&Roll",
  description: t.home.subheadline,
  alternates: {
    canonical: "https://rentandroll.com/es",
    languages: { en: "https://rentandroll.com", es: "https://rentandroll.com/es", "x-default": "https://rentandroll.com" },
  },
};

export default function HomePageES() { return <HomePageBody locale="es" />; }
