import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { adSchema } from "@/lib/validations";

type RouteParams = { params: Promise<{ id: string }> };

// PUT /api/admin/ads/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageAds(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const validation = adSchema.partial().safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const data = validation.data;

  const ad = await prisma.ad.update({
    where: { id },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.position ? { position: data.position } : {}),
      ...(data.type ? { type: data.type } : {}),
      ...(data.content ? { content: data.content } : {}),
      ...(data.link !== undefined ? { link: data.link || null } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(data.startDate !== undefined ? { startDate: data.startDate ? new Date(data.startDate) : null } : {}),
      ...(data.endDate !== undefined ? { endDate: data.endDate ? new Date(data.endDate) : null } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.showOnMobile !== undefined ? { showOnMobile: data.showOnMobile } : {}),
      ...(data.showOnDesktop !== undefined ? { showOnDesktop: data.showOnDesktop } : {}),
    },
  });

  return NextResponse.json(ad);
}

// DELETE /api/admin/ads/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageAds(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.ad.delete({ where: { id } });

  return NextResponse.json({ message: "Iklan berhasil dihapus" });
}
