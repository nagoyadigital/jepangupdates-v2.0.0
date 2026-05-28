"use client";

import { useEffect, useState } from "react";
import { AdminSidebar } from "@/components/AdminSidebar";
import { Plus, Trash2, Save, GripVertical, ChevronUp, ChevronDown } from "lucide-react";

type MenuItem = { id: string; label: string; url: string; order: number; target: string };
type MenuData = { id: string; name: string; location: string; items: MenuItem[] };

export default function MenusPage() {
  const [menus, setMenus] = useState<MenuData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string>("main_nav");
  const [items, setItems] = useState<{ label: string; url: string; target: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  async function fetchMenus() {
    const res = await fetch("/api/admin/menus");
    if (res.ok) {
      const data = await res.json();
      setMenus(data);
      const current = data.find((m: MenuData) => m.location === activeMenu);
      if (current) setItems(current.items.map((i: MenuItem) => ({ label: i.label, url: i.url, target: i.target })));
      
      // Auto-create default menus if they don't exist
      const existingLocations = data.map((m: MenuData) => m.location);
      
      // Get main_nav items to use as default for mobile_nav
      const mainNav = data.find((m: MenuData) => m.location === "main_nav");
      const mainNavItems = mainNav?.items?.map((i: MenuItem, idx: number) => ({
        label: i.label, url: i.url, target: i.target || "_self", order: idx + 1,
      })) || [
        { label: "News", url: "/kategori/news", target: "_self", order: 1 },
        { label: "Entertainment", url: "/kategori/entertainment", target: "_self", order: 2 },
        { label: "Bisnis", url: "/kategori/bisnis", target: "_self", order: 3 },
        { label: "Music", url: "/kategori/music", target: "_self", order: 4 },
        { label: "Bola & Sports", url: "/kategori/bola-sports", target: "_self", order: 5 },
        { label: "Politik", url: "/kategori/politik", target: "_self", order: 6 },
        { label: "Otomotif", url: "/kategori/otomotif", target: "_self", order: 7 },
        { label: "Food & Travel", url: "/kategori/food-travel", target: "_self", order: 8 },
      ];

      const defaults: Record<string, { name: string; items: { label: string; url: string; target: string; order: number }[] }> = {
        mobile_nav: {
          name: "Menu Mobile",
          items: mainNavItems,
        },
        footer_company: {
          name: "Footer - Perusahaan",
          items: [
            { label: "Tentang Kami", url: "/tentang-kami", target: "_self", order: 1 },
            { label: "Redaksi", url: "/redaksi", target: "_self", order: 2 },
            { label: "Iklan", url: "/iklan", target: "_self", order: 3 },
            { label: "Media Partner", url: "/media-partner", target: "_self", order: 4 },
            { label: "Kontak", url: "/kontak", target: "_self", order: 5 },
          ],
        },
        footer_legal: {
          name: "Footer - Legal",
          items: [
            { label: "Kebijakan Privasi", url: "/kebijakan-privasi", target: "_self", order: 1 },
            { label: "Syarat dan Ketentuan", url: "/syarat-ketentuan", target: "_self", order: 2 },
            { label: "Pedoman Media Siber", url: "/pedoman-media-siber", target: "_self", order: 3 },
            { label: "Sitemap", url: "/sitemap.xml", target: "_self", order: 4 },
          ],
        },
      };

      for (const [location, menu] of Object.entries(defaults)) {
        if (!existingLocations.includes(location)) {
          await fetch("/api/admin/menus", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: menu.name, location, items: menu.items }),
          });
        }
      }

      // Re-fetch if we created defaults
      if (Object.keys(defaults).some(loc => !existingLocations.includes(loc))) {
        const res2 = await fetch("/api/admin/menus");
        if (res2.ok) {
          const data2 = await res2.json();
          setMenus(data2);
          const current2 = data2.find((m: MenuData) => m.location === activeMenu);
          if (current2) setItems(current2.items.map((i: MenuItem) => ({ label: i.label, url: i.url, target: i.target })));
        }
      }
    }
    setLoading(false);
  }

  useEffect(() => { fetchMenus(); }, []);

  function handleMenuChange(location: string) {
    setActiveMenu(location);
    const current = menus.find(m => m.location === location);
    if (current) setItems(current.items.map(i => ({ label: i.label, url: i.url, target: i.target })));
    else setItems([]);
  }

  function addItem() {
    setItems([...items, { label: "", url: "", target: "_self" }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: string, value: string) {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  }

  function moveItem(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const updated = [...items];
    [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
    setItems(updated);
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault();
    setDragOverIndex(index);
  }

  function handleDrop(index: number) {
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    const updated = [...items];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    setItems(updated);
    setDragIndex(null);
    setDragOverIndex(null);
  }

  async function handleSave() {
    setSaving(true);
    const menuNames: Record<string, string> = {
      main_nav: "Menu Utama",
      footer_nav: "Footer - Kategori",
      mobile_nav: "Menu Mobile",
      footer_company: "Footer - Perusahaan",
      footer_legal: "Footer - Legal",
    };
    await fetch("/api/admin/menus", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: menuNames[activeMenu] || activeMenu,
        location: activeMenu,
        items: items.filter(i => i.label && i.url).map((item, idx) => ({ ...item, order: idx + 1 })),
      }),
    });
    setSaving(false);
    fetchMenus();
  }

  return (
    <div className="min-h-screen bg-[#F4F7FB] lg:flex">
      <AdminSidebar />
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#F5A91B]">Tampilan</p>
          <h1 className="mt-2 text-3xl font-black text-[#111827]">Menu Navigasi</h1>
          <p className="mt-1 text-sm text-slate-500">Geser item atau gunakan tombol ↑↓ untuk mengubah urutan</p>
        </div>

        {/* Menu selector */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { key: "main_nav", label: "Menu Utama" },
            { key: "mobile_nav", label: "Menu Mobile" },
            { key: "footer_nav", label: "Footer - Kategori" },
            { key: "footer_company", label: "Footer - Perusahaan" },
            { key: "footer_legal", label: "Footer - Legal" },
          ].map((loc) => (
            <button
              key={loc.key}
              onClick={() => handleMenuChange(loc.key)}
              className={`rounded-md px-4 py-2 text-sm font-bold ${activeMenu === loc.key ? "bg-[#1B5DAF] text-white" : "border border-slate-200 bg-white text-slate-700"}`}
            >
              {loc.label}
            </button>
          ))}
        </div>

        {/* Menu items editor */}
        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          {loading ? (
            <p className="text-slate-400">Memuat...</p>
          ) : (
            <>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div
                    key={index}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={() => handleDrop(index)}
                    onDragEnd={() => { setDragIndex(null); setDragOverIndex(null); }}
                    className={`flex items-center gap-2 rounded-lg border p-2 transition sm:gap-3 sm:p-3 ${
                      dragOverIndex === index ? "border-[#1B5DAF] bg-blue-50" : "border-slate-200 bg-white"
                    } ${dragIndex === index ? "opacity-50" : ""}`}
                  >
                    {/* Drag handle */}
                    <div className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
                      <GripVertical size={18} />
                    </div>

                    {/* Number */}
                    <span className="w-5 text-center text-xs font-bold text-slate-400">{index + 1}</span>

                    {/* Inputs */}
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) => updateItem(index, "label", e.target.value)}
                      placeholder="Label"
                      className="min-w-0 flex-1 rounded-md border px-3 py-2 text-sm"
                    />
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateItem(index, "url", e.target.value)}
                      placeholder="/kategori/nama"
                      className="hidden min-w-0 flex-1 rounded-md border px-3 py-2 text-sm sm:block"
                    />
                    <select value={item.target} onChange={(e) => updateItem(index, "target", e.target.value)} className="hidden rounded-md border px-2 py-2 text-sm sm:block">
                      <option value="_self">Same tab</option>
                      <option value="_blank">New tab</option>
                    </select>

                    {/* Move buttons */}
                    <div className="flex flex-col">
                      <button
                        onClick={() => moveItem(index, "up")}
                        disabled={index === 0}
                        className="rounded p-0.5 text-slate-400 hover:text-[#1B5DAF] disabled:opacity-20"
                        title="Pindah ke atas"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => moveItem(index, "down")}
                        disabled={index === items.length - 1}
                        className="rounded p-0.5 text-slate-400 hover:text-[#1B5DAF] disabled:opacity-20"
                        title="Pindah ke bawah"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>

                    {/* Delete */}
                    <button onClick={() => removeItem(index)} className="text-slate-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Mobile: show URL input below for small screens */}
              <div className="mt-3 sm:hidden">
                {items.map((item, index) => (
                  <div key={`url-${index}`} className="mb-2">
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => updateItem(index, "url", e.target.value)}
                      placeholder={`URL untuk "${item.label || `Item ${index + 1}`}"`}
                      className="w-full rounded-md border px-3 py-2 text-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                <button onClick={addItem} className="inline-flex items-center gap-2 rounded-md border border-dashed border-slate-300 px-4 py-2 text-sm font-bold text-slate-600 hover:border-[#1B5DAF] hover:text-[#1B5DAF]">
                  <Plus size={16} /> Tambah Item
                </button>
                <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 rounded-md bg-[#1B5DAF] px-4 py-2 text-sm font-bold text-white hover:bg-[#154A8F] disabled:opacity-50">
                  <Save size={16} /> {saving ? "Menyimpan..." : "Simpan Menu"}
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
