import type { Metadata } from "next";
import HostServicesPage from "@/components/HostServicesPage";

export const metadata: Metadata = {
  title: "Guest Equipment for Valencia Holiday Rentals",
  description:
    "Equipment support for Valencia hosts and property managers. Help guests arrange baby, mobility, comfort, work, and beach rentals for their stay.",
  alternates: {
    canonical: "https://rentanything.es/valencia/host-services",
    languages: {
      en: "https://rentanything.es/valencia/host-services",
      es: "https://rentanything.es/es/valencia/servicios-anfitriones",
      "x-default": "https://rentanything.es/valencia/host-services",
    },
  },
};

export default function HostServicesRoute() {
  return <HostServicesPage locale="en" />;
}
