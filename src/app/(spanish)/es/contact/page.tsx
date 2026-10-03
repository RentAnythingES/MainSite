import type { Metadata } from "next";
import ContactPageBody from "@/components/ContactPageBody";
export const metadata: Metadata = {
  title: "Contactar con Rent&Roll en Valencia",
  description:
    "Contacta con Rent&Roll sobre alquileres en Valencia, reservas, solicitudes especiales o colaboraciones por WhatsApp, correo o formulario.",
  alternates: {
    canonical: "https://rentandroll.com/es/contact",
    languages: {
      en: "https://rentandroll.com/contact",
      es: "https://rentandroll.com/es/contact",
      "x-default": "https://rentandroll.com/contact",
    },
  },
};

export default function Page() { return <ContactPageBody locale="es" />; }
