import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

// POST /api/ads/[id]/click - Track ad click
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  await prisma.ad.update({
    where: { id },
    data: { clicks: { increment: 1 } },
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
