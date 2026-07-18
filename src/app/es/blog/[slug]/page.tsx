import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogArticlePage, { type BlogArticleCta } from "@/components/blog/BlogArticlePage";
import {
  getAllSpanishBlogSlugsForBuild,
  getSpanishBlogPostBySlug,
} from "@/content/blog-es";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSpanishBlogSlugsForBuild().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getSpanishBlogPostBySlug(slug);
  if (!post) return { title: "Guía no encontrada" };

  const canonical = `https://rentanything.es/es/blog/${post.slug}`;
  const englishUrl = `https://rentanything.es/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      locale: "es_ES",
      publishedTime: post.date,
      images: [{
        url: post.heroImage || "/hero/valencia-1.webp",
        alt: post.heroImageAlt || post.title,
      }],
    },
    alternates: {
      canonical,
      languages: {
        en: englishUrl,
        es: canonical,
        "x-default": englishUrl,
      },
    },
  };
}

function getSpanishCta(slug: string): BlogArticleCta {
  if (slug === "best-beaches-valencia-families") {
    return {
      href: "/es/rental/travel-outdoors",
      heading: "¿Necesitas equipamiento de playa en Valencia?",
      description: "Compara opciones de sombra y equipamiento familiar y comprueba disponibilidad para tus fechas.",
      label: "Ver equipamiento de playa",
    };
  }

  return {
    href: "/es/rental/home-living",
    heading: "¿Quieres un alojamiento más cómodo este verano?",
    description: "Compara climatización portátil y equipamiento para mejorar el confort durante tu estancia.",
    label: "Ver confort para apartamentos",
  };
}

export default async function SpanishBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getSpanishBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <BlogArticlePage
      post={post}
      locale="es"
      blogHref="/es/blog"
      pageUrl={`https://rentanything.es/es/blog/${post.slug}`}
      cta={getSpanishCta(post.slug)}
      labels={{
        home: "Inicio",
        blog: "Blog",
        faqTitle: "Preguntas frecuentes",
        relatedTitle: "También te puede interesar",
        category: {
          guide: "Guía",
          tutorial: "Tutorial",
          seasonal: "Temporada",
          comparison: "Comparativa",
          update: "Actualización",
        },
      }}
    />
  );
}
