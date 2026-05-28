import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { createUserSchema } from "@/lib/validations";
import { getPaginationParams } from "@/lib/utils";
import bcrypt from "bcryptjs";

// GET /api/admin/users - List all users
export async function GET(request: NextRequest) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  const searchParams = request.nextUrl.searchParams;
  const { page, limit, skip } = getPaginationParams(searchParams);
  const role = searchParams.get("role");
  const search = searchParams.get("search");

  const where = {
    ...(role ? { role: role as "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "PENULIS" | "KONTRIBUTOR" } : {}),
    ...(search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        isActive: true,
        bio: true,
        createdAt: true,
        _count: { select: { articles: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

// POST /api/admin/users - Create user
export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth("SUPER_ADMIN");
  if (error) return error;

  if (!permissions.canManageUsers(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();
  const validation = createUserSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const data = validation.data;

  // Check if email already exists
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role,
      bio: data.bio,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
