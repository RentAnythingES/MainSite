import type { NextConfig } from "next";

const productSlugReplacements = [
  ["monitor-27", "32-inch-monitor-hdmi-cable"],
  ["Camping%20Kitchen", "outsunny-folding-camping-kitchen-a20-381v00gy"],
  ["car-seat-infant", "maxi-cosi-pebble-360-pro2-infant-car-seat"],
  ["infant-car-seat-0-15-months", "maxi-cosi-pebble-360-pro2-infant-car-seat"],
  ["car-seat-britax-i-size", "moni-serengeti-i-size-car-seat"],
  ["child-car-seat-15-months", "moni-serengeti-i-size-car-seat"],
  ["convertible-car-seat", "peg-perego-viaggio1-duo-fix-car-seat"],
  ["kinderkraft-i-boost-2-booster-seat", "kinderkraft-i-spark-2-plus-i-size-car-seat"],
  ["booster-car-seat-5-years", "kinderkraft-i-spark-2-plus-i-size-car-seat"],
  ["27-inch-monitor-hdmi-cable", "32-inch-monitor-hdmi-cable"],
] as const;

const nextConfig: NextConfig = {
  turbopack: { root: __dirname },
  experimental: { globalNotFound: true },
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
        {
          source: `/de/product/${sourceSlug}`,
          destination: `/de/product/${destinationSlug}`,
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
        source: "/product/double-stroller",
        destination: "/product/stroller-double",
        permanent: true,
      },
      {
        source: "/es/product/double-stroller",
        destination: "/es/product/stroller-double",
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
      { source: "/de/product/compact-stroller", destination: "/de/product/stroller-travel-compact", permanent: true },
      { source: "/de/product/double-stroller", destination: "/de/product/stroller-double", permanent: true },
      { source: "/de/product/portable-ac", destination: "/de/product/mobile-airconditioner-delonghi-pinguino-compact-classic", permanent: true },
      { source: "/de/product/mobility-scooter-lightweight", destination: "/de/product/mobility-scooter-lightweight-foldable", permanent: true },
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
