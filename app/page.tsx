"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { DashboardData } from "@/lib/types";
import Header from "@/components/dashboard/header";
import KPICards from "@/components/dashboard/kpi-cards";
import AlertBanner from "@/components/dashboard/alert-banner";
import FilterBar, { Filters } from "@/components/dashboard/filter-bar";
import LinePerformance from "@/components/dashboard/line-performance";
import { HourlyChart, DHUTrendChart, TableBalanceChart, DefectPieChart, DefectBarChart } from "@/components/dashboard/charts";
import { ControllerRanking, FloorICRanking } from "@/components/dashboard/ranking-tables";
import FinishingAnalysis from "@/components/dashboard/finishing-analysis";
import AOStyleTable from "@/components/dashboard/ao-style-table";
import RemarksFeed from "@/components/dashboard/remarks-feed";
import SectionLabel from "@/components/dashboard/section-label";

type ApiData = DashboardData & { source: string };

const DEFAULT_FILTERS: Filters = { unit: "All", search: "", status: "All", date: "All" };

export default function Dashboard() {
  const [data, setData]       = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [tvMode, setTvMode]   = useState(false);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  const fetchData = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/sheets", { cache: "no-store" });
      if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
      const json = await res.json() as unknown;
      if ((json as {error?: string}).error) throw new Error((json as {error: string}).error);
      setData(json as ApiData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);
  useEffect(() => { const t = setInterval(fetchData, 120_000); return () => clearInterval(t); }, [fetchData]);

  // Available units from line data
  const units = useMemo(() =>
    [...new Set(data?.lineDHU?.map(l => l.Unit_No) ?? [])].sort((a, b) => a - b)
  , [data]);

  // Filter hourly by date
  const filteredHourly = useMemo(() => {
    if (!data) return [];
    if (filters.date === "All") return data.hourlyRaw;
    return data.hourlyRaw.filter(r => String(r.Date) === filters.date);
  }, [data, filters.date]);

  // Loading
  if (loading && !data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#030b18]">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-1.5">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="w-1.5 rounded-full bg-cyan-400 pulse"
              style={{ height: `${10 + i * 4}px`, animationDelay: `${i * 0.12}s` }} />
          ))}
        </div>
        <p className="text-xs text-slate-500 tracking-widest uppercase font-mono">Loading Command Center…</p>
      </div>
    </div>
  );

  // Error
  if (error && !data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#030b18] px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto text-red-400 text-xl font-bold">!</div>
        <h2 className="text-slate-200 font-bold font-mono">Dashboard Error</h2>
        <p className="text-xs text-red-400 bg-red-400/8 border border-red-400/20 rounded-lg p-3 font-mono break-all">{error}</p>
        <button onClick={fetchData} className="px-4 py-2 text-xs rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/20 transition-colors font-mono">
          Retry
        </button>
      </div>
    </div>
  );

  if (!data) return null;

  return (
    <div className={tvMode ? "text-base" : ""}>
      <Header
        source={data.source}
        latest_date={data.kpis?.latest_date ?? ""}
        onRefresh={fetchData}
        loading={loading}
        tvMode={tvMode}
        onTVToggle={() => setTvMode(v => !v)}
      />

      <main className="max-w-screen-2xl mx-auto px-3 sm:px-4 py-4 space-y-4">

        {/* KPIs */}
        <KPICards kpis={data.kpis} />

        {/* Alert */}
        <AlertBanner lines={data.lineDHU ?? []} />

        {/* Global Filter Bar */}
        <SectionLabel label="Filters" />
        <FilterBar
          filters={filters}
          onChange={setFilters}
          units={units}
          dates={data.kpis?.dates ?? []}
        />

        {/* Line Performance */}
        <SectionLabel label="Line Performance" />
        <LinePerformance lines={data.lineDHU ?? []} filters={filters} />

        {/* Hourly Charts */}
        <SectionLabel label="Hourly Analytics" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <HourlyChart data={data.hourlyTrend ?? []} />
          <DHUTrendChart data={data.hourlyTrend ?? []} />
        </div>

        {/* Defect Analysis */}
        <SectionLabel label="Defect Analysis" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <DefectBarChart data={data.defectBreakdown ?? []} />
          <DefectPieChart data={data.defectBreakdown ?? []} />
        </div>

        {/* Table Balance */}
        <SectionLabel label="Table Balance & Backlog" />
        <TableBalanceChart data={data.hourlyTrend ?? []} />

        {/* Accountability */}
        <SectionLabel label="Accountability Rankings" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <ControllerRanking data={data.controllerPerf ?? []} />
          <FloorICRanking data={data.floorICPerf ?? []} />
        </div>

        {/* Finishing Analysis */}
        <SectionLabel label="Finishing DHU — Root Cause Analysis" />
        <FinishingAnalysis data={data.finishingRaw ?? []} lineMapping={data.lineMapping ?? []} />

        {/* AO / Style */}
        <SectionLabel label="AO / Style / Color" />
        <AOStyleTable aoStyles={data.aoStyles ?? []} hourly={filteredHourly} />

        {/* Remarks */}
        {(data.remarks?.length ?? 0) > 0 && (
          <>
            <SectionLabel label="Field Remarks" />
            <RemarksFeed remarks={data.remarks} />
          </>
        )}

        <div className="border-t border-[#142035] pt-4 pb-2 text-center text-xs text-slate-600 font-mono">
          Aman Tex Ltd. · Quality Command Center · AMANDHU v2.1
          <span className="mx-2">·</span>
          <span className={data.source?.includes("mock") ? "text-amber-400" : "text-emerald-400"}>
            {data.source?.includes("mock") ? "Demo Mode" : "Live Data"}
          </span>
        </div>
      </main>
    </div>
  );
}
