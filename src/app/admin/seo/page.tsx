"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Save, Globe, Share2, Code, Search, FileText, Zap } from "lucide-react";

type SeoSettings = {
  // General
  site_title: string;
  site_tagline: string;
  meta_description: string;
  meta_keywords: string;
  canonical_domain: string;
  // Social / Open Graph
  og_image: string;
  og_type: string;
  twitter_handle: string;
  facebook_page: string;
  // Verification
  google_verification: string;
  bing_verification: string;
  yandex_verification: string;
  pinterest_verification: string;
  // Analytics
  google_analytics_id: string;
  gtm_id: string;
  // Advanced
  robots_txt: string;
  head_scripts: string;
  body_scripts: string;
  // Indexing
  noindex_categories: string;
  noindex_tags: string;
  noindex_archives: string;
};

const defaultSettings: SeoSettings = {
  site_title: "Jepang Updates - Portal Berita Komunitas Indonesia di Jepang",
  site_tagline: "Informasi terkini seputar pekerjaan, imigrasi, event, dan kehidupan di Jepang",
  meta_description: "Portal berita komunitas Indonesia di Jepang. Informasi terkini seputar pekerjaan, imigrasi, event, dan kehidupan di Jepang.",
  meta_keywords: "jepang, berita jepang, indonesia di jepang, pekerjaan jepang, tokutei ginou, SSW, komunitas indonesia jepang",
  canonical_domain: "https://jepangupdates.com",
  og_image: "/jepangupdates-logo.png",
  og_type: "website",
  twitter_handle: "@jepangupdates",
  facebook_page: "https://facebook.com/jepangupdates",
  google_verification: "",
  bing_verification: "",
  yandex_verification: "",
  pinterest_verification: "",
  google_analytics_id: "",
  gtm_id: "",
  robots_txt: "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://jepangupdates.com/sitemap.xml",
  head_scripts: "",
  body_scripts: "",
  noindex_categories: "false",
  noindex_tags: "false",
  noindex_archives: "false",
};

