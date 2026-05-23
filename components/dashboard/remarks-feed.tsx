"use client";
import { MessageSquare } from "lucide-react";

interface Remark { line: string; hour: string; qi: string; text: string; date: string; }

export default function RemarksFeed({ remarks }: { remarks: Remark[] }) {
  if (!remarks.length) return null;
  return (
    <div className="glow-card rounded-xl border border-[--color-border] bg-[--color-card]">
      <div className="px-4 py-3 border-b border-[--color-border] flex items-center gap-2">
        <MessageSquare size={13} className="text-cyan-400" />
        <h3 className="text-sm font-bold font-[var(--font-display)] text-slate-200">Field Remarks</h3>
        <span className="text-xs text-[--color-muted] ml-1">{remarks.length} notes</span>
      </div>
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {remarks.map((r, i) => (
          <div key={i} className="rounded-lg border border-[--color-border] bg-[--color-surface] p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-cyan-400">{r.line}</span>
              <span className="text-xs text-[--color-muted]">{r.hour}</span>
              <span className="text-xs text-violet-400 ml-auto">{r.qi}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
