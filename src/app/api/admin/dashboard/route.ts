import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

// GET /api/admin/dashboard - Dashboard statistics
export async function GET() {
  const { error, session } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  const isLimitedRole = session!.user.role === "KONTRIBUTOR" || session!.user.role === "PENULIS";

  const authorFilter = isLimitedRole ? { authorId: session!.user.id } : {};

  const [
    totalArticles,
    publishedArticles,
    draftArticles,
    reviewArticles,
    totalViews,
    totalCategories,
    totalUsers,
    totalMedia,
    recentArticles,
    topArticles,
    categoryViews,
  ] = await Promise.all([
    prisma.article.count({ where: authorFilter }),
    prisma.article.count({ where: { ...authorFilter, status: "PUBLISHED" } }),
    prisma.article.count({ where: { ...authorFilter, status: "DRAFT" } }),
    prisma.article.count({ where: { ...authorFilter, status: "REVIEW" } }),
    prisma.article.aggregate({ where: authorFilter, _sum: { views: true } }),
    prisma.category.count(),
    prisma.user.count(),
    prisma.media.count(),
    prisma.article.findMany({
      where: authorFilter,
      include: {
        author: { select: { name: true } },
        category: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    // Top 10 articles by views
    prisma.article.findMany({
      where: { ...authorFilter, status: "PUBLISHED" },
      select: { title: true, slug: true, views: true, category: { select: { name: true } } },
      orderBy: { views: "desc" },
      take: 10,
    }),
    // Views per category
    prisma.category.findMany({
      where: { isActive: true },
      select: {
        name: true,
        slug: true,
        _count: { select: { articles: true } },
        articles: {
          where: { status: "PUBLISHED" },
          select: { views: true },
        },
      },
      orderBy: { articles: { _count: "desc" } },
      take: 8,
    }),
  ]);

  // Calculate total views per category
  const categoryStats = categoryViews.map(cat => ({
    name: cat.name,
    articles: cat._count.articles,
    views: cat.articles.reduce((sum, a) => sum + a.views, 0),
  })).sort((a, b) => b.views - a.views);

  return NextResponse.json({
    stats: {
      totalArticles,
      publishedArticles,
      draftArticles,
      reviewArticles,
      totalViews: totalViews._sum.views || 0,
      totalCategories,
      totalUsers,
      totalMedia,
    },
    recentArticles,
    topArticles,
    categoryStats,
  });
}
