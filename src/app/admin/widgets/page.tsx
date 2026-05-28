"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Save, ToggleLeft, ToggleRight, Clock, Cloud, Newspaper, TrendingUp, Calendar, MapPin } from "lucide-react";

type WidgetConfig = {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  position: string;
  settings: Record<string, string>;
};

const defaultWidgets: WidgetConfig[] = [
  {
    key: "prayer_times",
    label: "Jadwal Sholat",
    description: "Menampilkan waktu sholat berdasarkan lokasi di Jepang",
    icon: Clock,
    enabled: true,
    position: "sidebar_top",
    settings: {
      city: "Tokyo",
      method: "3",
      show_iqamah: "false",
      timezone: "Asia/Tokyo",
    },
  },
  {
    key: "weather",
    label: "Cuaca",
    description: "Menampilkan informasi cuaca terkini di kota Jepang",
    icon: Cloud,
    enabled: true,
    position: "sidebar_top",
    settings: {
      city: "Tokyo",
      units: "metric",
      api_key: "",
      show_forecast: "true",
    },
  },
  {
    key: "breaking_news",
    label: "Breaking News",
    description: "Ticker berita terkini di bagian atas halaman",
    icon: Newspaper,
    enabled: true,
    position: "header_bottom",
    settings: {
      max_items: "5",
      scroll_speed: "normal",
      auto_hide: "false",
    },
  },
  {
    key: "trending",
    label: "Trending / Populer",
    description: "Daftar artikel paling banyak dibaca",
    icon: TrendingUp,
    enabled: true,
    position: "sidebar_middle",
    settings: {
      max_items: "10",
      period: "7days",
      show_number: "true",
    },
  },
  {
    key: "events",
    label: "Event & Agenda",
    description: "Kalender event komunitas Indonesia di Jepang",
    icon: Calendar,
    enabled: true,
    position: "sidebar_bottom",
    settings: {
      max_items: "3",
      show_location: "true",
      show_past: "false",
    },
  },
  {
    key: "japan_carousel",
    label: "Japan Carousel",
    description: "Carousel gambar/info tentang kota-kota di Jepang",
    icon: MapPin,
    enabled: true,
    position: "home_middle",
    settings: {
      auto_play: "true",
      interval: "5000",
      show_caption: "true",
    },
  },
];

const positionOptions = [
  { value: "header_top", label: "Header - Atas" },
  { value: "header_bottom", label: "Header - Bawah (Breaking News)" },
  { value: "home_top", label: "Home - Atas" },
  { value: "home_middle", label: "Home - Tengah" },
  { value: "home_bottom", label: "Home - Bawah" },
  { value: "sidebar_top", label: "Sidebar - Atas" },
  { value: "sidebar_middle", label: "Sidebar - Tengah" },
  { value: "sidebar_bottom", label: "Sidebar - Bawah" },
  { value: "article_sidebar", label: "Artikel - Sidebar" },
  { value: "footer", label: "Footer" },
];

