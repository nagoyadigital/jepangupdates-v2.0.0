"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Dynamic settings
  const [siteLogo, setSiteLogo] = useState("");
  const [logoReady, setLogoReady] = useState(false);
  const [footerCopyright, setFooterCopyright] = useState("© 2026 Jepang Updates. All rights reserved.");
  const [footerDeveloperText, setFooterDeveloperText] = useState("Developed by");
  const [footerDeveloperName, setFooterDeveloperName] = useState("Nagoya Digital");
  const [footerDeveloperUrl, setFooterDeveloperUrl] = useState("https://nagoyadigital.com");
  const [showDeveloper, setShowDeveloper] = useState(true);

  useEffect(() => {
    fetch("/api/settings/public")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, Record<string, string>>) => {
        const general = data?.general || {};
        const footer = data?.footer || {};

        // Logo: prioritas site_logo dari settings
        if (general.site_logo) setSiteLogo(general.site_logo);
        setLogoReady(true);

        // Footer settings
        if (footer.footer_copyright) setFooterCopyright(footer.footer_copyright);
        if (footer.footer_developer_text) setFooterDeveloperText(footer.footer_developer_text);
        if (footer.footer_developer_name) setFooterDeveloperName(footer.footer_developer_name);
        if (footer.footer_developer_url) setFooterDeveloperUrl(footer.footer_developer_url);
        if (footer.footer_show_developer === "false") setShowDeveloper(false);
      })
      .catch(() => setLogoReady(true));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email atau password salah");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F4F7FB] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            {logoReady && siteLogo ? (
              <img src={siteLogo} alt="Logo" className="h-12 w-auto object-contain" />
            ) : (
              <div className="h-12 w-36 animate-pulse rounded bg-slate-200" />
            )}
          </div>

          <h1 className="mb-2 text-center text-2xl font-black text-[#111827]">
            Masuk ke Dashboard
          </h1>
          <p className="mb-6 text-center text-sm text-slate-500">
            Masukkan email dan password untuk melanjutkan
          </p>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-bold text-slate-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm focus:border-[#1B5DAF] focus:outline-none focus:ring-1 focus:ring-[#1B5DAF]"
                placeholder="admin@japanpopuler.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-bold text-slate-700">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-slate-300 px-4 py-3 pr-12 text-sm focus:border-[#1B5DAF] focus:outline-none focus:ring-1 focus:ring-[#1B5DAF]"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-[#1B5DAF] py-3 text-sm font-black text-white transition hover:bg-[#154A8F] disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          <p>{footerCopyright}</p>
          {showDeveloper && (
            <p className="mt-1">
              {footerDeveloperText}{" "}
              <a
                href={footerDeveloperUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-500 hover:text-slate-700"
              >
                {footerDeveloperName}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
