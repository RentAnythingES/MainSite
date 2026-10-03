import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getDestinationBySlug,
  getDestinationGovernance,
  getAllDestinationSlugsForBuild,
} from "@/content/destinations";
import { hasSpanishDestination } from "@/content/destinations-es";
import DestinationGuidePage from "@/components/DestinationGuidePage";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllDestinationSlugsForBuild().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) return { title: "Not Found" };
  const canonical = `https://rentandroll.com/discover/${dest.slug}`;
  const languages = hasSpanishDestination(dest.slug)
    ? {
        en: canonical,
        es: `https://rentandroll.com/es/discover/${dest.slug}`,
        "x-default": canonical,
      }
    : undefined;
  return {
    title: dest.title,
    description: dest.description,
    alternates: { canonical, languages },
    openGraph: {
      title: dest.title,
      description: dest.description,
      url: canonical,
      images: [
        {
          url: dest.heroImage || "/hero/valencia-1.webp",
          alt: dest.heroImageAlt || dest.title,
        },
      ],
    },
  };
}

export default async function DiscoverPage({params}: Props) {
  const {slug} = await params;
  const dest = getDestinationBySlug(slug);
  if (!dest) notFound();
  return <DestinationGuidePage dest={dest} governance={getDestinationGovernance(slug)} locale="en" />;
}
