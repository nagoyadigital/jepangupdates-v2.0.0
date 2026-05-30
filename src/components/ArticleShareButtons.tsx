"use client";

import { useEffect, useState } from "react";

export function ArticleShareButtons() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
    setCurrentTitle(document.title);
  }, []);

  const copyLink = async () => {
    await navigator.clipboard.writeText(currentUrl);
  };

  const shareItems = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
      className: "bg-[#1877F2] hover:bg-[#1466d8]",
      icon: <FacebookIcon />,
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(currentTitle)}`,
      className: "bg-[#111827] hover:bg-black",
      icon: <XIcon />,
    },
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${currentTitle} ${currentUrl}`)}`,
      className: "bg-[#25D366] hover:bg-[#1fba57]",
      icon: <WhatsAppIcon />,
    },
    {
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(currentTitle)}`,
      className: "bg-[#2AABEE] hover:bg-[#229ad6]",
      icon: <TelegramIcon />,
    },
    {
      label: "LINE",
      href: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(currentUrl)}`,
      className: "bg-[#06C755] hover:bg-[#05a847]",
      icon: <LineIcon />,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      {shareItems.map((item) => (
        <a
          aria-label={`Bagikan ke ${item.label}`}
          className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${item.className}`}
          href={item.href}
          key={item.label}
          rel="noreferrer"
          target="_blank"
        >
          {item.icon}
        </a>
      ))}
      <button
        aria-label="Salin link artikel"
        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#111827] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-black hover:shadow-md"
        onClick={copyLink}
        type="button"
      >
        <CopyLinkIcon />
      </button>
    </div>
  );
}

function FacebookIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

function LineIcon() {
  return (
    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
    </svg>
  );
}

function CopyLinkIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
