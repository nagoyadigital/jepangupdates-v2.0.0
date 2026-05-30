import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Providers } from "@/components/Providers";
import { WebsiteJsonLd } from "@/components/JsonLd";
import { PopupAd } from "@/components/PopupAd";
import { SeoHead, SeoBodyScripts } from "@/components/SeoHead";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
  preload: true,
});

import { prisma } from "@/lib/prisma";

async function getSiteSettings() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { group: { in: ["general", "seo"] } },
    });
    const result: Record<string, string> = {};
    for (const s of settings) result[s.key] = s.value;
    return result;
  } catch {
    return {};
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSiteSettings();
  const siteName = s.site_name || "Jepang Updates";
  const tagline = s.site_tagline || "Portal Berita Komunitas Indonesia di Jepang";
  const description = s.site_description || "Portal berita komunitas Indonesia di Jepang.";
  const siteUrl = s.site_url || "https://jepangupdates.com";
  const favicon = s.site_favicon || "/fav-icon.PNG";

  return {
    title: {
      default: `${siteName} - ${tagline}`,
      template: `%s | ${siteName}`,
    },
    description,
    metadataBase: new URL(siteUrl),
    keywords: ["berita jepang", "indonesia di jepang", "pekerjaan jepang", "tokutei ginou", "SSW jepang", siteName.toLowerCase()],
    authors: [{ name: siteName, url: siteUrl }],
    creator: siteName,
    publisher: siteName,
    formatDetection: { telephone: false },
    openGraph: {
      type: "website",
      locale: "id_ID",
      siteName,
      images: [{ url: s.site_logo || "/jepangupdates-logo.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      site: "@jepangupdates",
      creator: "@jepangupdates",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
    },
    alternates: { canonical: siteUrl },
    category: "news",
    icons: { icon: favicon, apple: favicon },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`h-full antialiased ${montserrat.variable}`}>
      <head>
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://api.open-meteo.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1B5DAF" />
        {/* Hreflang */}
        <link rel="alternate" hrefLang="id" href="https://jepangupdates.com" />
        <link rel="alternate" hrefLang="x-default" href="https://jepangupdates.com" />
        <SeoHead />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          {children}
          <PopupAd />
        </Providers>
        <WebsiteJsonLd />
        <SeoBodyScripts />
      </body>
    </html>
  );
}
