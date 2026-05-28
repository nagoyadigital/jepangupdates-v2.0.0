import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { categorySchema } from "@/lib/validations";
import slugify from "slugify";

type RouteParams = { params: Promise<{ id: string }> };

// PUT /api/admin/categories/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageCategories(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const validation = categorySchema.partial().safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const data = validation.data;
  const slug = data.name ? slugify(data.name, { lower: true, strict: true }) : undefined;

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...(data.name ? { name: data.name, slug } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.color !== undefined ? { color: data.color } : {}),
      ...(data.icon !== undefined ? { icon: data.icon } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(data.metaTitle !== undefined ? { metaTitle: data.metaTitle } : {}),
      ...(data.metaDescription !== undefined ? { metaDescription: data.metaDescription } : {}),
    },
  });

  return NextResponse.json(category);
}

// DELETE /api/admin/categories/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageCategories(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;

  // Check if category has articles
  const articleCount = await prisma.article.count({ where: { categoryId: id } });
  if (articleCount > 0) {
    return NextResponse.json(
      { error: `Kategori masih memiliki ${articleCount} artikel. Pindahkan artikel terlebih dahulu.` },
      { status: 400 }
    );
  }

  await prisma.category.delete({ where: { id } });

  return NextResponse.json({ message: "Kategori berhasil dihapus" });
}
