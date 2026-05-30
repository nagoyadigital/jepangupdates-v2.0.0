import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://japanpopuler.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/admin/", "/login"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
