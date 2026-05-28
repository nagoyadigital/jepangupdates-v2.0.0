import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/menus - Public endpoint to get navigation menus
export async function GET(request: NextRequest) {
  const location = request.nextUrl.searchParams.get("location");

  const menus = await prisma.menu.findMany({
    where: location ? { location } : {},
    include: {
      items: {
        orderBy: { order: "asc" },
      },
    },
  });

  return NextResponse.json(menus, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}
