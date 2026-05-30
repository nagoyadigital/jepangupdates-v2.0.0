"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    fetch("/api/settings/public")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: Record<string, Record<string, string>>) => {
        const a = data?.appearance || {};
        const f = data?.footer || {};
        const root = document.documentElement;

        // Colors
        root.style.setProperty("--color-primary", a.primary_color || "#1B5DAF");
        root.style.setProperty("--color-accent", a.accent_color || "#F5A91B");
        root.style.setProperty("--color-danger", a.danger_color || "#E6372E");
        root.style.setProperty("--text-heading", a.text_heading || "#111827");
        root.style.setProperty("--text-body", a.text_body || "#374151");
        root.style.setProperty("--text-link", a.text_link || "#1B5DAF");
        root.style.setProperty("--text-muted", a.text_muted || "#64748b");
        root.style.setProperty("--text-category", a.text_category || "#E6372E");
        root.style.setProperty("--nav-bg", a.nav_bg || "#1B5DAF");
        root.style.setProperty("--nav-text", a.nav_text || "#ffffff");
        root.style.setProperty("--footer-bg", f.footer_bg_color || "#1B5DAF");
        root.style.setProperty("--footer-text", f.footer_text_color || "#ffffff");
        root.style.setProperty("--footer-border", f.footer_border_color || "#E51B23");

        // Font
        const font = a.font_family || "Montserrat";
        if (font !== "Montserrat") {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(font)}:wght@400;500;600;700;800;900&display=swap`;
          document.head.appendChild(link);
        }
        root.style.setProperty("--font-site", `${font}, ui-sans-serif, system-ui, sans-serif`);
        document.body.style.fontFamily = "var(--font-site)";

        // Dynamic favicon
        const favicon = data?.general?.site_favicon;
        if (favicon) {
          const existingIcon = document.querySelector('link[rel="icon"]');
          if (existingIcon) existingIcon.setAttribute("href", favicon);
          const appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
          if (appleIcon) appleIcon.setAttribute("href", favicon);
        }
      })
      .catch(() => {});
  }, []);

  return <>{children}</>;
}
