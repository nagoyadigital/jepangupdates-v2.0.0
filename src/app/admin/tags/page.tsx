"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Plus, Search, Tag, Trash2 } from "lucide-react";

type TagItem = { id: string; name: string; slug: string; _count: { articles: number } };

export default function TagsPage() {
  const [tags, setTags] = useState<TagItem[]>([]);
  const [newTag, setNewTag] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 30;

  async function fetchTags() {
    const res = await fetch("/api/admin/tags");
    if (res.ok) setTags(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchTags(); }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!newTag.trim()) return;
    const res = await fetch("/api/admin/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTag.trim() }),
    });
    if (res.ok) { setNewTag(""); fetchTags(); }
  }

  const filteredTags = search
    ? tags.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))
    : tags;

  const totalPages = Math.ceil(filteredTags.length / perPage);
  const paginatedTags = filteredTags.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Konten</p>
          <h1 className="mt-2 text-3xl font-black text-[#111827]">Tag</h1>
          <p className="mt-1 text-sm text-slate-500">{tags.length} tag total</p>
        </div>

        {/* Add & Search */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <form onSubmit={handleAdd} className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nama tag baru..."
              className="w-48 rounded-md border border-slate-200 bg-white px-4 py-2.5 text-sm focus:border-[#1B5DAF] focus:outline-none"
            />
            <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#154A8F]">
              <Plus size={16} /> Tambah
            </button>
          </form>
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tag..."
              className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1B5DAF] focus:outline-none"
            />
          </div>
        </div>

        {/* Tags table */}
        <div className="mt-6 rounded-lg border border-slate-200 bg-white">
          {loading ? (
            <p className="p-8 text-center text-slate-400">Memuat...</p>
          ) : filteredTags.length === 0 ? (
            <p className="p-8 text-center text-slate-400">Tidak ada tag ditemukan</p>
          ) : (
            <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#F4F7FB] text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3">Nama Tag</th>
                    <th className="px-5 py-3">Slug</th>
                    <th className="px-5 py-3">Artikel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedTags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-bold text-[#111827]">{tag.name}</td>
                      <td className="px-5 py-3 text-slate-500">{tag.slug}</td>
                      <td className="px-5 py-3">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-600">{tag._count.articles}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
                <p className="text-sm text-slate-500">Halaman {page} dari {totalPages} ({filteredTags.length} tag)</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-md border px-3 py-1.5 text-sm font-bold disabled:opacity-50">Prev</button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="rounded-md border px-3 py-1.5 text-sm font-bold disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
