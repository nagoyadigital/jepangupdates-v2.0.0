import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const uploadDir = path.join(process.cwd(), "public", "uploads", "2026", "05");
  fs.mkdirSync(uploadDir, { recursive: true });

  const filename = `${uuid()}.webp`;
  const filepath = path.join(uploadDir, filename);
  const publicUrl = `/uploads/2026/05/${filename}`;

  // Use simple text instead of emoji to avoid Pango font issues
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6D28D9;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <circle cx="600" cy="260" r="80" fill="rgba(255,255,255,0.15)"/>
  <text x="600" y="290" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="white" text-anchor="middle">VISA</text>
  <text x="600" y="400" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">Visa Wisata 30 Hari</text>
  <text x="600" y="460" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.7)" text-anchor="middle">Jepang Updates</text>
</svg>`;

  await sharp(Buffer.from(svg)).resize(1200, 630).webp({ quality: 85 }).toFile(filepath);

  await prisma.article.update({
    where: { slug: "jepang-perpanjang-visa-wisata-wni-30-hari" },
    data: { featuredImage: publicUrl },
  });

  console.log(`✅ jepang-perpanjang-visa-wisata-wni-30-hari → ${publicUrl}`);
}

main()
  .catch((e) => { console.error("Error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
