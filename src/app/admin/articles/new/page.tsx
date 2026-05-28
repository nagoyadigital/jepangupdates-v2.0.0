"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Save, Upload, X, Eye, Image as ImageIcon, Plus, ChevronDown, ChevronUp } from "lucide-react";

type Category = { id: string; name: string; slug: string };
type TagItem = { id: string; name: string; slug: string };

export default function NewArticlePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<TagItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [showSEO, setShowSEO] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiTone, setAiTone] = useState("informatif");
  const [aiLength, setAiLength] = useState("medium");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiImagePrompt, setAiImagePrompt] = useState("");
  const [newTag, setNewTag] = useState("");

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    categoryId: "",
    featuredImage: "",
    status: "DRAFT" as "DRAFT" | "REVIEW",
    tags: [] as string[],
    isFeatured: false,
    isBreaking: false,
    isHeadline: false,
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/categories").then(r => r.json()),
      fetch("/api/admin/tags").then(r => r.json()),
    ]).then(([cats, tags]) => {
      setCategories(cats);
      setAllTags(tags);
      if (cats.length > 0 && !form.categoryId) {
        setForm(prev => ({ ...prev, categoryId: cats[0].id }));
      }
    });

    // Restore auto-saved draft
    const saved = localStorage.getItem("draft_article");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.title || parsed.content) {
          const restore = confirm("Ada draft yang belum disimpan. Mau lanjutkan?");
          if (restore) setForm(prev => ({ ...prev, ...parsed }));
          else localStorage.removeItem("draft_article");
        }
      } catch {}
    }
  }, []);

  // Auto-save to localStorage every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      if (form.title || form.content) {
        localStorage.setItem("draft_article", JSON.stringify(form));
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [form]);

  // Warn before leaving if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.title || form.content) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.title, form.content]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: formData });
    if (res.ok) {
      const media = await res.json();
      setForm(prev => ({ ...prev, featuredImage: media.url }));
    } else {
      alert("Gagal upload gambar");
    }
    setUploading(false);
  }

  async function handleAddTag() {
    if (!newTag.trim()) return;
    const res = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTag.trim() }),
    });
    if (res.ok) {
      const tag = await res.json();
      setAllTags(prev => [...prev, tag]);
      setForm(prev => ({ ...prev, tags: [...prev.tags, tag.id] }));
      setNewTag("");
    }
  }

  function toggleTag(tagId: string) {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId) ? prev.tags.filter(t => t !== tagId) : [...prev.tags, tagId],
    }));
  }

  async function handleAIGenerate() {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    setError("");
    const res = await fetch("/api/admin/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic: aiTopic, tone: aiTone, length: aiLength }),
    });
    const data = await res.json();
    setAiLoading(false);
    if (res.ok) {
      setForm(prev => ({
        ...prev,
        title: data.title || prev.title,
        content: data.content || prev.content,
        excerpt: data.excerpt || prev.excerpt,
        metaKeywords: data.metaKeywords || prev.metaKeywords,
      }));
      setShowAI(false);
      setAiTopic("");
    } else {
      setError(data.error || "Gagal generate artikel");
    }
  }

  async function handleSubmit(status: "DRAFT" | "REVIEW" | "PUBLISHED") {
    if (!form.title.trim()) { setError("Judul wajib diisi"); return; }
    if (!form.content.trim()) { setError("Konten wajib diisi"); return; }
    if (!form.categoryId) { setError("Kategori wajib dipilih"); return; }

    setSaving(true);
    setError("");

    const res = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status }),
    });

    setSaving(false);

    if (res.ok) {
      localStorage.removeItem("draft_article");
      router.push("/admin/articles");
    } else {
      const data = await res.json();
      setError(data.error || "Gagal menyimpan artikel");
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Konten</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827]">Tambah Artikel</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSubmit("DRAFT")} disabled={saving} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              <Save size={16} className="mr-1.5 inline" /> Simpan Draft
            </button>
            <button onClick={async () => {
              if (!form.title.trim() || !form.content.trim() || !form.categoryId) { setError("Isi judul, konten, dan kategori dulu untuk preview"); return; }
              setSaving(true);
              const res = await fetch("/api/admin/articles", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, status: "DRAFT" }) });
              setSaving(false);
              if (res.ok) { const article = await res.json(); window.open(`/${article.slug}?preview=true`, '_blank'); router.push(`/admin/articles/${article.id}/edit`); }
              else { const data = await res.json(); setError(data.error || "Gagal menyimpan"); }
            }} disabled={saving} className="rounded-md border border-[#1B5DAF] bg-white px-4 py-2.5 text-sm font-bold text-[#1B5DAF] hover:bg-blue-50 disabled:opacity-50">
              <Eye size={16} className="mr-1.5 inline" /> Preview
            </button>
            <button onClick={() => handleSubmit("PUBLISHED")} disabled={saving} className="rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
              Publikasi
            </button>
          </div>
        </div>

        {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main content area */}
          <div className="space-y-5">
            {/* AI Generate Panel */}
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
              <button onClick={() => setShowAI(!showAI)} className="flex w-full items-center justify-between text-sm font-bold text-purple-700">
                <span>✨ Generate Artikel dengan AI</span>
                <span className="text-xs">{showAI ? "Tutup" : "Buka"}</span>
              </button>
              {showAI && (
                <div className="mt-4 space-y-3">
                  <div>
                    <input type="text" value={aiTopic} onChange={(e) => setAiTopic(e.target.value)} placeholder="Masukkan topik artikel, contoh: Cara daftar visa kerja Jepang 2026" className="w-full rounded-md border border-purple-200 px-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none" />
                  </div>
                  <div className="flex gap-3">
                    <select value={aiTone} onChange={(e) => setAiTone(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
                      <option value="informatif">Informatif</option>
                      <option value="formal">Formal</option>
                      <option value="santai">Santai</option>
                    </select>
                    <select value={aiLength} onChange={(e) => setAiLength(e.target.value)} className="rounded-md border px-3 py-2 text-sm">
                      <option value="short">Pendek (400-600 kata)</option>
                      <option value="medium">Sedang (800-1000 kata)</option>
                      <option value="long">Panjang (1200-1500 kata)</option>
                    </select>
                    <button onClick={handleAIGenerate} disabled={aiLoading || !aiTopic.trim()} className="rounded-md bg-purple-600 px-4 py-2 text-sm font-bold text-white hover:bg-purple-700 disabled:opacity-50">
                      {aiLoading ? "Generating..." : "✨ Generate"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">Judul Artikel</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({...form, title: e.target.value})}
                placeholder="Tulis judul artikel yang menarik..."
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-lg font-bold focus:border-[#1B5DAF] focus:outline-none focus:ring-1 focus:ring-[#1B5DAF]"
              />
            </div>

            {/* Content */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">Konten Artikel</label>
              <RichTextEditor content={form.content} onChange={(html) => setForm({...form, content: html})} />
            </div>

            {/* Excerpt */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">Ringkasan / Excerpt</label>
              <p className="mb-3 text-xs text-slate-400">Ringkasan singkat yang muncul di halaman list dan meta description. Maks 300 karakter.</p>
              <textarea
                value={form.excerpt}
                onChange={(e) => setForm({...form, excerpt: e.target.value})}
                rows={3}
                maxLength={300}
                placeholder="Ringkasan singkat artikel..."
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm focus:border-[#1B5DAF] focus:outline-none"
              />
              <p className="mt-1 text-right text-xs text-slate-400">{form.excerpt.length}/300</p>
            </div>

            {/* SEO Section */}
            <div className="rounded-lg border border-slate-200 bg-white">
              <button onClick={() => setShowSEO(!showSEO)} className="flex w-full items-center justify-between p-5">
                <span className="text-sm font-bold text-slate-700">🔍 Pengaturan SEO</span>
                {showSEO ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {showSEO && (
                <div className="border-t border-slate-200 p-5 space-y-4">
                  {/* Google Preview */}
                  <div className="rounded-md border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Preview di Google</p>
                    <div className="space-y-1">
                      <p className="text-sm text-emerald-700 truncate">jepangupdates.com › {form.title ? form.title.toLowerCase().replace(/\s+/g, "-").substring(0, 40) : "nama-artikel"}</p>
                      <p className="text-xl text-[#1a0dab] hover:underline truncate">{form.metaTitle || form.title || "Judul Artikel"}</p>
                      <p className="text-sm text-slate-600 line-clamp-2">{form.metaDescription || form.excerpt || "Deskripsi artikel akan muncul di sini. Tulis ringkasan yang menarik agar orang mau klik dari hasil pencarian Google."}</p>
                    </div>
                  </div>

                  {/* Social Media Preview */}
                  <div className="rounded-md border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Preview di Social Media</p>
                    <div className="overflow-hidden rounded-md border border-slate-200">
                      {form.featuredImage ? (
                        <img src={form.featuredImage} alt="OG Preview" className="h-40 w-full object-cover" />
                      ) : (
                        <div className="flex h-40 items-center justify-center bg-slate-100 text-sm text-slate-400">Gambar utama akan muncul di sini</div>
                      )}
                      <div className="bg-[#f2f3f5] p-3">
                        <p className="text-[11px] uppercase text-slate-500">jepangupdates.com</p>
                        <p className="mt-1 text-sm font-bold text-[#1d2129] line-clamp-2">{form.metaTitle || form.title || "Judul Artikel"}</p>
                        <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{form.metaDescription || form.excerpt || "Deskripsi artikel..."}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Meta Title</label>
                    <input type="text" value={form.metaTitle} onChange={(e) => setForm({...form, metaTitle: e.target.value})} placeholder="Judul untuk mesin pencari (kosong = pakai judul artikel)" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                    <p className="mt-1 text-xs text-slate-400">{(form.metaTitle || form.title || "").length}/60 karakter (rekomendasi maks 60)</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Meta Description</label>
                    <textarea value={form.metaDescription} onChange={(e) => setForm({...form, metaDescription: e.target.value})} rows={2} placeholder="Deskripsi untuk mesin pencari (kosong = pakai excerpt)" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                    <p className="mt-1 text-xs text-slate-400">{(form.metaDescription || form.excerpt || "").length}/160 karakter (rekomendasi maks 160)</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Meta Keywords</label>
                    <input type="text" value={form.metaKeywords} onChange={(e) => setForm({...form, metaKeywords: e.target.value})} placeholder="keyword1, keyword2, keyword3" className="w-full rounded-md border px-4 py-2.5 text-sm" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            {/* Featured Image */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-3 block text-sm font-bold text-slate-700">Gambar Utama</label>
              {form.featuredImage ? (
                <div className="relative">
                  <img src={form.featuredImage} alt="Featured" className="w-full rounded-md object-cover" />
                  <button onClick={() => setForm({...form, featuredImage: ""})} className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 py-8 hover:border-[#1B5DAF]">
                  <Upload size={32} className="mb-2 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600">{uploading ? "Mengupload..." : "Upload Gambar"}</span>
                  <span className="mt-1 text-xs text-slate-400">JPG, PNG, WebP (maks 5MB)</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              )}
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  value={form.featuredImage}
                  onChange={(e) => setForm({...form, featuredImage: e.target.value})}
                  placeholder="Atau paste URL gambar..."
                  className="w-full rounded-md border px-3 py-2 text-xs"
                />
                <div className="rounded-md border border-purple-200 bg-purple-50 p-3">
                  <p className="mb-2 text-xs font-bold text-purple-700">✨ Generate dengan AI</p>
                  <input
                    type="text"
                    value={aiImagePrompt}
                    onChange={(e) => setAiImagePrompt(e.target.value)}
                    placeholder="Deskripsi gambar, contoh: Japanese office workers in Tokyo"
                    className="w-full rounded-md border border-purple-200 px-3 py-2 text-xs focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!aiImagePrompt.trim()) return;
                      setUploading(true);
                      const res = await fetch("/api/admin/ai/image", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ prompt: aiImagePrompt }),
                      });
                      const data = await res.json();
                      setUploading(false);
                      if (res.ok) setForm(prev => ({ ...prev, featuredImage: data.url }));
                      else setError(data.error || "Gagal generate gambar");
                    }}
                    disabled={uploading || !aiImagePrompt.trim()}
                    className="mt-2 w-full rounded-md bg-purple-600 px-3 py-2 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-50"
                  >
                    {uploading ? "Generating..." : "Generate"}
                  </button>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-3 block text-sm font-bold text-slate-700">Kategori</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({...form, categoryId: e.target.value})}
                className="w-full rounded-md border px-3 py-2.5 text-sm"
              >
                <option value="">-- Pilih Kategori --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-3 block text-sm font-bold text-slate-700">Tag</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }}
                  placeholder="Tambah tag..."
                  className="flex-1 rounded-md border px-3 py-2 text-sm"
                />
                <button onClick={handleAddTag} className="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold hover:bg-slate-200">
                  <Plus size={16} />
                </button>
              </div>
              {/* Selected tags */}
              {form.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {allTags.filter(t => form.tags.includes(t.id)).map((tag) => (
                    <button key={tag.id} onClick={() => toggleTag(tag.id)} className="inline-flex items-center gap-1 rounded-full bg-[#1B5DAF] px-2.5 py-1 text-[11px] font-bold text-white">
                      {tag.name} <X size={12} />
                    </button>
                  ))}
                </div>
              )}
              {/* Available tags - searchable, limited */}
              <div className="mt-3 max-h-32 overflow-y-auto rounded-md border border-slate-100 p-2">
                <div className="flex flex-wrap gap-1.5">
                  {allTags.filter(t => !form.tags.includes(t.id)).slice(0, 30).map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 hover:bg-slate-200"
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Article options */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-3 block text-sm font-bold text-slate-700">Opsi Artikel</label>
              <div className="space-y-3">
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({...form, isFeatured: e.target.checked})} className="rounded" />
                  <span className="font-bold text-slate-700">⭐ Artikel Unggulan</span>
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={form.isBreaking} onChange={(e) => setForm({...form, isBreaking: e.target.checked})} className="rounded" />
                  <span className="font-bold text-slate-700">🔴 Breaking News</span>
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <input type="checkbox" checked={form.isHeadline} onChange={(e) => setForm({...form, isHeadline: e.target.checked})} className="rounded" />
                  <span className="font-bold text-slate-700">📰 Headline</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
