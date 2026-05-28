import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { menuSchema } from "@/lib/validations";

// GET /api/admin/menus - List all menus
export async function GET() {
  const { error } = await requireAuth("ADMIN");
  if (error) return error;

  const menus = await prisma.menu.findMany({
    include: {
      items: {
        orderBy: { order: "asc" },
        include: { children: { orderBy: { order: "asc" } } },
      },
    },
  });

  return NextResponse.json(menus);
}

// POST /api/admin/menus - Create or update menu
export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageMenus(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();
  const validation = menuSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const data = validation.data;

  // Upsert menu by location
  const menu = await prisma.menu.upsert({
    where: { location: data.location },
    update: { name: data.name },
    create: { name: data.name, location: data.location },
  });

  // If items provided, replace all items
  if (data.items && data.items.length > 0) {
    // Delete existing items
    await prisma.menuItem.deleteMany({ where: { menuId: menu.id } });

    // Create new items
    for (const item of data.items) {
      await prisma.menuItem.create({
        data: {
          label: item.label,
          url: item.url,
          target: item.target || "_self",
          order: item.order || 0,
          parentId: item.parentId || null,
          menuId: menu.id,
        },
      });
    }
  }

  const result = await prisma.menu.findUnique({
    where: { id: menu.id },
    include: { items: { orderBy: { order: "asc" } } },
  });

  return NextResponse.json(result);
}
