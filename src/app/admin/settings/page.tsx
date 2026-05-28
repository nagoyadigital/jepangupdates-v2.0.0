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
          site_name: "Jepang Updates",
          site_tagline: "Portal Berita Komunitas Indonesia di Jepang",
          site_description: "Portal berita Jepang modern untuk komunitas Indonesia. Informasi terkini seputar pekerjaan, imigrasi, event, dan kehidupan di Jepang.",
          site_url: "https://jepangupdates.com",
          site_logo: "/jepangupdates-logo-trimmed.png",
          site_favicon: "/jepangupdates-logo-trimmed.png",
          site_language: "id",
        },
        social: {
          facebook: "https://facebook.com/jepangupdates",
          instagram: "https://instagram.com/jepangupdates",
          twitter: "",
          youtube: "https://youtube.com/@jepangupdates",
          tiktok: "https://tiktok.com/@jepangupdates",
          telegram: "",
          whatsapp: "",
          line: "",
        },
        contact: {
          contact_email: "redaksi@jepangupdates.com",
          ads_email: "iklan@jepangupdates.com",
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
          comment_mode: "disabled",
          show_author: "true",
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
    { id: "ai", label: "AI Writer", icon: Globe },
  ];

  // Ensure all groups exist with defaults
  const general = settings.general || {};
  const social = settings.social || {};
  const contact = settings.contact || {};
  const appearance = settings.appearance || {};

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
                      <input type="text" value={general.site_name || ""} onChange={(e) => updateSetting("general", "site_name", e.target.value)} placeholder="Jepang Updates" className="w-full rounded-md border px-4 py-2.5 text-sm" />
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
                      <input type="url" value={general.site_url || ""} onChange={(e) => updateSetting("general", "site_url", e.target.value)} placeholder="https://jepangupdates.com" className="w-full rounded-md border px-4 py-2.5 text-sm" />
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
                    <input type="url" value={social.facebook || ""} onChange={(e) => updateSetting("social", "facebook", e.target.value)} placeholder="https://facebook.com/jepangupdates" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Instagram</label>
                    <input type="url" value={social.instagram || ""} onChange={(e) => updateSetting("social", "instagram", e.target.value)} placeholder="https://instagram.com/jepangupdates" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Twitter / X</label>
                    <input type="url" value={social.twitter || ""} onChange={(e) => updateSetting("social", "twitter", e.target.value)} placeholder="https://x.com/jepangupdates" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">YouTube</label>
                    <input type="url" value={social.youtube || ""} onChange={(e) => updateSetting("social", "youtube", e.target.value)} placeholder="https://youtube.com/@jepangupdates" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">TikTok</label>
                    <input type="url" value={social.tiktok || ""} onChange={(e) => updateSetting("social", "tiktok", e.target.value)} placeholder="https://tiktok.com/@jepangupdates" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Telegram</label>
                    <input type="url" value={social.telegram || ""} onChange={(e) => updateSetting("social", "telegram", e.target.value)} placeholder="https://t.me/jepangupdates" className="w-full rounded-md border px-4 py-2.5 text-sm" />
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
                    <input type="email" value={contact.contact_email || ""} onChange={(e) => updateSetting("contact", "contact_email", e.target.value)} placeholder="redaksi@jepangupdates.com" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Email Iklan / Bisnis</label>
                    <input type="email" value={contact.ads_email || ""} onChange={(e) => updateSetting("contact", "ads_email", e.target.value)} placeholder="iklan@jepangupdates.com" className="w-full rounded-md border px-4 py-2.5 text-sm" />
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
                    <label className="mb-1 block text-sm font-bold text-slate-700">Warna Utama</label>
                    <div className="flex gap-2">
                      <input type="color" value={appearance.primary_color || "#1B5DAF"} onChange={(e) => updateSetting("appearance", "primary_color", e.target.value)} className="h-10 w-14 rounded border" />
                      <input type="text" value={appearance.primary_color || "#1B5DAF"} onChange={(e) => updateSetting("appearance", "primary_color", e.target.value)} className="flex-1 rounded-md border px-3 py-2.5 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Warna Aksen</label>
                    <div className="flex gap-2">
                      <input type="color" value={appearance.accent_color || "#F5A91B"} onChange={(e) => updateSetting("appearance", "accent_color", e.target.value)} className="h-10 w-14 rounded border" />
                      <input type="text" value={appearance.accent_color || "#F5A91B"} onChange={(e) => updateSetting("appearance", "accent_color", e.target.value)} className="flex-1 rounded-md border px-3 py-2.5 text-sm" />
                    </div>
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
