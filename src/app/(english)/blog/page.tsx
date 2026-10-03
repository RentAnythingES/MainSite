import type { Metadata } from "next";
import BlogPageBody from "@/components/blog/BlogPageBody";
export const metadata: Metadata = {
  title: "Blog — Travel Tips, Guides & Rental Advice | Rent&Roll",
  description:
    "Practical tips for travelling to Valencia. Guides for families, mobility needs, digital nomads & more. From the Rent&Roll team.",
  alternates: {
    canonical: "https://rentandroll.com/blog",
    languages: {
      en: "https://rentandroll.com/blog",
      es: "https://rentandroll.com/es/blog",
      "x-default": "https://rentandroll.com/blog",
    },
  },
};

export default function BlogPage(){return <BlogPageBody locale="en" />;}
