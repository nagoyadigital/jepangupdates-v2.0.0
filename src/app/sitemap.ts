import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://jepangupdates.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all published articles
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  // Get all active categories
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });

  const articleUrls = articles.map((article) => ({
    url: `${SITE_URL}/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((cat) => ({
    url: `${SITE_URL}/kategori/${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...articleUrls,
    ...categoryUrls,
  ];
}
