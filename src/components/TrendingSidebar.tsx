import Link from "next/link";
import { Flame } from "lucide-react";

type TrendingSidebarProps = {
  items?: { title: string; slug: string }[];
};

export function TrendingSidebar({ items = [] }: TrendingSidebarProps) {
  return (
    <aside className="space-y-6">
      <section>
        <h2 className="flex items-center gap-2 border-b-2 border-[#E6372E] pb-2 text-lg font-black uppercase text-[#111827]">
          <Flame size={20} className="text-[#E6372E]" /> Trending
        </h2>
        <div className="mt-4 space-y-3">
          {items.length === 0 ? (
            <p className="py-4 text-sm text-slate-400">Belum ada data trending</p>
          ) : (
            items.map((item, index) => (
              <Link href={`/${item.slug}`} className="grid grid-cols-[48px_1fr] gap-4 bg-[#F7F7F7] p-4 hover:bg-[#F4F7FB]" key={item.slug}>
                <span className="text-4xl font-bold italic leading-none text-[#1B5DAF]">{index + 1}</span>
                <span className="text-[13px] font-black leading-5 text-[#111827]">{item.title}</span>
              </Link>
            ))
          )}
        </div>
      </section>
    </aside>
  );
}
