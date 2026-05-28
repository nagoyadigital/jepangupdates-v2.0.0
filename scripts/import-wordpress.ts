/**
 * Import WordPress XML (WXR) ke database JepangUpdates
 * 
 * Cara pakai:
 * 1. Export dari WordPress: Tools → Export → All Content → Download
 * 2. Simpan file XML di folder scripts/
 * 3. Jalankan: npx tsx scripts/import-wordpress.ts ./scripts/nama-file.xml
 */

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { readFileSync } from "fs";
import { resolve } from "path";
import slugify from "slugify";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Simple XML parser for WordPress WXR format
function parseWXR(xml: string) {
  const items: Array<{
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    status: string;
    date: string;
    author: string;
    categories: string[];
    tags: string[];
    featuredImage: string | null;
  }> = [];

  // Extract items (posts)
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];

    // Only import posts (not pages, attachments, etc.)
    const postType = extractTag(item, "wp:post_type");
    if (postType !== "post") continue;

    const status = extractTag(item, "wp:status");
    if (status === "trash") continue;

    const title = extractTag(item, "title");
    const content = extractCDATA(item, "content:encoded");
    const excerpt = extractCDATA(item, "excerpt:encoded");
    const slug = extractTag(item, "wp:post_name") || slugify(title, { lower: true, strict: true });
    const date = extractTag(item, "wp:post_date");
    const author = extractTag(item, "dc:creator");

    // Extract categories
    const categories: string[] = [];
    const catRegex = /<category domain="category"[^>]*><!\[CDATA\[(.*?)\]\]><\/category>/g;
    let catMatch;
    while ((catMatch = catRegex.exec(item)) !== null) {
      categories.push(catMatch[1]);
    }

    // Extract tags
    const tags: string[] = [];
    const tagRegex = /<category domain="post_tag"[^>]*><!\[CDATA\[(.*?)\]\]><\/category>/g;
    let tagMatch;
    while ((tagMatch = tagRegex.exec(item)) !== null) {
      tags.push(tagMatch[1]);
    }

    // Try to find featured image from meta
    let featuredImage: string | null = null;
    const attachmentUrl = extractTag(item, "wp:attachment_url");
    if (attachmentUrl) featuredImage = attachmentUrl;

    items.push({
      title,
      content,
      excerpt,
      slug,
      status: status === "publish" ? "PUBLISHED" : "DRAFT",
      date,
      author,
      categories: categories.length > 0 ? categories : ["Berita Jepang"],
      tags,
      featuredImage,
    });
  }

  return items;
}

function extractTag(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`);
  const match = regex.exec(xml);
  return match ? match[1].replace(/<!\[CDATA\[|\]\]>/g, "").trim() : "";
}

function extractCDATA(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}>[\\s\\S]*?<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>[\\s\\S]*?<\\/${tag}>`);
  const match = regex.exec(xml);
  return match ? match[1].trim() : "";
}

async function main() {
  const filePath = process.argv[2];
  if (!filePath) {
    console.error("❌ Gunakan: npx tsx scripts/import-wordpress.ts ./path/to/export.xml");
    process.exit(1);
  }

  const fullPath = resolve(filePath);
  console.log(`📂 Membaca file: ${fullPath}`);

  const xml = readFileSync(fullPath, "utf-8");
  const posts = parseWXR(xml);

  console.log(`📝 Ditemukan ${posts.length} artikel untuk diimport\n`);

  // Get or create default author
  let defaultAuthor = await prisma.user.findFirst({ where: { role: "SUPER_ADMIN" } });
  if (!defaultAuthor) {
    console.error("❌ Tidak ada Super Admin. Jalankan db:seed dulu.");
    process.exit(1);
  }

  let imported = 0;
  let skipped = 0;

  for (const post of posts) {
    // Check if slug already exists
    const existing = await prisma.article.findUnique({ where: { slug: post.slug } });
    if (existing) {
      skipped++;
      continue;
    }

    // Get or create category
    const catName = post.categories[0];
    const catSlug = slugify(catName, { lower: true, strict: true });
    let category = await prisma.category.findUnique({ where: { slug: catSlug } });
    if (!category) {
      category = await prisma.category.create({
        data: { name: catName, slug: catSlug, isActive: true },
      });
    }

    // Create tags
    const tagIds: string[] = [];
    for (const tagName of post.tags) {
      const tagSlug = slugify(tagName, { lower: true, strict: true });
      let tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
      if (!tag) {
        tag = await prisma.tag.create({ data: { name: tagName, slug: tagSlug } });
      }
      tagIds.push(tag.id);
    }

    // Create article
    await prisma.article.create({
      data: {
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ""),
        status: post.status as "PUBLISHED" | "DRAFT",
        publishedAt: post.status === "PUBLISHED" && post.date ? new Date(post.date) : null,
        featuredImage: post.featuredImage,
        authorId: defaultAuthor.id,
        categoryId: category.id,
        readTime: Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200)),
        metaTitle: post.title,
        metaDescription: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ""),
        ...(tagIds.length > 0
          ? { tags: { create: tagIds.map((tagId) => ({ tag: { connect: { id: tagId } } })) } }
          : {}),
      },
    });

    imported++;
    if (imported % 10 === 0) console.log(`  ✅ ${imported} artikel diimport...`);
  }

  console.log(`\n🎉 Import selesai!`);
  console.log(`  ✅ Berhasil: ${imported} artikel`);
  console.log(`  ⏭️  Dilewati (sudah ada): ${skipped} artikel`);

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("❌ Error:", e.message);
  process.exit(1);
});
