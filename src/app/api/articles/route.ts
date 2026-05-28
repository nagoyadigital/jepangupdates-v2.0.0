import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaginationParams } from "@/lib/utils";

// GET /api/articles - Public: list published articles
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { page, limit, skip } = getPaginationParams(searchParams);
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const breaking = searchParams.get("breaking");
  const headline = searchParams.get("headline");

  const where = {
    status: "PUBLISHED" as const,
    ...(category ? { category: { slug: category } } : {}),
    ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { excerpt: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
    ...(featured === "true" ? { isFeatured: true } : {}),
    ...(breaking === "true" ? { isBreaking: true } : {}),
    ...(headline === "true" ? { isHeadline: true } : {}),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        featuredImage: true,
        publishedAt: true,
        readTime: true,
        views: true,
        isFeatured: true,
        isBreaking: true,
        isHeadline: true,
        author: { select: { name: true, image: true } },
        category: { select: { name: true, slug: true } },
        tags: { include: { tag: { select: { name: true, slug: true } } } },
      },
      orderBy: { publishedAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}
