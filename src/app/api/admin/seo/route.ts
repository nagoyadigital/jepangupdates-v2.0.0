import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";

// GET /api/admin/seo - Get SEO settings
export async function GET() {
  const { error } = await requireAuth("ADMIN");
  if (error) return error;

  const settings = await prisma.siteSetting.findMany({
    where: { group: "seo" },
  });

  const seo: Record<string, string> = {};
  for (const s of settings) {
    seo[s.key] = s.value;
  }

  return NextResponse.json(seo);
}

// PUT /api/admin/seo - Update SEO settings
export async function PUT(request: NextRequest) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageSEO(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();

  // Expected keys: site_title, site_description, default_og_image,
  // google_analytics_id, google_search_console, robots_txt, sitemap_enabled
  const allowedKeys = [
    "site_title",
    "site_description",
    "default_og_image",
    "google_analytics_id",
    "google_search_console",
    "bing_webmaster",
    "robots_txt",
    "sitemap_enabled",
    "structured_data",
    "twitter_handle",
    "facebook_app_id",
  ];

  const updates = Object.entries(body).filter(([key]) => allowedKeys.includes(key));

  await Promise.all(
    updates.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value), group: "seo" },
      })
    )
  );

  return NextResponse.json({ message: "Pengaturan SEO berhasil disimpan" });
}
