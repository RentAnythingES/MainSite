import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SpanishDestinationGuidePage from "@/components/discover/SpanishDestinationGuidePage";
import {
  getAllSpanishDestinationSlugsForBuild,
  getSpanishDestinationBySlug,
} from "@/content/destinations-es";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllSpanishDestinationSlugsForBuild().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getSpanishDestinationBySlug(slug);
  if (!guide) return { title: "Guía no encontrada" };
  const canonical = `https://rentanything.es/es/discover/${guide.slug}`;
  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical,
      languages: {
        en: `https://rentanything.es/discover/${guide.slug}`,
        es: canonical,
        "x-default": `https://rentanything.es/discover/${guide.slug}`,
      },
    },
    openGraph: {
      title: guide.title,
      description: guide.description,
      url: canonical,
      locale: "es_ES",
      alternateLocale: "en_US",
      images: [{ url: guide.heroImage, alt: guide.heroImageAlt }],
    },
  };
}

export default async function SpanishDiscoverGuideRoute({ params }: Props) {
  const { slug } = await params;
  const guide = getSpanishDestinationBySlug(slug);
  if (!guide) notFound();
  return <SpanishDestinationGuidePage guide={guide} />;
}
