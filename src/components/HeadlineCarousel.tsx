"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type HeadlineItem = {
  category: string;
  title: string;
  image: string;
  date: string;
  slug?: string;
};

type HeadlineCarouselProps = {
  items: HeadlineItem[];
};

export function HeadlineCarousel({ items }: HeadlineCarouselProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [items.length]);

  if (items.length === 0) return null;

  const current = items[active];
  const href = current.slug ? `/${current.slug}` : "/";

  const goPrevious = () => setActive((i) => (i - 1 + items.length) % items.length);
  const goNext = () => setActive((i) => (i + 1) % items.length);

  return (
    <section className="relative">
      <Link href={href} className="group block overflow-hidden rounded-[14px] bg-[#1B5DAF] shadow-sm sm:rounded-md">
        <div className="relative aspect-[16/10.2] overflow-hidden bg-slate-100 sm:aspect-[16/7.8]">
          <Image
            src={current.image}
            alt={current.title}
            fill
            sizes="(min-width: 1024px) 820px, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
            priority
          />
        </div>
        <div className="bg-[#1B5DAF] px-5 py-5 sm:px-7 sm:py-6">
          <p className="inline-block rounded-md bg-[#E6372E] px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white sm:text-xs sm:font-black">
            {current.category}
          </p>
          <h1 className="mt-2 text-[24px] font-extrabold leading-[1.14] text-white sm:text-4xl sm:font-black sm:leading-tight">
            {current.title}
          </h1>
          <p className="mt-5 text-[15px] font-medium text-white/88 sm:text-base">{current.date}</p>
        </div>
      </Link>

      {items.length > 1 && (
        <>
          <button
            aria-label="Headline sebelumnya"
            className="absolute left-5 top-[35%] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/35 text-white ring-1 ring-white/45 backdrop-blur transition hover:bg-white hover:text-[#1B5DAF] sm:left-6 sm:h-11 sm:w-11"
            onClick={goPrevious}
            type="button"
          >
            <ChevronLeft size={24} strokeWidth={2.6} />
          </button>
          <button
            aria-label="Headline berikutnya"
            className="absolute right-5 top-[35%] z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/35 text-white ring-1 ring-white/45 backdrop-blur transition hover:bg-white hover:text-[#1B5DAF] sm:right-6 sm:h-11 sm:w-11"
            onClick={goNext}
            type="button"
          >
            <ChevronRight size={24} strokeWidth={2.6} />
          </button>

          <div className="mt-3 flex justify-center gap-2">
            {items.map((item, index) => (
              <button
                aria-label={`Buka headline ${index + 1}`}
                className={`h-2 rounded-full transition ${index === active ? "w-7 bg-[#1B5DAF]" : "w-2 bg-slate-300"}`}
                key={`dot-${index}`}
                onClick={() => setActive(index)}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
