type AdBannerProps = {
  label?: string;
  size?: "wide" | "sidebar" | "inline" | "sticky";
};

export function AdBanner({ label = "Japan Premium Ads", size = "wide" }: AdBannerProps) {
  const height = {
    wide: "min-h-28",
    sidebar: "min-h-72",
    inline: "min-h-36",
    sticky: "min-h-20",
  }[size];

  return (
    <div
      className={`flex ${height} items-center justify-center rounded-lg border border-dashed border-[#F5A91B]/50 bg-[#1B5DAF] px-6 text-center text-white shadow-sm`}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#F5A91B]">Advertisement</p>
        <p className="mt-2 text-lg font-bold">{label}</p>
        <p className="mt-1 text-sm text-white/70">Slot iklan responsif untuk brand partner</p>
      </div>
    </div>
  );
}
