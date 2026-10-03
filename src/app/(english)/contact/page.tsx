import type { Metadata } from "next";
import ContactPageBody from "@/components/ContactPageBody";
export const metadata: Metadata = {
  title: "Contact Rent&Roll in Valencia",
  description:
    "Contact Rent&Roll about Valencia equipment rentals, existing bookings, custom requests or local partnerships by WhatsApp, email or form.",
  alternates: {
    canonical: "https://rentandroll.com/contact",
    languages: {
      en: "https://rentandroll.com/contact",
      es: "https://rentandroll.com/es/contact",
      "x-default": "https://rentandroll.com/contact",
    },
  },
};

export default function Page() { return <ContactPageBody locale="en" />; }
