import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
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
