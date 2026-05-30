"use client";

import { useEffect, useState } from "react";

export function AdminFooter() {
  const [copyright, setCopyright] = useState("");
  const [developerText, setDeveloperText] = useState("");
  const [developerName, setDeveloperName] = useState("");
  const [developerUrl, setDeveloperUrl] = useState("");
  const [showDeveloper, setShowDeveloper] = useState(false);

  useEffect(() => {
    fetch("/api/settings/public")
      .then((r) => (r.ok ? r.json() : {}))
      .then((data) => {
        const footer = data?.footer || {};
        setCopyright(footer.footer_copyright || "© 2026 Jepang Updates. All rights reserved.");
        setDeveloperText(footer.footer_developer_text || "Developed by");
        setDeveloperName(footer.footer_developer_name || "Nagoya Digital");
        setDeveloperUrl(footer.footer_developer_url || "https://nagoyadigital.com");
        setShowDeveloper(footer.footer_show_developer !== "false");
      })
      .catch(() => {
        setCopyright("© 2026 Jepang Updates. All rights reserved.");
      });
  }, []);

  return (
    <footer className="mt-12 border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-400">
      <p>{copyright}</p>
      {showDeveloper && developerName && (
        <p className="mt-1">
          {developerText}{" "}
          <a
            href={developerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-500 hover:text-slate-700"
          >
            {developerName}
          </a>
        </p>
      )}
    </footer>
  );
}
