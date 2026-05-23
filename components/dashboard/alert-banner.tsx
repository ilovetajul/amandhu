"use client";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";
import { LineDHU } from "@/lib/types";

export default function AlertBanner({ lines }: { lines: LineDHU[] }) {
  const [dismissed, setDismissed] = useState(false);
  const critical = lines.filter((l) => l.Status === "critical");
  if (!critical.length || dismissed) return null;
  return (
    <div className="critical-border rounded-lg border bg-red-500/8 p-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <AlertTriangle size={14} className="text-red-400 shrink-0 pulse" />
        <p className="text-xs text-red-300 truncate">
          <span className="font-bold text-red-400">CRITICAL DHU ALERT — </span>
          {critical.map((l) => `${l.Line_No} (${l.DHU_Pct.toFixed(2)}% · ${l.Top_Defect})`).join(" · ")}
        </p>
      </div>
      <button onClick={() => setDismissed(true)} className="text-red-400/50 hover:text-red-400 transition-colors">
        <X size={13} />
      </button>
    </div>
  );
}
