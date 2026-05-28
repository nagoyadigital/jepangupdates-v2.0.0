import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ slug: string }> };

// GET /api/articles/[slug] - Public: get single article by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      featuredImage: true,
      publishedAt: true,
      readTime: true,
      views: true,
      isFeatured: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
      ogImage: true,
      canonicalUrl: true,
      author: { select: { name: true, image: true, bio: true } },
      category: { select: { name: true, slug: true } },
      tags: { include: { tag: { select: { name: true, slug: true } } } },
    },
  });

  if (!article || article.views === undefined) {
    // Check if article exists but not published
    const exists = await prisma.article.findUnique({ where: { slug }, select: { status: true } });
    if (exists && exists.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Artikel belum dipublikasikan" }, { status: 403 });
    }
    return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  // Increment view count (fire and forget)
  prisma.article.update({
    where: { slug },
    data: { views: { increment: 1 } },
  }).catch(() => {});

  return NextResponse.json(article);
}
