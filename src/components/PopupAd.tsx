"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Ad = { id: string; type: string; content: string; link: string | null };

export function PopupAd() {
  const [ad, setAd] = useState<Ad | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch("/api/ads?position=POPUP")
      .then((r) => r.ok ? r.json() : [])
      .then((ads) => {
        if (Array.isArray(ads) && ads.length > 0) {
          setAd(ads[0]);
          // Show after 5 seconds, only once per session
          const shown = sessionStorage.getItem("popup_ad_shown");
          if (!shown) {
            setTimeout(() => setShow(true), 5000);
          }
        }
      })
      .catch(() => {});
  }, []);

  function handleClose() {
    setShow(false);
    sessionStorage.setItem("popup_ad_shown", "true");
  }

  function trackClick() {
    if (ad) fetch(`/api/ads/${ad.id}/click`, { method: "POST" });
  }

  if (!show || !ad) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4" onClick={handleClose}>
      <div className="relative max-w-lg w-full rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white hover:bg-black/80"
        >
          <X size={18} />
        </button>

        {/* Ad content */}
        {ad.type === "IMAGE" ? (
          ad.link ? (
            <a href={ad.link} target="_blank" rel="noopener noreferrer" onClick={trackClick}>
              <img src={ad.content} alt="Advertisement" className="w-full" />
            </a>
          ) : (
            <img src={ad.content} alt="Advertisement" className="w-full" />
          )
        ) : (
          <div className="bg-white p-4" dangerouslySetInnerHTML={{ __html: ad.content }} />
        )}
      </div>
    </div>
  );
}
