import {
  HourlyQualityRow, FinishingRow, DefectLog, LineDHU,
  ControllerPerf, FloorICPerf, DefectCount, HourlyTrend,
  DashboardKPIs, DashboardData, LineMapping, AOStyleMaster, DefectMaster
} from "./types";

const n = (v: unknown): number => { const x = Number(v); return isNaN(x) ? 0 : x; };
const s = (v: unknown): string =>
  v == null || String(v).trim() === "nan" ? "" : String(v).trim();

export function getDHUStatus(dhu: number): "critical" | "warning" | "good" {
  if (dhu > 4) return "critical";
  if (dhu > 2.5) return "warning";
  return "good";
}

export function parseSheetRows<T>(rows: string[][]): T[] {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0].map(h => s(h).replace(/\s+$/, "")); // trim trailing spaces
  return rows.slice(1)
    .filter(row => row.some(v => v != null && String(v).trim() !== ""))
    .map(row => {
      const obj: Record<string, unknown> = {};
      headers.forEach((key, i) => {
        if (!key) return;
        const val = row[i];
        const str = s(val);
        if (str === "" || str === "NaN") obj[key] = null;
        else if (!isNaN(Number(str))) obj[key] = Number(str);
        else obj[key] = str;
      });
      return obj as T;
    });
}

