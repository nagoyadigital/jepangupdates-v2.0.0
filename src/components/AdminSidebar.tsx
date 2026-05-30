"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  BarChart3,
  FileText,
  FilePlus,
  FolderTree,
  Image,
  LogOut,
  Megaphone,
  Menu,
  NavigationIcon,
  Puzzle,
  SearchCheck,
  Settings,
  Tag,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

const menuGroups = [
  {
    label: "Utama",
    items: [
      { label: "Dashboard", href: "/admin", icon: BarChart3, minRole: "KONTRIBUTOR" },
    ],
  },
  {
    label: "Konten",
    items: [
      { label: "Semua Artikel", href: "/admin/articles", icon: FileText, minRole: "KONTRIBUTOR" },
      { label: "Tambah Artikel", href: "/admin/articles/new", icon: FilePlus, minRole: "KONTRIBUTOR" },
      { label: "Kategori", href: "/admin/categories", icon: FolderTree, minRole: "ADMIN" },
      { label: "Tag", href: "/admin/tags", icon: Tag, minRole: "PENULIS" },
      { label: "Media Library", href: "/admin/media", icon: Image, minRole: "KONTRIBUTOR" },
    ],
  },
  {
    label: "Tampilan & Iklan",
    items: [
      { label: "Warna & Tema", href: "/admin/theme", icon: Puzzle, minRole: "ADMIN" },
      { label: "Iklan / Ads", href: "/admin/ads", icon: Megaphone, minRole: "ADMIN" },
      { label: "Widget", href: "/admin/widgets", icon: Puzzle, minRole: "ADMIN" },
      { label: "Menu Navigasi", href: "/admin/menus", icon: NavigationIcon, minRole: "ADMIN" },
    ],
  },
  {
    label: "Pengaturan",
    items: [
      { label: "SEO", href: "/admin/seo", icon: SearchCheck, minRole: "ADMIN" },
      { label: "Pengguna", href: "/admin/users", icon: Users, minRole: "SUPER_ADMIN" },
      { label: "Pengaturan Situs", href: "/admin/settings", icon: Settings, minRole: "SUPER_ADMIN" },
      { label: "Profil Saya", href: "/admin/profile", icon: User, minRole: "KONTRIBUTOR" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [primaryColor, setPrimaryColor] = useState("#1B5DAF");
  const [siteLogo, setSiteLogo] = useState("/jepangupdates-logo-trimmed.png");

  useEffect(() => {
    fetch("/api/settings/public")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        if (data?.appearance?.primary_color) setPrimaryColor(data.appearance.primary_color);
        const general = data?.general || {};
        setSiteLogo(general.admin_logo || general.site_logo || "/jepangupdates-logo-trimmed.png");
      })
      .catch(() => {});
  }, []);

  const roleLabel: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    EDITOR: "Editor",
    PENULIS: "Penulis",
    KONTRIBUTOR: "Kontributor",
  };

  const roleHierarchy: Record<string, number> = {
    SUPER_ADMIN: 5,
    ADMIN: 4,
    EDITOR: 3,
    PENULIS: 2,
    KONTRIBUTOR: 1,
  };

  const userRoleLevel = roleHierarchy[session?.user?.role || "KONTRIBUTOR"] || 1;

  const filteredMenuGroups = menuGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => userRoleLevel >= roleHierarchy[item.minRole]),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      {/* Mobile toggle */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 px-4 py-3 lg:hidden" style={{ backgroundColor: primaryColor }}>
        <Link href="/admin" className="flex items-center gap-2 text-white">
          <img src={siteLogo} alt="Jepang Updates" className="h-8 w-auto" />
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform flex flex-col text-white transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ backgroundColor: primaryColor }}>
        {/* Logo */}
        <div className="px-5 py-6">
          <Link href="/" className="flex items-center gap-3">
            <img
              src={siteLogo}
              alt="Jepang Updates"
              className="h-14 w-auto"
            />
          </Link>
        </div>

        {/* User info */}
        {session?.user && (
          <div className="mx-4 mb-4 rounded-lg bg-white/10 px-4 py-3">
            <p className="text-sm font-bold truncate">{session.user.name}</p>
            <p className="text-xs text-white/60">{roleLabel[session.user.role] || session.user.role}</p>
          </div>
        )}

        {/* Navigation - scrollable */}
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {filteredMenuGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-2 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || (item.href !== "/admin" && item.href !== "/admin/articles" && pathname.startsWith(item.href));
                  return (
                    <Link
                      href={item.href}
                      key={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold transition ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Logout - fixed bottom */}
        <div className="sticky bottom-0 border-t border-white/10 px-4 py-4" style={{ backgroundColor: primaryColor }}>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-bold text-white/70 transition hover:bg-red-500/20 hover:text-red-200"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/* Spacer for fixed sidebar on desktop */}
      <div className="hidden lg:block lg:w-72 lg:flex-shrink-0" />
    </>
  );
}
