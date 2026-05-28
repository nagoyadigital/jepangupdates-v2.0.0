import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  site_name: string;
  site_tagline: string;
  site_description: string;
  site_url: string;
  site_logo: string;
  site_favicon: string;
  site_language: string;
  // Social
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  tiktok: string;
  telegram: string;
  whatsapp: string;
  line: string;
  // Contact
  contact_email: string;
  ads_email: string;
  contact_phone: string;
  contact_address: string;
};

const defaults: SiteSettings = {
  site_name: "Jepang Updates",
  site_tagline: "Portal Berita Komunitas Indonesia di Jepang",
  site_description: "",
  site_url: "https://jepangupdates.com",
  site_logo: "/jepangupdates-logo-trimmed.png",
  site_favicon: "/favicon.ico",
  site_language: "id",
  facebook: "https://facebook.com/jepangupdates",
  instagram: "https://instagram.com/jepangupdates",
  twitter: "",
  youtube: "https://youtube.com/@jepangupdates",
  tiktok: "https://tiktok.com/@jepangupdates",
  telegram: "",
  whatsapp: "",
  line: "",
  contact_email: "",
  ads_email: "",
  contact_phone: "",
  contact_address: "",
};

/**
 * Server-side: get site settings from database.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { group: { in: ["general", "social", "contact"] } },
    });

    const config: Record<string, string> = {};
    for (const s of settings) {
      config[s.key] = s.value;
    }

    return { ...defaults, ...config } as unknown as SiteSettings;
  } catch {
    return defaults;
  }
}
