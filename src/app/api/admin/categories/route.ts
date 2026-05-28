import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { categorySchema } from "@/lib/validations";
import slugify from "slugify";

// GET /api/admin/categories - List all categories
export async function GET() {
  const { error } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  const categories = await prisma.category.findMany({
    include: { _count: { select: { articles: true } } },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(categories);
}

// POST /api/admin/categories - Create category
export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageCategories(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();
  const validation = categorySchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const data = validation.data;
  const slug = slugify(data.name, { lower: true, strict: true });

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: "Kategori sudah ada" }, { status: 409 });
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      color: data.color,
      icon: data.icon,
      order: data.order || 0,
      isActive: data.isActive ?? true,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
    },
  });

  return NextResponse.json(category, { status: 201 });
}
