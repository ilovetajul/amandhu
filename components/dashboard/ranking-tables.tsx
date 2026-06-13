"use client";
import { ControllerPerf, FloorICPerf } from "@/lib/types";
import { cn, fmtPct, fmtNum, statusColor, rankBadge } from "@/lib/utils";

function RankBadge({ rank }: { rank: number }) {
  return (
    <span className={cn("inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border", rankBadge(rank))}>
      {rank}
    </span>
  );
}

function DHUBar({ dhu, max = 8 }: { dhu: number; max?: number }) {
  const pct = Math.min((dhu / max) * 100, 100);
  const color = dhu > 4 ? "#ef4444" : dhu > 2.5 ? "#f59e0b" : "#22c55e";
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full bg-black/30 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="font-mono text-xs font-bold" style={{ color }}>{fmtPct(dhu)}</span>
    </div>
  );
}

export function ControllerRanking({ data }: { data: ControllerPerf[] }) {
  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card]">
      <div className="px-4 py-3 border-b border-[--color-border]">
        <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200">Controller Ranking</h3>
        <p className="text-xs text-[--color-muted] mt-0.5">Sorted by DHU% (Best → Worst)</p>
      </div>
      <div className="divide-y divide-[--color-border]/50">
        {data.map((c) => (
          <div key={c.Controller_Name} className={cn("data-row px-4 py-3 flex items-center gap-3", c.Status === "critical" && "bg-red-500/5")}>
            <RankBadge rank={c.Rank} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-bold", statusColor(c.Status))}>{c.Controller_Name}</span>
                {c.Status === "critical" && <span className="text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">CRITICAL</span>}
              </div>
              <div className="text-xs text-[--color-muted] mt-0.5">
                {c.Lines.length} lines · {fmtNum(c.Total_Checked)} checked · {c.Total_Defects} defects
              </div>
              <div className="text-xs text-violet-400/70 truncate">{c.Lines.join(", ")}</div>
            </div>
            <DHUBar dhu={c.DHU_Pct} />
          </div>
        ))}
        {!data.length && <p className="px-4 py-6 text-xs text-[--color-muted] text-center">No data</p>}
      </div>
    </div>
  );
}

export function FloorICRanking({ data }: { data: FloorICPerf[] }) {
  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card]">
      <div className="px-4 py-3 border-b border-[--color-border]">
        <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200">Floor IC Ranking</h3>
        <p className="text-xs text-[--color-muted] mt-0.5">Sorted by DHU% (Best → Worst)</p>
      </div>
      <div className="divide-y divide-[--color-border]/50">
        {data.map((f) => (
          <div key={f.Floor_IC_Name} className={cn("data-row px-4 py-3 flex items-center gap-3", f.Status === "critical" && "bg-red-500/5")}>
            <RankBadge rank={f.Rank} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-bold", statusColor(f.Status))}>{f.Floor_IC_Name}</span>
                {f.Status === "critical" && <span className="text-xs text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded">CRITICAL</span>}
              </div>
              <div className="text-xs text-[--color-muted] mt-0.5">
                {f.Lines.length} lines · {fmtNum(f.Total_Checked)} checked · {f.Total_Defects} defects
              </div>
              <div className="text-xs text-amber-400/70 truncate">{f.Lines.join(", ")}</div>
            </div>
            <DHUBar dhu={f.DHU_Pct} />
          </div>
        ))}
        {!data.length && <p className="px-4 py-6 text-xs text-[--color-muted] text-center">No data</p>}
      </div>
    </div>
  );
}
