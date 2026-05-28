import { NextResponse } from "next/server";
import { getWidgetConfig } from "@/lib/widgets";

// GET /api/widgets - Public endpoint to get widget configuration
export async function GET() {
  const config = await getWidgetConfig();
  return NextResponse.json(config, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}
