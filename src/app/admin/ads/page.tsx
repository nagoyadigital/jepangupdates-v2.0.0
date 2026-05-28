"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Megaphone, Plus, Trash2, Edit, X, Save, Upload, Eye, EyeOff } from "lucide-react";

type Ad = {
  id: string;
  name: string;
  position: string;
  type: string;
  content: string;
  link: string | null;
  isActive: boolean;
  showOnMobile: boolean;
  showOnDesktop: boolean;
  impressions: number;
  clicks: number;
  order: number;
  startDate: string | null;
  endDate: string | null;
};

const positionLabels: Record<string, string> = {
  HEADER_TOP: "Header - Atas",
  HEADER_BANNER: "Header - Banner Utama",
  SIDEBAR_TOP: "Sidebar - Atas",
  SIDEBAR_MIDDLE: "Sidebar - Tengah",
  SIDEBAR_BOTTOM: "Sidebar - Bawah",
  ARTICLE_TOP: "Artikel - Atas",
  ARTICLE_MIDDLE: "Artikel - Tengah (Parallax)",
  ARTICLE_BOTTOM: "Artikel - Bawah",
  FOOTER: "Footer",
  POPUP: "Popup",
  MOBILE_TOP: "Mobile - Header (Parallax)",
  MOBILE_BOTTOM: "Mobile - Bawah",
  PARALLAX: "Parallax - Full Width",
};

const typeLabels: Record<string, string> = {
  IMAGE: "Gambar (Upload)",
  SCRIPT: "Script (Adsense/JS)",
  HTML: "HTML Custom",
  ADSENSE: "Google Adsense",
};

