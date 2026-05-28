"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BreakingItem = { title: string; slug: string };

export function BreakingNews() {
  const [items, setItems] = useState<BreakingItem[]>([]);

  useEffect(() => {
    fetch("/api/breaking-news")
      .then(r => r.ok ? r.json() : [])
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="overflow-hidden border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-2 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden">
          <div className="animate-marquee flex items-center gap-6 whitespace-nowrap">
            {[...items, ...items].map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3">
                <span className="h-[6px] w-[6px] flex-shrink-0 rounded-full bg-[#E6372E]" />
                <Link href={`/${item.slug}`} className="text-xs font-bold text-[#111827] hover:text-[#1B5DAF]">
                  {item.title}
                </Link>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
