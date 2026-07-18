import { notFound } from "next/navigation";
import type { Metadata } from "next";
import BlogArticlePage, { type BlogArticleCta } from "@/components/blog/BlogArticlePage";
import {
  getBlogPostBySlug,
  getAllBlogSlugsForBuild,
  isPublished,
  type BlogPost,
} from "@/content/blog";
import { getSpanishBlogPostBySlug } from "@/content/blog-es";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogSlugsForBuild().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };

  const canonical = `https://rentanything.es/blog/${post.slug}`;
  const spanishPost = getSpanishBlogPostBySlug(slug);

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: [{
        url: post.heroImage || "/hero/valencia-1.webp",
        alt: post.heroImageAlt || post.title,
      }],
    },
    alternates: {
      canonical,
      ...(spanishPost && {
        languages: {
          en: canonical,
          es: `https://rentanything.es/es/blog/${post.slug}`,
          "x-default": canonical,
        },
      }),
    },
  };
}

const clusterCtas = [
  {
    slug: "best-beaches-valencia-families",
    tags: ["beach", "beaches"],
    href: "/rental/travel-outdoors",
    heading: "Need Beach Equipment for Your Valencia Stay?",
    description: "Compare beach umbrellas, shelters and family shade options, then check availability for your dates.",
    label: "Browse Beach Equipment",
  },
  {
    slug: "wheelchair-accessibility-valencia",
    tags: ["mobility", "accessibility"],
    href: "/rental/mobility",
    heading: "Need Mobility Equipment in Valencia?",
    description: "Compare wheelchairs, scooters and daily mobility aids with pickup and delivery options for your stay.",
    label: "Browse Mobility Equipment",
  },
  {
    slug: "digital-nomad-guide-valencia",
    tags: ["digital nomad", "remote work"],
    href: "/rental/remote-work",
    heading: "Need a Better Workspace in Valencia?",
    description: "Compare monitors, desks and ergonomic equipment for your apartment or longer Valencia stay.",
    label: "Browse Remote Work Equipment",
  },
  {
    slug: "valencia-summer-survival-guide",
    tags: ["summer", "seasonal"],
    href: "/rental/home-living",
    heading: "Need a More Comfortable Valencia Apartment?",
    description: "Compare portable cooling and apartment comfort equipment, then check availability for your dates.",
    label: "Browse Apartment Comfort",
  },
  {
    slug: "valencia-with-kids-complete-guide",
    tags: ["family", "kids"],
    href: "/rental/baby-gear",
    heading: "Need Family Equipment for Your Valencia Stay?",
    description: "Compare practical baby and toddler equipment without adding bulky items to your luggage.",
    label: "Browse Baby & Toddler Equipment",
  },
] as const;

function getClusterCta(post: BlogPost): BlogArticleCta {
  const tags = new Set(post.tags.map((tag) => tag.toLowerCase()));
  return clusterCtas.find((cta) => cta.slug === post.slug)
    || clusterCtas.find((cta) => cta.tags.some((tag) => tags.has(tag)))
    || {
      href: "/valencia",
      heading: "Need Equipment for Your Valencia Stay?",
      description: "Browse practical rental equipment and check availability for your dates in Valencia.",
      label: "Browse Valencia Rentals",
    };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post || !isPublished(post)) notFound();

  return (
    <BlogArticlePage
      post={post}
      locale="en"
      blogHref="/blog"
      pageUrl={`https://rentanything.es/blog/${post.slug}`}
      cta={getClusterCta(post)}
      labels={{
        home: "Home",
        blog: "Blog",
        faqTitle: "Frequently Asked Questions",
        relatedTitle: "You Might Also Need",
        category: {
          guide: "Guide",
          tutorial: "Tutorial",
          seasonal: "Seasonal",
          comparison: "Comparison",
          update: "Update",
        },
      }}
    />
  );
}
