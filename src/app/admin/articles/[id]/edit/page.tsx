"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Save, Upload, X, Eye, Plus, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Category = { id: string; name: string; slug: string };
type TagItem = { id: string; name: string; slug: string };

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<TagItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showSEO, setShowSEO] = useState(false);
  const [newTag, setNewTag] = useState("");

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    categoryId: "",
    featuredImage: "",
    status: "DRAFT" as string,
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
      fetch(`/api/admin/articles/${id}`).then(r => r.json()),
      fetch("/api/admin/categories").then(r => r.json()),
      fetch("/api/admin/tags").then(r => r.json()),
    ]).then(([article, cats, tags]) => {
      setCategories(cats);
      setAllTags(tags);
      if (article && !article.error) {
        setForm({
          title: article.title || "",
          content: article.content || "",
          excerpt: article.excerpt || "",
          categoryId: article.categoryId || "",
          featuredImage: article.featuredImage || "",
          status: article.status || "DRAFT",
          tags: article.tags?.map((t: { tag: { id: string } }) => t.tag.id) || [],
          isFeatured: article.isFeatured || false,
          isBreaking: article.isBreaking || false,
          isHeadline: article.isHeadline || false,
          metaTitle: article.metaTitle || "",
          metaDescription: article.metaDescription || "",
          metaKeywords: article.metaKeywords || "",
        });
      }
      setLoading(false);
    });
  }, [id]);

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

  // Editor toolbar helpers
  function getEditor() {
    return document.getElementById("content-editor") as HTMLTextAreaElement | null;
  }

  function insertTag(tag: string) {
    const editor = getEditor();
    if (!editor) return;
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selected = form.content.substring(start, end);
    const before = form.content.substring(0, start);
    const after = form.content.substring(end);
    setForm({ ...form, content: `${before}<${tag}>${selected || "teks"}</${tag}>${after}` });
  }

  function insertBlock(block: string) {
    const editor = getEditor();
    if (!editor) return;
    const start = editor.selectionStart;
    const before = form.content.substring(0, start);
    const after = form.content.substring(start);
    setForm({ ...form, content: `${before}\n${block}\n${after}` });
  }

  function insertLink() {
    const url = prompt("Masukkan URL link:");
    if (!url) return;
    const text = prompt("Teks link:", "klik di sini") || "klik di sini";
    insertBlock(`<a href="${url}" target="_blank">${text}</a>`);
  }

  function insertImage() {
    const url = prompt("URL gambar (upload dulu di Media Library):");
    if (!url) return;
    const alt = prompt("Alt text:", "") || "";
    insertBlock(`<img src="${url}" alt="${alt}" />`);
  }

  function insertVideo() {
    const url = prompt("URL YouTube:");
    if (!url) return;
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?/]+)/)?.[1];
    if (videoId) insertBlock(`<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`);
    else alert("URL YouTube tidak valid");
  }

  async function handleSubmit(status: string) {
    if (!form.title.trim()) { setError("Judul wajib diisi"); return; }
    if (!form.content.trim()) { setError("Konten wajib diisi"); return; }

    setSaving(true);
    setError("");

    const res = await fetch(`/api/admin/articles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status }),
    });

    setSaving(false);

    if (res.ok) {
      router.push("/admin/articles");
    } else {
      const data = await res.json();
      setError(data.error || "Gagal menyimpan artikel");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] lg:flex">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-slate-400">Memuat artikel...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin/articles" className="rounded-md border border-slate-300 bg-white p-2 hover:bg-slate-50">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Konten</p>
              <h1 className="mt-1 text-2xl font-black text-[#111827]">Edit Artikel</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleSubmit("DRAFT")} disabled={saving} className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50">
              <Save size={16} className="mr-1.5 inline" /> Simpan Draft
            </button>
            <button onClick={() => handleSubmit("PUBLISHED")} disabled={saving} className="rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50">
              <Eye size={16} className="mr-1.5 inline" /> Publish
            </button>
          </div>
        </div>

        {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}

        {/* Status badge */}
        <div className="mt-4">
          <span className={`rounded-md px-3 py-1 text-xs font-bold ${
            form.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700" :
            form.status === "REVIEW" ? "bg-yellow-50 text-yellow-700" :
            form.status === "ARCHIVED" ? "bg-red-50 text-red-700" :
            "bg-slate-100 text-slate-700"
          }`}>
            Status: {form.status}
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* Main content */}
          <div className="space-y-5">
            {/* Title */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">Judul Artikel</label>
              <input type="text" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full rounded-md border border-slate-300 px-4 py-3 text-lg font-bold focus:border-[#1B5DAF] focus:outline-none focus:ring-1 focus:ring-[#1B5DAF]" />
            </div>

            {/* Content with toolbar */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">Konten Artikel</label>
              <div className="mb-2 flex flex-wrap gap-1 rounded-t-md border border-slate-200 bg-slate-50 p-2">
                <ToolbarBtn label="Bold" icon="B" className="font-black" onClick={() => insertTag("strong")} />
                <ToolbarBtn label="Italic" icon="I" className="italic" onClick={() => insertTag("em")} />
                <ToolbarBtn label="Underline" icon="U" className="underline" onClick={() => insertTag("u")} />
                <div className="mx-1 w-px bg-slate-300" />
                <ToolbarBtn label="H2" icon="H2" onClick={() => insertTag("h2")} />
                <ToolbarBtn label="H3" icon="H3" onClick={() => insertTag("h3")} />
                <ToolbarBtn label="P" icon="¶" onClick={() => insertTag("p")} />
                <div className="mx-1 w-px bg-slate-300" />
                <ToolbarBtn label="List" icon="•" onClick={() => insertBlock("<ul>\n  <li></li>\n</ul>")} />
                <ToolbarBtn label="Quote" icon="❝" onClick={() => insertTag("blockquote")} />
                <div className="mx-1 w-px bg-slate-300" />
                <ToolbarBtn label="Link" icon="🔗" onClick={() => insertLink()} />
                <ToolbarBtn label="Image" icon="🖼" onClick={() => insertImage()} />
                <ToolbarBtn label="Video" icon="▶" onClick={() => insertVideo()} />
                <ToolbarBtn label="HR" icon="—" onClick={() => insertBlock("<hr />")} />
              </div>
              <textarea id="content-editor" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} rows={22} className="w-full rounded-b-md border border-t-0 border-slate-200 px-4 py-3 font-mono text-sm leading-relaxed focus:border-[#1B5DAF] focus:outline-none" />
            </div>

            {/* Excerpt */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-2 block text-sm font-bold text-slate-700">Ringkasan / Excerpt</label>
              <textarea value={form.excerpt} onChange={(e) => setForm({...form, excerpt: e.target.value})} rows={3} maxLength={300} className="w-full rounded-md border px-4 py-3 text-sm focus:border-[#1B5DAF] focus:outline-none" />
              <p className="mt-1 text-right text-xs text-slate-400">{form.excerpt.length}/300</p>
            </div>

            {/* SEO */}
            <div className="rounded-lg border border-slate-200 bg-white">
              <button onClick={() => setShowSEO(!showSEO)} className="flex w-full items-center justify-between p-5">
                <span className="text-sm font-bold text-slate-700">🔍 Pengaturan SEO</span>
                {showSEO ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
              {showSEO && (
                <div className="border-t border-slate-200 p-5 space-y-4">
                  <div className="rounded-md border border-slate-200 bg-white p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Preview di Google</p>
                    <p className="text-sm text-emerald-700 truncate">japanpopuler.com › {form.title.toLowerCase().replace(/\s+/g, "-").substring(0, 40)}</p>
                    <p className="text-xl text-[#1a0dab] truncate">{form.metaTitle || form.title || "Judul"}</p>
                    <p className="text-sm text-slate-600 line-clamp-2">{form.metaDescription || form.excerpt || "Deskripsi..."}</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Meta Title</label>
                    <input type="text" value={form.metaTitle} onChange={(e) => setForm({...form, metaTitle: e.target.value})} className="w-full rounded-md border px-4 py-2.5 text-sm" />
                    <p className="mt-1 text-xs text-slate-400">{(form.metaTitle || form.title).length}/60</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Meta Description</label>
                    <textarea value={form.metaDescription} onChange={(e) => setForm({...form, metaDescription: e.target.value})} rows={2} className="w-full rounded-md border px-4 py-2.5 text-sm" />
                    <p className="mt-1 text-xs text-slate-400">{(form.metaDescription || form.excerpt).length}/160</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Meta Keywords</label>
                    <input type="text" value={form.metaKeywords} onChange={(e) => setForm({...form, metaKeywords: e.target.value})} className="w-full rounded-md border px-4 py-2.5 text-sm" />
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
                  <button onClick={() => setForm({...form, featuredImage: ""})} className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"><X size={14} /></button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-slate-300 py-8 hover:border-[#1B5DAF]">
                  <Upload size={32} className="mb-2 text-slate-400" />
                  <span className="text-sm font-bold text-slate-600">{uploading ? "Mengupload..." : "Upload Gambar"}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>
              )}
              <input type="text" value={form.featuredImage} onChange={(e) => setForm({...form, featuredImage: e.target.value})} placeholder="Atau paste URL..." className="mt-3 w-full rounded-md border px-3 py-2 text-xs" />
            </div>

            {/* Category */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-3 block text-sm font-bold text-slate-700">Kategori</label>
              <select value={form.categoryId} onChange={(e) => setForm({...form, categoryId: e.target.value})} className="w-full rounded-md border px-3 py-2.5 text-sm">
                {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
              </select>
            </div>

            {/* Tags */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <label className="mb-3 block text-sm font-bold text-slate-700">Tag</label>
              <div className="flex gap-2">
                <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTag(); } }} placeholder="Tambah tag..." className="flex-1 rounded-md border px-3 py-2 text-sm" />
                <button onClick={handleAddTag} className="rounded-md bg-slate-100 px-3 py-2"><Plus size={16} /></button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {allTags.map((tag) => (
                  <button key={tag.id} onClick={() => toggleTag(tag.id)} className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${form.tags.includes(tag.id) ? "bg-[#1B5DAF] text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{tag.name}</button>
                ))}
              </div>
            </div>

            {/* Options */}
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

function ToolbarBtn({ label, icon, className = "", onClick }: { label: string; icon: string; className?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} title={label} className={`flex h-8 min-w-[32px] items-center justify-center rounded px-1.5 text-sm text-slate-600 hover:bg-white hover:text-[#1B5DAF] hover:shadow-sm ${className}`}>
      {icon}
    </button>
  );
}
