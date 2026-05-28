"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Save, Camera, User, Shield, FileText } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "", bio: "", role: "", image: "", articleCount: 0 });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchProfile() {
    const res = await fetch("/api/admin/profile");
    if (res.ok) {
      const data = await res.json();
      setProfile({
        name: data.name,
        email: data.email,
        bio: data.bio || "",
        role: data.role,
        image: data.image || "",
        articleCount: data._count?.articles || 0,
      });
    }
    setLoading(false);
  }

  useEffect(() => { fetchProfile(); }, []);

  async function handleUploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/media", { method: "POST", body: fd });
    if (res.ok) {
      const media = await res.json();
      setProfile(prev => ({ ...prev, image: media.url }));
      // Auto-save photo
      await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: media.url }),
      });
      showSuccess("Foto profil berhasil diubah");
    } else {
      showError("Gagal upload foto");
    }
    setUploading(false);
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); clearMessages();
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: profile.name, bio: profile.bio }),
    });
    setSaving(false);
    if (res.ok) showSuccess("Profil berhasil disimpan");
    else { const data = await res.json(); showError(data.error || "Gagal menyimpan"); }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (passwords.newPassword.length < 8) { showError("Password baru minimal 8 karakter"); return; }
    if (passwords.newPassword !== passwords.confirmPassword) { showError("Password baru tidak cocok"); return; }
    setSaving(true); clearMessages();
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword }),
    });
    setSaving(false);
    if (res.ok) { showSuccess("Password berhasil diubah"); setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" }); }
    else { const data = await res.json(); showError(data.error || "Gagal mengubah password"); }
  }

  function showSuccess(msg: string) { setMessage(msg); setError(""); setTimeout(() => setMessage(""), 4000); }
  function showError(msg: string) { setError(msg); setMessage(""); setTimeout(() => setError(""), 4000); }
  function clearMessages() { setMessage(""); setError(""); }

  const roleLabel: Record<string, string> = { SUPER_ADMIN: "Super Admin", ADMIN: "Admin", EDITOR: "Editor", PENULIS: "Penulis", KONTRIBUTOR: "Kontributor" };
  const roleColor: Record<string, string> = { SUPER_ADMIN: "bg-purple-100 text-purple-700", ADMIN: "bg-blue-100 text-blue-700", EDITOR: "bg-emerald-100 text-emerald-700", PENULIS: "bg-yellow-100 text-yellow-700", KONTRIBUTOR: "bg-slate-100 text-slate-700" };

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Pengaturan</p>
          <h1 className="mt-2 text-3xl font-black text-[#111827]">Profil Saya</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola informasi profil yang tampil sebagai penulis di artikel</p>
        </div>

        {message && <div className="mt-4 rounded-md bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</div>}
        {error && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">{error}</div>}

        {loading ? <p className="mt-8 text-slate-400">Memuat...</p> : (
          <div className="mt-6 space-y-6">
            {/* Profile Card - Photo & Quick Info */}
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              <div className="flex flex-col items-center gap-6 sm:flex-row">
                {/* Photo */}
                <div className="relative flex-shrink-0">
                  <div className="h-20 w-20 overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-100">
                    {profile.image ? (
                      <img src={profile.image} alt={profile.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#1B5DAF]">
                        <User size={28} className="text-white" />
                      </div>
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[#1B5DAF] text-white shadow-md transition hover:bg-[#154A8F]">
                    {uploading ? (
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <Camera size={13} />
                    )}
                    <input type="file" accept="image/*" className="hidden" onChange={handleUploadPhoto} disabled={uploading} />
                  </label>
                </div>

                {/* Info */}
                <div className="text-center sm:text-left">
                  <h2 className="text-lg font-black text-[#111827]">{profile.name}</h2>
                  <p className="mt-0.5 text-sm text-slate-500">{profile.email}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${roleColor[profile.role] || ""}`}>
                      <Shield size={11} /> {roleLabel[profile.role] || profile.role}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                      <FileText size={11} /> {profile.articleCount} Artikel
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-[11px] text-slate-400">Klik ikon kamera untuk mengubah foto. Gunakan gambar 1:1 (kotak) untuk hasil terbaik.</p>
            </div>

            {/* Preview Tampilan di Artikel */}
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="mb-3 text-sm font-black text-slate-500 uppercase tracking-wider">Preview di Artikel</h2>
              <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
                <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-slate-200">
                  {profile.image ? (
                    <img src={profile.image} alt={profile.name} className="h-full w-full object-cover" />
                  ) : (
                    <img src="/jepangupdates-logo-trimmed.png" alt={profile.name} className="h-full w-full object-contain p-1.5" />
                  )}
                </div>
                <div>
                  <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1B5DAF]">
                    {profile.name || "Nama Penulis"}
                    <svg className="h-4 w-4 fill-[#1B5DAF] text-white" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" fill="currentColor" /><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" /></svg>
                  </p>
                  <p className="text-xs text-slate-500">Senin, 26 Mei 2026 · 14:30 WIB</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Profile form */}
              <form onSubmit={handleSaveProfile} className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="mb-1 text-lg font-black text-[#111827]">Informasi Penulis</h2>
                <p className="mb-5 text-xs text-slate-500">Nama dan bio ini akan tampil di setiap artikel yang Anda tulis</p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Nama Tampilan</label>
                    <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full rounded-md border px-4 py-2.5 text-sm" placeholder="Nama yang tampil di artikel" />
                    <p className="mt-1 text-[11px] text-slate-400">Ini adalah nama yang dilihat pembaca di halaman artikel</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Email</label>
                    <input type="email" value={profile.email} disabled className="w-full rounded-md border bg-slate-50 px-4 py-2.5 text-sm text-slate-500" />
                    <p className="mt-1 text-[11px] text-slate-400">Hubungi Super Admin untuk mengubah email</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Bio Penulis</label>
                    <textarea value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} rows={4} className="w-full rounded-md border px-4 py-2.5 text-sm" placeholder="Ceritakan sedikit tentang diri Anda sebagai penulis..." />
                    <p className="mt-1 text-[11px] text-slate-400">Muncul di profil penulis (opsional)</p>
                  </div>
                  <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#154A8F] disabled:opacity-50">
                    <Save size={16} /> Simpan Profil
                  </button>
                </div>
              </form>

              {/* Password form */}
              <form onSubmit={handleChangePassword} className="rounded-lg border border-slate-200 bg-white p-6">
                <h2 className="mb-1 text-lg font-black text-[#111827]">Keamanan</h2>
                <p className="mb-5 text-xs text-slate-500">Ubah password untuk menjaga keamanan akun</p>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Password Lama</label>
                    <input type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})} className="w-full rounded-md border px-4 py-2.5 text-sm" placeholder="Masukkan password saat ini" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Password Baru</label>
                    <input type="password" value={passwords.newPassword} onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} className="w-full rounded-md border px-4 py-2.5 text-sm" placeholder="Minimal 8 karakter" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-700">Konfirmasi Password Baru</label>
                    <input type="password" value={passwords.confirmPassword} onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full rounded-md border px-4 py-2.5 text-sm" placeholder="Ketik ulang password baru" />
                  </div>
                  <button type="submit" disabled={saving || !passwords.currentPassword || !passwords.newPassword} className="inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#154A8F] disabled:opacity-50">
                    <Save size={16} /> Ubah Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
