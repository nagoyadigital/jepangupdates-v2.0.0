"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Ad = {
  id: string;
  position: string;
  type: string;
  content: string;
  link: string | null;
};

export function SideAds() {
  const [leftAd, setLeftAd] = useState<Ad | null>(null);
  const [rightAd, setRightAd] = useState<Ad | null>(null);
  const [leftClosed, setLeftClosed] = useState(false);
  const [rightClosed, setRightClosed] = useState(false);

  useEffect(() => {
    fetch("/api/ads?position=SIDEBAR_LEFT")
      .then((r) => r.ok ? r.json() : [])
      .then((ads) => { if (Array.isArray(ads) && ads.length > 0) setLeftAd(ads[0]); })
      .catch(() => {});
    fetch("/api/ads?position=SIDEBAR_RIGHT")
      .then((r) => r.ok ? r.json() : [])
      .then((ads) => { if (Array.isArray(ads) && ads.length > 0) setRightAd(ads[0]); })
      .catch(() => {});
  }, []);

  // Don't render if both closed or no ads
  if ((leftClosed || !leftAd) && (rightClosed || !rightAd)) return null;

  function trackClick(adId: string) {
    fetch(`/api/ads/${adId}/click`, { method: "POST" });
  }

  function renderAd(ad: Ad) {
    if (ad.type === "IMAGE") {
      const img = <img src={ad.content} alt="Advertisement" className="w-full rounded-md" />;
      return ad.link ? (
        <a href={ad.link} target="_blank" rel="noopener noreferrer" onClick={() => trackClick(ad.id)}>{img}</a>
      ) : img;
    }
    // Script or HTML type
    return <div dangerouslySetInnerHTML={{ __html: ad.content }} />;
  }

  return (
    <div className="pointer-events-none fixed inset-y-0 left-0 right-0 z-30 hidden xl:block">
      <div className="mx-auto flex h-full max-w-[1400px] items-start justify-between px-2 pt-[200px]">
        {/* Left ad */}
        {leftAd && !leftClosed && (
          <div className="pointer-events-auto relative w-[140px]">
            <button
              onClick={() => setLeftClosed(true)}
              className="absolute -right-1 -top-1 z-10 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
              aria-label="Tutup iklan"
            >
              <X size={12} />
            </button>
            {renderAd(leftAd)}
          </div>
        )}
        {/* Spacer */}
        {(!leftAd || leftClosed) && <div />}

        {/* Right ad */}
        {rightAd && !rightClosed && (
          <div className="pointer-events-auto relative w-[140px]">
            <button
              onClick={() => setRightClosed(true)}
              className="absolute -left-1 -top-1 z-10 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80"
              aria-label="Tutup iklan"
            >
              <X size={12} />
            </button>
            {renderAd(rightAd)}
          </div>
        )}
        {(!rightAd || rightClosed) && <div />}
      </div>
    </div>
  );
}
