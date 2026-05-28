"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, Eye, FileText, FolderTree, Image, Plus, TrendingUp, Users } from "lucide-react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminFooter } from "@/components/AdminFooter";

type Stats = {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  reviewArticles: number;
  totalViews: number;
  totalCategories: number;
  totalUsers: number;
  totalMedia: number;
};

type RecentArticle = {
  id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  createdAt: string;
  author: { name: string };
  category: { name: string };
};

type TopArticle = {
  title: string;
  slug: string;
  views: number;
  category: { name: string };
};

type CategoryStat = {
  name: string;
  articles: number;
  views: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [topArticles, setTopArticles] = useState<TopArticle[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      const res = await fetch("/api/admin/dashboard");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentArticles(data.recentArticles);
        setTopArticles(data.topArticles || []);
        setCategoryStats(data.categoryStats || []);
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827]">Overview Statistik</h1>
          </div>
          <Link href="/admin/articles/new" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#F5A91B] px-4 font-black text-[#1B5DAF] hover:bg-[#D98F00]">
            <Plus size={18} />
            Tambah Artikel
          </Link>
        </div>

        {/* Stats */}
        <section className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Artikel" value={loading ? "..." : String(stats?.totalArticles || 0)} sub={`${stats?.publishedArticles || 0} published, ${stats?.draftArticles || 0} draft`} icon={FileText} />
          <StatCard label="Total Views" value={loading ? "..." : (stats?.totalViews || 0).toLocaleString()} sub="Semua artikel" icon={Eye} />
          <StatCard label="Total Pengguna" value={loading ? "..." : String(stats?.totalUsers || 0)} sub="Semua role" icon={Users} />
          <StatCard label="Media & Kategori" value={loading ? "..." : `${stats?.totalMedia || 0} / ${stats?.totalCategories || 0}`} sub="File / Kategori" icon={Image} />
        </section>

        {/* Quick actions */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/articles/new" className="rounded-lg border border-slate-200 bg-white p-4 text-center hover:border-[#1B5DAF] hover:shadow-sm">
            <FileText size={24} className="mx-auto mb-2 text-[#1B5DAF]" />
            <p className="text-sm font-bold">Tulis Artikel</p>
          </Link>
          <Link href="/admin/media" className="rounded-lg border border-slate-200 bg-white p-4 text-center hover:border-[#1B5DAF] hover:shadow-sm">
            <Image size={24} className="mx-auto mb-2 text-[#1B5DAF]" />
            <p className="text-sm font-bold">Upload Media</p>
          </Link>
          <Link href="/admin/categories" className="rounded-lg border border-slate-200 bg-white p-4 text-center hover:border-[#1B5DAF] hover:shadow-sm">
            <FolderTree size={24} className="mx-auto mb-2 text-[#1B5DAF]" />
            <p className="text-sm font-bold">Kelola Kategori</p>
          </Link>
          <Link href="/admin/users" className="rounded-lg border border-slate-200 bg-white p-4 text-center hover:border-[#1B5DAF] hover:shadow-sm">
            <Users size={24} className="mx-auto mb-2 text-[#1B5DAF]" />
            <p className="text-sm font-bold">Kelola User</p>
          </Link>
        </section>

        {/* Charts Section */}
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          {/* Top Articles Chart */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">
                <TrendingUp size={14} className="inline mr-1.5 text-[#1B5DAF]" />
                Artikel Terbanyak Dibaca
              </h2>
            </div>
            {loading ? (
              <p className="py-8 text-center text-sm text-slate-400">Memuat...</p>
            ) : topArticles.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">Belum ada data</p>
            ) : (
              <div className="space-y-3">
                {topArticles.slice(0, 7).map((article, idx) => {
                  const maxViews = topArticles[0]?.views || 1;
                  const percentage = Math.max((article.views / maxViews) * 100, 2);
                  return (
                    <div key={article.slug}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="min-w-0 flex-1 truncate text-xs font-bold text-[#111827]">
                          <span className="mr-2 text-slate-400">{idx + 1}.</span>
                          {article.title}
                        </p>
                        <span className="ml-2 flex-shrink-0 text-xs font-bold text-[#1B5DAF]">{article.views.toLocaleString()}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#1B5DAF] to-[#4A90D9]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category Views Chart */}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-wider text-slate-500">
                <FolderTree size={14} className="inline mr-1.5 text-[#F5A91B]" />
                Views per Kategori
              </h2>
            </div>
            {loading ? (
              <p className="py-8 text-center text-sm text-slate-400">Memuat...</p>
            ) : categoryStats.length === 0 ? (
              <p className="py-8 text-center text-sm text-slate-400">Belum ada data</p>
            ) : (
              <div className="space-y-3">
                {categoryStats.map((cat) => {
                  const maxViews = categoryStats[0]?.views || 1;
                  const percentage = Math.max((cat.views / maxViews) * 100, 2);
                  return (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-bold text-[#111827]">{cat.name}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-400">{cat.articles} artikel</span>
                          <span className="text-xs font-bold text-[#F5A91B]">{cat.views.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#F5A91B] to-[#FFD166]"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Recent articles */}
        <section className="mt-8 rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <h2 className="text-xl font-black text-[#111827]">Artikel Terbaru</h2>
            <Link href="/admin/articles" className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:border-[#F5A91B]">
              Lihat Semua
            </Link>
          </div>
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : recentArticles.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Belum ada artikel. Mulai tulis artikel pertama!</td></tr>
                ) : (
                  recentArticles.map((article) => (
                    <tr key={article.id}>
                      <td className="max-w-[280px] truncate px-5 py-4 font-bold text-[#1B5DAF]">{article.title}</td>
                      <td className="px-5 py-4 text-slate-600">{article.category.name}</td>
                      <td className="px-5 py-4 text-slate-600">{article.author.name}</td>
                      <td className="px-5 py-4">
                        <span className={`rounded-md px-2 py-1 text-xs font-bold ${statusColors[article.status] || ""}`}>{article.status}</span>
                      </td>
                      <td className="px-5 py-4 text-slate-600">{article.views}</td>
                      <td className="px-5 py-4 text-slate-600">{new Date(article.createdAt).toLocaleDateString("id-ID")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
        <AdminFooter />
      </main>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub: string; icon: React.ElementType }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-[#111827]">{value}</p>
          <p className="mt-1 text-xs text-slate-400">{sub}</p>
        </div>
        <div className="rounded-lg bg-[#F4F7FB] p-3">
          <Icon size={22} className="text-[#1B5DAF]" />
        </div>
      </div>
    </div>
  );
}