export default function AdminSeoPage() {
  const [settings, setSettings] = useState<SeoSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetch("/api/admin/settings?group=seo")
      .then(r => r.ok ? r.json() : {})
      .then((data: Record<string, Record<string, string>>) => {
        if (data.seo) {
          setSettings(prev => ({ ...prev, ...data.seo }));
        }
      })
      .catch(() => {});
  }, []);

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const settingsArray = Object.entries(settings).map(([key, value]) => ({
      key,
      value: value,
      group: "seo",
    }));

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings: settingsArray }),
    });

    setSaving(false);
    if (res.ok) {
      setMessage("SEO settings berhasil disimpan!");
    } else {
      setMessage("Gagal menyimpan. Pastikan Anda login sebagai Super Admin.");
    }
    setTimeout(() => setMessage(""), 4000);
  }

  function updateField(key: keyof SeoSettings, value: string) {
    setSettings(prev => ({ ...prev, [key]: value }));
  }

  const tabs = [
    { key: "general", label: "General", icon: Globe },
    { key: "social", label: "Social & OG", icon: Share2 },
    { key: "analytics", label: "Analytics", icon: Zap },
    { key: "indexing", label: "Indexing", icon: Search },
    { key: "advanced", label: "Advanced", icon: Code },
  ];

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Optimization</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827]">SEO Settings</h1>
            <p className="mt-1 text-sm text-slate-500">Optimasi mesin pencari untuk performa maksimal di Google, Bing, dan social media</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-5 py-2.5 font-bold text-white hover:bg-[#154A8F] disabled:opacity-50"
          >
            <Save size={16} /> {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>

        {message && (
          <div className={`mt-4 rounded-md p-3 text-sm font-bold ${message.includes("berhasil") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        {/* Tabs */}
        <div className="mt-6 flex gap-1 overflow-x-auto border-b border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-bold transition ${
                  activeTab === tab.key
                    ? "border-[#1B5DAF] text-[#1B5DAF]"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === "general" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#111827]">General SEO</h3>
              <p className="mt-1 text-xs text-slate-500">Pengaturan dasar SEO yang muncul di hasil pencarian Google</p>
              <div className="mt-5 grid gap-5">
                <Field label="Site Title" hint="Judul utama website. Muncul di tab browser dan hasil Google. Max 60 karakter.">
                  <input type="text" value={settings.site_title} onChange={(e) => updateField("site_title", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm" maxLength={70} />
                  <CharCount text={settings.site_title} max={60} />
                </Field>
                <Field label="Tagline / Separator" hint="Deskripsi singkat setelah judul. Digunakan di title template.">
                  <input type="text" value={settings.site_tagline} onChange={(e) => updateField("site_tagline", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm" />
                </Field>
                <Field label="Default Meta Description" hint="Deskripsi default untuk halaman tanpa deskripsi khusus. Max 160 karakter.">
                  <textarea value={settings.meta_description} onChange={(e) => updateField("meta_description", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm" rows={3} maxLength={170} />
                  <CharCount text={settings.meta_description} max={160} />
                </Field>
                <Field label="Meta Keywords" hint="Kata kunci utama website, pisahkan dengan koma.">
                  <input type="text" value={settings.meta_keywords} onChange={(e) => updateField("meta_keywords", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm" placeholder="jepang, berita, indonesia" />
                </Field>
                <Field label="Canonical Domain" hint="Domain utama website. Digunakan untuk canonical URL dan sitemap.">
                  <input type="url" value={settings.canonical_domain} onChange={(e) => updateField("canonical_domain", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm" placeholder="https://jepangupdates.com" />
                </Field>
              </div>

              {/* Preview */}
              <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold text-slate-500 mb-2">📱 Preview di Google:</p>
                <div className="rounded-md bg-white p-3 border">
                  <p className="text-[#1a0dab] text-base font-medium truncate">{settings.site_title || "Jepang Updates"}</p>
                  <p className="text-[#006621] text-xs mt-0.5">{settings.canonical_domain}</p>
                  <p className="text-[#545454] text-xs mt-1 line-clamp-2">{settings.meta_description || "Deskripsi website..."}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#111827]">Social Media & Open Graph</h3>
              <p className="mt-1 text-xs text-slate-500">Pengaturan tampilan saat link di-share di Facebook, Twitter, WhatsApp, dll</p>
              <div className="mt-5 grid gap-5">
                <Field label="Default OG Image" hint="Gambar default saat link di-share. Ukuran ideal: 1200×630px.">
                  <input type="text" value={settings.og_image} onChange={(e) => updateField("og_image", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm" placeholder="/uploads/og-image.jpg" />
                  {settings.og_image && (
                    <div className="mt-2 h-32 w-full max-w-sm overflow-hidden rounded-md border bg-slate-50">
                      <img src={settings.og_image} alt="OG Preview" className="h-full w-full object-contain" />
                    </div>
                  )}
                </Field>
                <Field label="OG Type" hint="Tipe konten untuk Open Graph.">
                  <select value={settings.og_type} onChange={(e) => updateField("og_type", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm">
                    <option value="website">Website</option>
                    <option value="article">Article</option>
                    <option value="blog">Blog</option>
                  </select>
                </Field>
                <Field label="Twitter Handle" hint="Username Twitter/X tanpa @. Untuk Twitter Card attribution.">
                  <input type="text" value={settings.twitter_handle} onChange={(e) => updateField("twitter_handle", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm" placeholder="@jepangupdates" />
                </Field>
                <Field label="Facebook Page URL" hint="URL halaman Facebook untuk og:see_also.">
                  <input type="url" value={settings.facebook_page} onChange={(e) => updateField("facebook_page", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm" placeholder="https://facebook.com/jepangupdates" />
                </Field>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#111827]">Analytics & Tracking</h3>
              <p className="mt-1 text-xs text-slate-500">Hubungkan Google Analytics, GTM, dan verifikasi webmaster tools</p>
              <div className="mt-5 grid gap-5">
                <Field label="Google Analytics ID" hint="Measurement ID dari GA4. Format: G-XXXXXXXXXX">
                  <input type="text" value={settings.google_analytics_id} onChange={(e) => updateField("google_analytics_id", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm font-mono" placeholder="G-XXXXXXXXXX" />
                </Field>
                <Field label="Google Tag Manager ID" hint="Container ID dari GTM. Format: GTM-XXXXXXX">
                  <input type="text" value={settings.gtm_id} onChange={(e) => updateField("gtm_id", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm font-mono" placeholder="GTM-XXXXXXX" />
                </Field>
                <div className="border-t border-slate-200 pt-5">
                  <p className="text-sm font-bold text-[#111827] mb-3">Verifikasi Webmaster Tools</p>
                </div>
                <Field label="Google Search Console" hint="Meta tag verification content value.">
                  <input type="text" value={settings.google_verification} onChange={(e) => updateField("google_verification", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm font-mono" placeholder="google-site-verification content value" />
                </Field>
                <Field label="Bing Webmaster" hint="Meta tag msvalidate.01 content value.">
                  <input type="text" value={settings.bing_verification} onChange={(e) => updateField("bing_verification", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm font-mono" placeholder="bing verification content" />
                </Field>
                <Field label="Yandex Webmaster" hint="Meta tag yandex-verification content value.">
                  <input type="text" value={settings.yandex_verification} onChange={(e) => updateField("yandex_verification", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm font-mono" placeholder="yandex verification content" />
                </Field>
                <Field label="Pinterest" hint="Meta tag p:domain_verify content value.">
                  <input type="text" value={settings.pinterest_verification} onChange={(e) => updateField("pinterest_verification", e.target.value)} className="w-full rounded-md border px-3 py-2.5 text-sm font-mono" placeholder="pinterest verification content" />
                </Field>
              </div>
            </div>
          )}

          {activeTab === "indexing" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#111827]">Indexing & Crawling</h3>
              <p className="mt-1 text-xs text-slate-500">Kontrol halaman mana yang boleh di-index oleh Google</p>
              <div className="mt-5 grid gap-5">
                <Field label="Robots.txt" hint="Aturan crawling untuk search engine bots. Hati-hati mengubah ini.">
                  <textarea value={settings.robots_txt} onChange={(e) => updateField("robots_txt", e.target.value)} className="w-full rounded-md border px-3 py-2.5 font-mono text-sm" rows={8} />
                </Field>
                <div className="border-t border-slate-200 pt-5">
                  <p className="text-sm font-bold text-[#111827] mb-3">Noindex Settings</p>
                  <p className="text-xs text-slate-500 mb-4">Halaman dengan noindex tidak akan muncul di hasil pencarian Google.</p>
                </div>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={settings.noindex_categories === "true"} onChange={(e) => updateField("noindex_categories", e.target.checked ? "true" : "false")} className="rounded" />
                  <div>
                    <span className="text-sm font-bold text-slate-700">Noindex halaman kategori</span>
                    <p className="text-xs text-slate-500">Jangan index /kategori/xxx (hindari duplicate content)</p>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={settings.noindex_tags === "true"} onChange={(e) => updateField("noindex_tags", e.target.checked ? "true" : "false")} className="rounded" />
                  <div>
                    <span className="text-sm font-bold text-slate-700">Noindex halaman tag</span>
                    <p className="text-xs text-slate-500">Jangan index halaman tag/search results</p>
                  </div>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" checked={settings.noindex_archives === "true"} onChange={(e) => updateField("noindex_archives", e.target.checked ? "true" : "false")} className="rounded" />
                  <div>
                    <span className="text-sm font-bold text-slate-700">Noindex halaman arsip/pagination</span>
                    <p className="text-xs text-slate-500">Jangan index ?page=2, ?page=3, dll</p>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === "advanced" && (
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-black text-[#111827]">Advanced / Custom Code</h3>
              <p className="mt-1 text-xs text-slate-500">Tambahkan script kustom di head atau body. Untuk Google Adsense, Facebook Pixel, dll.</p>
              <div className="mt-5 grid gap-5">
                <Field label="Head Scripts" hint="Kode yang disisipkan di dalam <head>. Untuk meta tags, CSS, atau script yang harus load duluan.">
                  <textarea value={settings.head_scripts} onChange={(e) => updateField("head_scripts", e.target.value)} className="w-full rounded-md border px-3 py-2.5 font-mono text-sm" rows={6} placeholder="<!-- Google Adsense, Facebook Pixel, dll -->" />
                </Field>
                <Field label="Body Scripts (Before </body>)" hint="Kode yang disisipkan sebelum </body>. Untuk analytics, chat widget, dll.">
                  <textarea value={settings.body_scripts} onChange={(e) => updateField("body_scripts", e.target.value)} className="w-full rounded-md border px-3 py-2.5 font-mono text-sm" rows={6} placeholder="<!-- Chat widget, analytics, dll -->" />
                </Field>
              </div>
              <div className="mt-5 rounded-md bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                <p className="font-bold">⚠️ Perhatian:</p>
                <p className="mt-1">Script yang salah bisa merusak tampilan website. Pastikan kode yang dimasukkan sudah benar dan dari sumber terpercaya.</p>
              </div>
            </div>
          )}
        </div>

        {/* SEO Checklist */}
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-4">✅ SEO Checklist</h3>
          <div className="grid gap-2 sm:grid-cols-2 text-xs">
            <CheckItem done={!!settings.site_title} label="Site title terisi" />
            <CheckItem done={!!settings.meta_description && settings.meta_description.length >= 50} label="Meta description min 50 karakter" />
            <CheckItem done={!!settings.canonical_domain} label="Canonical domain di-set" />
            <CheckItem done={!!settings.og_image} label="Default OG image tersedia" />
            <CheckItem done={!!settings.google_analytics_id} label="Google Analytics terhubung" />
            <CheckItem done={!!settings.google_verification} label="Google Search Console terverifikasi" />
            <CheckItem done={!!settings.robots_txt} label="Robots.txt dikonfigurasi" />
            <CheckItem done={!!settings.meta_keywords} label="Meta keywords terisi" />
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-bold text-slate-700">{label}</label>
      <p className="mb-2 text-[11px] text-slate-500">{hint}</p>
      {children}
    </div>
  );
}

function CharCount({ text, max }: { text: string; max: number }) {
  const len = text.length;
  const isOver = len > max;
  return (
    <p className={`mt-1 text-right text-[11px] font-bold ${isOver ? "text-red-500" : len > max * 0.8 ? "text-amber-500" : "text-slate-400"}`}>
      {len}/{max}
    </p>
  );
}

function CheckItem({ done, label }: { done: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 rounded-md px-3 py-2 ${done ? "bg-emerald-50" : "bg-slate-50"}`}>
      <span className={`text-sm ${done ? "text-emerald-600" : "text-slate-300"}`}>{done ? "✓" : "○"}</span>
      <span className={done ? "text-slate-700" : "text-slate-500"}>{label}</span>
    </div>
  );
}
