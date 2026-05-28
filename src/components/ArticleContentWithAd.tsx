"use client";

import { useEffect, useRef, useState } from "react";

type Ad = {
  id: string;
  type: string;
  content: string;
  link: string | null;
};

export function ArticleContentWithAd({ content, bacaJuga }: { content: string; bacaJuga?: { title: string; slug: string } | null }) {
  const [middleAd, setMiddleAd] = useState<Ad | null>(null);

  useEffect(() => {
    fetch("/api/ads?position=ARTICLE_MIDDLE")
      .then((r) => r.ok ? r.json() : [])
      .then((ads) => { if (Array.isArray(ads) && ads.length > 0) setMiddleAd(ads[0]); })
      .catch(() => {});
  }, []);

  // Split content by paragraphs properly
  const paragraphs = content.split(/<\/p>/gi);
  const nonEmptyParagraphs = paragraphs.filter(p => p.trim().length > 0);
  const totalParagraphs = nonEmptyParagraphs.length;
  
  // Only split if article has enough paragraphs (min 6 paragraphs / ~300 kata)
  const isLongEnough = totalParagraphs >= 6;

  // Calculate split points based on non-empty paragraphs mapped back to original indices
  const bacaJugaIndex = Math.floor(paragraphs.length * 0.5);
  const adIndex = Math.floor(paragraphs.length * 0.7);

  // Rebuild content parts
  const firstPart = isLongEnough
    ? paragraphs.slice(0, bacaJugaIndex).join("</p>") + "</p>"
    : "";
  const secondPart = isLongEnough
    ? paragraphs.slice(bacaJugaIndex, adIndex).join("</p>") + "</p>"
    : "";
  const thirdPart = isLongEnough
    ? paragraphs.slice(adIndex).join("</p>")
    : "";

  function handleAdClick() {
    if (middleAd?.link) {
      fetch(`/api/ads/${middleAd.id}/click`, { method: "POST" });
      window.open(middleAd.link, "_blank");
    }
  }

  return (
    <>
      {isLongEnough ? (
        <>
          <div dangerouslySetInnerHTML={{ __html: firstPart }} />

          {/* Baca Juga - di tengah artikel (50%) */}
          {bacaJuga && (
            <div className="my-5 rounded-md border-l-4 border-[#1B5DAF] bg-[#F4F7FB] px-4 py-3">
              <a href={`/${bacaJuga.slug}`} className="block">
                <span className="text-xs font-black uppercase text-[#1B5DAF]">Baca Juga:</span>
                <span className="ml-2 text-sm font-bold text-[#111827] hover:text-[#1B5DAF]">{bacaJuga.title}</span>
              </a>
            </div>
          )}

          <div dangerouslySetInnerHTML={{ __html: secondPart }} />

          {/* Parallax Ad - di 70% artikel */}
          {middleAd && (
            <div className="my-6 -mx-3 sm:-mx-6 lg:-mx-4">
              <div className="bg-[#1B5DAF] py-1.5 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white italic">
                Advertisement
              </div>
              {middleAd.type === "IMAGE" ? (
                <ParallaxImage
                  src={middleAd.content}
                  link={middleAd.link}
                  onClick={handleAdClick}
                />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: middleAd.content }} />
              )}
              <div className="bg-[#1B5DAF] py-1.5 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white italic">
                Scroll to resume content
              </div>
            </div>
          )}

          <div dangerouslySetInnerHTML={{ __html: thirdPart }} />
        </>
      ) : (
        <>
          {/* Artikel pendek: tampilkan konten utuh, Baca Juga & Ad di bawah */}
          <div dangerouslySetInnerHTML={{ __html: content }} />

          {bacaJuga && (
            <div className="my-5 rounded-md border-l-4 border-[#1B5DAF] bg-[#F4F7FB] px-4 py-3">
              <a href={`/${bacaJuga.slug}`} className="block">
                <span className="text-xs font-black uppercase text-[#1B5DAF]">Baca Juga:</span>
                <span className="ml-2 text-sm font-bold text-[#111827] hover:text-[#1B5DAF]">{bacaJuga.title}</span>
              </a>
            </div>
          )}
        </>
      )}
    </>
  );
}

/**
 * ParallaxImage: 
 * Gambar diam (fixed) di tengah jendela saat scroll — baik desktop maupun mobile.
 * Posisi: di tengah-tengah artikel (content di-split jadi 2).
 */
function ParallaxImage({
  src,
  link,
  onClick,
}: {
  src: string;
  link: string | null;
  onClick: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgNaturalSize, setImgNaturalSize] = useState({ w: 1, h: 1 });
  const [containerRect, setContainerRect] = useState({ left: 0, width: 0 });

  // Preload image to get natural dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => setImgNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = src;
  }, [src]);

  // Track container position
  useEffect(() => {
    function update() {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerRect({ left: rect.left, width: rect.width });
      }
    }
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, []);

  const aspectRatio = imgNaturalSize.w / imgNaturalSize.h;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        height: "min(calc(100vw / " + aspectRatio + "), 500px)",
        clipPath: "inset(0)",
      }}
      onClick={onClick}
      role={link ? "link" : undefined}
      tabIndex={link ? 0 : undefined}
      aria-label={link ? "Advertisement link" : undefined}
    >
      <img
        src={src}
        alt="Advertisement"
        className="pointer-events-none fixed top-1/2 -translate-y-1/2"
        style={{
          left: containerRect.left + "px",
          width: containerRect.width + "px",
          height: "auto",
          maxHeight: "100vh",
          objectFit: "contain",
          cursor: link ? "pointer" : undefined,
        }}
      />
    </div>
  );
}
