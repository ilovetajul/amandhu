"use client";
import { useMemo, useState } from "react";
import { FinishingRow, LineMapping } from "@/lib/types";
import { cn, fmtNum } from "@/lib/utils";
import { getDHUStatus } from "@/lib/parser";
import { Search, X } from "lucide-react";

export default function FinishingAnalysis({ data, lineMapping }: { data: FinishingRow[]; lineMapping: LineMapping[] }) {
  const [search, setSearch]         = useState("");
  const [unitFilter, setUnitFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const lmByLine = useMemo(() =>
    new Map(lineMapping.map(l => [String(l.Line_No), l])), [lineMapping]);

  const units = useMemo(() =>
    [...new Set(data.map(r => String(r.Unit_No ?? "")).filter(Boolean))].sort(), [data]);

  const enriched = useMemo(() => data.map(r => {
    const raw = r["DHU%"] != null ? Number(r["DHU%"]) : 0;
    const dhu = raw > 0 && raw <= 1 ? raw * 100 : raw > 1 ? raw : Number(r.Inspected_Qty)>0?(Number(r.Defectives_gmts)/Number(r.Inspected_Qty))*100:0;
    const rawT = r["Target_DHU%"] != null ? Number(r["Target_DHU%"]) : 0.03;
    const target = rawT <= 1 ? rawT * 100 : rawT;
    const lm = lmByLine.get(String(r.Line_No ?? ""));
    return { ...r, _dhu: +dhu.toFixed(2), _target: +target.toFixed(1), _isPass: dhu <= target, _status: getDHUStatus(dhu), lm };
  }), [data, lmByLine]);

  const filtered = useMemo(() => enriched.filter(r => {
    if (unitFilter !== "All" && String(r.Unit_No) !== unitFilter) return false;
    if (statusFilter === "Pass" && !r._isPass) return false;
    if (statusFilter === "Fail" && r._isPass) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        String(r.AO_Number??"").toLowerCase().includes(q)||
        String(r.Style_No??"").toLowerCase().includes(q)||
        String(r.Color??"").toLowerCase().includes(q)||
        String(r.Line_No??"").toLowerCase().includes(q)||
        String(r.Buyer??"").toLowerCase().includes(q)||
        String(r.lm?.Controller_Name??"").toLowerCase().includes(q)||
        String(r.lm?.Floor_IC_Name??"").toLowerCase().includes(q)
      );
    }
    return true;
  }).sort((a,b)=>b._dhu-a._dhu), [enriched, unitFilter, statusFilter, search]);

  const passCount = enriched.filter(r=>r._isPass).length;

  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card]">
      <div className="px-4 py-3 border-b border-[--color-border]">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200">Finishing DHU — Root Cause Analysis</h3>
            <p className="text-xs text-[--color-muted] mt-0.5">
              <span className="text-emerald-400 font-bold">{passCount} Pass</span>{" · "}
              <span className="text-red-400 font-bold">{enriched.length-passCount} Fail</span>
              {" · "}{filtered.length} showing
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-36">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[--color-muted]" />
            <input type="text" placeholder="AO, line, buyer, controller..." value={search}
              onChange={e=>setSearch(e.target.value)}
              className="w-full pl-7 pr-6 py-1.5 text-xs rounded-lg bg-[--color-surface] border border-[--color-border] text-slate-200 placeholder:text-[--color-muted] focus:outline-none focus:border-cyan-400/50" />
            {search&&<button onClick={()=>setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[--color-muted]"><X size={10}/></button>}
          </div>
          <div className="flex gap-1">
            {["All",...units].map(u=>(
              <button key={u} onClick={()=>setUnitFilter(u)}
                className={cn("px-2 py-1.5 text-xs rounded-lg border font-mono transition-colors",
                  unitFilter===u?"bg-cyan-400/15 text-cyan-400 border-cyan-400/40":"bg-[--color-surface] text-[--color-muted] border-[--color-border]")}>
                {u==="All"?"All":`U${u}`}
              </button>
            ))}
          </div>
          <div className="flex gap-1">
            {[{k:"All",l:"All"},{k:"Pass",l:"✓ Pass"},{k:"Fail",l:"✗ Fail"}].map(({k,l})=>(
              <button key={k} onClick={()=>setStatusFilter(k)}
                className={cn("px-2.5 py-1.5 text-xs rounded-lg border font-mono transition-colors",
                  statusFilter===k
                    ? k==="Pass"?"bg-emerald-400/15 text-emerald-400 border-emerald-400/40"
                      :k==="Fail"?"bg-red-400/15 text-red-400 border-red-400/40"
                      :"bg-cyan-400/15 text-cyan-400 border-cyan-400/40"
                    :"bg-[--color-surface] text-[--color-muted] border-[--color-border]")}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[--color-border]/50">
              {["Line","AO / Style","Buyer · Color","Unit","Inspected","Defects","DHU%","Target","Status","LQ","Controller","Floor IC","Remarks"].map(h=>(
                <th key={h} className="px-3 py-2.5 text-left text-[--color-muted] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r,i)=>{
              const sc = r._status==="critical"?"text-red-400":r._status==="warning"?"text-amber-400":"text-emerald-400";
              return (
                <tr key={i} className={cn("data-row border-b border-[--color-border]/30", r._status==="critical"&&"bg-red-500/5")}>
                  <td className="px-3 py-2.5 font-bold text-cyan-400 whitespace-nowrap">{String(r.Line_No??"—")}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="text-slate-300">{String(r.AO_Number??"—")}</div>
                    <div className="text-[--color-muted]">{String(r.Style_No??"—")}</div>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <div className="text-slate-400">{String(r.Buyer??"—")}</div>
                    <div className="text-[--color-muted]">{String(r.Color??"—")}</div>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-cyan-400">U{r.Unit_No}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-300">{fmtNum(Number(r.Inspected_Qty))}</td>
                  <td className="px-3 py-2.5 font-mono font-bold text-red-400">{Number(r.Defectives_gmts)}</td>
                  <td className="px-3 py-2.5"><span className={cn("font-mono font-bold text-sm",sc)}>{r._dhu.toFixed(2)}%</span></td>
                  <td className="px-3 py-2.5 font-mono text-[--color-muted]">{r._target.toFixed(1)}%</td>
                  <td className="px-3 py-2.5">
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border",
                      r._isPass?"text-emerald-400 bg-emerald-400/10 border-emerald-400/30":"text-red-400 bg-red-400/10 border-red-400/30")}>
                      {r._isPass?"✓ Pass":"✗ Fail"}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-cyan-400 whitespace-nowrap">{r.lm?.LQ_Name??"—"}</td>
                  <td className="px-3 py-2.5 text-violet-400 whitespace-nowrap">{r.lm?.Controller_Name??"—"}</td>
                  <td className="px-3 py-2.5 text-amber-400 whitespace-nowrap">{r.lm?.Floor_IC_Name??"—"}</td>
                  <td className="px-3 py-2.5 text-slate-400 max-w-32 truncate">{String(r.Remarks??"—")}</td>
                </tr>
              );
            })}
            {filtered.length===0&&(
              <tr><td colSpan={13} className="px-4 py-10 text-center text-[--color-muted]">No records match filters</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
