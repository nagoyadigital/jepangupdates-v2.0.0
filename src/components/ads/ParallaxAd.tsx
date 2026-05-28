"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";

type ParallaxAdProps = {
  position: string;
};

type Ad = {
  id: string;
  type: string;
  content: string;
  link: string | null;
};

export function ParallaxAd({ position }: ParallaxAdProps) {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    fetch(`/api/ads?position=${position}`)
      .then((r) => r.ok ? r.json() : [])
      .then((ads) => { if (Array.isArray(ads) && ads.length > 0) setAd(ads[0]); })
      .catch(() => {});
  }, [position]);

  if (isClosed || !ad) return null;

  const isMobileTop = position === "MOBILE_TOP";

  return (
    <section className={isMobileTop ? "block bg-[#1B5DAF] md:hidden" : "my-9"}>
      <div
        className={[
          "relative overflow-hidden bg-[#1B5DAF]",
          isMobileTop
            ? "flex h-[100svh] min-h-[620px] w-full items-center justify-center bg-contain bg-center bg-no-repeat"
            : "h-[360px] sm:h-[430px]",
        ].join(" ")}
        style={
          ad.type === "IMAGE"
            ? isMobileTop
              ? { backgroundImage: `url(${ad.content})`, backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat" }
              : { backgroundImage: `url(${ad.content})`, backgroundPosition: "center", backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundAttachment: "fixed" }
            : undefined
        }
      >
        {ad.type !== "IMAGE" && (
          <div className="flex h-full items-center justify-center" dangerouslySetInnerHTML={{ __html: ad.content }} />
        )}

        {isMobileTop ? (
          <button
            aria-label="Close Ads"
            className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#1B5DAF] shadow-lg"
            onClick={() => setIsClosed(true)}
            type="button"
          >
            <span>Close Ads</span>
            <X size={13} strokeWidth={3} />
          </button>
        ) : (
          <div className="absolute left-0 right-0 top-0 z-10 bg-[#1B5DAF] px-4 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white italic">
            Advertisement
          </div>
        )}

        {isMobileTop ? (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#1B5DAF] px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white">
            Scroll to continue with content
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 z-10 bg-[#1B5DAF] px-4 py-1 text-center text-[10px] font-semibold uppercase tracking-[0.14em] text-white italic">
            Scroll to resume content
          </div>
        )}
      </div>
    </section>
  );
}
