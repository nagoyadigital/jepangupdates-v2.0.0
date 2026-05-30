"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Save, RotateCcw } from "lucide-react";

type ColorSetting = {
  key: string;
  label: string;
  hint: string;
  position: string;
  defaultValue: string;
};

const colorGroups = [
  {
    title: "🎨 Warna Utama",
    description: "Warna dasar yang digunakan di seluruh website",
    items: [
      { key: "primary_color", label: "Primary / Utama", hint: "Navbar, tombol, link, social icons, sidebar admin", position: "Header, Sidebar, Button", defaultValue: "#1B5DAF" },
      { key: "accent_color", label: "Aksen / Highlight", hint: "Badge, label aktif, highlight penting", position: "Badge, Dot indicator, Label", defaultValue: "#F5A91B" },
      { key: "danger_color", label: "Garis / Separator", hint: "Garis bawah judul section, border dekoratif", position: "Section title underline", defaultValue: "#E6372E" },
    ],
  },
  {
    title: "✏️ Warna Teks",
    description: "Mengatur warna teks di seluruh halaman",
    items: [
      { key: "text_heading", label: "Judul / Heading", hint: "Judul artikel, nama section, heading besar", position: "H1, H2, H3, Judul artikel", defaultValue: "#111827" },
      { key: "text_body", label: "Body / Paragraf", hint: "Isi artikel, deskripsi, teks umum", position: "Konten artikel, paragraf", defaultValue: "#374151" },
      { key: "text_link", label: "Link / Tautan", hint: "Teks yang bisa diklik, breadcrumb, navigasi", position: "Link di artikel, breadcrumb", defaultValue: "#1B5DAF" },
      { key: "text_muted", label: "Muted / Secondary", hint: "Tanggal, caption, info tambahan", position: "Tanggal publish, author info", defaultValue: "#64748b" },
      { key: "text_category", label: "Label Kategori", hint: "Nama kategori di atas judul artikel", position: "Badge kategori merah", defaultValue: "#E6372E" },
    ],
  },
  {
    title: "🧭 Navigasi",
    description: "Warna menu navigasi utama (bar kategori)",
    items: [
      { key: "nav_bg", label: "Background Navbar", hint: "Latar belakang bar navigasi kategori", position: "Bar menu di bawah header", defaultValue: "#1B5DAF" },
      { key: "nav_text", label: "Teks Navbar", hint: "Warna teks menu kategori", position: "Teks di bar navigasi", defaultValue: "#ffffff" },
    ],
  },
  {
    title: "🦶 Footer",
    description: "Warna bagian footer website",
    items: [
      { key: "footer_bg_color", label: "Background Footer", hint: "Latar belakang area footer", position: "Seluruh area footer", defaultValue: "#1B5DAF" },
      { key: "footer_text_color", label: "Teks Footer", hint: "Warna teks dan link di footer", position: "Link, copyright, deskripsi", defaultValue: "#ffffff" },
      { key: "footer_border_color", label: "Border Atas Footer", hint: "Garis merah di atas footer", position: "Garis pemisah konten & footer", defaultValue: "#E51B23" },
    ],
  },
];

const defaultColors: Record<string, string> = {};
colorGroups.forEach(g => g.items.forEach(i => { defaultColors[i.key] = i.defaultValue; }));

