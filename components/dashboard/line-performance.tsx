"use client";
import { useMemo } from "react";
import { LineDHU } from "@/lib/types";
import { Filters } from "./filter-bar";
import { cn, fmtPct, fmtNum, statusColor, statusBg } from "@/lib/utils";

function LineCard({ l, rank }: { l: LineDHU; rank: number }) {
  const sc = statusColor(l.Status);
  const sb = statusBg(l.Status);
  return (
    <div className={cn("glow-card rounded-lg border p-3 relative overflow-hidden", sb)}>
      {l.Status === "critical" && <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-400/70 critical-border" />}
      <div className="flex items-start justify-between mb-2">
        <div>
          <span className="text-xs text-slate-500 font-mono">#{rank}</span>
          <span className={cn("text-sm font-bold ml-1.5 font-[var(--font-display)]", sc)}>{l.Line_No}</span>
          <span className="text-xs text-[--color-muted] ml-1">U{l.Unit_No}</span>
        </div>
        <div className={cn("text-xl font-bold font-mono", sc)}>{fmtPct(l.DHU_Pct)}</div>
      </div>
      {/* DHU bar */}
      <div className="h-1 rounded-full bg-black/30 mb-2.5 overflow-hidden">
        <div className="h-full rounded-full" style={{
          width: `${Math.min((l.DHU_Pct / 8) * 100, 100)}%`,
          background: l.Status === "critical" ? "#ef4444" : l.Status === "warning" ? "#f59e0b" : "#22c55e"
        }} />
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs mb-2">
        <div><span className="text-[--color-muted]">Checked: </span><span className="text-slate-300 font-mono">{fmtNum(l.Total_Checked)}</span></div>
        <div><span className="text-[--color-muted]">Defects: </span><span className={cn(sc, "font-mono font-bold")}>{l.Total_Defects}</span></div>
        <div><span className="text-[--color-muted]">Prod: </span><span className={l.Prod_Eff >= 90 ? "text-emerald-400" : "text-amber-400"}>{l.Prod_Eff}%</span></div>
        <div><span className="text-[--color-muted]">Balance: </span><span className={l.Table_Balance > 50 ? "text-amber-400 font-bold" : "text-slate-300"}>{l.Table_Balance}</span></div>
      </div>
      <div className="border-t border-white/5 pt-1.5 space-y-0.5 text-xs">
        <div><span className="text-[--color-muted]">LQ: </span><span className="text-cyan-400">{l.LQ_Name}</span><span className="text-[--color-muted] ml-2">Ctrl: </span><span className="text-violet-400">{l.Controller_Name}</span></div>
        {l.Top_Defect !== "—" && <div><span className="text-[--color-muted]">Top Defect: </span><span className="text-amber-400">{l.Top_Defect}</span></div>}
      </div>
    </div>
  );
}

interface Props { lines: LineDHU[]; filters: Filters; }

export default function LinePerformance({ lines, filters }: Props) {
  const filtered = useMemo(() => {
    return lines.filter(l => {
      if (filters.unit !== "All" && String(l.Unit_No) !== filters.unit) return false;
      if (filters.status !== "All" && l.Status !== filters.status) return false;
      if (filters.search) {
        const q = filters.search.toLowerCase();
        return (
          l.Line_No.toLowerCase().includes(q) ||
          l.LQ_Name.toLowerCase().includes(q) ||
          l.Controller_Name.toLowerCase().includes(q) ||
          l.Floor_IC_Name.toLowerCase().includes(q) ||
          l.Top_Defect.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [lines, filters]);

  const sorted = [...filtered].sort((a, b) => b.DHU_Pct - a.DHU_Pct);

  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[--color-border]">
        <div>
          <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200">Line Performance</h3>
          <p className="text-xs text-[--color-muted] mt-0.5">{sorted.length} of {lines.length} lines</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-red-400">● Critical (&gt;4%)</span>
          <span className="text-amber-400 hidden sm:inline">● Warning (2.5-4%)</span>
          <span className="text-emerald-400 hidden sm:inline">● Good</span>
        </div>
      </div>
      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
        {sorted.map((l, i) => <LineCard key={l.Line_No} l={l} rank={i + 1} />)}
        {sorted.length === 0 && (
          <div className="col-span-full text-center py-8 text-[--color-muted] text-xs">
            No lines match the current filters
          </div>
        )}
      </div>
    </div>
  );
}
