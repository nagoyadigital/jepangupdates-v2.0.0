"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminSidebar } from "@/components/AdminSidebar";
import { FileText, Plus, Search, Filter, Trash2, Edit, Eye } from "lucide-react";

type Article = {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  createdAt: string;
  author: { name: string };
  category: { name: string };
};

type Pagination = { page: number; limit: number; total: number; totalPages: number };

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchArticles(page = 1) {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("search", search);
    if (statusFilter) params.set("status", statusFilter);

    const res = await fetch(`/api/admin/articles?${params}`);
    if (res.ok) {
      const data = await res.json();
      setArticles(data.articles);
      setPagination(data.pagination);
    }
    setLoading(false);
  }

  useEffect(() => { fetchArticles(); }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchArticles(1);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus artikel "${title}"?`)) return;
    const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    if (res.ok) fetchArticles(pagination.page);
    else alert("Gagal menghapus artikel");
  }

  const statusColors: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    REVIEW: "bg-yellow-50 text-yellow-700",
    PUBLISHED: "bg-emerald-50 text-emerald-700",
    ARCHIVED: "bg-red-50 text-red-700",
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Konten</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827]">Semua Artikel</h1>
          </div>
          <Link href="/admin/articles/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#F5A91B] px-4 font-black text-[#1B5DAF] hover:bg-[#D98F00]">
            <Plus size={18} />
            Tambah Artikel
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari artikel..."
              className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-[#1B5DAF] focus:outline-none"
            />
          </form>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setTimeout(() => fetchArticles(1), 0); }}
            className="rounded-md border border-slate-200 bg-white px-3 py-2.5 text-sm"
          >
            <option value="">Semua Status</option>
            <option value="DRAFT">Draft</option>
            <option value="REVIEW">Review</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Table */}
        <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-[#F4F7FB] text-xs uppercase tracking-[0.16em] text-slate-500">
                <tr>
                  <th className="px-5 py-4">Judul</th>
                  <th className="px-5 py-4">Kategori</th>
                  <th className="px-5 py-4">Penulis</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Views</th>
                  <th className="px-5 py-4">Tanggal</th>
                  <th className="px-5 py-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">Memuat...</td></tr>
                ) : articles.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-slate-400">
                    <FileText size={40} className="mx-auto mb-2 text-slate-300" />
                    Belum ada artikel
                  </td></tr>
                ) : (
                  articles.map((article) => (
                    <tr key={article.id} className="hover:bg-slate-50">
                      <td className="max-w-[280px] truncate px-5 py-4 font-bold text-[#1B5DAF]">
                        {article.title}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{article.category.name}</td>
                      <td className="px-5 py-4 text-slate-600">{article.author.name}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-md px-2 py-1 text-xs font-bold ${statusColors[article.status] || ""}`}>
                          {article.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{article.views.toLocaleString()}</td>
                      <td className="px-5 py-4 text-slate-600">{new Date(article.createdAt).toLocaleDateString("id-ID")}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link href={`/${article.slug}`} target="_blank" className="text-slate-400 hover:text-[#1B5DAF]"><Eye size={16} /></Link>
                          <Link href={`/admin/articles/${article.id}/edit`} className="text-slate-400 hover:text-[#1B5DAF]"><Edit size={16} /></Link>
                          <button onClick={() => handleDelete(article.id, article.title)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
              <p className="text-sm text-slate-500">
                Menampilkan {articles.length} dari {pagination.total} artikel
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchArticles(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="flex items-center px-3 text-sm font-bold">{pagination.page}/{pagination.totalPages}</span>
                <button
                  onClick={() => fetchArticles(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
