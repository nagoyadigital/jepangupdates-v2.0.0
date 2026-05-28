"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

type MenuItem = { id: string; label: string; url: string; target: string; order: number };

// Fallback menu items (used while loading or if API fails)
const fallbackNavItems = [
  { label: "News", url: "/kategori/news" },
  { label: "Entertainment", url: "/kategori/entertainment" },
  { label: "Bisnis", url: "/kategori/bisnis" },
  { label: "Music", url: "/kategori/music" },
  { label: "Bola & Sports", url: "/kategori/bola-sports" },
  { label: "Politik", url: "/kategori/politik" },
  { label: "Otomotif", url: "/kategori/otomotif" },
  { label: "Food & Travel", url: "/kategori/food-travel" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState<{ label: string; url: string; target: string }[]>(
    fallbackNavItems.map(i => ({ ...i, target: "_self" }))
  );
  const [mobileItems, setMobileItems] = useState<{ label: string; url: string; target: string }[]>(
    fallbackNavItems.map(i => ({ ...i, target: "_self" }))
  );

  useEffect(() => {
    // Fetch main nav (desktop nav bar)
    fetch("/api/menus?location=main_nav")
      .then(r => r.ok ? r.json() : [])
      .then((menus) => {
        if (Array.isArray(menus) && menus.length > 0 && menus[0].items?.length > 0) {
          const items = menus[0].items.map((item: MenuItem) => ({
            label: item.label,
            url: item.url,
            target: item.target || "_self",
          }));
          setNavItems(items);
          // Use main_nav as fallback for mobile if mobile_nav is empty
          setMobileItems(prev => prev.length === fallbackNavItems.length ? items : prev);
        }
      })
      .catch(() => {});

    // Fetch mobile nav (hamburger menu) — fallback to main_nav
    fetch("/api/menus?location=mobile_nav")
      .then(r => r.ok ? r.json() : [])
      .then((menus) => {
        if (Array.isArray(menus) && menus.length > 0 && menus[0].items?.length > 0) {
          setMobileItems(menus[0].items.map((item: MenuItem) => ({
            label: item.label,
            url: item.url,
            target: item.target || "_self",
          })));
        } else {
          // If mobile_nav is empty, use main_nav
          fetch("/api/menus?location=main_nav")
            .then(r => r.ok ? r.json() : [])
            .then((mainMenus) => {
              if (Array.isArray(mainMenus) && mainMenus.length > 0 && mainMenus[0].items?.length > 0) {
                setMobileItems(mainMenus[0].items.map((item: MenuItem) => ({
                  label: item.label,
                  url: item.url,
                  target: item.target || "_self",
                })));
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-[168px_1fr] items-center gap-3 px-4 py-3 sm:grid-cols-[190px_minmax(220px,1fr)_190px] sm:gap-4 sm:px-6 sm:py-4 lg:grid-cols-[240px_1fr_250px] lg:px-8">
        <Link href="/" className="flex h-[54px] items-center sm:h-[56px] lg:h-[66px]" aria-label="Jepang Updates homepage">
          <Image
            src="/jepangupdates-logo-trimmed.png"
            alt="Jepang Updates"
            width={4951}
            height={1515}
            priority
            className="h-full w-auto object-contain"
          />
        </Link>

        <SearchForm className="hidden sm:order-none sm:col-span-1 sm:mx-auto sm:flex sm:h-10 sm:w-full sm:max-w-sm lg:h-11 lg:max-w-md" />

        <div className="hidden items-center justify-end gap-2.5 sm:flex lg:gap-3">
          <SocialIcon href="https://facebook.com/jepangupdates" label="Facebook" icon="facebook" />
          <SocialIcon href="https://instagram.com/jepangupdates" label="Instagram" icon="instagram" />
          <SocialIcon href="https://youtube.com/@jepangupdates" label="YouTube" icon="youtube" />
          <SocialIcon href="https://tiktok.com/@jepangupdates" label="TikTok" icon="tiktok" />
        </div>

        <button
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#111827] transition hover:bg-slate-50 sm:hidden"
          onClick={() => setIsMenuOpen((current) => !current)}
          type="button"
        >
          {isMenuOpen ? <X size={24} strokeWidth={3} /> : <ColorHamburger />}
        </button>
      </div>

      <nav className="bg-[#1B5DAF]">
        <div className="mx-auto flex max-w-6xl overflow-x-auto px-4 sm:px-6 lg:px-8">
          {navItems.map((item) => (
            <Link
              href={item.url}
              target={item.target}
              className="shrink-0 px-2.5 py-2.5 text-[10px] font-extrabold uppercase text-white transition hover:bg-[#2D54A7] sm:px-3 sm:py-3 sm:text-[11px] sm:font-black"
              key={item.label}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {isMenuOpen ? (
        <div className="border-t border-slate-100 bg-white px-4 pb-5 shadow-lg sm:hidden">
          <SearchForm className="flex h-11 w-full overflow-hidden rounded-[13px] border-2 border-[#1B5DAF] bg-white" />
          <div className="mt-4 flex items-center justify-center gap-3">
            <SocialIcon href="https://facebook.com/jepangupdates" label="Facebook" icon="facebook" />
            <SocialIcon href="https://instagram.com/jepangupdates" label="Instagram" icon="instagram" />
            <SocialIcon href="https://youtube.com/@jepangupdates" label="YouTube" icon="youtube" />
            <SocialIcon href="https://tiktok.com/@jepangupdates" label="TikTok" icon="tiktok" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {mobileItems.map((item) => (
              <Link
                href={item.url}
                target={item.target}
                className="rounded-md bg-[#1B5DAF] px-3 py-3 text-center text-[11px] font-extrabold uppercase text-white"
                key={item.label}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function ColorHamburger() {
  return (
    <span className="flex w-7 flex-col gap-1.5" aria-hidden="true">
      <span className="h-[3px] w-7 rounded-full bg-[#111827]" />
      <span className="h-[3px] w-7 rounded-full bg-[#F5A91B]" />
      <span className="h-[3px] w-7 rounded-full bg-[#1B5DAF]" />
    </span>
  );
}

function SearchForm({ className }: { className: string }) {
  return (
    <form action="/search" className={`overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm ${className}`}>
      <input
        name="q"
        className="min-w-0 flex-1 px-4 text-sm text-[#111827] outline-none placeholder:text-slate-400 sm:px-5 sm:text-sm"
        placeholder="Cari Berita..."
      />
      <button className="flex w-12 items-center justify-center rounded-r-full bg-[#1B5DAF] text-white transition hover:bg-[#164a8a] sm:w-14" aria-label="Cari">
        <Search size={18} strokeWidth={2.5} />
      </button>
    </form>
  );
}

function SocialIcon({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: "facebook" | "instagram" | "youtube" | "tiktok";
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid h-8 w-8 place-items-center rounded-full bg-[#1B5DAF] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#164a8a] hover:shadow-md sm:h-9 sm:w-9 lg:h-10 lg:w-10"
    >
      <BrandGlyph icon={icon} />
    </a>
  );
}

function BrandGlyph({ icon }: { icon: "facebook" | "instagram" | "youtube" | "tiktok" }) {
  const cls = "h-4 w-4 sm:h-[18px] sm:w-[18px] lg:h-5 lg:w-5";

  if (icon === "facebook") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
      </svg>
    );
  }

  if (icon === "instagram") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (icon === "youtube") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814ZM9.545 15.568V8.432L15.818 12l-6.273 3.568Z" />
      </svg>
    );
  }

  // TikTok
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.88 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.82.1v-3.5a6.37 6.37 0 0 0-.82-.05A6.34 6.34 0 0 0 3.15 15.7a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.4a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.83Z" />
    </svg>
  );
}
