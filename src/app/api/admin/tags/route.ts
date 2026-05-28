import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import slugify from "slugify";

// GET /api/admin/tags - List all tags
export async function GET(request: NextRequest) {
  const { error } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  const search = request.nextUrl.searchParams.get("search");

  const tags = await prisma.tag.findMany({
    where: search ? { name: { contains: search, mode: "insensitive" } } : {},
    include: { _count: { select: { articles: true } } },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(tags);
}

// POST /api/admin/tags - Create tag
export async function POST(request: NextRequest) {
  const { error } = await requireAuth("PENULIS");
  if (error) return error;

  const body = await request.json();
  const { name } = body;

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Nama tag minimal 2 karakter" }, { status: 400 });
  }

  const slug = slugify(name, { lower: true, strict: true });

  const existing = await prisma.tag.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json(existing); // Return existing tag instead of error
  }

  const tag = await prisma.tag.create({
    data: { name, slug },
  });

  return NextResponse.json(tag, { status: 201 });
}
