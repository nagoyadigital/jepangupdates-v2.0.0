"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FooterAd } from "./FooterAd";

type MenuItem = { label: string; url: string; target: string };
type FooterSettings = {
  footer_description: string;
  footer_copyright: string;
  footer_developer_text: string;
  footer_developer_name: string;
  footer_developer_url: string;
  footer_bg_color: string;
  footer_text_color: string;
  footer_border_color: string;
  footer_logo: string;
  footer_show_logo: string;
  footer_show_description: string;
  footer_show_developer: string;
};

const defaultSettings: FooterSettings = {
  footer_description: "",
  footer_copyright: "© 2026 Jepang Updates. All rights reserved.",
  footer_developer_text: "Developed by",
  footer_developer_name: "Nagoya Digital",
  footer_developer_url: "https://nagoyadigital.com",
  footer_bg_color: "",
  footer_text_color: "",
  footer_border_color: "",
  footer_logo: "",
  footer_show_logo: "true",
  footer_show_description: "true",
  footer_show_developer: "true",
};

export function Footer() {
  const [footerMenu, setFooterMenu] = useState<MenuItem[]>([]);
  const [companyMenu, setCompanyMenu] = useState<MenuItem[]>([]);
  const [legalMenu, setLegalMenu] = useState<MenuItem[]>([]);
  const [settings, setSettings] = useState<FooterSettings>(defaultSettings);

  useEffect(() => {
    fetch("/api/settings/public")
      .then(r => r.ok ? r.json() : {})
      .then((data: Record<string, Record<string, string>>) => {
        const footerData = data?.footer || {};
        const generalData = data?.general || {};
        
        // Footer logo: prioritas dari general.footer_logo (upload terpisah)
        const footerLogo = generalData.footer_logo || "";
        
        setSettings(prev => ({
          ...prev,
          footer_description: footerData.footer_description || generalData.site_description || prev.footer_description,
          footer_copyright: footerData.footer_copyright || prev.footer_copyright,
          footer_developer_text: footerData.footer_developer_text || prev.footer_developer_text,
          footer_developer_name: footerData.footer_developer_name || prev.footer_developer_name,
          footer_developer_url: footerData.footer_developer_url || prev.footer_developer_url,
          footer_bg_color: footerData.footer_bg_color || prev.footer_bg_color,
          footer_text_color: footerData.footer_text_color || prev.footer_text_color,
          footer_border_color: footerData.footer_border_color || prev.footer_border_color,
          footer_logo: footerLogo,
          footer_show_logo: footerData.footer_show_logo || prev.footer_show_logo,
          footer_show_description: footerData.footer_show_description || prev.footer_show_description,
          footer_show_developer: footerData.footer_show_developer || prev.footer_show_developer,
        }));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Fetch footer kategori
    fetch("/api/menus?location=footer_nav")
      .then(r => r.ok ? r.json() : [])
      .then((menus) => {
        if (Array.isArray(menus) && menus.length > 0 && menus[0].items?.length > 0) {
          setFooterMenu(menus[0].items.map((item: MenuItem & { id?: string; order?: number }) => ({
            label: item.label, url: item.url, target: item.target || "_self",
          })));
        }
      })
      .catch(() => {});

    // Fetch footer perusahaan
    fetch("/api/menus?location=footer_company")
      .then(r => r.ok ? r.json() : [])
      .then((menus) => {
        if (Array.isArray(menus) && menus.length > 0 && menus[0].items?.length > 0) {
          setCompanyMenu(menus[0].items.map((item: MenuItem & { id?: string; order?: number }) => ({
            label: item.label, url: item.url, target: item.target || "_self",
          })));
        }
      })
      .catch(() => {});

    // Fetch footer legal
    fetch("/api/menus?location=footer_legal")
      .then(r => r.ok ? r.json() : [])
      .then((menus) => {
        if (Array.isArray(menus) && menus.length > 0 && menus[0].items?.length > 0) {
          setLegalMenu(menus[0].items.map((item: MenuItem & { id?: string; order?: number }) => ({
            label: item.label, url: item.url, target: item.target || "_self",
          })));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <>
    <FooterAd />
    <footer className="border-t-2 text-white" style={{ backgroundColor: "var(--footer-bg, #1B5DAF)", borderColor: "var(--footer-border, #E51B23)", color: "var(--footer-text, #ffffff)" }}>
      <div className="mx-auto grid max-w-6xl gap-9 px-4 py-12 text-center sm:px-6 md:grid-cols-5 md:text-left lg:px-8">
        <div className="flex flex-col items-center md:col-span-2 md:items-start">
          {settings.footer_show_logo === "true" && settings.footer_logo && (
            <Link href="/" className="flex h-[58px] w-fit items-center bg-transparent sm:h-[68px]" aria-label="Jepang Updates homepage">
              <img
                src={settings.footer_logo}
                alt="Jepang Updates"
                className="h-full w-auto object-contain"
              />
            </Link>
          )}
          {settings.footer_show_description === "true" && (
            <p className="mt-5 max-w-xl text-sm leading-7" style={{ color: `${settings.footer_text_color}b3` }}>
              {settings.footer_description}
            </p>
          )}
        </div>
        <div className="w-full">
          <h3 className="font-bold text-white">Kategori</h3>
          <div className="mt-4 grid justify-items-center gap-2 text-sm text-white/75 md:justify-items-start">
            {footerMenu.length > 0 ? (
              footerMenu.slice(0, 6).map((item) => (
                <Link href={item.url} target={item.target} key={item.label} className="hover:text-white">
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link href="/kategori/berita-jepang" className="hover:text-white">Berita Jepang</Link>
                <Link href="/kategori/pekerjaan" className="hover:text-white">Pekerjaan</Link>
                <Link href="/kategori/pendidikan" className="hover:text-white">Pendidikan</Link>
                <Link href="/kategori/event" className="hover:text-white">Event</Link>
                <Link href="/kategori/komunitas" className="hover:text-white">Komunitas</Link>
                <Link href="/kategori/bisnis" className="hover:text-white">Bisnis</Link>
              </>
            )}
          </div>
        </div>
        <div className="w-full">
          <h3 className="font-bold text-white">Perusahaan</h3>
          <div className="mt-4 grid justify-items-center gap-2 text-sm text-white/75 md:justify-items-start">
            {companyMenu.length > 0 ? (
              companyMenu.map((item) => (
                <Link href={item.url} target={item.target} key={item.label} className="hover:text-white">
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link href="/tentang-kami" className="hover:text-white">Tentang Kami</Link>
                <Link href="/redaksi" className="hover:text-white">Redaksi</Link>
                <Link href="/iklan" className="hover:text-white">Iklan</Link>
                <Link href="/media-partner" className="hover:text-white">Media Partner</Link>
                <Link href="/kontak" className="hover:text-white">Kontak</Link>
              </>
            )}
          </div>
        </div>
        <div className="w-full">
          <h3 className="font-bold text-white">Legal</h3>
          <div className="mt-4 grid justify-items-center gap-2 text-sm text-white/75 md:justify-items-start">
            {legalMenu.length > 0 ? (
              legalMenu.map((item) => (
                <Link href={item.url} target={item.target} key={item.label} className="hover:text-white">
                  {item.label}
                </Link>
              ))
            ) : (
              <>
                <Link href="/kebijakan-privasi" className="hover:text-white">Kebijakan Privasi</Link>
                <Link href="/syarat-ketentuan" className="hover:text-white">Syarat dan Ketentuan</Link>
                <Link href="/pedoman-media-siber" className="hover:text-white">Pedoman Media Siber</Link>
                <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm md:text-left" style={{ color: `${settings.footer_text_color}99` }}>
        <div className="mx-auto max-w-6xl sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <p>{settings.footer_copyright}</p>
          {settings.footer_show_developer === "true" && (
            <p className="mt-2 md:mt-0">
              {settings.footer_developer_text}{" "}
              <a href={settings.footer_developer_url} className="font-bold hover:opacity-80" style={{ color: settings.footer_text_color }}>
                {settings.footer_developer_name}
              </a>
              .
            </p>
          )}
        </div>
      </div>
    </footer>
    </>
  );
}
