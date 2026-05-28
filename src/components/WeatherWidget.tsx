"use client";

import { useEffect, useState } from "react";

type CityWeather = {
  name: string;
  temp: number;
  code: number;
};

type WeatherData = {
  main: CityWeather;
  humidity: number;
  windSpeed: number;
  cities: CityWeather[];
};

const cities = [
  { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "Osaka", lat: 34.6937, lon: 135.5023 },
  { name: "Nagoya", lat: 35.1815, lon: 136.9066 },
  { name: "Fukuoka", lat: 33.5904, lon: 130.4017 },
  { name: "Sapporo", lat: 43.0618, lon: 141.3545 },
];

function weatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code <= 3) return "⛅";
  if (code <= 48) return "🌥";
  if (code <= 57) return "🌦";
  if (code <= 67) return "🌧";
  if (code <= 77) return "🌨";
  if (code <= 82) return "🌧";
  if (code <= 86) return "❄️";
  if (code <= 99) return "⛈";
  return "🌤";
}

function weatherLabel(code: number): string {
  if (code === 0) return "Cerah";
  if (code <= 3) return "Cerah Berawan";
  if (code <= 48) return "Berawan";
  if (code <= 57) return "Gerimis";
  if (code <= 67) return "Hujan Ringan";
  if (code <= 77) return "Hujan Salju";
  if (code <= 82) return "Hujan Lebat";
  if (code <= 86) return "Salju";
  if (code <= 99) return "Badai Petir";
  return "Cerah Berawan";
}

export function WeatherWidget() {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const latitudes = cities.map((c) => c.lat).join(",");
        const longitudes = cities.map((c) => c.lon).join(",");

        const res = await fetch(
          `https://api.open-meteo.com/v1/jma?latitude=${latitudes}&longitude=${longitudes}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=Asia/Tokyo`
        );
        const json = await res.json();

        // Open-Meteo returns array when multiple locations
        const results = Array.isArray(json) ? json : [json];

        const cityWeathers: CityWeather[] = results.map((r: { current: { temperature_2m: number; weather_code: number } }, i: number) => ({
          name: cities[i].name,
          temp: Math.round(r.current.temperature_2m),
          code: r.current.weather_code,
        }));

        setData({
          main: cityWeathers[0],
          humidity: results[0].current.relative_humidity_2m,
          windSpeed: Math.round(results[0].current.wind_speed_10m),
          cities: cityWeathers.slice(1),
        });
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchWeather();
  }, []);

  if (loading) {
    return (
      <div className="mt-4 flex h-[200px] items-center justify-center rounded-lg bg-gradient-to-br from-[#1a4a8a] to-[#0d2d5e] text-white">
        <p className="text-sm text-white/60">Memuat cuaca...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mt-4 flex h-[200px] items-center justify-center rounded-lg bg-gradient-to-br from-[#1a4a8a] to-[#0d2d5e] text-white">
        <p className="text-sm text-white/60">Gagal memuat data cuaca</p>
      </div>
    );
  }

  return (
    <div className="mt-4 overflow-hidden rounded-lg bg-gradient-to-br from-[#1a4a8a] to-[#0d2d5e] p-5 text-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-white/60">{data.main.name}, Japan</p>
          <p className="mt-1 text-4xl font-black">{data.main.temp}°C</p>
          <p className="mt-1 text-sm font-medium text-white/80">{weatherLabel(data.main.code)}</p>
        </div>
        <div className="text-5xl">{weatherIcon(data.main.code)}</div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
        <div className="text-center">
          <p className="text-[10px] font-bold text-white/50">Kelembapan</p>
          <p className="mt-1 text-sm font-black">{data.humidity}%</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-white/50">Angin</p>
          <p className="mt-1 text-sm font-black">{data.windSpeed} km/h</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-1 border-t border-white/10 pt-4">
        {data.cities.map((city) => (
          <div className="text-center" key={city.name}>
            <p className="text-[10px] font-bold text-white/50">{city.name}</p>
            <p className="text-lg">{weatherIcon(city.code)}</p>
            <p className="text-xs font-bold">{city.temp}°C</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-[10px] text-white/40">Data: JMA via Open-Meteo</p>
    </div>
  );
}
