import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { updateUserSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

type RouteParams = { params: Promise<{ id: string }> };

// GET /api/admin/users/[id]
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth("ADMIN");
  if (error) return error;

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      bio: true,
      isActive: true,
      createdAt: true,
      _count: { select: { articles: true, editedArticles: true, mediaUploads: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(user);
}

// PUT /api/admin/users/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAuth("SUPER_ADMIN");
  if (error) return error;

  if (!permissions.canManageUsers(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const validation = updateUserSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const data = validation.data;

  // If email is being changed, check uniqueness
  if (data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: data.email, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json({ error: "Email sudah digunakan" }, { status: 409 });
    }
  }

  const updateData: Record<string, unknown> = {};
  if (data.name) updateData.name = data.name;
  if (data.email) updateData.email = data.email;
  if (data.role) updateData.role = data.role;
  if (data.bio !== undefined) updateData.bio = data.bio;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;
  if (data.image !== undefined) updateData.image = data.image;
  if (data.password) updateData.password = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      bio: true,
      image: true,
    },
  });

  return NextResponse.json(user);
}

// DELETE /api/admin/users/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAuth("SUPER_ADMIN");
  if (error) return error;

  if (!permissions.canManageUsers(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;

  // Prevent self-deletion
  if (id === session!.user.id) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });

  return NextResponse.json({ message: "User berhasil dihapus" });
}
