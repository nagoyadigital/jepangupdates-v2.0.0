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
    const img = (
      <section className="mx-auto max-w-6xl px-0 pt-2 sm:px-6 sm:pt-3 lg:px-8 lg:pt-3">
        <img src={ad.content} alt="Advertisement" className="w-full rounded-none object-cover sm:rounded-xl" />
      </section>
    );
    return ad.link ? (
      <a href={ad.link} target="_blank" rel="noopener noreferrer" onClick={trackClick}>{img}</a>
    ) : img;
  }

  // HTML or Script type
  return (
    <section className="mx-auto max-w-6xl px-0 pt-2 sm:px-6 sm:pt-3 lg:px-8 lg:pt-3">
      <div dangerouslySetInnerHTML={{ __html: ad.content }} />
    </section>
  );
}
