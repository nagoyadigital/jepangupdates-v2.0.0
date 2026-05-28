import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Providers } from "@/components/Providers";
import { WebsiteJsonLd } from "@/components/JsonLd";
import { PopupAd } from "@/components/PopupAd";
import { SeoHead, SeoBodyScripts } from "@/components/SeoHead";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: {
    default: "Jepang Updates - Portal Berita Komunitas Indonesia di Jepang",
    template: "%s | Jepang Updates",
  },
  description: "Portal berita komunitas Indonesia di Jepang. Informasi terkini seputar pekerjaan, imigrasi, event, dan kehidupan di Jepang.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jepangupdates.com"),
  keywords: ["berita jepang", "indonesia di jepang", "pekerjaan jepang", "tokutei ginou", "SSW jepang", "komunitas indonesia jepang", "jepang updates"],
  authors: [{ name: "Jepang Updates", url: "https://jepangupdates.com" }],
  creator: "Jepang Updates",
  publisher: "Jepang Updates",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Jepang Updates",
    images: [{ url: "/jepangupdates-logo.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@jepangupdates",
    creator: "@jepangupdates",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://jepangupdates.com",
    languages: {
      "id-ID": "https://jepangupdates.com",
    },
  },
  category: "news",
  icons: {
    icon: "/fav-icon.PNG",
    apple: "/fav-icon.PNG",
  },
};

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
