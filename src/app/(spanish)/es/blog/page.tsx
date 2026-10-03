import type { Metadata } from "next";
import BlogPageBody from "@/components/blog/BlogPageBody";
export const metadata: Metadata = {
  title: "Guías de Valencia para familias y estancias de verano",
  description:
    "Consejos prácticos para visitar Valencia: playas con niños, calor, alojamiento y equipamiento útil para disfrutar de una estancia más cómoda.",
  alternates: {
    canonical: "https://rentandroll.com/es/blog",
    languages: {
      en: "https://rentandroll.com/blog",
      es: "https://rentandroll.com/es/blog",
      "x-default": "https://rentandroll.com/blog",
    },
  },
};

export default function SpanishBlogPage(){return <BlogPageBody locale="es" />;}
