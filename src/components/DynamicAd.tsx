"use client";

import { useEffect, useState } from "react";

type Ad = {
  id: string;
  type: string;
  content: string;
  link: string | null;
};

type DynamicAdProps = {
  position: string;
  fallback: React.ReactNode;
};

export function DynamicAd({ position, fallback }: DynamicAdProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/ads?position=${position}`)
      .then((r) => r.ok ? r.json() : [])
      .then((ads) => {
        if (Array.isArray(ads) && ads.length > 0) setAd(ads[0]);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [position]);

  // Show fallback while loading or if no ad
  if (!loaded || !ad) return <>{fallback}</>;

  function trackClick() {
    if (ad) fetch(`/api/ads/${ad.id}/click`, { method: "POST" });
  }

  if (ad.type === "IMAGE") {
    // Different sizing based on position
    const sizeClass: Record<string, string> = {
      HEADER_BANNER: "h-[120px] sm:h-[160px] md:h-[220px] lg:h-[280px]",
      SIDEBAR_TOP: "h-auto aspect-[4/5]",
      SIDEBAR_MIDDLE: "h-auto aspect-square",
      ARTICLE_TOP: "h-[80px] sm:h-[100px] lg:h-[120px]",
      ARTICLE_MIDDLE: "h-[80px] sm:h-[100px] lg:h-[120px]",
    };

    const heightClass = sizeClass[position] || "h-auto";

    const img = (
      <section className={position === "SIDEBAR_TOP" || position === "SIDEBAR_MIDDLE" ? "" : "mx-auto max-w-6xl px-0 pt-2 sm:px-6 sm:pt-3 lg:px-8 lg:pt-3"}>
        <img src={ad.content} alt="Advertisement" className={`w-full object-cover sm:rounded-xl ${heightClass}`} />
      </section>
    );
    return ad.link ? (
      <a href={ad.link} target="_blank" rel="noopener noreferrer" onClick={trackClick} className="block">{img}</a>
    ) : img;
  }

  // HTML or Script type
  return (
    <section className="mx-auto max-w-6xl px-0 pt-2 sm:px-6 sm:pt-3 lg:px-8 lg:pt-3">
      <div dangerouslySetInnerHTML={{ __html: ad.content }} />
    </section>
  );
}
