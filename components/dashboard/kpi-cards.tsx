"use client";
import { AlertTriangle, Activity, Package, Users, Layers, TrendingDown } from "lucide-react";
import { cn, fmtPct, fmtNum, statusColor, statusBg } from "@/lib/utils";
import { DashboardKPIs } from "@/lib/types";
import { getDHUStatus } from "@/lib/parser";

export default function KPICards({ kpis }: { kpis: DashboardKPIs }) {
  const s = getDHUStatus(kpis.overall_dhu);
  const fs = getDHUStatus(kpis.finishing_dhu);

  const cards = [
    { label: "Sewing DHU%", value: fmtPct(kpis.overall_dhu), sub: `${fmtNum(kpis.total_defects)} defects`, icon: <Activity size={16}/>, status: s, accent: statusColor(s) },
    { label: "Finishing DHU%", value: fmtPct(kpis.finishing_dhu), sub: "Finishing floor", icon: <TrendingDown size={16}/>, status: fs, accent: statusColor(fs) },
    { label: "Total Checked", value: fmtNum(kpis.total_checked), sub: `Target: ${fmtNum(kpis.total_prod_target)}`, icon: <Layers size={16}/>, status: "good" as const, accent: "text-cyan-400" },
    { label: "Prod Efficiency", value: fmtPct(kpis.prod_eff, 1), sub: `${fmtNum(kpis.total_prod_actual)} pcs made`, icon: <Package size={16}/>, status: kpis.prod_eff >= 90 ? "good" as const : kpis.prod_eff >= 75 ? "warning" as const : "critical" as const, accent: kpis.prod_eff >= 90 ? "text-emerald-400" : kpis.prod_eff >= 75 ? "text-amber-400" : "text-red-400" },
    { label: "Table Balance", value: fmtNum(kpis.total_balance), sub: "Pending pcs", icon: <AlertTriangle size={16}/>, status: kpis.total_balance > 500 ? "critical" as const : kpis.total_balance > 200 ? "warning" as const : "good" as const, accent: kpis.total_balance > 500 ? "text-red-400" : "text-amber-400" },
    { label: "Critical Lines", value: String(kpis.critical_lines), sub: `of ${kpis.active_lines} active`, icon: <Users size={16}/>, status: kpis.critical_lines > 0 ? "critical" as const : "good" as const, accent: kpis.critical_lines > 0 ? "text-red-400" : "text-emerald-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2">
      {cards.map((c, i) => (
        <div key={i} className={cn("glow-card rounded-lg border p-4 slide-up", statusBg(c.status))}
          style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="flex items-center justify-between mb-3">
            <div className={cn("p-1.5 rounded-md bg-black/20", c.accent)}>{c.icon}</div>
            {c.status === "critical" && <div className="w-2 h-2 rounded-full bg-red-400 pulse"/>}
          </div>
          <div className={cn("text-2xl font-bold font-[var(--font-display)] count-in", c.accent)}>{c.value}</div>
          <div className="text-xs text-[--color-muted] mt-1">{c.label}</div>
          <div className={cn("text-xs mt-0.5", c.accent, "opacity-70")}>{c.sub}</div>
        </div>
      ))}
    </div>
  );
}
