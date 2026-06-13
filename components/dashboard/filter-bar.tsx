"use client";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Filters {
  unit: string;
  search: string;
  status: string;
  date: string;
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  units: number[];
  dates: string[];
}

export default function FilterBar({ filters, onChange, units, dates }: Props) {
  const set = (k: keyof Filters, v: string) => onChange({ ...filters, [k]: v });
  const hasActive = filters.unit !== "All" || filters.search || filters.status !== "All" || filters.date !== "All";

  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card] p-3">
      <div className="flex flex-wrap items-center gap-2">

        {/* Search */}
        <div className="relative flex-1 min-w-40">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[--color-muted]" />
          <input
            type="text"
            placeholder="Search line, QI, defect..."
            value={filters.search}
            onChange={e => set("search", e.target.value)}
            className="w-full pl-7 pr-3 py-2 text-xs rounded-lg bg-[--color-surface] border border-[--color-border] text-slate-200 placeholder:text-[--color-muted] focus:outline-none focus:border-cyan-400/50"
          />
          {filters.search && (
            <button onClick={() => set("search", "")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[--color-muted] hover:text-red-400">
              <X size={11} />
            </button>
          )}
        </div>

        {/* Unit Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[--color-muted] font-mono whitespace-nowrap">Unit:</span>
          <div className="flex gap-1">
            {["All", ...units.map(String)].map(u => (
              <button key={u} onClick={() => set("unit", u)}
                className={cn("px-2.5 py-1.5 text-xs rounded-lg border font-mono transition-colors",
                  filters.unit === u
                    ? "bg-cyan-400/15 text-cyan-400 border-cyan-400/40"
                    : "bg-[--color-surface] text-[--color-muted] border-[--color-border] hover:text-slate-300"
                )}>
                {u === "All" ? "All" : `U${u}`}
              </button>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-[--color-muted] font-mono">Status:</span>
          <div className="flex gap-1">
            {[
              { k: "All",      label: "All",      cls: "text-slate-400 border-slate-600" },
              { k: "critical", label: "Critical", cls: "text-red-400 border-red-400/40" },
              { k: "warning",  label: "Warning",  cls: "text-amber-400 border-amber-400/40" },
              { k: "good",     label: "Good",     cls: "text-emerald-400 border-emerald-400/40" },
            ].map(({ k, label, cls }) => (
              <button key={k} onClick={() => set("status", k)}
                className={cn("px-2.5 py-1.5 text-xs rounded-lg border font-mono transition-colors",
                  filters.status === k ? `${cls} bg-white/5` : "bg-[--color-surface] text-[--color-muted] border-[--color-border] hover:text-slate-300"
                )}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Date Filter */}
        {dates.length > 1 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[--color-muted] font-mono">Date:</span>
            <select value={filters.date} onChange={e => set("date", e.target.value)}
              className="px-2 py-1.5 text-xs rounded-lg bg-[--color-surface] border border-[--color-border] text-slate-300 focus:outline-none focus:border-cyan-400/50">
              <option value="All">All dates</option>
              {[...dates].reverse().map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}

        {/* Clear all */}
        {hasActive && (
          <button onClick={() => onChange({ unit: "All", search: "", status: "All", date: "All" })}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs rounded-lg border border-red-400/20 text-red-400 hover:bg-red-400/10 transition-colors font-mono">
            <X size={10} /> Clear
          </button>
        )}

        {/* Active filter count */}
        {hasActive && (
          <span className="text-xs text-cyan-400 font-mono ml-auto">
            {[filters.unit !== "All", !!filters.search, filters.status !== "All", filters.date !== "All"].filter(Boolean).length} filter(s) active
          </span>
        )}
      </div>
    </div>
  );
}
