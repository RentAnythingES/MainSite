import type { NextConfig } from "next";

const productSlugReplacements = [
  ["Camping%20Kitchen", "outsunny-folding-camping-kitchen-a20-381v00gy"],
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...productSlugReplacements.flatMap(([sourceSlug, destinationSlug]) => [
        {
          source: `/product/${sourceSlug}`,
          destination: `/product/${destinationSlug}`,
          permanent: true,
        },
        {
          source: `/es/product/${sourceSlug}`,
          destination: `/es/product/${destinationSlug}`,
          permanent: true,
        },
      ]),
      {
        source: "/product/compact-stroller",
        destination: "/product/stroller-travel-compact",
        permanent: true,
      },
      {
        source: "/es/product/compact-stroller",
        destination: "/es/product/stroller-travel-compact",
        permanent: true,
      },
      {
        source: "/product/portable-ac",
        destination: "/product/mobile-airconditioner-delonghi-pinguino-compact-classic",
        permanent: true,
      },
      {
        source: "/es/product/portable-ac",
        destination: "/es/product/mobile-airconditioner-delonghi-pinguino-compact-classic",
        permanent: true,
      },
      {
        source: "/product/mobility-scooter-lightweight",
        destination: "/product/mobility-scooter-lightweight-foldable",
        permanent: true,
      },
      {
        source: "/es/product/mobility-scooter-lightweight",
        destination: "/es/product/mobility-scooter-lightweight-foldable",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
