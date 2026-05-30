import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/settings/public - Public endpoint for site settings (general, social, contact)
export async function GET() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      group: { in: ["general", "social", "contact", "appearance", "footer"] },
    },
  });

  const grouped: Record<string, Record<string, string>> = {};
  for (const s of settings) {
    if (!grouped[s.group]) grouped[s.group] = {};
    grouped[s.group][s.key] = s.value;
  }

  return NextResponse.json(grouped, {
    headers: { "Cache-Control": "no-cache" },
  });
}
