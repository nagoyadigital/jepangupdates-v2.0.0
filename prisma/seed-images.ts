import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import sharp from "sharp";
import { v4 as uuid } from "uuid";
import path from "path";
import fs from "fs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const imageData: { slug: string; label: string; bgColor: string; emoji: string }[] = [
  { slug: "jepang-naikkan-upah-minimum-1100-yen-oktober-2026", label: "Upah Minimum", bgColor: "#1B5DAF", emoji: "💴" },
  { slug: "lowongan-tokutei-ginou-pertanian-5000-pekerja-indonesia", label: "Tokutei Ginou", bgColor: "#059669", emoji: "🌾" },
  { slug: "gempa-m62-guncang-prefektur-ishikawa-mei-2026", label: "Gempa Ishikawa", bgColor: "#DC2626", emoji: "🌏" },
  { slug: "panduan-perpanjangan-visa-kerja-jepang-2026", label: "Visa Kerja", bgColor: "#7C3AED", emoji: "📋" },
  { slug: "festival-bon-odori-jakarta-2026-juli", label: "Bon Odori", bgColor: "#D97706", emoji: "🎆" },
  { slug: "komunitas-muslim-indonesia-osaka-resmikan-masjid-baru", label: "Masjid Osaka", bgColor: "#0891B2", emoji: "🕌" },
  { slug: "startup-indonesia-pendanaan-investor-jepang-50-miliar", label: "Startup", bgColor: "#2563EB", emoji: "🚀" },
  { slug: "timnas-indonesia-u23-vs-jepang-semifinal-piala-asia-2026", label: "Timnas U-23", bgColor: "#15803D", emoji: "⚽" },
  { slug: "beasiswa-mext-2027-panduan-pendaftaran-mahasiswa-indonesia", label: "Beasiswa MEXT", bgColor: "#4F46E5", emoji: "🎓" },
  { slug: "review-film-jepang-the-last-samurai-returns-box-office-2026", label: "Film Samurai", bgColor: "#E11D48", emoji: "🎬" },
  { slug: "jepang-luncurkan-shinkansen-alfa-x-400-kmjam", label: "Shinkansen", bgColor: "#0284C7", emoji: "🚄" },
  { slug: "tips-hemat-biaya-hidup-tokyo-pekerja-indonesia-150000-yen", label: "Tips Hemat", bgColor: "#EA580C", emoji: "💰" },
  { slug: "anime-one-piece-live-action-season-2-syuting-jepang", label: "One Piece", bgColor: "#9333EA", emoji: "🏴‍☠️" },
  { slug: "kbri-tokyo-job-fair-wni-50-perusahaan-jepang-2026", label: "Job Fair", bgColor: "#059669", emoji: "💼" },
  { slug: "jepang-perpanjang-visa-wisata-wni-30-hari", label: "Visa Wisata", bgColor: "#6D28D9", emoji: "✈️" },
];

function createSvg(label: string, bgColor: string, emoji: string): string {
  return `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="600" y="280" font-size="120" text-anchor="middle">${emoji}</text>
  <text x="600" y="400" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle">${label}</text>
  <text x="600" y="460" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.7)" text-anchor="middle">Jepang Updates</text>
</svg>`;
}

async function main() {
  console.log("🖼️  Generating featured images for 15 articles...");

  const uploadDir = path.join(process.cwd(), "public", "uploads", "2026", "05");
  fs.mkdirSync(uploadDir, { recursive: true });

  for (const item of imageData) {
    const filename = `${uuid()}.webp`;
    const filepath = path.join(uploadDir, filename);
    const publicUrl = `/uploads/2026/05/${filename}`;

    const svg = createSvg(item.label, item.bgColor, item.emoji);
    await sharp(Buffer.from(svg)).resize(1200, 630).webp({ quality: 85 }).toFile(filepath);

    await prisma.article.update({
      where: { slug: item.slug },
      data: { featuredImage: publicUrl },
    });

    console.log(`✅ ${item.slug} → ${publicUrl}`);
  }

  console.log("\n🎉 All 15 articles now have featured images!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
