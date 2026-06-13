import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export const fmtPct = (v: number, d = 2) => `${v.toFixed(d)}%`;
export const fmtNum = (v: number) => new Intl.NumberFormat("en-US").format(v);

export function statusColor(s: "critical" | "warning" | "good") {
  return { critical:"text-red-400", warning:"text-amber-400", good:"text-emerald-400" }[s];
}
export function statusBg(s: "critical" | "warning" | "good") {
  return { critical:"bg-red-400/10 border-red-400/25", warning:"bg-amber-400/10 border-amber-400/25", good:"bg-emerald-400/10 border-emerald-400/25" }[s];
}
export function rankBadge(rank: number) {
  if (rank === 1) return "bg-amber-400/20 text-amber-400 border-amber-400/40";
  if (rank === 2) return "bg-slate-400/20 text-slate-300 border-slate-400/40";
  if (rank === 3) return "bg-orange-400/20 text-orange-400 border-orange-400/40";
  return "bg-slate-800/50 text-slate-500 border-slate-700/40";
}
