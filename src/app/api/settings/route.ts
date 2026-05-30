import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/settings?group=footer - Public endpoint for specific settings group
export async function GET(request: NextRequest) {
  const group = request.nextUrl.searchParams.get("group");

  if (!group) {
    return NextResponse.json({ error: "group parameter required" }, { status: 400 });
  }

  // Only allow public groups
  const allowedGroups = ["general", "social", "footer", "appearance"];
  if (!allowedGroups.includes(group)) {
    return NextResponse.json({ error: "group not allowed" }, { status: 403 });
  }

  const settings = await prisma.siteSetting.findMany({
    where: { group },
  });

  const result: Record<string, string> = {};
  for (const s of settings) {
    result[s.key] = s.value;
  }

  return NextResponse.json(result, {
    headers: { "Cache-Control": "public, max-age=60" },
  });
}