export function computeDashboard(
  hourlyRaw: HourlyQualityRow[],
  defectLog: DefectLog[],
  finishingRaw: FinishingRow[],
  lineMapping: LineMapping[],
  aoStyles: AOStyleMaster[],
  defectMaster: DefectMaster[]
): DashboardData {

  const defectCatMap = new Map(
    defectMaster.map(d => [s(d.Defect_Name).toLowerCase(), s(d.Category)])
  );

  // ── Dates ──────────────────────────────────────────────────
  const dates = [...new Set(hourlyRaw.map(r => s(r.Date)).filter(Boolean))].sort();
  const latest_date = dates[dates.length - 1] ?? "";
  const today = hourlyRaw.filter(r => s(r.Date) === latest_date);
  const todayDefects = defectLog.filter(r => s(r.Date) === latest_date);

  // Defect lookup by HQ_Row_ID
  const defectByHQ = new Map<string, DefectLog[]>();
  for (const d of defectLog) {
    const key = s(d.HQ_Row_ID); if (!key) continue;
    const arr = defectByHQ.get(key) ?? [];
    arr.push(d); defectByHQ.set(key, arr);
  }

  // ── KPIs ───────────────────────────────────────────────────
  const total_checked      = today.reduce((a, r) => a + n(r.Quality_Checked), 0);
  const total_defects      = today.reduce((a, r) => a + n(r.Defectives_gmts), 0);
  const total_prod_target  = today.reduce((a, r) => a + n(r.Prod_Target_Hr), 0);
  const total_prod_actual  = today.reduce((a, r) => a + n(r.Prod_Actual), 0);
  const total_balance      = today.reduce((a, r) => a + n(r.Table_Balance_Prev), 0);
  const fin_defects        = finishingRaw.reduce((a, r) => a + n(r.Defectives_gmts), 0);
  const fin_inspected      = finishingRaw.reduce((a, r) => a + n(r.Inspected_Qty), 0);

  // ── Line DHU ───────────────────────────────────────────────
  type Acc = { chk:number; def:number; pt:number; pa:number; bal:number; defMap:Map<string,number> };
  const lineAcc = new Map<string, Acc>();
  for (const r of today) {
    const k = s(r.Line_No); if (!k) continue;
    const a = lineAcc.get(k) ?? { chk:0,def:0,pt:0,pa:0,bal:0,defMap:new Map() };
    a.chk += n(r.Quality_Checked);
    a.def += n(r.Defectives_gmts);
    a.pt  += n(r.Prod_Target_Hr);
    a.pa  += n(r.Prod_Actual);
    a.bal += n(r.Table_Balance_Prev);
    for (const d of defectByHQ.get(s(r.Row_ID)) ?? []) {
      const dn = s(d.Defect_Name);
      a.defMap.set(dn, (a.defMap.get(dn) ?? 0) + n(d.Defect_Qty));
    }
    lineAcc.set(k, a);
  }

  const lmByLine = new Map(lineMapping.map(l => [s(l.Line_No), l]));
  const lineDHU: LineDHU[] = Array.from(lineAcc.entries()).map(([line, a]) => {
    const lm = lmByLine.get(line);
    const dhu = a.chk > 0 ? (a.def / a.chk) * 100 : 0;
    const top = [...a.defMap.entries()].sort((x, y) => y[1] - x[1])[0];
    return {
      Line_No: line, Unit_No: n(lm?.Unit_No),
      LQ_Name: s(lm?.LQ_Name) || "—",
      Controller_Name: s(lm?.Controller_Name) || "—",
      Floor_IC_Name: s(lm?.Floor_IC_Name) || "—",
      Total_Checked: a.chk, Total_Defects: a.def,
      DHU_Pct: +dhu.toFixed(2),
      Prod_Target: a.pt, Prod_Actual: a.pa,
      Prod_Eff: a.pt > 0 ? +((a.pa / a.pt) * 100).toFixed(1) : 0,
      Table_Balance: a.bal,
      Top_Defect: top?.[0] ?? "—",
      Status: getDHUStatus(dhu),
    };
  }).sort((a, b) => b.DHU_Pct - a.DHU_Pct);

  // ── Controller Perf ────────────────────────────────────────
  const ctrlAcc = new Map<string, {id:number;lines:string[];chk:number;def:number}>();
  for (const lm of lineMapping) {
    const k = s(lm.Controller_Name); if (!k) continue;
    const c = ctrlAcc.get(k) ?? {id:n(lm.Controller_ID),lines:[],chk:0,def:0};
    const ln = s(lm.Line_No);
    if (!c.lines.includes(ln)) c.lines.push(ln);
    const a = lineAcc.get(ln);
    if (a) { c.chk += a.chk; c.def += a.def; }
    ctrlAcc.set(k, c);
  }
  const controllerPerf: ControllerPerf[] = Array.from(ctrlAcc.entries())
    .map(([name, c]) => {
      const dhu = c.chk > 0 ? +((c.def/c.chk)*100).toFixed(2) : 0;
      return {Controller_ID:c.id,Controller_Name:name,Lines:c.lines.sort(),
              Total_Checked:c.chk,Total_Defects:c.def,DHU_Pct:dhu,Rank:0,Status:getDHUStatus(dhu)};
    })
    .sort((a,b) => a.DHU_Pct - b.DHU_Pct)
    .map((c,i) => ({...c, Rank:i+1}));

  // ── Floor IC Perf ──────────────────────────────────────────
  const ficAcc = new Map<string, {id:number;lines:string[];chk:number;def:number}>();
  for (const lm of lineMapping) {
    const k = s(lm.Floor_IC_Name); if (!k) continue;
    const c = ficAcc.get(k) ?? {id:n(lm.Floor_IC_ID),lines:[],chk:0,def:0};
    const ln = s(lm.Line_No);
    if (!c.lines.includes(ln)) c.lines.push(ln);
    const a = lineAcc.get(ln);
    if (a) { c.chk += a.chk; c.def += a.def; }
    ficAcc.set(k, c);
  }
  const floorICPerf: FloorICPerf[] = Array.from(ficAcc.entries())
    .map(([name, c]) => {
      const dhu = c.chk > 0 ? +((c.def/c.chk)*100).toFixed(2) : 0;
      return {Floor_IC_ID:c.id,Floor_IC_Name:name,Lines:c.lines.sort(),
              Total_Checked:c.chk,Total_Defects:c.def,DHU_Pct:dhu,Rank:0,Status:getDHUStatus(dhu)};
    })
    .sort((a,b) => a.DHU_Pct - b.DHU_Pct)
    .map((c,i) => ({...c, Rank:i+1}));

  // ── Defect Breakdown ───────────────────────────────────────
  const defTotals = new Map<string,{qty:number;cat:string}>();
  for (const d of todayDefects) {
    const name = s(d.Defect_Name); if (!name) continue;
    const cur = defTotals.get(name) ?? {qty:0, cat: s(d.Defect_Category)||defectCatMap.get(name.toLowerCase())||"Other"};
    cur.qty += n(d.Defect_Qty);
    defTotals.set(name, cur);
  }
  const totalQty = Array.from(defTotals.values()).reduce((a,b)=>a+b.qty,0)||1;
  const defectBreakdown: DefectCount[] = Array.from(defTotals.entries())
    .map(([name,{qty,cat}]) => ({name,qty,category:cat,pct:+((qty/totalQty)*100).toFixed(1)}))
    .sort((a,b)=>b.qty-a.qty).slice(0,12);

  // ── Hourly Trend ───────────────────────────────────────────
  const hrAcc = new Map<string,{pt:number;pa:number;qc:number;def:number;bal:number}>();
  for (const r of today) {
    const k = s(r.Hour_Slot); if (!k) continue;
    const a = hrAcc.get(k) ?? {pt:0,pa:0,qc:0,def:0,bal:0};
    a.pt+=n(r.Prod_Target_Hr); a.pa+=n(r.Prod_Actual);
    a.qc+=n(r.Quality_Checked); a.def+=n(r.Defectives_gmts);
    a.bal+=n(r.Table_Balance_Prev);
    hrAcc.set(k,a);
  }
  const hourlyTrend: HourlyTrend[] = Array.from(hrAcc.entries())
    .sort((a,b)=>a[0].localeCompare(b[0]))
    .map(([hour,a]) => ({
      hour, prod_target:a.pt, prod_actual:a.pa,
      quality_checked:a.qc, defects:a.def,
      dhu:a.qc>0?+((a.def/a.qc)*100).toFixed(2):0, balance:a.bal,
    }));

  // ── Remarks ────────────────────────────────────────────────
  const remarks = today
    .filter(r => s(r.Remarks))
    .map(r => ({line:s(r.Line_No),hour:s(r.Hour_Slot),qi:s(r.QI_Name),text:s(r.Remarks),date:s(r.Date)}));

  const kpis: DashboardKPIs = {
    overall_dhu:   total_checked>0?+((total_defects/total_checked)*100).toFixed(2):0,
    total_defects, total_checked, total_prod_target, total_prod_actual,
    prod_eff:      total_prod_target>0?+((total_prod_actual/total_prod_target)*100).toFixed(1):0,
    total_balance,
    finishing_dhu: fin_inspected>0?+((fin_defects/fin_inspected)*100).toFixed(2):0,
    active_lines:  lineAcc.size,
    critical_lines:lineDHU.filter(l=>l.Status==="critical").length,
    dates, latest_date,
  };

  return {kpis,lineDHU,controllerPerf,floorICPerf,defectBreakdown,
          hourlyTrend,hourlyRaw:today,finishingRaw,aoStyles,lineMapping,remarks};
}