export default function ThemePage() {
  const [colors, setColors] = useState<Record<string, string>>(defaultColors);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.ok ? r.json() : {})
      .then(data => {
        const appearance = data?.appearance || {};
        const footer = data?.footer || {};
        const merged = { ...defaultColors };
        Object.keys(defaultColors).forEach(key => {
          if (appearance[key]) merged[key] = appearance[key];
          if (footer[key]) merged[key] = footer[key];
        });
        setColors(merged);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  function updateColor(key: string, value: string) {
    setColors(prev => ({ ...prev, [key]: value }));
    // Live preview: update CSS variable immediately
    const varMap: Record<string, string> = {
      primary_color: "--color-primary",
      accent_color: "--color-accent",
      danger_color: "--color-danger",
      text_heading: "--text-heading",
      text_body: "--text-body",
      text_link: "--text-link",
      text_muted: "--text-muted",
      text_category: "--text-category",
      nav_bg: "--nav-bg",
      nav_text: "--nav-text",
      footer_bg_color: "--footer-bg",
      footer_text_color: "--footer-text",
      footer_border_color: "--footer-border",
    };
    if (varMap[key]) {
      document.documentElement.style.setProperty(varMap[key], value);
    }
  }

  function resetToDefault() {
    setColors(defaultColors);
    Object.entries(defaultColors).forEach(([key]) => {
      const varMap: Record<string, string> = {
        primary_color: "--color-primary", accent_color: "--color-accent", danger_color: "--color-danger",
        text_heading: "--text-heading", text_body: "--text-body", text_link: "--text-link",
        text_muted: "--text-muted", text_category: "--text-category", nav_bg: "--nav-bg",
        nav_text: "--nav-text", footer_bg_color: "--footer-bg", footer_text_color: "--footer-text",
        footer_border_color: "--footer-border",
      };
      if (varMap[key]) document.documentElement.style.setProperty(varMap[key], defaultColors[key]);
    });
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const settings: { key: string; value: string; group: string }[] = [];
    const footerKeys = ["footer_bg_color", "footer_text_color", "footer_border_color"];

    Object.entries(colors).forEach(([key, value]) => {
      const group = footerKeys.includes(key) ? "footer" : "appearance";
      settings.push({ key, value, group });
    });

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });

    if (res.ok) setMessage("✅ Warna berhasil disimpan! Refresh halaman depan untuk melihat perubahan.");
    else setMessage("❌ Gagal menyimpan");
    setSaving(false);
    setTimeout(() => setMessage(""), 5000);
  }

  if (loading) return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 flex items-center justify-center">
        <p className="text-slate-500">Memuat pengaturan warna...</p>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Tampilan</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827]">Warna & Tema</h1>
            <p className="mt-1 text-sm text-slate-500">Ubah warna langsung terlihat preview. Klik Simpan untuk menyimpan permanen.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={resetToDefault} className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50">
              <RotateCcw size={14} /> Reset
            </button>
            <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-5 py-2.5 font-bold text-white hover:bg-[#154A8F] disabled:opacity-50">
              <Save size={16} /> {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </div>

        {message && (
          <div className={`mt-4 rounded-md p-3 text-sm font-bold ${message.includes("✅") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="mt-6 space-y-8">
          {colorGroups.map((group) => (
            <section key={group.title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-[#111827]">{group.title}</h2>
              <p className="mt-1 text-sm text-slate-500">{group.description}</p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <div key={item.key} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                    {/* Color preview bar */}
                    <div className="h-16 w-full transition-colors" style={{ backgroundColor: colors[item.key] || item.defaultValue }} />
                    
                    <div className="p-4">
                      <label className="block text-sm font-black text-slate-800">{item.label}</label>
                      <p className="mt-0.5 text-[11px] leading-tight text-slate-400">{item.hint}</p>
                      
                      <div className="mt-3 flex items-center gap-2">
                        <div className="relative">
                          <input
                            type="color"
                            value={colors[item.key] || item.defaultValue}
                            onChange={(e) => updateColor(item.key, e.target.value)}
                            className="h-10 w-10 cursor-pointer rounded-lg border-2 border-slate-200 p-0.5"
                          />
                        </div>
                        <input
                          type="text"
                          value={colors[item.key] || item.defaultValue}
                          onChange={(e) => updateColor(item.key, e.target.value)}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-mono uppercase tracking-wide"
                          placeholder="#000000"
                        />
                      </div>
                      
                      <div className="mt-3 flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1.5">
                        <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-[10px] font-bold text-slate-500">{item.position}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Live Preview */}
        <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-[#111827]">👁️ Preview Langsung</h2>
          <p className="mt-1 text-sm text-slate-500">Contoh tampilan dengan warna yang dipilih</p>

          <div className="mt-5 rounded-lg border overflow-hidden">
            {/* Nav preview */}
            <div className="px-4 py-3 text-sm font-bold" style={{ backgroundColor: colors.nav_bg, color: colors.nav_text }}>
              Jepang &nbsp; Pendidikan &nbsp; News &nbsp; Entertainment &nbsp; Bisnis &nbsp; Music
            </div>

            {/* Content preview */}
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-2">
                <span className="rounded px-2 py-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: colors.text_category }}>ENTERTAINMENT</span>
              </div>
              <h3 className="text-xl font-black" style={{ color: colors.text_heading }}>Contoh Judul Artikel Berita Terkini</h3>
              <p className="text-sm" style={{ color: colors.text_body }}>Ini adalah contoh paragraf body text yang akan tampil di artikel dan halaman website.</p>
              <a className="text-sm font-bold" style={{ color: colors.text_link }}>Baca selengkapnya →</a>
              <p className="text-xs" style={{ color: colors.text_muted }}>Sabtu, 24 Mei 2026 - 10:30</p>
              <div className="flex gap-2 mt-3">
                <span className="rounded-md px-3 py-1.5 text-xs font-bold text-white" style={{ backgroundColor: colors.primary_color }}>Button Primary</span>
                <span className="rounded-md px-3 py-1.5 text-xs font-bold" style={{ backgroundColor: colors.accent_color, color: colors.text_heading }}>Button Aksen</span>
              </div>
              <div className="border-b-2 mt-3 pb-2 text-sm font-black" style={{ borderColor: colors.danger_color, color: colors.text_heading }}>SECTION TITLE</div>
            </div>

            {/* Footer preview */}
            <div className="px-4 py-4 text-sm border-t-2" style={{ backgroundColor: colors.footer_bg_color, color: colors.footer_text_color, borderColor: colors.footer_border_color }}>
              © 2026 Jepang Updates &nbsp;|&nbsp; Developed by Nagoya Digital
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
