"use client";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend, ReferenceLine, PieChart, Pie } from "recharts";
import { HourlyTrend, DefectCount } from "@/lib/types";

const TT = ({ active, payload, label }: { active?: boolean; payload?: {color:string;name:string;value:number}[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a1828] border border-[#142035] rounded-lg p-3 text-xs shadow-xl">
      <p className="text-slate-400 mb-2 font-medium">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex justify-between gap-4 mb-0.5">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="font-bold" style={{ color: p.color }}>{typeof p.value === "number" && p.value % 1 !== 0 ? p.value.toFixed(2) : p.value}</span>
        </div>
      ))}
    </div>
  );
};

export function HourlyChart({ data }: { data: HourlyTrend[] }) {
  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card] p-4">
      <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200 mb-4">Hourly Production vs Quality</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 0, right: 4, left: -20, bottom: 0 }} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="#142035" vertical={false} />
          <XAxis dataKey="hour" tick={{ fill: "#4a6080", fontSize: 9, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#4a6080", fontSize: 9, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
          <Tooltip content={<TT />} />
          <Legend wrapperStyle={{ fontSize: 10, color: "#4a6080" }} />
          <Bar dataKey="prod_actual" name="Production" fill="#6366f1" fillOpacity={0.8} radius={[2,2,0,0]} maxBarSize={14} />
          <Bar dataKey="quality_checked" name="QC Checked" fill="#22d3ee" fillOpacity={0.8} radius={[2,2,0,0]} maxBarSize={14} />
          <Bar dataKey="defects" name="Defects" fill="#ef4444" fillOpacity={0.9} radius={[2,2,0,0]} maxBarSize={14} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DHUTrendChart({ data }: { data: HourlyTrend[] }) {
  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card] p-4">
      <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200 mb-4">DHU% by Hour Slot</h3>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#142035" vertical={false} />
          <XAxis dataKey="hour" tick={{ fill: "#4a6080", fontSize: 9, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#4a6080", fontSize: 9, fontFamily: "DM Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
          <Tooltip content={<TT />} />
          <ReferenceLine y={2.5} stroke="#f59e0b" strokeDasharray="4 4" label={{ value:"Target", fill:"#f59e0b", fontSize:9, position:"right" }} />
          <Line type="monotone" dataKey="dhu" name="DHU%" stroke="#22d3ee" strokeWidth={2.5} dot={{ r: 3, fill: "#22d3ee" }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TableBalanceChart({ data }: { data: HourlyTrend[] }) {
  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card] p-4">
      <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200 mb-1">Table Balance (Pending)</h3>
      <p className="text-xs text-[--color-muted] mb-4">Carry-forward pressure per hour slot</p>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#142035" vertical={false} />
          <XAxis dataKey="hour" tick={{ fill: "#4a6080", fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#4a6080", fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip content={<TT />} />
          <Bar dataKey="balance" name="Pending pcs" radius={[3,3,0,0]} maxBarSize={18}>
            {data.map((d, i) => <Cell key={i} fill={d.balance > 50 ? "#ef4444" : d.balance > 20 ? "#f59e0b" : "#22c55e"} fillOpacity={0.8} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

const DEFECT_COLORS = ["#ef4444","#f59e0b","#22d3ee","#8b5cf6","#10b981","#f43f5e","#06b6d4","#a78bfa","#34d399","#fb923c","#60a5fa","#e879f9"];

export function DefectPieChart({ data }: { data: DefectCount[] }) {
  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card] p-4">
      <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200 mb-4">Defect Distribution</h3>
      <div className="flex gap-4">
        <ResponsiveContainer width="50%" height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="qty" paddingAngle={2}>
              {data.map((_, i) => <Cell key={i} fill={DEFECT_COLORS[i % DEFECT_COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v: number, n: string) => [`${v} pcs`, n]} contentStyle={{ background: "#0a1828", border: "1px solid #142035", borderRadius: 8, fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex-1 space-y-1.5 overflow-y-auto max-h-44">
          {data.map((d, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: DEFECT_COLORS[i % DEFECT_COLORS.length] }} />
                <span className="text-slate-300 truncate">{d.name}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 ml-1">
                <span className="text-[--color-muted]">{d.qty}</span>
                <span className="text-[--color-muted] w-8 text-right">{d.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DefectBarChart({ data }: { data: DefectCount[] }) {
  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card] p-4">
      <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200 mb-4">Top Defects by Qty</h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data.slice(0,10)} layout="vertical" margin={{ top: 0, right: 8, left: 4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#142035" horizontal={false} />
          <XAxis type="number" tick={{ fill: "#4a6080", fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" width={100} tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip content={<TT />} cursor={{ fill: "rgba(34,211,238,0.04)" }} />
          <Bar dataKey="qty" name="Quantity" radius={[0,3,3,0]} maxBarSize={14}>
            {data.slice(0,10).map((d, i) => <Cell key={i} fill={d.category === "Critical" ? "#ef4444" : d.category === "Major" ? "#f59e0b" : "#22d3ee"} fillOpacity={0.85} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex gap-3 mt-2 text-xs justify-center">
        <span className="text-red-400">● Critical</span>
        <span className="text-amber-400">● Major</span>
        <span className="text-cyan-400">● Minor</span>
      </div>
    </div>
  );
}
