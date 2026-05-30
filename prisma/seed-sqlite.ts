import { config } from "dotenv";
config({ path: ".env" });
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

const libsql = createClient({ url: process.env.DATABASE_URL || "file:prisma/dev.db" });
const adapter = new PrismaLibSql(libsql);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding SQLite database...");

  // Simple hash for dev (not bcrypt since it may not be installed)
  const hashedPassword = "$2a$12$LQv3c1yqBo9SkvXS7QTJPOoGz3KLBfIq5Y.HCkz8/roB.1fZJXICy"; // SuperAdmin123!

  const superAdmin = await prisma.user.upsert({
    where: { email: "admin@jepangupdates.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@jepangupdates.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true,
      bio: "Administrator utama Jepang Updates",
    },
  });
  console.log(`✅ Super Admin: ${superAdmin.email}`);

  // Categories
  const cats = [
    { name: "News", slug: "news", color: "#1B5DAF", order: 1 },
    { name: "Jepang", slug: "jepang", color: "#E6372E", order: 2 },
    { name: "Entertainment", slug: "entertainment", color: "#9333EA", order: 3 },
    { name: "Bola & Sports", slug: "bola-sports", color: "#15803D", order: 4 },
    { name: "Music", slug: "music", color: "#D97706", order: 5 },
    { name: "Pendidikan", slug: "pendidikan", color: "#2563EB", order: 6 },
    { name: "Bisnis", slug: "bisnis", color: "#0891B2", order: 7 },
    { name: "Politik", slug: "politik", color: "#7C3AED", order: 8 },
    { name: "Otomotif", slug: "otomotif", color: "#DC2626", order: 9 },
    { name: "Food & Travel", slug: "food-travel", color: "#059669", order: 10 },
    { name: "Tekno & Sains", slug: "tekno-sains", color: "#0284C7", order: 11 },
  ];

  for (const cat of cats) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, isActive: true },
    });
  }
  console.log(`✅ ${cats.length} categories created`);

  // Sample articles
  const articles = [
    {
      title: "Rebelion Targetkan Back-to-Back Juara KCL Season 9",
      slug: "rebelion-targetkan-back-to-back-juara-kcl-season-9",
      excerpt: "Tim Rebelion menargetkan gelar juara berturut-turut.",
      content: "<p>Tim Rebelion menargetkan gelar juara berturut-turut di KCL Season 9. Aconk sebagai kapten menyatakan tekad kuat untuk mempertahankan gelar.</p>",
      featuredImage: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=85",
      categorySlug: "news",
      isHeadline: true,
      views: 1840,
      publishedAt: new Date("2026-05-23T21:32:00"),
    },
    {
      title: "Kansai Elite Cup 2026 Season 1 Sukses Digelar",
      slug: "kansai-elite-cup-2026-season-1-sukses-digelar",
      excerpt: "Rebellion Kicker berhasil menjadi juara perdana.",
      content: "<p>Kansai Elite Cup 2026 Season 1 sukses digelar dengan Rebellion Kicker sebagai juara perdana.</p>",
      featuredImage: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=85",
      categorySlug: "bola-sports",
      isHeadline: true,
      views: 1290,
      publishedAt: new Date("2026-05-20T17:55:00"),
    },
    {
      title: "Cirebon Pride Japan Resmi Kantongi Legalitas",
      slug: "cirebon-pride-japan-resmi-kantongi-legalitas",
      excerpt: "CPJ resmi memasuki babak baru dalam perjalanannya.",
      content: "<p>Cirebon Pride Japan resmi memasuki babak baru sebagai komunitas diaspora Indonesia di Jepang.</p>",
      featuredImage: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=900&q=85",
      categorySlug: "entertainment",
      isHeadline: true,
      views: 970,
      publishedAt: new Date("2026-05-08T19:20:00"),
    },
    {
      title: "Cara Transfer Gaji dari Jepang ke Indonesia: Biaya & Metode Terbaik 2026",
      slug: "cara-transfer-gaji-dari-jepang-ke-indonesia",
      excerpt: "Panduan lengkap transfer uang dari Jepang ke Indonesia.",
      content: "<p>Panduan lengkap cara transfer gaji dari Jepang ke Indonesia dengan biaya termurah.</p>",
      featuredImage: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=900&q=85",
      categorySlug: "jepang",
      isHeadline: false,
      views: 1420,
      publishedAt: new Date("2026-04-25T14:00:00"),
    },
    {
      title: "Ujian SSW Bidang Pembersihan Gedung Jepang 2026",
      slug: "ujian-ssw-bidang-pembersihan-gedung-jepang-2026",
      excerpt: "Panduan lengkap ujian SSW bidang pembersihan gedung.",
      content: "<p>Informasi lengkap tentang ujian SSW bidang pembersihan gedung di Jepang tahun 2026.</p>",
      featuredImage: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85",
      categorySlug: "jepang",
      isHeadline: false,
      views: 560,
      publishedAt: new Date("2026-04-24T09:00:00"),
    },
    {
      title: "Ujian Prometric Tokutei Ginou: Ikut di Indonesia atau Jepang?",
      slug: "ujian-prometric-tokutei-ginou-perbandingan",
      excerpt: "Perbandingan lengkap ujian Prometric di Indonesia vs Jepang.",
      content: "<p>Perbandingan lengkap mengikuti ujian Prometric Tokutei Ginou di Indonesia atau di Jepang.</p>",
      featuredImage: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=900&q=85",
      categorySlug: "jepang",
      isHeadline: false,
      views: 480,
      publishedAt: new Date("2026-04-22T11:30:00"),
    },
    {
      title: "Goyang Nagoya! Pantura Japan Gelar Halal Bihalal 2026",
      slug: "goyang-nagoya-pantura-japan-halal-bihalal-2026",
      excerpt: "Pantura Japan menggelar acara halal bihalal meriah.",
      content: "<p>Pantura Japan menggelar acara halal bihalal 2026 bersama bintang dangdut di RAD HALL Nagoya.</p>",
      featuredImage: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85",
      categorySlug: "music",
      isHeadline: false,
      views: 720,
      publishedAt: new Date("2026-04-20T18:00:00"),
    },
    {
      title: "Jadwal dan Line Up Cirebon Pride Japan 2026 di Nagoya",
      slug: "jadwal-line-up-cirebon-pride-japan-2026",
      excerpt: "Line up lengkap CPJ 2026 di Nagoya resmi diumumkan.",
      content: "<p>Jadwal dan line up lengkap Cirebon Pride Japan 2026 di Nagoya telah resmi diumumkan.</p>",
      featuredImage: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=85",
      categorySlug: "music",
      isHeadline: false,
      views: 890,
      publishedAt: new Date("2026-04-18T15:00:00"),
    },
    {
      title: "Aftershine Tampil Perdana di Jepang, Siap Guncang Nagoya",
      slug: "aftershine-tampil-perdana-di-jepang",
      excerpt: "Band Aftershine akan tampil untuk pertama kalinya di Jepang.",
      content: "<p>Aftershine akan tampil perdana di Jepang dalam rangka anniversary Cirebon Pride Japan.</p>",
      featuredImage: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=900&q=85",
      categorySlug: "music",
      isHeadline: false,
      views: 650,
      publishedAt: new Date("2026-04-15T12:00:00"),
    },
  ];

  for (const art of articles) {
    const category = await prisma.category.findUnique({ where: { slug: art.categorySlug } });
    if (!category) continue;

    await prisma.article.upsert({
      where: { slug: art.slug },
      update: {},
      create: {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        content: art.content,
        featuredImage: art.featuredImage,
        status: "PUBLISHED",
        isHeadline: art.isHeadline,
        views: art.views,
        publishedAt: art.publishedAt,
        authorId: superAdmin.id,
        categoryId: category.id,
      },
    });
  }
  console.log(`✅ ${articles.length} articles created`);

  // Menu
  const menu = await prisma.menu.upsert({
    where: { location: "main_nav" },
    update: {},
    create: { name: "Main Navigation", location: "main_nav" },
  });

  const navItems = ["Jepang", "Pendidikan", "News", "Entertainment", "Bisnis", "Music", "Bola & Sports", "Politik", "Otomotif", "Food & Travel", "Tekno & Sains"];
  for (let i = 0; i < navItems.length; i++) {
    const slug = navItems[i].toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    await prisma.menuItem.create({
      data: { label: navItems[i], url: `/kategori/${slug}`, order: i, menuId: menu.id },
    });
  }
  console.log(`✅ Navigation menu created`);

  console.log("\n🎉 Seeding completed!");
  console.log("📧 Login: admin@jepangupdates.com");
  console.log("🔑 Password: SuperAdmin123!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
