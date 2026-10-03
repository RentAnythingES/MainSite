import type { Metadata } from "next";
import DayTripsHubPage from "@/components/DayTripsHubPage";

export const metadata: Metadata = {
  "title": "Day Trips from Valencia — Beaches, Mountains & Castles",
  "description": "Compare day trips from Valencia including Albufera, castles, inland towns and Cullera's coast, with practical transport and planning advice.",
  "alternates": {
    "canonical": "https://rentandroll.com/discover/day-trips",
    "languages": {
      "en": "https://rentandroll.com/discover/day-trips",
      "es": "https://rentandroll.com/es/discover/day-trips",
      "x-default": "https://rentandroll.com/discover/day-trips"
    }
  }
};

export default function DayTripsHub(){return <DayTripsHubPage />;}
