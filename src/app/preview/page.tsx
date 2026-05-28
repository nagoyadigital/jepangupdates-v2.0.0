"use client";

import { useEffect, useState } from "react";

export default function PreviewPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("preview_article");
    if (data) {
      const parsed = JSON.parse(data);
      setTitle(parsed.title || "Preview Artikel");
      setContent(parsed.content || "");
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header bar */}
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-yellow-50 px-4 py-2 text-center text-sm font-bold text-yellow-800">
        ⚠️ Mode Preview — Artikel belum dipublikasikan
      </div>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <h1 className="text-[28px] font-black leading-tight text-[#111827] sm:text-[36px]">
          {title || "Judul Artikel"}
        </h1>

        <div className="mt-4 flex items-center gap-3 border-b border-slate-200 pb-4 text-xs text-slate-500">
          <span className="font-bold text-[#1B5DAF]">Jepang Updates</span>
          <span>·</span>
          <span>{new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
        </div>

        {content ? (
          <div
            className="article-copy mt-6 text-[15px] leading-7 text-[#111827] sm:text-[16px] sm:leading-8"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <p className="mt-8 text-center text-slate-400">Tidak ada konten untuk di-preview</p>
        )}
      </main>
    </div>
  );
}
