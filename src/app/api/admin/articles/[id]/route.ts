import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { updateArticleSchema } from "@/lib/validations";
import { generateUniqueSlug, calculateReadTime } from "@/lib/utils";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/articles/[id] - Get single article
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  const { id } = await params;

  const article = await prisma.article.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      editor: { select: { id: true, name: true } },
      category: { select: { id: true, name: true, slug: true } },
      tags: { include: { tag: true } },
    },
  });

  if (!article) {
    return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(article);
}

// PUT /api/admin/articles/[id] - Update article
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  const { id } = await params;

  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) {
    return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
  }

  // Check permission: own article or editor+
  const isOwner = article.authorId === session!.user.id;
  const canEditAny = permissions.canEditAnyArticle(session!.user.role);

  if (!isOwner && !canEditAny) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();
  const validation = updateArticleSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const data = validation.data;

  // Only Editor+ can publish
  if (data.status === "PUBLISHED" && !permissions.canPublishArticle(session!.user.role)) {
    return NextResponse.json({ error: "Hanya Editor ke atas yang bisa publish" }, { status: 403 });
  }

  // Generate new slug if title changed
  let slug = article.slug;
  if (data.title && data.title !== article.title) {
    slug = data.slug || (await generateUniqueSlug(data.title, id));
  }

  const readTime = data.content ? calculateReadTime(data.content) : article.readTime;

  // Handle tags update
  if (data.tags) {
    await prisma.tagOnArticle.deleteMany({ where: { articleId: id } });
  }

  const updated = await prisma.article.update({
    where: { id },
    data: {
      ...(data.title ? { title: data.title } : {}),
      slug,
      ...(data.content ? { content: data.content } : {}),
      ...(data.excerpt !== undefined ? { excerpt: data.excerpt } : {}),
      ...(data.categoryId ? { categoryId: data.categoryId } : {}),
      ...(data.featuredImage !== undefined ? { featuredImage: data.featuredImage } : {}),
      ...(data.status ? { status: data.status } : {}),
      ...(data.status === "PUBLISHED" && !article.publishedAt ? { publishedAt: new Date() } : {}),
      ...(data.status === "PUBLISHED" || data.status === "REVIEW"
        ? { editorId: session!.user.id }
        : {}),
      readTime,
      ...(data.isFeatured !== undefined ? { isFeatured: data.isFeatured } : {}),
      ...(data.isBreaking !== undefined ? { isBreaking: data.isBreaking } : {}),
      ...(data.isHeadline !== undefined ? { isHeadline: data.isHeadline } : {}),
      ...(data.metaTitle !== undefined ? { metaTitle: data.metaTitle } : {}),
      ...(data.metaDescription !== undefined ? { metaDescription: data.metaDescription } : {}),
      ...(data.metaKeywords !== undefined ? { metaKeywords: data.metaKeywords } : {}),
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

  return NextResponse.json(updated);
}

// DELETE /api/admin/articles/[id] - Delete article
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  const { id } = await params;

  if (!permissions.canDeleteArticle(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  await prisma.article.delete({ where: { id } });

  return NextResponse.json({ message: "Artikel berhasil dihapus" });
}
