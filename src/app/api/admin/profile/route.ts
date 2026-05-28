import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import bcrypt from "bcryptjs";

// GET /api/admin/profile - Get current user profile
export async function GET() {
  const { error, session } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      bio: true,
      createdAt: true,
      _count: { select: { articles: true } },
    },
  });

  return NextResponse.json(user);
}

// PUT /api/admin/profile - Update own profile
export async function PUT(request: NextRequest) {
  const { error, session } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  const body = await request.json();
  const { name, bio, image, currentPassword, newPassword } = body;

  const updateData: Record<string, unknown> = {};

  if (name) updateData.name = name;
  if (bio !== undefined) updateData.bio = bio;
  if (image !== undefined) updateData.image = image;

  // Password change
  if (newPassword) {
    if (!currentPassword) {
      return NextResponse.json({ error: "Password lama wajib diisi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session!.user.id },
      select: { password: true },
    });

    const isValid = await bcrypt.compare(currentPassword, user!.password);
    if (!isValid) {
      return NextResponse.json({ error: "Password lama salah" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password baru minimal 8 karakter" }, { status: 400 });
    }

    updateData.password = await bcrypt.hash(newPassword, 12);
  }

  const updated = await prisma.user.update({
    where: { id: session!.user.id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      bio: true,
    },
  });

  return NextResponse.json(updated);
}
