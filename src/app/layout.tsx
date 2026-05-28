import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { WebsiteJsonLd } from "@/components/JsonLd";
import { PopupAd } from "@/components/PopupAd";
import { SeoHead, SeoBodyScripts } from "@/components/SeoHead";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jepang Updates - Portal Berita Komunitas Indonesia di Jepang",
    template: "%s | Jepang Updates",
  },
  description: "Portal berita komunitas Indonesia di Jepang. Informasi terkini seputar pekerjaan, imigrasi, event, dan kehidupan di Jepang.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jepangupdates.com"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Jepang Updates",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <head>
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
