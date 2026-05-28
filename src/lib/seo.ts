import { prisma } from "@/lib/prisma";

export type SeoConfig = {
  site_title: string;
  site_tagline: string;
  meta_description: string;
  meta_keywords: string;
  canonical_domain: string;
  og_image: string;
  og_type: string;
  twitter_handle: string;
  facebook_page: string;
  google_verification: string;
  bing_verification: string;
  yandex_verification: string;
  pinterest_verification: string;
  google_analytics_id: string;
  gtm_id: string;
  head_scripts: string;
  body_scripts: string;
};

const defaults: SeoConfig = {
  site_title: "Jepang Updates - Portal Berita Komunitas Indonesia di Jepang",
  site_tagline: "Informasi terkini seputar pekerjaan, imigrasi, event, dan kehidupan di Jepang",
  meta_description: "Portal berita komunitas Indonesia di Jepang. Informasi terkini seputar pekerjaan, imigrasi, event, dan kehidupan di Jepang.",
  meta_keywords: "jepang, berita jepang, indonesia di jepang, pekerjaan jepang",
  canonical_domain: "https://jepangupdates.com",
  og_image: "/jepangupdates-logo.png",
  og_type: "website",
  twitter_handle: "@jepangupdates",
  facebook_page: "",
  google_verification: "",
  bing_verification: "",
  yandex_verification: "",
  pinterest_verification: "",
  google_analytics_id: "",
  gtm_id: "",
  head_scripts: "",
  body_scripts: "",
};

/**
 * Server-side: get SEO configuration from database.
 */
export async function getSeoConfig(): Promise<SeoConfig> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { group: "seo" },
    });

    if (settings.length === 0) return defaults;

    const config: Record<string, string> = {};
    for (const s of settings) {
      config[s.key] = s.value;
    }

    return { ...defaults, ...config } as SeoConfig;
  } catch {
    return defaults;
  }
}
