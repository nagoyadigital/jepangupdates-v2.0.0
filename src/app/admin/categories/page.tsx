"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { FolderTree, Plus, Trash2, Edit, Save, X } from "lucide-react";

type Category = { id: string; name: string; slug: string; color: string | null; order: number; isActive: boolean; _count: { articles: number } };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", color: "#1B5DAF", description: "" });

  async function fetchCategories() {
    const res = await fetch("/api/admin/categories");
    if (res.ok) setCategories(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchCategories(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const url = editId ? `/api/admin/categories/${editId}` : "/api/admin/categories";
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setShowForm(false); setEditId(null); setForm({ name: "", color: "#1B5DAF", description: "" }); fetchCategories(); }
    else { const data = await res.json(); alert(data.error || "Gagal menyimpan"); }
  }

  function startEdit(cat: Category) {
    setEditId(cat.id);
    setForm({ name: cat.name, color: cat.color || "#1B5DAF", description: "" });
    setShowForm(true);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus kategori "${name}"?`)) return;
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    if (res.ok) fetchCategories();
    else { const data = await res.json(); alert(data.error || "Gagal menghapus"); }
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Konten</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827]">Kategori</h1>
          </div>
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", color: "#1B5DAF", description: "" }); }} className="inline-flex items-center gap-2 rounded-md bg-[#F5A91B] px-4 py-2.5 font-black text-[#1B5DAF] hover:bg-[#D98F00]">
            <Plus size={18} /> Tambah
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-[#111827]">{editId ? "Edit Kategori" : "Tambah Kategori"}</h3>
              <button type="button" onClick={() => { setShowForm(false); setEditId(null); }}><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Nama</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="w-full rounded-md border px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Warna</label>
                <div className="flex gap-2">
                  <input type="color" value={form.color} onChange={(e) => setForm({...form, color: e.target.value})} className="h-9 w-12 rounded border" />
                  <input type="text" value={form.color} onChange={(e) => setForm({...form, color: e.target.value})} className="flex-1 rounded-md border px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Deskripsi</label>
                <input type="text" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full rounded-md border px-3 py-2 text-sm" />
              </div>
            </div>
            <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-4 py-2 text-sm font-bold text-white">
              <Save size={16} /> {editId ? "Update" : "Simpan"}
            </button>
          </form>
        )}

        {/* List */}
        <div className="mt-6 rounded-lg border border-slate-200 bg-white">
          {loading ? (
            <p className="p-8 text-center text-slate-400">Memuat...</p>
          ) : categories.length === 0 ? (
            <p className="p-8 text-center text-slate-400">Belum ada kategori</p>
          ) : (
            <div className="divide-y divide-slate-200">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: cat.color || "#ccc" }} />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#111827]">{cat.name}</p>
                    <p className="text-xs text-slate-500">/{cat.slug} · {cat._count.articles} artikel</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${cat.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {cat.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                  <button onClick={() => startEdit(cat)} className="text-slate-400 hover:text-[#1B5DAF]"><Edit size={16} /></button>
                  <button onClick={() => handleDelete(cat.id, cat.name)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
