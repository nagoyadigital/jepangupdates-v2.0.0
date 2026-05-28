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

  const staticPages = [
    { url: `${SITE_URL}/kontak`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/tentang-kami`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/redaksi`, priority: 0.3, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/iklan`, priority: 0.4, changeFrequency: "monthly" as const },
    { url: `${SITE_URL}/kebijakan-privasi`, priority: 0.2, changeFrequency: "yearly" as const },
    { url: `${SITE_URL}/syarat-ketentuan`, priority: 0.2, changeFrequency: "yearly" as const },
    { url: `${SITE_URL}/pedoman-media-siber`, priority: 0.3, changeFrequency: "yearly" as const },
  ];

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    ...articleUrls,
    ...categoryUrls,
    ...staticPages,
  ];
}
