import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/internal/",
          "/booking/",
          "/newsletter/unsubscribe",
        ],
      },
    ],
    sitemap: "https://rentanything.es/sitemap.xml",
  };
}
