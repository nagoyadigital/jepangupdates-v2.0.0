"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

type JapanCarouselItem = {
  category?: string;
  title: string;
  image: string;
};

type JapanCarouselProps = {
  items: JapanCarouselItem[];
  label?: string;
};

export function JapanCarousel({ items, label = "Jepang" }: JapanCarouselProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % items.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [items.length]);

  const goToPrevious = () => {
    setActive((current) => (current - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setActive((current) => (current + 1) % items.length);
  };

  const item = items[active];

  return (
    <section className="mt-3">
      {/* Mobile: single carousel */}
      <div className="relative overflow-hidden bg-[#07182C] p-3 sm:p-4 lg:hidden">
        <div className="absolute left-0 top-0 z-20 bg-[#F5A91B] px-4 py-2 text-xs font-extrabold text-[#07182C] sm:font-black">{label}</div>

        <button
          className="absolute left-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-[#111827] shadow-md transition hover:bg-[#F5A91B]"
          onClick={goToPrevious}
          type="button"
          aria-label="Slide sebelumnya"
        >
          <ChevronLeft size={22} strokeWidth={2.6} />
        </button>

        <button
          className="absolute right-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white text-[#111827] shadow-md transition hover:bg-[#F5A91B]"
          onClick={goToNext}
          type="button"
          aria-label="Slide berikutnya"
        >
          <ChevronRight size={22} strokeWidth={2.6} />
        </button>

        <Link href="/artikel/visa-pekerja-terampil-jepang-2026" className="group relative block overflow-hidden">
          <div className="relative aspect-[16/10] min-h-[280px]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
              priority={active === 0}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />
          </div>
          <div className="absolute inset-x-5 bottom-6">
            <span className="text-sm font-extrabold text-[#F5A91B]">{item.category || label}</span>
            <p className="mt-2 text-[20px] font-extrabold leading-[1.12] text-white">
              {item.title}
            </p>
          </div>
        </Link>

        <div className="mt-3 flex items-center justify-center gap-2">
          {items.map((slide, index) => (
            <button
              aria-label={`Buka slide ${index + 1}`}
              className={`h-2.5 rounded-full transition ${
                index === active ? "w-8 bg-[#F5A91B]" : "w-2.5 bg-white/45 hover:bg-white"
              }`}
              key={slide.title}
              onClick={() => setActive(index)}
              type="button"
            />
          ))}
        </div>
      </div>

      {/* Desktop: grid 3 columns */}
      <div className="hidden overflow-hidden rounded-lg bg-[#07182C] lg:block">
        <div className="relative">
          <div className="absolute left-0 top-0 z-20 bg-[#F5A91B] px-4 py-2 text-xs font-black text-[#07182C]">{label}</div>
          <div className="grid grid-cols-3">
            {items.slice(0, 3).map((slideItem) => (
              <Link
                href="/artikel/visa-pekerja-terampil-jepang-2026"
                className="group relative block overflow-hidden"
                key={slideItem.title}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={slideItem.image}
                    alt={slideItem.title}
                    fill
                    sizes="300px"
                    className="object-cover opacity-90 transition duration-300 group-hover:scale-105 group-hover:opacity-100"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-3 divide-x divide-white/10">
          {items.slice(0, 3).map((slideItem) => (
            <Link
              href="/artikel/visa-pekerja-terampil-jepang-2026"
              className="group block px-4 py-4"
              key={`text-${slideItem.title}`}
            >
              <p className="text-[11px] font-black uppercase text-[#F5A91B]">{slideItem.category || label}</p>
              <h3 className="mt-1.5 line-clamp-3 text-[14px] font-bold leading-snug text-white group-hover:text-[#F5A91B]">
                {slideItem.title}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
