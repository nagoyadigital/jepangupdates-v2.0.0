import Link from "next/link";
import Image from "next/image";
import { BadgeCheck, Clock, Eye } from "lucide-react";

type ArticleCardProps = {
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  author: string;
  date: string;
  readTime?: string;
  image?: string;
  views?: string;
};

export function ArticleCard({ title, slug, excerpt, category, author, date, readTime, image, views }: ArticleCardProps) {
  return (
    <Link href={`/${slug}`} className="group block">
      {image && (
        <div className="relative aspect-[16/9] overflow-hidden rounded-md bg-slate-100">
          <Image src={image} alt={title} fill sizes="(min-width: 1024px) 400px, 100vw" className="object-cover transition group-hover:scale-105" />
        </div>
      )}
      <p className="mt-3 text-[11px] font-extrabold uppercase text-[#E6372E]">{category}</p>
      <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-[#111827] group-hover:text-[#1B5DAF]">{title}</h3>
      {excerpt && <p className="mt-2 line-clamp-2 text-sm text-slate-500">{excerpt}</p>}
      <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
        <span>{author}</span>
        <span>·</span>
        <span>{date}</span>
        {readTime && <><span>·</span><Clock size={12} /><span>{readTime}</span></>}
      </div>
    </Link>
  );
}
