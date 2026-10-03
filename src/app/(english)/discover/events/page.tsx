import type { Metadata } from "next";
import EventsHubPage from "@/components/EventsHubPage";
const hubUrl = "https://rentandroll.com/discover/events";
const hubDescription =
  "Plan a Valencia trip around published festival and seasonal guides, with practical dates, local context and booking advice.";
export const metadata: Metadata = {
  title: "Valencia Events — Festivals, Holidays & Seasonal Highlights",
  description: hubDescription,
  alternates: {
    canonical: hubUrl,
    languages: { en: hubUrl, es: "https://rentandroll.com/es/discover/events", "x-default": hubUrl },
  },
};

export default function EventsHub(){return <EventsHubPage />;}
