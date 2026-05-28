import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

type RouteParams = { params: Promise<{ id: string }> };

// PUT /api/admin/media/[id] - Update media metadata (alt, caption)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  const { id } = await params;
  const body = await request.json();

  const media = await prisma.media.update({
    where: { id },
    data: {
      ...(body.alt !== undefined ? { alt: body.alt } : {}),
      ...(body.caption !== undefined ? { caption: body.caption } : {}),
    },
  });

  return NextResponse.json(media);
}

// DELETE /api/admin/media/[id] - Delete media file
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAuth("KONTRIBUTOR");
  if (error) return error;

  const { id } = await params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Media tidak ditemukan" }, { status: 404 });
  }

  // Only owner or admin can delete
  const isOwner = media.uploadedById === session!.user.id;
  if (!isOwner && !permissions.canDeleteAnyMedia(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  // Delete physical file
  const filePath = path.join(process.cwd(), "public", media.url);
  if (existsSync(filePath)) {
    await unlink(filePath);
  }

  await prisma.media.delete({ where: { id } });

  return NextResponse.json({ message: "Media berhasil dihapus" });
}
