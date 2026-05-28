import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, change, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-[#1B5DAF]">{value}</p>
        </div>
        <div className="rounded-lg bg-[#F5A91B]/15 p-3 text-[#2D54A7]">
          <Icon size={22} />
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-emerald-600">{change}</p>
    </div>
  );
}
