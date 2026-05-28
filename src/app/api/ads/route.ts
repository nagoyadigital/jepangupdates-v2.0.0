import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/ads - Public: get active ads by position
export async function GET(request: NextRequest) {
  const position = request.nextUrl.searchParams.get("position");
  const now = new Date();

  const where = {
    isActive: true,
    ...(position ? { position: position as "HEADER_TOP" | "SIDEBAR_TOP" } : {}),
    OR: [
      { startDate: null, endDate: null },
      { startDate: { lte: now }, endDate: null },
      { startDate: null, endDate: { gte: now } },
      { startDate: { lte: now }, endDate: { gte: now } },
    ],
  };

  const ads = await prisma.ad.findMany({
    where,
    select: {
      id: true,
      name: true,
      position: true,
      type: true,
      content: true,
      link: true,
      showOnMobile: true,
      showOnDesktop: true,
      order: true,
    },
    orderBy: { order: "asc" },
  });

  return NextResponse.json(ads);
}
