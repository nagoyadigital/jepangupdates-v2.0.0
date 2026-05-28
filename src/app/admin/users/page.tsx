"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Plus, Trash2, Edit, X, Save, Key } from "lucide-react";

type UserItem = { id: string; name: string; email: string; role: string; isActive: boolean; createdAt: string; _count: { articles: number } };

export default function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState<UserItem | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "KONTRIBUTOR" as string });
  const [editForm, setEditForm] = useState({ name: "", email: "", role: "", newPassword: "" });
  const [message, setMessage] = useState("");

  async function fetchUsers() {
    const res = await fetch("/api/admin/users");
    if (res.ok) { const data = await res.json(); setUsers(data.users); }
    setLoading(false);
  }

  useEffect(() => { fetchUsers(); }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setShowForm(false);
      setForm({ name: "", email: "", password: "", role: "KONTRIBUTOR" });
      fetchUsers();
      showMessage("User berhasil ditambahkan");
    } else {
      const data = await res.json();
      alert(data.error || "Gagal menambah user");
    }
  }

  async function handleEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editUser) return;

    const body: Record<string, string> = {};
    if (editForm.name && editForm.name !== editUser.name) body.name = editForm.name;
    if (editForm.email && editForm.email !== editUser.email) body.email = editForm.email;
    if (editForm.role && editForm.role !== editUser.role) body.role = editForm.role;
    if (editForm.newPassword) body.password = editForm.newPassword;

    if (Object.keys(body).length === 0) {
      setEditUser(null);
      return;
    }

    const res = await fetch(`/api/admin/users/${editUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setEditUser(null);
      fetchUsers();
      showMessage(editForm.newPassword ? "User diupdate & password direset" : "User berhasil diupdate");
    } else {
      const data = await res.json();
      alert(data.error || "Gagal mengupdate user");
    }
  }

  function startEdit(user: UserItem) {
    setEditUser(user);
    setEditForm({ name: user.name, email: user.email, role: user.role, newPassword: "" });
  }

  async function toggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchUsers();
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus user "${name}"? Aksi ini tidak bisa dibatalkan.`)) return;
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    if (res.ok) { fetchUsers(); showMessage("User berhasil dihapus"); }
    else { const data = await res.json(); alert(data.error || "Gagal menghapus"); }
  }

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  const roleColors: Record<string, string> = {
    SUPER_ADMIN: "bg-purple-50 text-purple-700",
    ADMIN: "bg-blue-50 text-blue-700",
    EDITOR: "bg-emerald-50 text-emerald-700",
    PENULIS: "bg-yellow-50 text-yellow-700",
    KONTRIBUTOR: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Pengaturan</p>
            <h1 className="mt-2 text-3xl font-black text-[#111827]">Pengguna</h1>
          </div>
          <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-md bg-[#F5A91B] px-4 py-2.5 font-black text-[#1B5DAF] hover:bg-[#D98F00]">
            <Plus size={18} /> Tambah User
          </button>
        </div>

        {message && (
          <div className="mt-4 rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</div>
        )}

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-[#111827]">Tambah User Baru</h3>
              <button type="button" onClick={() => setShowForm(false)}><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Nama</label>
                <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required className="w-full rounded-md border px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required className="w-full rounded-md border px-3 py-2.5 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Password</label>
                <input type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} required minLength={8} className="w-full rounded-md border px-3 py-2.5 text-sm" placeholder="Min 8 karakter" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Role</label>
                <select value={form.role} onChange={(e) => setForm({...form, role: e.target.value})} className="w-full rounded-md border px-3 py-2.5 text-sm">
                  <option value="SUPER_ADMIN">Super Admin</option>
                  <option value="ADMIN">Admin</option>
                  <option value="EDITOR">Editor</option>
                  <option value="PENULIS">Penulis</option>
                  <option value="KONTRIBUTOR">Kontributor</option>
                </select>
              </div>
            </div>
            <button type="submit" className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#154A8F]">
              <Save size={16} /> Simpan
            </button>
          </form>
        )}

        {/* Edit Modal */}
        {editUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <form onSubmit={handleEdit} className="w-full max-w-md rounded-xl bg-white shadow-2xl">
              <div className="flex items-center justify-between border-b px-6 py-4">
                <h3 className="text-lg font-black text-[#111827]">Edit User</h3>
                <button type="button" onClick={() => setEditUser(null)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>
              <div className="space-y-4 p-6">
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Nama</label>
                  <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} required className="w-full rounded-md border px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Email</label>
                  <input type="email" value={editForm.email} onChange={(e) => setEditForm({...editForm, email: e.target.value})} required className="w-full rounded-md border px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-700">Role</label>
                  <select value={editForm.role} onChange={(e) => setEditForm({...editForm, role: e.target.value})} className="w-full rounded-md border px-3 py-2.5 text-sm">
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option>
                    <option value="PENULIS">Penulis</option>
                    <option value="KONTRIBUTOR">Kontributor</option>
                  </select>
                </div>
                <div className="border-t border-slate-200 pt-4">
                  <label className="mb-1 flex items-center gap-2 text-sm font-bold text-slate-700">
                    <Key size={14} /> Reset Password
                  </label>
                  <input type="password" value={editForm.newPassword} onChange={(e) => setEditForm({...editForm, newPassword: e.target.value})} className="w-full rounded-md border px-3 py-2.5 text-sm" placeholder="Kosongkan jika tidak ingin reset" minLength={8} />
                  <p className="mt-1 text-[11px] text-slate-500">Isi password baru min 8 karakter. Kosongkan jika tidak ingin mengubah.</p>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#154A8F]">
                    <Save size={16} /> Update
                  </button>
                  <button type="button" onClick={() => setEditUser(null)} className="rounded-md border px-5 py-2.5 text-sm font-bold text-slate-600">Batal</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Users table */}
        <section className="mt-6 rounded-lg border border-slate-200 bg-white shadow-sm overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-[#F4F7FB] text-xs uppercase tracking-[0.16em] text-slate-500">
              <tr>
                <th className="px-5 py-4">Nama</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">Role</th>
                <th className="px-5 py-4">Artikel</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Memuat...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">Tidak ada user</td></tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 font-bold text-[#111827]">{user.name}</td>
                    <td className="px-5 py-4 text-slate-600">{user.email}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-md px-2 py-1 text-xs font-bold ${roleColors[user.role] || ""}`}>{user.role.replace("_", " ")}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{user._count.articles}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleActive(user.id, user.isActive)} className={`rounded-full px-3 py-1 text-xs font-bold ${user.isActive ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                        {user.isActive ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEdit(user)} className="text-slate-400 hover:text-[#1B5DAF]" title="Edit"><Edit size={16} /></button>
                        <button onClick={() => handleDelete(user.id, user.name)} className="text-slate-400 hover:text-red-600" title="Hapus"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
