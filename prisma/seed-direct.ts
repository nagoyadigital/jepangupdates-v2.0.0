import { createClient } from "@libsql/client";

const db = createClient({ url: "file:prisma/dev.db" });

async function main() {
  console.log("🌱 Seeding database directly...");

  // Admin user
  const hashedPassword = "$2a$12$LQv3c1yqBo9SkvXS7QTJPOoGz3KLBfIq5Y.HCkz8/roB.1fZJXICy";
  const adminId = "admin_001";

  await db.execute({
    sql: `INSERT OR IGNORE INTO users (id, name, email, password, role, isActive, bio, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
    args: [adminId, "Super Admin", "admin@jepangupdates.com", hashedPassword, "SUPER_ADMIN", 1, "Administrator utama Jepang Updates"],
  });
  console.log("✅ Super Admin created");

  // Categories
  const cats = [
    { id: "cat_01", name: "News", slug: "news", color: "#1B5DAF", order: 1 },
    { id: "cat_02", name: "Jepang", slug: "jepang", color: "#E6372E", order: 2 },
    { id: "cat_03", name: "Entertainment", slug: "entertainment", color: "#9333EA", order: 3 },
    { id: "cat_04", name: "Bola & Sports", slug: "bola-sports", color: "#15803D", order: 4 },
    { id: "cat_05", name: "Music", slug: "music", color: "#D97706", order: 5 },
    { id: "cat_06", name: "Pendidikan", slug: "pendidikan", color: "#2563EB", order: 6 },
    { id: "cat_07", name: "Bisnis", slug: "bisnis", color: "#0891B2", order: 7 },
    { id: "cat_08", name: "Politik", slug: "politik", color: "#7C3AED", order: 8 },
    { id: "cat_09", name: "Otomotif", slug: "otomotif", color: "#DC2626", order: 9 },
    { id: "cat_10", name: "Food & Travel", slug: "food-travel", color: "#059669", order: 10 },
    { id: "cat_11", name: "Tekno & Sains", slug: "tekno-sains", color: "#0284C7", order: 11 },
  ];

  for (const c of cats) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO categories (id, name, slug, color, "order", isActive, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, 1, datetime('now'), datetime('now'))`,
      args: [c.id, c.name, c.slug, c.color, c.order],
    });
  }
  console.log(`✅ ${cats.length} categories created`);

  // Articles
  const articles = [
    { id: "art_01", title: "Rebelion Targetkan Back-to-Back Juara KCL Season 9, Aconk: Kami Ingin Pertahankan Gelar", slug: "rebelion-targetkan-back-to-back-juara-kcl-season-9", catId: "cat_01", isHeadline: 1, views: 1840, date: "2026-05-23 21:32:00", image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=900&q=85" },
    { id: "art_02", title: "Kansai Elite Cup 2026 Season 1 Sukses Digelar, Rebellion Kicker Ukir Sejarah", slug: "kansai-elite-cup-2026-season-1-sukses-digelar", catId: "cat_04", isHeadline: 1, views: 1290, date: "2026-05-20 17:55:00", image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?auto=format&fit=crop&w=900&q=85" },
    { id: "art_03", title: "Cirebon Pride Japan Resmi Kantongi Legalitas, Siap Sambut Anniversary ke-2", slug: "cirebon-pride-japan-resmi-kantongi-legalitas", catId: "cat_03", isHeadline: 1, views: 970, date: "2026-05-08 19:20:00", image: "https://images.unsplash.com/photo-1528164344705-47542687000d?auto=format&fit=crop&w=900&q=85" },
    { id: "art_04", title: "Rebellion Kickers FC Juara BVJ Tokai 2026, Tim Futsal Indonesia Bersinar", slug: "rebellion-kickers-fc-juara-bvj-tokai-2026", catId: "cat_04", isHeadline: 0, views: 810, date: "2026-04-28 10:11:00", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=900&q=85" },
    { id: "art_05", title: "Cara Transfer Gaji dari Jepang ke Indonesia: Biaya & Metode Terbaik 2026", slug: "cara-transfer-gaji-dari-jepang-ke-indonesia", catId: "cat_02", isHeadline: 0, views: 1420, date: "2026-04-25 14:00:00", image: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=900&q=85" },
    { id: "art_06", title: "Ujian SSW Bidang Pembersihan Gedung Jepang 2026: Syarat, Format & Tips", slug: "ujian-ssw-bidang-pembersihan-gedung-jepang-2026", catId: "cat_02", isHeadline: 0, views: 560, date: "2026-04-24 09:00:00", image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85" },
    { id: "art_07", title: "Ujian Prometric Tokutei Ginou: Ikut di Indonesia atau Jepang?", slug: "ujian-prometric-tokutei-ginou-perbandingan", catId: "cat_02", isHeadline: 0, views: 480, date: "2026-04-22 11:30:00", image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=900&q=85" },
    { id: "art_08", title: "Goyang Nagoya! Pantura Japan Gelar Halal Bihalal 2026 di RAD HALL", slug: "goyang-nagoya-pantura-japan-halal-bihalal-2026", catId: "cat_05", isHeadline: 0, views: 720, date: "2026-04-20 18:00:00", image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85" },
    { id: "art_09", title: "Jadwal dan Line Up Cirebon Pride Japan 2026 di Nagoya", slug: "jadwal-line-up-cirebon-pride-japan-2026", catId: "cat_05", isHeadline: 0, views: 890, date: "2026-04-18 15:00:00", image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=900&q=85" },
    { id: "art_10", title: "Aftershine Tampil Perdana di Jepang, Siap Guncang Nagoya", slug: "aftershine-tampil-perdana-di-jepang", catId: "cat_05", isHeadline: 0, views: 650, date: "2026-04-15 12:00:00", image: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=900&q=85" },
    { id: "art_11", title: "Ujian SSW Bidang Perikanan Jepang 2026: Syarat & Tips Lolos", slug: "ujian-ssw-bidang-perikanan-jepang-2026", catId: "cat_06", isHeadline: 0, views: 340, date: "2026-04-12 08:00:00", image: "https://images.unsplash.com/photo-1534766438357-2b270dbd1b48?auto=format&fit=crop&w=900&q=85" },
    { id: "art_12", title: "Superkoplo Resmi Lengkapi Line Up CPJ Connect Anniversary ke-2", slug: "superkoplo-resmi-lengkapi-line-up-cpj-connect", catId: "cat_03", isHeadline: 0, views: 640, date: "2026-04-27 20:25:00", image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85" },
  ];

  for (const a of articles) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO articles (id, title, slug, excerpt, content, featuredImage, status, isHeadline, isBreaking, isFeatured, views, publishedAt, authorId, categoryId, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, 'PUBLISHED', ?, 0, 0, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      args: [a.id, a.title, a.slug, a.title, `<p>${a.title}</p>`, a.image, a.isHeadline, a.views, a.date, adminId, a.catId],
    });
  }
  console.log(`✅ ${articles.length} articles created`);

  // Menu
  await db.execute({
    sql: `INSERT OR IGNORE INTO menus (id, name, location, createdAt, updatedAt) VALUES ('menu_01', 'Main Navigation', 'main_nav', datetime('now'), datetime('now'))`,
    args: [],
  });

  const navItems = ["Jepang", "Pendidikan", "News", "Entertainment", "Bisnis", "Music", "Bola & Sports", "Politik", "Otomotif", "Food & Travel", "Tekno & Sains"];
  for (let i = 0; i < navItems.length; i++) {
    const slug = navItems[i].toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
    await db.execute({
      sql: `INSERT OR IGNORE INTO menu_items (id, label, url, target, "order", menuId) VALUES (?, ?, ?, '_self', ?, 'menu_01')`,
      args: [`mi_${i}`, navItems[i], `/kategori/${slug}`, i],
    });
  }
  console.log("✅ Navigation menu created");

  console.log("\n🎉 Seeding completed!");
  console.log("📧 Login: admin@jepangupdates.com");
  console.log("🔑 Password: SuperAdmin123!");
}

main().catch(console.error);
