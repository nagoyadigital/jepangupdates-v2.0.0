"use client";

import { useEffect, useState } from "react";

type Ad = { id: string; type: string; content: string; link: string | null };

export function FooterAd() {
  const [ad, setAd] = useState<Ad | null>(null);

  useEffect(() => {
    fetch("/api/ads?position=FOOTER")
      .then((r) => r.ok ? r.json() : [])
      .then((ads) => { if (Array.isArray(ads) && ads.length > 0) setAd(ads[0]); })
      .catch(() => {});
  }, []);

  if (!ad) return null;

  function trackClick() {
    if (ad) fetch(`/api/ads/${ad.id}/click`, { method: "POST" });
  }

  return (
    <section className="mx-auto max-w-6xl px-3 py-4 sm:px-6 lg:px-8">
      <p className="mb-1 text-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">Advertisement</p>
      {ad.type === "IMAGE" ? (
        ad.link ? (
          <a href={ad.link} target="_blank" rel="noopener noreferrer" onClick={trackClick}>
            <img src={ad.content} alt="Advertisement" className="mx-auto w-full max-w-[728px] rounded-md" />
          </a>
        ) : (
          <img src={ad.content} alt="Advertisement" className="mx-auto w-full max-w-[728px] rounded-md" />
        )
      ) : (
        <div className="mx-auto max-w-[728px]" dangerouslySetInnerHTML={{ __html: ad.content }} />
      )}
    </section>
  );
}