export default function AdsPage() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    position: "HEADER_BANNER",
    type: "IMAGE",
    content: "",
    link: "",
    isActive: true,
    showOnMobile: true,
    showOnDesktop: true,
    order: 0,
    startDate: "",
    endDate: "",
  });

  async function fetchAds() {
    const res = await fetch("/api/admin/ads");
    if (res.ok) setAds(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchAds(); }, []);

  function resetForm() {
    setForm({ name: "", position: "HEADER_BANNER", type: "IMAGE", content: "", link: "", isActive: true, showOnMobile: true, showOnDesktop: true, order: 0, startDate: "", endDate: "" });
    setEditId(null);
  }

  function startEdit(ad: Ad) {
    setEditId(ad.id);
    setForm({
      name: ad.name,
      position: ad.position,
      type: ad.type,
      content: ad.content,
      link: ad.link || "",
      isActive: ad.isActive,
      showOnMobile: ad.showOnMobile,
      showOnDesktop: ad.showOnDesktop,
      order: ad.order,
      startDate: ad.startDate ? ad.startDate.split("T")[0] : "",
      endDate: ad.endDate ? ad.endDate.split("T")[0] : "",
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editId ? `/api/admin/ads/${editId}` : "/api/admin/ads";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setShowForm(false); resetForm(); fetchAds(); }
    else { const data = await res.json(); alert(data.error || "Gagal menyimpan"); }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: formData });
    if (res.ok) {
      const media = await res.json();
      setForm({ ...form, content: media.url });
    } else {
      alert("Gagal upload gambar");
    }
    setUploading(false);
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/ads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchAds();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus iklan "${name}"?`)) return;
    const res = await fetch(`/api/admin/ads/${id}`, { method: "DELETE" });
    if (res.ok) fetchAds();
  }

  // Group ads by position
  const groupedAds: Record<string, Ad[]> = {};
  ads.forEach((ad) => {
    if (!groupedAds[ad.position]) groupedAds[ad.position] = [];
    groupedAds[ad.position].push(ad);
  });

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Tampilan</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827]">Manajemen Iklan</h1>
            <p className="mt-1 text-sm text-slate-500">Kelola semua slot iklan di website termasuk parallax, banner, sidebar, dan popup</p>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-md bg-[#F5A91B] px-4 py-2.5 font-black text-[#1B5DAF] hover:bg-[#D98F00]">
            <Plus size={18} /> Tambah Iklan
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-[#111827]">{editId ? "Edit Iklan" : "Tambah Iklan Baru"}</h3>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }}><X size={20} className="text-slate-400" /></button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {/* Nama */}
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Nama Iklan</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="Contoh: Banner DCOM" className="w-full rounded-md border px-3 py-2.5 text-sm" />
              </div>

              {/* Posisi */}
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Posisi</label>
                <select value={form.position} onChange={(e) => setForm({...form, position: e.target.value})} className="w-full rounded-md border px-3 py-2.5 text-sm">
                  {Object.entries(positionLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Tipe */}
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Tipe Iklan</label>
                <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full rounded-md border px-3 py-2.5 text-sm">
                  {Object.entries(typeLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Link */}
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Link Tujuan (opsional)</label>
                <input type="url" value={form.link} onChange={(e) => setForm({...form, link: e.target.value})} placeholder="https://..." className="w-full rounded-md border px-3 py-2.5 text-sm" />
              </div>

              {/* Order */}
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Urutan</label>
                <input type="number" value={form.order} onChange={(e) => setForm({...form, order: parseInt(e.target.value) || 0})} className="w-full rounded-md border px-3 py-2.5 text-sm" />
              </div>

              {/* Tanggal */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Mulai</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({...form, startDate: e.target.value})} className="w-full rounded-md border px-2 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Berakhir</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({...form, endDate: e.target.value})} className="w-full rounded-md border px-2 py-2.5 text-sm" />
                </div>
              </div>
            </div>

            {/* Content area - depends on type */}
            <div className="mt-5">
              <label className="mb-1 block text-sm font-bold text-slate-700">
                {form.type === "IMAGE" ? "Gambar Iklan" : form.type === "SCRIPT" ? "Kode Script" : form.type === "ADSENSE" ? "Kode Adsense" : "Kode HTML"}
              </label>

              {form.type === "IMAGE" ? (
                <div className="space-y-3">
                  {/* Upload button */}
                  <div className="flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-slate-300 px-4 py-3 text-sm font-bold text-slate-600 hover:border-[#1B5DAF] hover:text-[#1B5DAF]">
                      <Upload size={16} />
                      {uploading ? "Mengupload..." : "Upload Gambar"}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                    </label>
                    <span className="text-xs text-slate-400">atau paste URL gambar di bawah</span>
                  </div>
                  <input type="text" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} placeholder="URL gambar: /uploads/2026/05/banner.jpg atau https://..." className="w-full rounded-md border px-3 py-2.5 text-sm" />
                  {/* Preview */}
                  {form.content && (
                    <div className="relative mt-2 h-32 w-full max-w-md overflow-hidden rounded-md border bg-slate-50">
                      <img src={form.content} alt="Preview" className="h-full w-full object-contain" />
                    </div>
                  )}
                </div>
              ) : (
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({...form, content: e.target.value})}
                  rows={6}
                  required
                  placeholder={form.type === "SCRIPT" ? "<script>...</script>" : form.type === "ADSENSE" ? "Paste kode Google Adsense di sini..." : "<div>...</div>"}
                  className="w-full rounded-md border px-3 py-2.5 font-mono text-sm"
                />
              )}
            </div>

            {/* Toggles */}
            <div className="mt-5 flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({...form, isActive: e.target.checked})} className="rounded" />
                <span className="font-bold text-slate-700">Aktif</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.showOnMobile} onChange={(e) => setForm({...form, showOnMobile: e.target.checked})} className="rounded" />
                <span className="font-bold text-slate-700">Tampil di Mobile</span>
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.showOnDesktop} onChange={(e) => setForm({...form, showOnDesktop: e.target.checked})} className="rounded" />
                <span className="font-bold text-slate-700">Tampil di Desktop</span>
              </label>
            </div>

            <div className="mt-5 flex gap-3">
              <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#154A8F]">
                <Save size={16} /> {editId ? "Update Iklan" : "Simpan Iklan"}
              </button>
              <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="rounded-md border px-5 py-2.5 text-sm font-bold text-slate-600">Batal</button>
            </div>
          </form>
        )}

        {/* Ads list grouped by position */}
        {loading ? (
          <p className="mt-8 text-center text-slate-400">Memuat...</p>
        ) : ads.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <Megaphone size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-bold text-slate-500">Belum ada iklan</p>
            <p className="mt-1 text-sm text-slate-400">Tambahkan iklan pertama untuk mulai monetisasi website</p>
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            {Object.entries(groupedAds).map(([position, posAds]) => (
              <div key={position} className="rounded-lg border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-3 bg-[#F4F7FB]">
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-600">
                    📍 {positionLabels[position] || position}
                  </h3>
                </div>
                <div className="divide-y divide-slate-100">
                  {posAds.map((ad) => (
                    <div key={ad.id} className="flex items-center gap-4 px-5 py-4">
                      {/* Preview thumbnail */}
                      <div className="h-12 w-20 flex-shrink-0 overflow-hidden rounded border bg-slate-50">
                        {ad.type === "IMAGE" && ad.content ? (
                          <img src={ad.content} alt={ad.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-[10px] font-bold text-slate-400">
                            {ad.type}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#111827] truncate">{ad.name}</p>
                        <p className="text-xs text-slate-500">
                          {typeLabels[ad.type]} · {ad.impressions} views · {ad.clicks} clicks
                          {ad.showOnMobile && ad.showOnDesktop ? " · All devices" : ad.showOnMobile ? " · Mobile only" : " · Desktop only"}
                        </p>
                      </div>

                      {/* Actions */}
                      <button onClick={() => toggleActive(ad.id, ad.isActive)} className={`rounded-full px-3 py-1 text-xs font-bold ${ad.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                        {ad.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                      <button onClick={() => startEdit(ad)} className="text-slate-400 hover:text-[#1B5DAF]"><Edit size={16} /></button>
                      <button onClick={() => handleDelete(ad.id, ad.name)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Position guide */}
        <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 mb-4">📐 Panduan Posisi & Ukuran Iklan</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F4F7FB] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-2">Posisi</th>
                  <th className="px-4 py-2">Ukuran Rekomendasi</th>
                  <th className="px-4 py-2">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                <tr><td className="px-4 py-2 font-bold">Header - Banner Utama</td><td className="px-4 py-2">1200×300 px</td><td className="px-4 py-2 text-slate-500">Banner lebar di atas homepage, di bawah menu navigasi</td></tr>
                <tr><td className="px-4 py-2 font-bold">Header - Atas</td><td className="px-4 py-2">728×90 px</td><td className="px-4 py-2 text-slate-500">Leaderboard kecil di paling atas halaman</td></tr>
                <tr><td className="px-4 py-2 font-bold">Sidebar - Atas</td><td className="px-4 py-2">300×250 px</td><td className="px-4 py-2 text-slate-500">Kotak iklan di sidebar kanan atas</td></tr>
                <tr><td className="px-4 py-2 font-bold">Sidebar - Tengah</td><td className="px-4 py-2">300×250 px</td><td className="px-4 py-2 text-slate-500">Kotak iklan di sidebar kanan tengah</td></tr>
                <tr><td className="px-4 py-2 font-bold">Sidebar - Bawah</td><td className="px-4 py-2">300×600 px</td><td className="px-4 py-2 text-slate-500">Half-page di sidebar kanan bawah</td></tr>
                <tr><td className="px-4 py-2 font-bold">Sidebar - Kiri</td><td className="px-4 py-2">120×600 px</td><td className="px-4 py-2 text-slate-500">Skyscraper di sisi kiri layar (desktop XL only)</td></tr>
                <tr><td className="px-4 py-2 font-bold">Sidebar - Kanan</td><td className="px-4 py-2">120×600 px</td><td className="px-4 py-2 text-slate-500">Skyscraper di sisi kanan layar (desktop XL only)</td></tr>
                <tr><td className="px-4 py-2 font-bold">Artikel - Atas</td><td className="px-4 py-2">728×90 px</td><td className="px-4 py-2 text-slate-500">Inline ad di antara section homepage</td></tr>
                <tr><td className="px-4 py-2 font-bold">Artikel - Tengah (Parallax)</td><td className="px-4 py-2">1:1 (800×800 px)</td><td className="px-4 py-2 text-slate-500">Muncul di tengah konten artikel dengan efek parallax, gambar diam saat scroll</td></tr>
                <tr><td className="px-4 py-2 font-bold">Artikel - Bawah</td><td className="px-4 py-2">728×90 px</td><td className="px-4 py-2 text-slate-500">Di bawah konten artikel sebelum related</td></tr>
                <tr><td className="px-4 py-2 font-bold">Mobile - Header (Parallax)</td><td className="px-4 py-2">400×700 px</td><td className="px-4 py-2 text-slate-500">Fullscreen saat pertama buka di HP, bisa di-close</td></tr>
                <tr><td className="px-4 py-2 font-bold">Mobile - Bawah</td><td className="px-4 py-2">320×50 px</td><td className="px-4 py-2 text-slate-500">Sticky banner di bawah layar mobile</td></tr>
                <tr><td className="px-4 py-2 font-bold">Popup</td><td className="px-4 py-2">600×400 px</td><td className="px-4 py-2 text-slate-500">Modal popup (muncul setelah beberapa detik)</td></tr>
                <tr><td className="px-4 py-2 font-bold">Footer</td><td className="px-4 py-2">728×90 px</td><td className="px-4 py-2 text-slate-500">Banner di atas footer</td></tr>
                <tr><td className="px-4 py-2 font-bold">Parallax - Full Width</td><td className="px-4 py-2">1200×500 px</td><td className="px-4 py-2 text-slate-500">Parallax full lebar di antara section</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 rounded-md bg-blue-50 p-3 text-xs text-blue-800">
            <p className="font-bold">💡 Tips:</p>
            <ul className="mt-1 list-disc pl-4 space-y-0.5">
              <li>Gambar otomatis dikompres ke WebP saat upload (tetap tajam, ukuran kecil)</li>
              <li>Untuk Google Adsense / Adsterra: pilih tipe "Script" lalu paste kode</li>
              <li>Untuk custom HTML (iframe, dll): pilih tipe "HTML Custom"</li>
              <li>Set tanggal mulai & berakhir untuk iklan kampanye terbatas</li>
              <li>Centang "Mobile only" atau "Desktop only" untuk targeting device</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
