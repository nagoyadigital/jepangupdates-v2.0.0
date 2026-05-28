import { z } from "zod";

// ============================================================
// ARTICLE VALIDATIONS
// ============================================================

export const createArticleSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  content: z.string().min(50, "Konten minimal 50 karakter"),
  excerpt: z.string().optional(),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  featuredImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "REVIEW"]).default("DRAFT"),
  isFeatured: z.boolean().optional(),
  isBreaking: z.boolean().optional(),
  isHeadline: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

export const updateArticleSchema = createArticleSchema.partial().extend({
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"]).optional(),
  slug: z.string().optional(),
});

// ============================================================
// CATEGORY VALIDATIONS
// ============================================================

export const categorySchema = z.object({
  name: z.string().min(2, "Nama kategori minimal 2 karakter"),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  order: z.number().optional(),
  isActive: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

// ============================================================
// USER VALIDATIONS
// ============================================================

export const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "PENULIS", "KONTRIBUTOR"]),
  bio: z.string().optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "PENULIS", "KONTRIBUTOR"]).optional(),
  bio: z.string().optional(),
  isActive: z.boolean().optional(),
  image: z.string().optional(),
});

// ============================================================
// AD VALIDATIONS
// ============================================================

export const adSchema = z.object({
  name: z.string().min(2, "Nama iklan minimal 2 karakter"),
  position: z.enum([
    "HEADER_TOP", "HEADER_BANNER", "SIDEBAR_TOP", "SIDEBAR_MIDDLE",
    "SIDEBAR_BOTTOM", "SIDEBAR_LEFT", "SIDEBAR_RIGHT", "ARTICLE_TOP", "ARTICLE_MIDDLE", "ARTICLE_BOTTOM",
    "FOOTER", "POPUP", "MOBILE_TOP", "MOBILE_BOTTOM", "PARALLAX",
  ]),
  type: z.enum(["IMAGE", "SCRIPT", "HTML", "ADSENSE"]).default("IMAGE"),
  content: z.string().min(1, "Konten iklan wajib diisi"),
  link: z.string().url().optional().or(z.literal("")),
  isActive: z.boolean().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  order: z.number().optional(),
  showOnMobile: z.boolean().optional(),
  showOnDesktop: z.boolean().optional(),
});

// ============================================================
// SETTINGS VALIDATIONS
// ============================================================

export const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  group: z.string().optional(),
});

export const settingsBulkSchema = z.object({
  settings: z.array(settingSchema),
});

// ============================================================
// LAYOUT WIDGET VALIDATIONS
// ============================================================

export const layoutWidgetSchema = z.object({
  name: z.string().min(2),
  section: z.string().min(1),
  type: z.string().min(1),
  config: z.string(), // JSON string
  order: z.number().optional(),
  isActive: z.boolean().optional(),
});

// ============================================================
// MENU VALIDATIONS
// ============================================================

export const menuItemSchema = z.object({
  label: z.string().min(1),
  url: z.string().min(1),
  target: z.enum(["_self", "_blank"]).default("_self"),
  order: z.number().optional(),
  parentId: z.string().nullable().optional(),
});

export const menuSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  items: z.array(menuItemSchema).optional(),
});
