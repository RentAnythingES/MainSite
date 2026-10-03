import DiscoverIndexPage from "@/components/DiscoverIndexPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Valencia — Neighbourhood, Beach & Event Guides",
  description: "Your complete travel guide to Valencia. Explore neighbourhoods, day trips, beaches, attractions, and local events — with honest advice from locals.",
  alternates: {
    canonical: "https://rentandroll.com/discover",
    languages: {
      en: "https://rentandroll.com/discover",
      es: "https://rentandroll.com/es/discover",
      "x-default": "https://rentandroll.com/discover",
    },
  },
};

export default function Page() { return <DiscoverIndexPage locale="en" />; }
