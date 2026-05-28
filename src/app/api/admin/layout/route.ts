import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { layoutWidgetSchema } from "@/lib/validations";

// GET /api/admin/layout - Get all layout widgets
export async function GET(request: NextRequest) {
  const { error } = await requireAuth("ADMIN");
  if (error) return error;

  const section = request.nextUrl.searchParams.get("section");

  const widgets = await prisma.layoutWidget.findMany({
    where: section ? { section } : {},
    orderBy: [{ section: "asc" }, { order: "asc" }],
  });

  return NextResponse.json(widgets);
}

// POST /api/admin/layout - Create layout widget
export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageLayout(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();
  const validation = layoutWidgetSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const data = validation.data;

  const widget = await prisma.layoutWidget.create({
    data: {
      name: data.name,
      section: data.section,
      type: data.type,
      config: data.config,
      order: data.order || 0,
      isActive: data.isActive ?? true,
    },
  });

  return NextResponse.json(widget, { status: 201 });
}

// PUT /api/admin/layout/reorder - Reorder widgets
export async function PUT(request: NextRequest) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageLayout(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();
  const { widgets } = body as { widgets: { id: string; order: number }[] };

  if (!widgets || !Array.isArray(widgets)) {
    return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  }

  await Promise.all(
    widgets.map((w) =>
      prisma.layoutWidget.update({
        where: { id: w.id },
        data: { order: w.order },
      })
    )
  );

  return NextResponse.json({ message: "Urutan berhasil diperbarui" });
}
