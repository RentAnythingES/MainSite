import type { Metadata } from "next";
import BeachesHubPage from "@/components/BeachesHubPage";

export const metadata: Metadata = {
  "title": "Valencia Beaches Guide — Compare the Best Beaches",
  "description": "Compare Valencia beaches for families, swimming, accessibility and quieter days, with practical transport advice and local beach guides.",
  "alternates": {
    "canonical": "https://rentandroll.com/discover/beaches",
    "languages": {
      "en": "https://rentandroll.com/discover/beaches",
      "es": "https://rentandroll.com/es/discover/beaches",
      "x-default": "https://rentandroll.com/discover/beaches"
    }
  },
  "openGraph": {
    "title": "Valencia Beaches Guide",
    "description": "Compare Valencia beaches for families, swimming, accessibility and quieter days, with practical transport advice and local beach guides.",
    "url": "https://rentandroll.com/discover/beaches",
    "images": [
      {
        "url": "/discover/malvarrosa-beach.webp",
        "alt": "Malvarrosa Beach in Valencia"
      }
    ]
  }
};

export default function BeachesHub(){return <BeachesHubPage />;}
