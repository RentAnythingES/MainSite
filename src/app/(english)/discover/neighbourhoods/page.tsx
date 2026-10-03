import NeighbourhoodsHubPage from "@/components/NeighbourhoodsHubPage";
import type { Metadata } from "next";
import copy from "@/i18n/discover-hubs/neighbourhoods-en.json";
const hubUrl = copy.hubUrl;
const hubDescription = copy.hubDescription;
export const metadata: Metadata = {
  title: "Valencia Neighbourhoods — Where to Stay & Explore",
  description: hubDescription,
  alternates: {
    canonical: hubUrl,
    languages: {
      en: hubUrl,
      es: "https://rentandroll.com/es/discover/neighbourhoods",
      "x-default": hubUrl,
    },
  },
};
export default function Page(){ return <NeighbourhoodsHubPage locale="en" />; }
