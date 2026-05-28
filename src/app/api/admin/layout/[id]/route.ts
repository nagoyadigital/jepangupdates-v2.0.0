import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { layoutWidgetSchema } from "@/lib/validations";

type RouteParams = { params: Promise<{ id: string }> };

// PUT /api/admin/layout/[id]
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageLayout(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const validation = layoutWidgetSchema.partial().safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const data = validation.data;

  const widget = await prisma.layoutWidget.update({
    where: { id },
    data: {
      ...(data.name ? { name: data.name } : {}),
      ...(data.section ? { section: data.section } : {}),
      ...(data.type ? { type: data.type } : {}),
      ...(data.config ? { config: data.config } : {}),
      ...(data.order !== undefined ? { order: data.order } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
    },
  });

  return NextResponse.json(widget);
}

// DELETE /api/admin/layout/[id]
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageLayout(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const { id } = await params;
  await prisma.layoutWidget.delete({ where: { id } });

  return NextResponse.json({ message: "Widget berhasil dihapus" });
}
