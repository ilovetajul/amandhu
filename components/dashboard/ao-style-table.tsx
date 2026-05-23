"use client";
import { useMemo, useState } from "react";
import { AOStyleMaster, HourlyQualityRow } from "@/lib/types";
import { cn, fmtNum } from "@/lib/utils";
import { Search, X } from "lucide-react";

export default function AOStyleTable({ aoStyles, hourly }: { aoStyles: AOStyleMaster[]; hourly: HourlyQualityRow[] }) {
  const [search, setSearch] = useState("");

  const rows = useMemo(() => {
    const defByAO = new Map<string,number>();
    const chkByAO = new Map<string,number>();
    for (const r of hourly) {
      const ao = String(r.AO_Number??"");
      defByAO.set(ao, (defByAO.get(ao)??0) + Number(r.Defectives_gmts??0));
      chkByAO.set(ao, (chkByAO.get(ao)??0) + Number(r.Quality_Checked??0));
    }
    return aoStyles
      .filter(a => a.Status === "Active")
      .map(a => {
        const def = defByAO.get(a.AO_Number)??0;
        const chk = chkByAO.get(a.AO_Number)??0;
        const dhu = chk>0 ? +((def/chk)*100).toFixed(2) : 0;
        return { ...a, defects:def, checked:chk, dhu };
      })
      .filter(r => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          String(r.AO_Number??"").toLowerCase().includes(q)||
          String(r.Style_No??"").toLowerCase().includes(q)||
          String(r.Buyer??"").toLowerCase().includes(q)||
          String(r.Color??"").toLowerCase().includes(q)||
          String(r.Line_No??"").toLowerCase().includes(q)
        );
      })
      .sort((a,b)=>b.dhu-a.dhu);
  }, [aoStyles, hourly, search]);

  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 border-b border-[--color-border]">
        <div>
          <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200">AO / Style / Color Analysis</h3>
          <p className="text-xs text-[--color-muted] mt-0.5">কোন Style-এ বেশি Defect</p>
        </div>
        <div className="relative">
          <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[--color-muted]" />
          <input type="text" placeholder="AO, Style, Line, Buyer..." value={search}
            onChange={e=>setSearch(e.target.value)}
            className="pl-7 pr-6 py-1.5 text-xs rounded-lg bg-[--color-surface] border border-[--color-border] text-slate-200 placeholder:text-[--color-muted] focus:outline-none focus:border-cyan-400/50 w-44" />
          {search&&<button onClick={()=>setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[--color-muted]"><X size={10}/></button>}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[--color-border]/50">
              {["Line","AO","Style","Buyer","Color","Type","Order Qty","Checked","Defects","DHU%"].map(h=>(
                <th key={h} className="px-3 py-2.5 text-left text-[--color-muted] uppercase tracking-wider font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r,i)=>{
              const sc = r.dhu>4?"text-red-400":r.dhu>2.5?"text-amber-400":r.dhu>0?"text-emerald-400":"text-[--color-muted]";
              return (
                <tr key={i} className={cn("data-row border-b border-[--color-border]/30", r.dhu>4&&"bg-red-500/5")}>
                  <td className="px-3 py-2.5 font-mono text-cyan-400 font-bold">{String(r.Line_No??"—")}</td>
                  <td className="px-3 py-2.5 font-mono text-cyan-400">{r.AO_Number}</td>
                  <td className="px-3 py-2.5 text-slate-300">{r.Style_No}</td>
                  <td className="px-3 py-2.5 text-violet-400">{r.Buyer}</td>
                  <td className="px-3 py-2.5 text-slate-400">{r.Color}</td>
                  <td className="px-3 py-2.5 text-slate-400">{r.Garment_Type}</td>
                  <td className="px-3 py-2.5 font-mono text-slate-300">{fmtNum(r.Order_Qty)}</td>
                  <td className="px-3 py-2.5 font-mono text-cyan-400">{r.checked}</td>
                  <td className="px-3 py-2.5 font-mono text-red-400 font-bold">{r.defects}</td>
                  <td className="px-3 py-2.5"><span className={cn("font-mono font-bold text-sm",sc)}>{r.dhu>0?`${r.dhu}%`:"—"}</span></td>
                </tr>
              );
            })}
            {rows.length===0&&(
              <tr><td colSpan={10} className="px-4 py-8 text-center text-[--color-muted]">No data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
