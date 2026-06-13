"use client";
import { useState, useEffect } from "react";
import { RefreshCw, Wifi, WifiOff, Tv2, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { source: string; latest_date: string; onRefresh: () => void; loading: boolean; tvMode: boolean; onTVToggle: () => void; }

export default function Header({ source, latest_date, onRefresh, loading, tvMode, onTVToggle }: Props) {
  const [time, setTime] = useState("");
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const isMock = source.includes("mock");

  return (
    <header className="sticky top-0 z-50 border-b border-[--color-border] bg-[--color-bg]/95 backdrop-blur-sm">
      <div className="max-w-screen-2xl mx-auto px-4 h-12 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-cyan-400 pulse" />
            <div className="w-1 h-4 bg-cyan-400/40 rounded" />
            <div className="w-1 h-6 bg-cyan-400/70 rounded" />
            <div className="w-1 h-4 bg-cyan-400/40 rounded" />
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest text-cyan-400 font-[var(--font-display)]">AMANDHU</span>
            <span className="text-xs text-[--color-muted] ml-2 hidden sm:inline">Quality Command Center</span>
          </div>
        </div>

        {/* Center — Date */}
        <div className="hidden md:flex items-center gap-3 text-xs font-mono">
          <span className="text-[--color-muted]">DATA:</span>
          <span className="text-amber-400 font-bold">{latest_date || "—"}</span>
          <span className="text-[--color-muted]">|</span>
          <span className="text-cyan-400 font-bold tabular-nums">{time}</span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <div className={cn("hidden sm:flex items-center gap-1.5 text-xs px-2 py-1 rounded border",
            isMock ? "text-amber-400 border-amber-400/20 bg-amber-400/5" : "text-emerald-400 border-emerald-400/20 bg-emerald-400/5"
          )}>
            {isMock ? <WifiOff size={10} /> : <Wifi size={10} />}
            <span>{isMock ? "DEMO" : "LIVE"}</span>
          </div>
          <button onClick={onTVToggle} className={cn("p-1.5 rounded border text-xs transition-colors", tvMode ? "text-violet-400 border-violet-400/30 bg-violet-400/10" : "text-[--color-muted] border-[--color-border] hover:text-cyan-400")}>
            <Tv2 size={13} />
          </button>
          <button onClick={onRefresh} disabled={loading} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-cyan-400/20 bg-cyan-400/8 text-cyan-400 text-xs hover:bg-cyan-400/15 disabled:opacity-50 transition-colors">
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>
    </header>
  );
}
