import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, permissions } from "@/lib/auth-utils";
import { adSchema } from "@/lib/validations";

// GET /api/admin/ads - List all ads
export async function GET() {
  const { error } = await requireAuth("ADMIN");
  if (error) return error;

  const ads = await prisma.ad.findMany({
    orderBy: [{ position: "asc" }, { order: "asc" }],
  });

  return NextResponse.json(ads);
}

// POST /api/admin/ads - Create ad
export async function POST(request: NextRequest) {
  const { error, session } = await requireAuth("ADMIN");
  if (error) return error;

  if (!permissions.canManageAds(session!.user.role)) {
    return NextResponse.json({ error: "Akses ditolak" }, { status: 403 });
  }

  const body = await request.json();
  const validation = adSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: "Validasi gagal", details: validation.error.flatten() },
      { status: 400 }
    );
  }

  const data = validation.data;

  const ad = await prisma.ad.create({
    data: {
      name: data.name,
      position: data.position,
      type: data.type,
      content: data.content,
      link: data.link || null,
      isActive: data.isActive ?? true,
      startDate: data.startDate ? new Date(data.startDate) : null,
      endDate: data.endDate ? new Date(data.endDate) : null,
      order: data.order || 0,
      showOnMobile: data.showOnMobile ?? true,
      showOnDesktop: data.showOnDesktop ?? true,
    },
  });

  return NextResponse.json(ad, { status: 201 });
}
