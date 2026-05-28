import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { settingsBulkSchema } from "@/lib/validations";

// GET /api/admin/settings - Get all settings (optionally by group)
export async function GET(request: NextRequest) {
  const { error } = await requireAuth("ADMIN");
  if (error) return error;

  const group = request.nextUrl.searchParams.get("group");

  const settings = await prisma.siteSetting.findMany({
    where: group ? { group } : {},
    orderBy: { key: "asc" },
  });

  // Convert to key-value object grouped by group
  const grouped: Record<string, Record<string, string>> = {};
  for (const setting of settings) {
    if (!grouped[setting.group]) grouped[setting.group] = {};
    grouped[setting.group][setting.key] = setting.value;
  }

  return NextResponse.json(grouped);
}

// PUT /api/admin/settings - Bulk update settings
export async function PUT(request: NextRequest) {
  const { error, session } = await requireAuth("SUPER_ADMIN");
  if (error) return error;

  if (!permissions.canManageSettings(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();
  const validation = settingsBulkSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const { settings } = validation.data;

  // Upsert each setting
  await Promise.all(
    settings.map((setting) =>
      prisma.siteSetting.upsert({
        where: { key: setting.key },
        update: { value: setting.value, group: setting.group || "general" },
        create: { key: setting.key, value: setting.value, group: setting.group || "general" },
      })
    )
  );

  return NextResponse.json({ message: "Pengaturan berhasil disimpan" });
}
