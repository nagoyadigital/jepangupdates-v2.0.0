import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Create Super Admin
  const hashedPassword = await bcrypt.hash("SuperAdmin123!", 12);

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

  console.log(`✅ Super Admin created: ${superAdmin.email}`);

  // Create categories
  const categories = [
    { name: "Berita Jepang", slug: "berita-jepang", color: "#1B5DAF", order: 1 },
    { name: "Pekerjaan", slug: "pekerjaan", color: "#059669", order: 2 },
    { name: "Imigrasi", slug: "imigrasi", color: "#7C3AED", order: 3 },
    { name: "Tokutei Ginou", slug: "tokutei-ginou", color: "#DC2626", order: 4 },
    { name: "Pendidikan", slug: "pendidikan", color: "#2563EB", order: 5 },
    { name: "Event", slug: "event", color: "#D97706", order: 6 },
    { name: "Komunitas", slug: "komunitas", color: "#EC4899", order: 7 },
    { name: "Bisnis", slug: "bisnis", color: "#0891B2", order: 8 },
    { name: "Olahraga", slug: "olahraga", color: "#16A34A", order: 9 },
    { name: "Hiburan", slug: "hiburan", color: "#E11D48", order: 10 },
    { name: "Entertainment", slug: "entertainment", color: "#9333EA", order: 11 },
    { name: "Bola & Sports", slug: "bola-sports", color: "#15803D", order: 12 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        color: cat.color,
        order: cat.order,
        isActive: true,
      },
    });
  }

  console.log(`✅ ${categories.length} categories created`);

  // Create default site settings
  const defaultSettings = [
    { key: "site_title", value: "Jepang Updates", group: "seo" },
    { key: "site_description", value: "Portal berita komunitas Indonesia di Jepang", group: "seo" },
    { key: "default_og_image", value: "/jepangupdates-logo.png", group: "seo" },
    { key: "sitemap_enabled", value: "true", group: "seo" },
    { key: "robots_txt", value: "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/admin/\nSitemap: https://jepangupdates.com/sitemap.xml", group: "seo" },
    { key: "site_name", value: "Jepang Updates", group: "general" },
    { key: "site_tagline", value: "Portal Berita Komunitas Indonesia di Jepang", group: "general" },
    { key: "contact_email", value: "redaksi@jepangupdates.com", group: "general" },
    { key: "articles_per_page", value: "20", group: "appearance" },
    { key: "show_breaking_news", value: "true", group: "appearance" },
    { key: "show_weather_widget", value: "true", group: "appearance" },
    { key: "show_prayer_times", value: "true", group: "appearance" },
  ];

  for (const setting of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log(`✅ ${defaultSettings.length} default settings created`);

  // Create default menus
  const mainMenu = await prisma.menu.upsert({
    where: { location: "main_nav" },
    update: {},
    create: {
      name: "Menu Utama",
      location: "main_nav",
    },
  });

  const menuItems = [
    { label: "Berita Jepang", url: "/kategori/berita-jepang", order: 1 },
    { label: "Pekerjaan", url: "/kategori/pekerjaan", order: 2 },
    { label: "Imigrasi", url: "/kategori/imigrasi", order: 3 },
    { label: "Tokutei Ginou", url: "/kategori/tokutei-ginou", order: 4 },
    { label: "Pendidikan", url: "/kategori/pendidikan", order: 5 },
    { label: "Event", url: "/kategori/event", order: 6 },
    { label: "Komunitas", url: "/kategori/komunitas", order: 7 },
  ];

  // Delete existing menu items first
  await prisma.menuItem.deleteMany({ where: { menuId: mainMenu.id } });

  for (const item of menuItems) {
    await prisma.menuItem.create({
      data: { ...item, menuId: mainMenu.id },
    });
  }

  console.log(`✅ Main menu with ${menuItems.length} items created`);

  console.log("\n🎉 Seeding completed!");
  console.log("📧 Login: admin@jepangupdates.com");
  console.log("🔑 Password: SuperAdmin123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
