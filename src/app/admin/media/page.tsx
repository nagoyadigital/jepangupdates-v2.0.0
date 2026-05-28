"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ImageIcon, Upload, Trash2, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";

type MediaItem = { id: string; filename: string; originalName: string; url: string; mimeType: string; size: number; width: number | null; height: number | null; createdAt: string; uploadedBy: { name: string } };

const PER_PAGE = 12;

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function fetchMedia(p: number) {
    setLoading(true);
    const res = await fetch(`/api/admin/media?limit=${PER_PAGE}&page=${p}`);
    if (res.ok) {
      const data = await res.json();
      setMedia(data.media || []);
      setTotal(data.pagination?.total || 0);
    }
    setLoading(false);
  }

  useEffect(() => { fetchMedia(page); }, [page]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/admin/media", { method: "POST", body: formData });
    }
    setUploading(false);
    setPage(1);
    fetchMedia(1);
    e.target.value = "";
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus file ini?")) return;
    await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    fetchMedia(page);
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  function formatSize(bytes: number) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Konten</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827]">Media Library</h1>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-[#F5A91B] px-4 py-2.5 font-black text-[#1B5DAF] hover:bg-[#D98F00]">
            <Upload size={18} /> {uploading ? "Mengupload..." : "Upload File"}
            <input type="file" accept="image/*,application/pdf" multiple onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>

        {loading ? (
          <p className="mt-8 text-center text-slate-400">Memuat...</p>
        ) : media.length === 0 && page === 1 ? (
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <ImageIcon size={48} className="mx-auto mb-3 text-slate-300" />
            <p className="text-lg font-bold text-slate-500">Belum ada media</p>
            <p className="mt-1 text-sm text-slate-400">Upload gambar atau file pertama</p>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {media.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <div className="relative aspect-square bg-slate-100">
                    {item.mimeType.startsWith("image/") ? (
                      <img src={item.url} alt={item.originalName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm font-bold text-slate-400">
                        {item.mimeType.split("/")[1]?.toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                      <button onClick={() => copyUrl(item.url)} className="rounded-full bg-white p-2 text-slate-700 hover:bg-slate-100">
                        {copied === item.url ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="rounded-full bg-white p-2 text-red-600 hover:bg-red-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-xs font-bold text-[#111827]">{item.originalName}</p>
                    <p className="mt-1 text-[10px] text-slate-400">
                      {formatSize(item.size)}
                      {item.width && item.height && ` · ${item.width}×${item.height}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-5 py-3">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page <= 1}
                  className="inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-bold text-slate-600 hover:border-[#1B5DAF] hover:text-[#1B5DAF] disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                >
                  <ChevronLeft size={16} /> Kembali
                </button>
                <span className="text-sm text-slate-500">
                  Halaman <span className="font-bold text-[#111827]">{page}</span> dari <span className="font-bold text-[#111827]">{totalPages}</span>
                  <span className="ml-2 text-xs text-slate-400">({total} file)</span>
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page >= totalPages}
                  className="inline-flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-bold text-slate-600 hover:border-[#1B5DAF] hover:text-[#1B5DAF] disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
