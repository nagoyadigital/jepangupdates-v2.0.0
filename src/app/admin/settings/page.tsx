"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Save, Globe, Share2, Mail, Palette } from "lucide-react";

type SettingsGroup = Record<string, string>;

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, SettingsGroup>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  async function fetchSettings() {
    const res = await fetch("/api/admin/settings");
    if (res.ok) {
      const data = await res.json();
      // Merge with defaults if empty
      const defaults: Record<string, SettingsGroup> = {
        general: {
          site_name: "Japan Populer",
          site_tagline: "Portal Berita Komunitas Indonesia di Jepang",
          site_description: "Portal berita Jepang modern untuk komunitas Indonesia. Informasi terkini seputar pekerjaan, imigrasi, event, dan kehidupan di Jepang.",
          site_url: "https://japanpopuler.com",
          site_logo: "/japanpopuler-logo-trimmed.png",
          site_favicon: "/japanpopuler-logo-trimmed.png",
          footer_logo: "",
          admin_logo: "",
          site_language: "id",
        },
        social: {
          facebook: "https://facebook.com/japanpopuler",
          instagram: "https://instagram.com/japanpopuler",
          twitter: "",
          youtube: "https://youtube.com/@japanpopuler",
          tiktok: "https://tiktok.com/@japanpopuler",
          telegram: "",
          whatsapp: "",
          line: "",
        },
        contact: {
          contact_email: "redaksi@japanpopuler.com",
          ads_email: "iklan@japanpopuler.com",
          contact_phone: "",
          contact_address: "",
          smtp_host: "",
          smtp_port: "",
          smtp_user: "",
          smtp_password: "",
        },
        appearance: {
          articles_per_page: "20",
          show_breaking_news: "true",
          show_weather_widget: "true",
          show_prayer_times: "true",
          primary_color: "#1B5DAF",
          accent_color: "#F5A91B",
          danger_color: "#E6372E",
          text_heading: "#111827",
          text_body: "#111827",
          text_link: "#1B5DAF",
          text_muted: "#64748b",
          text_category: "#E6372E",
          nav_bg: "#1B5DAF",
          nav_text: "#ffffff",
          font_family: "Montserrat",
          comment_mode: "disabled",
          show_author: "true",
        },
        footer: {
          footer_description: "Portal berita Jepang berbahasa Indonesia untuk pekerja, pelajar, pelaku bisnis, dan komunitas Indonesia di Jepang.",
          footer_copyright: "© 2026 Japan Populer. All rights reserved.",
          footer_developer_text: "Developed by",
          footer_developer_name: "Nagoya Digital",
          footer_developer_url: "https://nagoyadigital.com",
          footer_bg_color: "#1B5DAF",
          footer_text_color: "#ffffff",
          footer_border_color: "#E51B23",
          footer_show_logo: "true",
          footer_show_description: "true",
          footer_show_developer: "true",
        },
      };

      // Merge: use saved values, fallback to defaults
      const merged: Record<string, SettingsGroup> = {};
      for (const [group, defaultValues] of Object.entries(defaults)) {
        merged[group] = { ...defaultValues, ...(data[group] || {}) };
      }
      // Keep AI settings as-is
      if (data.ai) merged.ai = data.ai;

      setSettings(merged);
    }
    setLoading(false);
  }

  useEffect(() => { fetchSettings(); }, []);

  function updateSetting(group: string, key: string, value: string) {
    setSettings(prev => ({
      ...prev,
      [group]: { ...(prev[group] || {}), [key]: value },
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    // Flatten all settings into array
    const allSettings: { key: string; value: string; group: string }[] = [];
    Object.entries(settings).forEach(([group, values]) => {
      Object.entries(values).forEach(([key, value]) => {
        allSettings.push({ key, value, group });
      });
    });

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: allSettings }),
    });

    setSaving(false);
    if (res.ok) setMessage("Pengaturan berhasil disimpan!");
    else setMessage("Gagal menyimpan pengaturan");
    setTimeout(() => setMessage(""), 3000);
  }

  const tabs = [
    { id: "general", label: "Umum", icon: Globe },
    { id: "social", label: "Social Media", icon: Share2 },
    { id: "contact", label: "Kontak & Email", icon: Mail },
    { id: "appearance", label: "Tampilan", icon: Palette },
    { id: "footer", label: "Footer", icon: Globe },
    { id: "ai", label: "AI Writer", icon: Globe },
  ];

  // Ensure all groups exist with defaults
  const general = settings.general || {};
  const social = settings.social || {};
  const contact = settings.contact || {};
  const appearance = settings.appearance || {};
  const footer = settings.footer || {};

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Pengaturan</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827]">Pengaturan Situs</h1>
          </div>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-5 py-2.5 font-bold text-white hover:bg-[#154A8F] disabled:opacity-50">
            <Save size={16} /> {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>

        {message && (
          <div className={`mt-4 rounded-md p-3 text-sm font-bold ${message.includes("berhasil") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="mt-6 flex gap-2 overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition ${
                  activeTab === tab.id
                    ? "border-[#1B5DAF] text-[#1B5DAF]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <p className="mt-8 text-slate-400">Memuat...</p>
        ) : (
          <div className="mt-6">
            {/* Tab: Umum */}
            {activeTab === "general" && (
              <div className="space-y-6">
                {/* Identitas Situs */}
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-black text-[#111827]">Identitas Situs</h3>
                  <p className="mt-1 text-xs text-slate-500">Informasi dasar website</p>
                  <div className="mt-5 grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-bold text-slate-700">Nama Situs</label>
                      <input type="text" value={general.site_name || ""} onChange={(e) => updateSetting("general", "site_name", e.target.value)} placeholder="Japan Populer" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-bold text-slate-700">Tagline</label>
                      <input type="text" value={general.site_tagline || ""} onChange={(e) => updateSetting("general", "site_tagline", e.target.value)} placeholder="Portal Berita Komunitas Indonesia di Jepang" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-sm font-bold text-slate-700">Deskripsi Situs</label>
                      <textarea value={general.site_description || ""} onChange={(e) => updateSetting("general", "site_description", e.target.value)} rows={3} placeholder="Deskripsi singkat tentang website..." className="w-full rounded-md border px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-bold text-slate-700">URL Situs</label>
                      <input type="url" value={general.site_url || ""} onChange={(e) => updateSetting("general", "site_url", e.target.value)} placeholder="https://japanpopuler.com" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-bold text-slate-700">Bahasa</label>
                      <select value={general.site_language || "id"} onChange={(e) => updateSetting("general", "site_language", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                        <option value="id">Indonesia</option>
                        <option value="en">English</option>
                        <option value="ja">日本語</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Logo & Favicon */}
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                  <h3 className="text-lg font-black text-[#111827]">Logo & Favicon</h3>
                  <p className="mt-1 text-xs text-slate-500">Gambar identitas website</p>
                  <div className="mt-5 grid gap-6 sm:grid-cols-2">
                    {/* Logo */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Logo Website</label>
                      <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                        {general.site_logo ? (
                          <img src={general.site_logo} alt="Logo" className="mx-auto h-14 w-auto object-contain" />
                        ) : (
                          <div className="py-4 text-xs text-slate-400">Belum ada logo</div>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input type="text" value={general.site_logo || ""} onChange={(e) => updateSetting("general", "site_logo", e.target.value)} placeholder="/logo.png" className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm" />
                        <label className="inline-flex cursor-pointer items-center rounded-md bg-[#1B5DAF] px-3 py-2 text-xs font-bold text-white hover:bg-[#154A8F]">
                          Upload
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0]; if (!file) return;
                            const fd = new FormData(); fd.append("file", file);
                            const res = await fetch("/api/admin/media", { method: "POST", body: fd });
                            if (res.ok) { const m = await res.json(); updateSetting("general", "site_logo", m.url); }
                          }} />
                        </label>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">Rekomendasi: PNG/SVG transparan, lebar 300-500px</p>
                    </div>

                    {/* Favicon */}
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Favicon</label>
                      <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                        {general.site_favicon ? (
                          <img src={general.site_favicon} alt="Favicon" className="mx-auto h-14 w-14 rounded-lg object-contain" />
                        ) : (
                          <div className="py-4 text-xs text-slate-400">Belum ada favicon</div>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input type="text" value={general.site_favicon || ""} onChange={(e) => updateSetting("general", "site_favicon", e.target.value)} placeholder="/favicon.png" className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm" />
                        <label className="inline-flex cursor-pointer items-center rounded-md bg-[#1B5DAF] px-3 py-2 text-xs font-bold text-white hover:bg-[#154A8F]">
                          Upload
                          <input type="file" accept="image/png,image/x-icon,image/svg+xml" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0]; if (!file) return;
                            const fd = new FormData(); fd.append("file", file);
                            const res = await fetch("/api/admin/media", { method: "POST", body: fd });
                            if (res.ok) { const m = await res.json(); updateSetting("general", "site_favicon", m.url); }
                          }} />
                        </label>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">Rekomendasi: PNG 192×192px, tanpa background</p>
                    </div>
                  </div>

                  {/* Logo Footer & Admin */}
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Logo Footer</label>
                      <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                        {general.footer_logo ? (
                          <img src={general.footer_logo} alt="Logo Footer" className="mx-auto h-12 w-auto object-contain" />
                        ) : (
                          <div className="py-4 text-xs text-slate-400">Sama dengan Logo Website</div>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input type="text" value={general.footer_logo || ""} onChange={(e) => updateSetting("general", "footer_logo", e.target.value)} placeholder="Kosongkan = pakai Logo Website" className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm" />
                        <label className="inline-flex cursor-pointer items-center rounded-md bg-[#1B5DAF] px-3 py-2 text-xs font-bold text-white hover:bg-[#154A8F]">
                          Upload
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0]; if (!file) return;
                            const fd = new FormData(); fd.append("file", file);
                            const res = await fetch("/api/admin/media", { method: "POST", body: fd });
                            if (res.ok) { const m = await res.json(); updateSetting("general", "footer_logo", m.url); }
                          }} />
                        </label>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">Kosongkan untuk menggunakan Logo Website. Rekomendasi: PNG transparan</p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Logo Admin Dashboard</label>
                      <div className="rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-4 text-center">
                        {general.admin_logo ? (
                          <img src={general.admin_logo} alt="Logo Admin" className="mx-auto h-12 w-auto object-contain" />
                        ) : (
                          <div className="py-4 text-xs text-slate-400">Sama dengan Logo Website</div>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <input type="text" value={general.admin_logo || ""} onChange={(e) => updateSetting("general", "admin_logo", e.target.value)} placeholder="Kosongkan = pakai Logo Website" className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm" />
                        <label className="inline-flex cursor-pointer items-center rounded-md bg-[#1B5DAF] px-3 py-2 text-xs font-bold text-white hover:bg-[#154A8F]">
                          Upload
                          <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                            const file = e.target.files?.[0]; if (!file) return;
                            const fd = new FormData(); fd.append("file", file);
                            const res = await fetch("/api/admin/media", { method: "POST", body: fd });
                            if (res.ok) { const m = await res.json(); updateSetting("general", "admin_logo", m.url); }
                          }} />
                        </label>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">Kosongkan untuk menggunakan Logo Website. Tampil di sidebar admin</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Social Media */}
            {activeTab === "social" && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-5">
                <h3 className="text-lg font-black text-[#111827]">Akun Social Media</h3>
                <p className="text-sm text-slate-500">Link social media yang akan ditampilkan di footer dan halaman kontak</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Facebook</label>
                    <input type="url" value={social.facebook || ""} onChange={(e) => updateSetting("social", "facebook", e.target.value)} placeholder="https://facebook.com/japanpopuler" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Instagram</label>
                    <input type="url" value={social.instagram || ""} onChange={(e) => updateSetting("social", "instagram", e.target.value)} placeholder="https://instagram.com/japanpopuler" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Twitter / X</label>
                    <input type="url" value={social.twitter || ""} onChange={(e) => updateSetting("social", "twitter", e.target.value)} placeholder="https://x.com/japanpopuler" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">YouTube</label>
                    <input type="url" value={social.youtube || ""} onChange={(e) => updateSetting("social", "youtube", e.target.value)} placeholder="https://youtube.com/@japanpopuler" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">TikTok</label>
                    <input type="url" value={social.tiktok || ""} onChange={(e) => updateSetting("social", "tiktok", e.target.value)} placeholder="https://tiktok.com/@japanpopuler" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Telegram</label>
                    <input type="url" value={social.telegram || ""} onChange={(e) => updateSetting("social", "telegram", e.target.value)} placeholder="https://t.me/japanpopuler" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">WhatsApp</label>
                    <input type="text" value={social.whatsapp || ""} onChange={(e) => updateSetting("social", "whatsapp", e.target.value)} placeholder="+81xxxxxxxxxx" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">LINE</label>
                    <input type="url" value={social.line || ""} onChange={(e) => updateSetting("social", "line", e.target.value)} placeholder="https://line.me/ti/p/xxxxx" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Kontak & Email */}
            {activeTab === "contact" && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-5">
                <h3 className="text-lg font-black text-[#111827]">Informasi Kontak</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Email Redaksi</label>
                    <input type="email" value={contact.contact_email || ""} onChange={(e) => updateSetting("contact", "contact_email", e.target.value)} placeholder="redaksi@japanpopuler.com" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Email Iklan / Bisnis</label>
                    <input type="email" value={contact.ads_email || ""} onChange={(e) => updateSetting("contact", "ads_email", e.target.value)} placeholder="iklan@japanpopuler.com" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Telepon / WhatsApp</label>
                    <input type="text" value={contact.contact_phone || ""} onChange={(e) => updateSetting("contact", "contact_phone", e.target.value)} placeholder="+81-xxx-xxxx-xxxx" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Alamat</label>
                    <input type="text" value={contact.contact_address || ""} onChange={(e) => updateSetting("contact", "contact_address", e.target.value)} placeholder="Tokyo, Japan" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                </div>

                <hr className="border-slate-200" />

                <h3 className="text-lg font-black text-[#111827]">Pengaturan Email (SMTP)</h3>
                <p className="text-sm text-slate-500">Untuk fitur lupa password dan notifikasi email</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">SMTP Host</label>
                    <input type="text" value={contact.smtp_host || ""} onChange={(e) => updateSetting("contact", "smtp_host", e.target.value)} placeholder="smtp.gmail.com" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">SMTP Port</label>
                    <input type="text" value={contact.smtp_port || ""} onChange={(e) => updateSetting("contact", "smtp_port", e.target.value)} placeholder="587" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">SMTP Username</label>
                    <input type="text" value={contact.smtp_user || ""} onChange={(e) => updateSetting("contact", "smtp_user", e.target.value)} placeholder="email@gmail.com" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">SMTP Password</label>
                    <input type="password" value={contact.smtp_password || ""} onChange={(e) => updateSetting("contact", "smtp_password", e.target.value)} placeholder="••••••••" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Tampilan */}
            {activeTab === "appearance" && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-5">
                <h3 className="text-lg font-black text-[#111827]">Pengaturan Tampilan</h3>
                
                <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-700">
                  <strong>🎨 Pengaturan Warna & Tema</strong> telah dipindahkan ke halaman khusus untuk pengalaman yang lebih baik. <a href="/admin/theme" className="font-bold underline">Buka Warna & Tema →</a>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Artikel per Halaman</label>
                    <input type="number" value={appearance.articles_per_page || "20"} onChange={(e) => updateSetting("appearance", "articles_per_page", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Tampilkan Breaking News</label>
                    <select value={appearance.show_breaking_news || "true"} onChange={(e) => updateSetting("appearance", "show_breaking_news", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                      <option value="true">Ya</option>
                      <option value="false">Tidak</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Tampilkan Widget Cuaca</label>
                    <select value={appearance.show_weather_widget || "true"} onChange={(e) => updateSetting("appearance", "show_weather_widget", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                      <option value="true">Ya</option>
                      <option value="false">Tidak</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Tampilkan Jadwal Sholat</label>
                    <select value={appearance.show_prayer_times || "true"} onChange={(e) => updateSetting("appearance", "show_prayer_times", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                      <option value="true">Ya</option>
                      <option value="false">Tidak</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Font Website</label>
                    <select value={appearance.font_family || "Montserrat"} onChange={(e) => updateSetting("appearance", "font_family", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                      <option value="Montserrat">Montserrat</option>
                      <option value="Inter">Inter</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Open Sans">Open Sans</option>
                      <option value="Lato">Lato</option>
                      <option value="Nunito">Nunito</option>
                      <option value="Raleway">Raleway</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                      <option value="DM Sans">DM Sans</option>
                      <option value="Noto Sans">Noto Sans</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Mode Komentar</label>
                    <select value={appearance.comment_mode || "disabled"} onChange={(e) => updateSetting("appearance", "comment_mode", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                      <option value="disabled">Nonaktif</option>
                      <option value="manual">Manual Approve</option>
                      <option value="auto">Auto Approve</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Tampilkan Penulis di Artikel</label>
                    <select value={appearance.show_author || "true"} onChange={(e) => updateSetting("appearance", "show_author", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                      <option value="true">Ya</option>
                      <option value="false">Tidak</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Footer */}
            {activeTab === "footer" && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-5">
                <h3 className="text-lg font-black text-[#111827]">Pengaturan Footer</h3>
                <p className="text-sm text-slate-500">Kelola tampilan footer website. Untuk mengubah link menu footer, gunakan halaman Menu Navigasi.</p>
                <div className="grid gap-5">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Deskripsi Footer</label>
                    <textarea value={footer.footer_description || ""} onChange={(e) => updateSetting("footer", "footer_description", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm min-h-[80px]" placeholder="Deskripsi singkat tentang website" />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-bold text-slate-700">Tampilkan Logo</label>
                      <select value={footer.footer_show_logo || "true"} onChange={(e) => updateSetting("footer", "footer_show_logo", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                        <option value="true">Ya</option>
                        <option value="false">Tidak</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Teks Copyright</label>
                    <input value={footer.footer_copyright || ""} onChange={(e) => updateSetting("footer", "footer_copyright", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm" placeholder="© 2026 Japan Populer. All rights reserved." />
                  </div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-sm font-bold text-slate-700">Developer Text</label>
                      <input value={footer.footer_developer_text || ""} onChange={(e) => updateSetting("footer", "footer_developer_text", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm" placeholder="Developed by" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-bold text-slate-700">Developer Name</label>
                      <input value={footer.footer_developer_name || ""} onChange={(e) => updateSetting("footer", "footer_developer_name", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm" placeholder="Nagoya Digital" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-bold text-slate-700">Developer URL</label>
                      <input value={footer.footer_developer_url || ""} onChange={(e) => updateSetting("footer", "footer_developer_url", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm" placeholder="https://nagoyadigital.com" />
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-bold text-slate-700">Tampilkan Deskripsi</label>
                      <select value={footer.footer_show_description || "true"} onChange={(e) => updateSetting("footer", "footer_show_description", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                        <option value="true">Ya</option>
                        <option value="false">Tidak</option>
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-bold text-slate-700">Tampilkan Developer Credit</label>
                      <select value={footer.footer_show_developer || "true"} onChange={(e) => updateSetting("footer", "footer_show_developer", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                        <option value="true">Ya</option>
                        <option value="false">Tidak</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="mt-4 rounded-md bg-blue-50 p-4 text-sm text-blue-700">
                  <strong>🎨 Warna Footer</strong> diatur di halaman <a href="/admin/theme" className="font-bold underline">Warna & Tema</a>. <strong>💡 Link Footer</strong> diatur di <a href="/admin/menus" className="font-bold underline">Menu Navigasi</a>.
                </div>
              </div>
            )}

            {/* Tab: AI Writer */}
            {activeTab === "ai" && (
              <div className="rounded-lg border border-slate-200 bg-white p-6 space-y-5">
                <h3 className="text-lg font-black text-[#111827]">✨ AI Writer</h3>
                <p className="text-sm text-slate-500">Setup API key untuk fitur generate artikel otomatis dengan AI. Bisa pakai OpenAI (ChatGPT) atau Google Gemini.</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Provider AI (Teks)</label>
                    <select value={(settings.ai || {}).ai_provider || "openai"} onChange={(e) => updateSetting("ai", "ai_provider", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                      <option value="openai">OpenAI (ChatGPT)</option>
                      <option value="gemini">Google Gemini</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Model</label>
                    <input type="text" value={(settings.ai || {}).ai_model || ""} onChange={(e) => updateSetting("ai", "ai_model", e.target.value)} placeholder="gpt-4o-mini / gemini-2.0-flash" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                    <p className="mt-1 text-xs text-slate-400">Kosongkan untuk pakai default</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm font-bold text-slate-700">API Key (Teks AI)</label>
                    <input type="password" value={(settings.ai || {}).ai_api_key || ""} onChange={(e) => updateSetting("ai", "ai_api_key", e.target.value)} placeholder="sk-... atau AIza..." className="w-full rounded-md border px-4 py-2.5 text-sm font-mono" />
                    <p className="mt-1 text-xs text-slate-400">
                      OpenAI: platform.openai.com/api-keys · Gemini: aistudio.google.com/apikey
                    </p>
                  </div>
                </div>

                <hr className="border-slate-200" />

                <h3 className="text-lg font-black text-[#111827]">🖼️ AI Image Generator</h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Provider Gambar</label>
                    <select value={(settings.ai || {}).ai_image_provider || "leonardo"} onChange={(e) => updateSetting("ai", "ai_image_provider", e.target.value)} className="w-full rounded-md border px-4 py-2.5 text-sm">
                      <option value="leonardo">Leonardo.ai</option>
                      <option value="dalle">OpenAI DALL-E</option>
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">API Key (Gambar)</label>
                    <input type="password" value={(settings.ai || {}).ai_image_api_key || ""} onChange={(e) => updateSetting("ai", "ai_image_api_key", e.target.value)} placeholder="Leonardo: 8cdb937c-..." className="w-full rounded-md border px-4 py-2.5 text-sm font-mono" />
                    <p className="mt-1 text-xs text-slate-400">
                      Leonardo: app.leonardo.ai/settings → API Key
                    </p>
                  </div>
                </div>
                <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                  <p className="font-bold">Cara pakai:</p>
                  <ol className="mt-2 list-decimal pl-4 space-y-1 text-xs">
                    <li>Isi API Key di atas lalu klik Simpan</li>
                    <li>Buka halaman Tambah Artikel</li>
                    <li>Klik tombol "✨ Generate dengan AI"</li>
                    <li>Masukkan topik → AI akan generate artikel lengkap</li>
                    <li>Edit sesuai kebutuhan lalu publish</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
