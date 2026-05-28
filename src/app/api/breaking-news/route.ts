import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/breaking-news - Public endpoint for breaking news ticker
export async function GET() {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      isBreaking: true,
    },
    select: {
      title: true,
      slug: true,
    },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  // If no breaking news, fallback to latest 5 articles
  if (articles.length === 0) {
    const latest = await prisma.article.findMany({
      where: { status: "PUBLISHED" },
      select: { title: true, slug: true },
      orderBy: { publishedAt: "desc" },
      take: 5,
    });
    return NextResponse.json(latest);
  }

  return NextResponse.json(articles);
}
