"use client";
import { useState, useMemo } from "react";
import {
  useReactTable, getCoreRowModel, getPaginationRowModel,
  getSortedRowModel, flexRender, ColumnDef, SortingState,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, ChevronsUpDown, ChevronUp, ChevronDown, X } from "lucide-react";
import { FinishingRow } from "@/lib/types";
import { cn } from "@/lib/utils";

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  if (!sorted) return <ChevronsUpDown size={11} className="text-[--color-muted]" />;
  return sorted === "asc" ? <ChevronUp size={11} className="text-cyan-400" /> : <ChevronDown size={11} className="text-cyan-400" />;
}

type EnrichedRow = FinishingRow & { _dhu: number; _target: number; _isPass: boolean };

export default function FinishingTable({ data }: { data: FinishingRow[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // DHU% already converted to percent by parser
  const enriched: EnrichedRow[] = useMemo(() => data.map(r => {
    const dhu = Number(r.DHU_Pct ?? 0) || (Number(r.Inspected_Qty) > 0 ? (Number(r.Defectives_gmts) / Number(r.Inspected_Qty)) * 100 : 0);
    const target = Number(r.Target_DHU_Pct ?? 3.0);
    return { ...r, _dhu: +dhu.toFixed(2), _target: target, _isPass: dhu <= target };
  }), [data]);

  const filtered = useMemo(() => enriched.filter(r => {
    if (statusFilter === "Pass" && !r._isPass) return false;
    if (statusFilter === "Fail" && r._isPass) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        String(r.AO_Number ?? "").toLowerCase().includes(q) ||
        String(r.Style_No ?? "").toLowerCase().includes(q) ||
        String(r.Line_No ?? "").toLowerCase().includes(q) ||
        String(r.Buyer ?? "").toLowerCase().includes(q) ||
        String(r.Color ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  }), [enriched, statusFilter, search]);

  const columns = useMemo<ColumnDef<EnrichedRow>[]>(() => [
    { accessorKey: "Date", header: "Date",
      cell: ({ getValue }) => <span className="text-xs font-mono text-[--color-muted]">{String(getValue() ?? "—")}</span> },
    { accessorKey: "Unit_No", header: "Unit",
      cell: ({ getValue }) => <span className="font-mono text-xs text-cyan-400">U{getValue() as number}</span> },
    { accessorKey: "Line_No", header: "Line",
      cell: ({ getValue }) => <span className="font-bold text-cyan-400 font-mono text-xs">{String(getValue() ?? "—")}</span> },
    { accessorKey: "AO_Number", header: "AO / Style",
      cell: ({ row }) => <div><p className="text-xs font-mono text-cyan-400">{row.original.AO_Number}</p><p className="text-xs text-[--color-muted]">{row.original.Style_No}</p></div> },
    { accessorKey: "Buyer", header: "Buyer",
      cell: ({ getValue }) => <span className="text-xs text-violet-400">{String(getValue() ?? "—")}</span> },
    { accessorKey: "Color", header: "Color",
      cell: ({ getValue }) => <span className="text-xs text-slate-400">{String(getValue() ?? "—")}</span> },
    { accessorKey: "Inspected_Qty", header: "Inspected",
      cell: ({ getValue }) => <span className="font-mono text-xs text-slate-300">{Number(getValue() ?? 0).toLocaleString()}</span> },
    { accessorKey: "Defectives_gmts", header: "Defects",
      cell: ({ getValue }) => <span className="font-mono text-xs text-red-400 font-bold">{String(getValue() ?? 0)}</span> },
    { id: "dhu", header: "DHU%",
      cell: ({ row }) => {
        const v = row.original._dhu;
        const c = v > 4 ? "text-red-400" : v > 2.5 ? "text-amber-400" : "text-emerald-400";
        return <span className={cn("font-mono font-bold text-sm", c)}>{v.toFixed(2)}%</span>;
      }},
    { id: "status", header: "Status",
      cell: ({ row }) => {
        const p = row.original._isPass;
        return <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full border",
          p ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30" : "text-red-400 bg-red-400/10 border-red-400/30")}>
          {p ? "✓ Pass" : "✗ Fail"}</span>;
      }},
    { accessorKey: "Vs_Target_Pct", header: "Vs Target",
      cell: ({ getValue }) => {
        const v = Number(getValue() ?? 0);
        return <span className={cn("font-mono text-xs font-bold", v > 0 ? "text-red-400" : "text-emerald-400")}>
          {v > 0 ? "+" : ""}{v.toFixed(2)}%</span>;
      }},
    { accessorKey: "Remarks", header: "Action",
      cell: ({ getValue }) => <span className="text-xs text-[--color-muted]">{String(getValue() ?? "—")}</span> },
  ], []);

  const table = useReactTable({
    data: filtered, columns,
    state: { sorting, pagination: { pageIndex: 0, pageSize: 10 } },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const passCount = enriched.filter(r => r._isPass).length;

  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-[--color-border]">
        <div>
          <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200">Finishing DHU Records</h3>
          <p className="text-xs text-[--color-muted] mt-0.5">
            <span className="text-emerald-400 font-bold">{passCount} Pass</span>{" · "}
            <span className="text-red-400 font-bold">{data.length - passCount} Fail</span>{" · "}{data.length} total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[--color-muted]" />
            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-7 pr-6 py-1.5 text-xs rounded-lg bg-[--color-surface] border border-[--color-border] text-slate-200 placeholder:text-[--color-muted] focus:outline-none focus:border-cyan-400/50 w-36" />
            {search && <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-[--color-muted]"><X size={10} /></button>}
          </div>
          <div className="flex gap-1">
            {["All", "Pass", "Fail"].map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={cn("px-2 py-1.5 text-xs rounded-lg border font-mono transition-colors",
                  statusFilter === s
                    ? s === "Pass" ? "bg-emerald-400/15 text-emerald-400 border-emerald-400/40"
                      : s === "Fail" ? "bg-red-400/15 text-red-400 border-red-400/40"
                      : "bg-cyan-400/15 text-cyan-400 border-cyan-400/40"
                    : "bg-[--color-surface] text-[--color-muted] border-[--color-border]")}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="border-b border-[--color-border]/50">
                {hg.headers.map(h => (
                  <th key={h.id} onClick={h.column.getToggleSortingHandler()}
                    className="px-3 py-2.5 text-left text-xs font-medium text-[--color-muted] uppercase tracking-wider whitespace-nowrap cursor-pointer hover:text-cyan-400 transition-colors">
                    <div className="flex items-center gap-1">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      <SortIcon sorted={h.column.getIsSorted()} />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className={cn("data-row border-b border-[--color-border]/30", !row.original._isPass && row.original._dhu > 4 && "bg-red-500/5")}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-3 py-2.5 whitespace-nowrap">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <tr><td colSpan={columns.length} className="px-4 py-8 text-center text-xs text-[--color-muted]">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-4 py-3 border-t border-[--color-border]">
        <span className="text-xs text-[--color-muted]">Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}</span>
        <div className="flex gap-1">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded text-[--color-muted] hover:text-cyan-400 disabled:opacity-30 transition-colors"><ChevronLeft size={13} /></button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 rounded text-[--color-muted] hover:text-cyan-400 disabled:opacity-30 transition-colors"><ChevronRight size={13} /></button>
        </div>
      </div>
    </div>
  );
}