export default function WidgetsPage() {
  const [widgets, setWidgets] = useState<WidgetConfig[]>(defaultWidgets);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeWidget, setActiveWidget] = useState<string | null>(null);

  // Load saved widget settings from API
  useEffect(() => {
    async function loadSettings() {
      const res = await fetch("/api/admin/settings?group=widgets");
      if (res.ok) {
        const data = await res.json();
        if (data.widgets) {
          // Merge saved settings with defaults
          const saved = Object.entries(data.widgets) as [string, string][];
          const updated = [...defaultWidgets];
          saved.forEach(([key, value]) => {
            try {
              const parsed = JSON.parse(value);
              const idx = updated.findIndex(w => w.key === key);
              if (idx >= 0) {
                updated[idx] = { ...updated[idx], ...parsed };
              }
            } catch {}
          });
          setWidgets(updated);
        }
      }
    }
    loadSettings();
  }, []);

  function toggleWidget(key: string) {
    setWidgets(widgets.map(w => w.key === key ? { ...w, enabled: !w.enabled } : w));
  }

  function updatePosition(key: string, position: string) {
    setWidgets(widgets.map(w => w.key === key ? { ...w, position } : w));
  }

  function updateSetting(widgetKey: string, settingKey: string, value: string) {
    setWidgets(widgets.map(w => {
      if (w.key === widgetKey) {
        return { ...w, settings: { ...w.settings, [settingKey]: value } };
      }
      return w;
    }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");

    const settings = widgets.map(w => ({
      key: w.key,
      value: JSON.stringify({ enabled: w.enabled, position: w.position, settings: w.settings }),
      group: "widgets",
    }));

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ settings }),
    });

    setSaving(false);
    if (res.ok) setMessage("Widget berhasil disimpan!");
    else setMessage("Gagal menyimpan");
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Tampilan</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827]">Widget</h1>
            <p className="mt-1 text-sm text-slate-500">Atur widget yang tampil di halaman: jadwal sholat, cuaca, trending, dll</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-5 py-2.5 font-bold text-white hover:bg-[#154A8F] disabled:opacity-50">
            <Save size={16} /> {saving ? "Menyimpan..." : "Simpan Semua"}
          </button>
        </div>

        {message && (
          <div className={`mt-4 rounded-md p-3 text-sm font-bold ${message.includes("berhasil") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {message}
          </div>
        )}

        {/* Widget cards */}
        <div className="mt-6 space-y-4">
          {widgets.map((widget) => {
            const Icon = widget.icon;
            const isOpen = activeWidget === widget.key;

            return (
              <div key={widget.key} className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                {/* Widget header */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className={`rounded-lg p-2.5 ${widget.enabled ? "bg-[#1B5DAF]/10" : "bg-slate-100"}`}>
                    <Icon size={20} className={widget.enabled ? "text-[#1B5DAF]" : "text-slate-400"} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-[#111827]">{widget.label}</p>
                    <p className="text-xs text-slate-500">{widget.description}</p>
                  </div>

                  {/* Position badge */}
                  <span className="hidden sm:inline-block rounded-md bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                    {positionOptions.find(p => p.value === widget.position)?.label || widget.position}
                  </span>

                  {/* Toggle */}
                  <button onClick={() => toggleWidget(widget.key)} className="flex-shrink-0">
                    {widget.enabled ? (
                      <ToggleRight size={32} className="text-[#1B5DAF]" />
                    ) : (
                      <ToggleLeft size={32} className="text-slate-300" />
                    )}
                  </button>

                  {/* Expand */}
                  <button
                    onClick={() => setActiveWidget(isOpen ? null : widget.key)}
                    className="rounded-md border px-3 py-1.5 text-xs font-bold text-slate-600 hover:border-[#1B5DAF] hover:text-[#1B5DAF]"
                  >
                    {isOpen ? "Tutup" : "Atur"}
                  </button>
                </div>

                {/* Widget settings (expanded) */}
                {isOpen && (
                  <div className="border-t border-slate-200 bg-[#F9FAFB] px-5 py-5">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {/* Position selector */}
                      <div>
                        <label className="mb-1 block text-sm font-bold text-slate-700">Posisi</label>
                        <select
                          value={widget.position}
                          onChange={(e) => updatePosition(widget.key, e.target.value)}
                          className="w-full rounded-md border bg-white px-3 py-2.5 text-sm"
                        >
                          {positionOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Dynamic settings */}
                      {Object.entries(widget.settings).map(([settingKey, settingValue]) => (
                        <div key={settingKey}>
                          <label className="mb-1 block text-sm font-bold text-slate-700 capitalize">
                            {settingKey.replace(/_/g, " ")}
                          </label>
                          {settingValue === "true" || settingValue === "false" ? (
                            <select
                              value={settingValue}
                              onChange={(e) => updateSetting(widget.key, settingKey, e.target.value)}
                              className="w-full rounded-md border bg-white px-3 py-2.5 text-sm"
                            >
                              <option value="true">Ya</option>
                              <option value="false">Tidak</option>
                            </select>
                          ) : settingKey === "city" ? (
                            <select
                              value={settingValue}
                              onChange={(e) => updateSetting(widget.key, settingKey, e.target.value)}
                              className="w-full rounded-md border bg-white px-3 py-2.5 text-sm"
                            >
                              <option value="Tokyo">Tokyo</option>
                              <option value="Osaka">Osaka</option>
                              <option value="Nagoya">Nagoya</option>
                              <option value="Fukuoka">Fukuoka</option>
                              <option value="Sapporo">Sapporo</option>
                              <option value="Yokohama">Yokohama</option>
                              <option value="Kobe">Kobe</option>
                              <option value="Kyoto">Kyoto</option>
                            </select>
                          ) : settingKey === "period" ? (
                            <select
                              value={settingValue}
                              onChange={(e) => updateSetting(widget.key, settingKey, e.target.value)}
                              className="w-full rounded-md border bg-white px-3 py-2.5 text-sm"
                            >
                              <option value="24hours">24 Jam</option>
                              <option value="7days">7 Hari</option>
                              <option value="30days">30 Hari</option>
                              <option value="alltime">Semua Waktu</option>
                            </select>
                          ) : settingKey === "scroll_speed" ? (
                            <select
                              value={settingValue}
                              onChange={(e) => updateSetting(widget.key, settingKey, e.target.value)}
                              className="w-full rounded-md border bg-white px-3 py-2.5 text-sm"
                            >
                              <option value="slow">Lambat</option>
                              <option value="normal">Normal</option>
                              <option value="fast">Cepat</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={settingValue}
                              onChange={(e) => updateSetting(widget.key, settingKey, e.target.value)}
                              className="w-full rounded-md border bg-white px-3 py-2.5 text-sm"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Position map */}
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-4">📐 Peta Posisi Widget</h3>
          <div className="grid gap-2 text-xs">
            <div className="rounded border border-dashed border-slate-300 p-3 text-center font-bold text-slate-500">HEADER TOP</div>
            <div className="rounded border border-dashed border-slate-300 p-3 text-center font-bold text-slate-500">HEADER BOTTOM (Breaking News)</div>
            <div className="grid grid-cols-[1fr_300px] gap-2">
              <div className="space-y-2">
                <div className="rounded border border-dashed border-slate-300 p-3 text-center font-bold text-slate-500">HOME TOP</div>
                <div className="rounded border border-dashed border-slate-300 p-3 text-center font-bold text-slate-500">HOME MIDDLE (Carousel)</div>
                <div className="rounded border border-dashed border-slate-300 p-3 text-center font-bold text-slate-500">HOME BOTTOM</div>
              </div>
              <div className="space-y-2">
                <div className="rounded border border-dashed border-[#1B5DAF] bg-blue-50 p-3 text-center font-bold text-[#1B5DAF]">SIDEBAR TOP (Sholat/Cuaca)</div>
                <div className="rounded border border-dashed border-[#1B5DAF] bg-blue-50 p-3 text-center font-bold text-[#1B5DAF]">SIDEBAR MIDDLE (Trending)</div>
                <div className="rounded border border-dashed border-[#1B5DAF] bg-blue-50 p-3 text-center font-bold text-[#1B5DAF]">SIDEBAR BOTTOM (Event)</div>
              </div>
            </div>
            <div className="rounded border border-dashed border-slate-300 p-3 text-center font-bold text-slate-500">FOOTER</div>
          </div>
        </div>
      </main>
    </div>
  );
}
