import slugify from "slugify";
import { prisma } from "@/lib/prisma";

/**
 * Generate a unique slug from a title.
 * If slug already exists, append a number suffix.
 */
export async function generateUniqueSlug(title: string, existingId?: string): Promise<string> {
  let slug = slugify(title, { lower: true, strict: true, locale: "id" });

  // Check if slug exists
  const existing = await prisma.article.findFirst({
    where: {
      slug,
      ...(existingId ? { NOT: { id: existingId } } : {}),
    },
  });

  if (!existing) return slug;

  // Append number suffix
  let counter = 2;
  while (true) {
    const newSlug = `${slug}-${counter}`;
    const exists = await prisma.article.findFirst({
      where: {
        slug: newSlug,
        ...(existingId ? { NOT: { id: existingId } } : {}),
      },
    });
    if (!exists) return newSlug;
    counter++;
  }
}

/**
 * Calculate read time based on content length
 */
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Format date to Indonesian locale
 */
export function formatDateID(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Paginate helper
 */
export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20")));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}
