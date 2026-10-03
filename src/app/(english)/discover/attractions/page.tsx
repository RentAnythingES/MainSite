import type { Metadata } from "next";
import AttractionsHubPage from "@/components/AttractionsHubPage";
const hubUrl = "https://rentandroll.com/discover/attractions";
const hubDescription =
  "Practical guides to Valencia sights and attractions, including Oceanogràfic, the City of Arts and Sciences, Central Market, La Lonja and Turia Gardens.";
export const metadata: Metadata = {
  title: "Valencia Sights & Attractions — What to See & Do",
  description: hubDescription,
  alternates: {
    canonical: hubUrl,
    languages: { en: hubUrl, es: "https://rentandroll.com/es/discover/attractions", "x-default": hubUrl },
  },
};

export default function AttractionsHub(){return <AttractionsHubPage />;}
