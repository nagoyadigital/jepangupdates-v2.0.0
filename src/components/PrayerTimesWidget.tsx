"use client";

import { useEffect, useState } from "react";

type PrayerTimes = {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
};

type PrayerData = {
  timings: PrayerTimes;
  date: string;
  city: string;
};

const cities = [
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Osaka", lat: 34.6937, lon: 135.5023 },
  { name: "Nagoya", lat: 35.1815, lon: 136.9066 },
];

export function PrayerTimesWidget() {
  const [data, setData] = useState<PrayerData | null>(null);
  const [activeCity, setActiveCity] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrayer() {
      try {
        const city = cities[activeCity];
        const res = await fetch(
          `https://api.aladhan.com/v1/timings?latitude=${city.lat}&longitude=${city.lon}&method=3`
        );
        const json = await res.json();
        const timings = json.data.timings;
        const dateInfo = json.data.date.readable;

        setData({
          timings: {
            Fajr: timings.Fajr,
            Sunrise: timings.Sunrise,
            Dhuhr: timings.Dhuhr,
            Asr: timings.Asr,
            Maghrib: timings.Maghrib,
            Isha: timings.Isha,
          },
          date: dateInfo,
          city: city.name,
        });
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    fetchPrayer();
  }, [activeCity]);

  if (loading) {
    return (
      <div className="mt-4 flex h-[200px] items-center justify-center rounded-lg bg-gradient-to-br from-[#1a3a2a] to-[#0d2d1e] text-white">
        <p className="text-sm text-white/60">Memuat jadwal sholat...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-4 flex h-[200px] items-center justify-center rounded-lg bg-gradient-to-br from-[#1a3a2a] to-[#0d2d1e] text-white">
        <p className="text-sm text-white/60">Gagal memuat jadwal sholat</p>
      </div>
    );
  }

  const prayers = [
    { name: "Subuh", time: data.timings.Fajr, icon: "🌙" },
    { name: "Syuruq", time: data.timings.Sunrise, icon: "🌅" },
    { name: "Dzuhur", time: data.timings.Dhuhr, icon: "☀️" },
    { name: "Ashar", time: data.timings.Asr, icon: "🌤" },
    { name: "Maghrib", time: data.timings.Maghrib, icon: "🌇" },
    { name: "Isya", time: data.timings.Isha, icon: "🌃" },
  ];

  return (
    <div className="mt-4 overflow-hidden rounded-lg bg-gradient-to-br from-[#1a3a2a] to-[#0d2d1e] text-white shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div>
          <p className="text-xs font-bold text-white/50">{data.date}</p>
          <p className="mt-0.5 text-sm font-black">{data.city}, Japan</p>
        </div>
        <span className="text-2xl">🕌</span>
      </div>

      {/* City tabs */}
      <div className="flex border-b border-white/10">
        {cities.map((city, i) => (
          <button
            key={city.name}
            onClick={() => setActiveCity(i)}
            className={`flex-1 py-2 text-[11px] font-bold transition ${
              i === activeCity
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white/80"
            }`}
            type="button"
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Prayer times */}
      <div className="divide-y divide-white/5 px-5">
        {prayers.map((prayer) => (
          <div key={prayer.name} className="flex items-center justify-between py-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-sm">{prayer.icon}</span>
              <span className="text-xs font-bold text-white/80">{prayer.name}</span>
            </div>
            <span className="text-sm font-black">{prayer.time}</span>
          </div>
        ))}
      </div>

      <p className="border-t border-white/10 px-5 py-2.5 text-center text-[10px] text-white/40">
        Data: Aladhan API • Muslim World League
      </p>
    </div>
  );
}
