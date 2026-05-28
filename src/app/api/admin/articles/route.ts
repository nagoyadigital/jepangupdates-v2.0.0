import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { createArticleSchema } from "@/lib/validations";
import { generateUniqueSlug, calculateReadTime, getPaginationParams } from "@/lib/utils";

// GET /api/admin/articles - List articles with filters
export async function GET(request: NextRequest) {
  const { error, session } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const { page, limit, skip } = getPaginationParams(searchParams);
  const status = searchParams.get("status");
  const categoryId = searchParams.get("categoryId");
  const search = searchParams.get("search");
  const authorId = searchParams.get("authorId");

  // Kontributor & Penulis only see their own articles
  const isLimitedRole = session!.user.role === "KONTRIBUTOR" || session!.user.role === "PENULIS";

  const where = {
    ...(status ? { status: status as "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED" } : {}),
    ...(categoryId ? { categoryId } : {}),
    ...(isLimitedRole ? { authorId: session!.user.id } : authorId ? { authorId } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { content: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, image: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { include: { tag: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.article.count({ where }),
  ]);

  return NextResponse.json({
    articles,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}

// POST /api/admin/articles - Create article
export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  if (!permissions.canCreateArticle(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();
  const validation = createArticleSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const data = validation.data;
  const slug = await generateUniqueSlug(data.title);
  const readTime = calculateReadTime(data.content);

  // Kontributor can only create DRAFT
  const status = session!.user.role === "KONTRIBUTOR" ? "DRAFT" : data.status;

  const article = await prisma.article.create({
    data: {
      title: data.title,
      slug,
      content: data.content,
      excerpt: data.excerpt || data.content.substring(0, 160),
      categoryId: data.categoryId,
      authorId: session!.user.id,
      featuredImage: data.featuredImage,
      status,
      readTime,
      isFeatured: data.isFeatured || false,
      isBreaking: data.isBreaking || false,
      isHeadline: data.isHeadline || false,
      metaTitle: data.metaTitle || data.title,
      metaDescription: data.metaDescription || data.excerpt || data.content.substring(0, 160),
      metaKeywords: data.metaKeywords,
      ...(data.tags && data.tags.length > 0
        ? {
            tags: {
              create: data.tags.map((tagId: string) => ({
                tag: { connect: { id: tagId } },
              })),
            },
          }
        : {}),
    },
    include: {
      author: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(article, { status: 201 });
}
