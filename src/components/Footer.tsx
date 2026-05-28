"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FooterAd } from "./FooterAd";

type MenuItem = { label: string; url: string; target: string };

export function Footer() {
  const [footerMenu, setFooterMenu] = useState<MenuItem[]>([]);
  const [companyMenu, setCompanyMenu] = useState<MenuItem[]>([]);
  const [legalMenu, setLegalMenu] = useState<MenuItem[]>([]);

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
    <footer className="border-t-2 border-[#E51B23] bg-[#1B5DAF] text-white">
      <div className="mx-auto grid max-w-6xl gap-9 px-4 py-12 text-center sm:px-6 md:grid-cols-5 md:text-left lg:px-8">
        <div className="flex flex-col items-center md:col-span-2 md:items-start">
          <Link href="/" className="flex h-[58px] w-fit items-center bg-transparent sm:h-[68px]" aria-label="Jepang Updates homepage">
            <Image
              src="/jepangupdates-logo-trimmed.png"
              alt="Jepang Updates"
              width={4951}
              height={1515}
              className="h-full w-auto object-contain"
            />
          </Link>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/70">
            Portal berita Jepang berbahasa Indonesia untuk pekerja, pelajar, pelaku bisnis, dan komunitas Indonesia di Jepang.
          </p>
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
      <div className="border-t border-white/10 px-4 py-5 text-center text-sm text-white/60 md:text-left">
        <div className="mx-auto max-w-6xl sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <p>© 2026 Jepang Updates. All rights reserved.</p>
          <p className="mt-2 md:mt-0">
            Developed by{" "}
            <a href="https://nagoyadigital.com" className="font-bold text-white hover:text-[#F5A91B]">
              Nagoya Digital
            </a>
            .
          </p>
        </div>
      </div>
    </footer>
    </>
  );
}
