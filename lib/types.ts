export interface QualityInfo {
  User_ID: number; User_Name: string; Role: string;
  Unit_No: number; Line_No: string; Contact: string; Status: string;
}
export interface LineMapping {
  Unit_No: number; Line_No: string; LQ_ID: number; LQ_Name: string;
  Controller_ID: number; Controller_Name: string;
  Floor_IC_ID: number; Floor_IC_Name: string;
}
export interface DefectMaster {
  Defect_Name: string; Category: string; Description?: string;
}
export interface AOStyleMaster {
  Unit_No: number; Line_No: string;
  AO_Number: string; Style_No: string; Buyer: string;
  Color: string; Garment_Type: string; Order_Qty: number;
  DHU_Target_Pct?: number; Finishing_DHU_Target_Pct?: number;
  Start_Date?: string; End_Date?: string;
  Status: string; Remarks?: string;
}
export interface HourlyQualityRow {
  Row_ID: string; Timestamp: string; Date: string; Hour_Slot: string;
  Unit_No: number; Line_No: string;
  Buyer: string; AO_Number: string; Style_No: string; Color: string;
  User_ID: number; User_Name: string;
  Prod_Target_Hr: number; Prod_Actual: number;
  Table_Balance_Prev: number; Quality_Target_Hr: number;
  Quality_Checked: number; Defectives_gmts: number; Defect_Qty: number;
  Remarks?: string; Data_Source?: string;
}
export interface DefectLog {
  Log_ID: string; HQ_Row_ID: string; Date: string;
  Unit_No: number; Line_No: string; Hour_Slot: string;
  Defect_Name: string; Defect_Qty: number; Defect_Category: string;
}
export interface FinishingRow {
  FD_Row_ID?: string; Date: string;
  Unit_No: number; Line_No: string;
  AO_Number: string; Style_No: string; Buyer: string; Color: string;
  Inspected_Qty: number; Defectives_gmts: number;
  DHU_Pct?: number; Target_DHU_Pct?: number; Vs_Target_Pct?: number;
  Remarks?: string;
}
export interface LineDHU {
  Line_No: string; Unit_No: number; LQ_Name: string;
  Controller_Name: string; Floor_IC_Name: string;
  Total_Checked: number; Total_Defects: number; DHU_Pct: number;
  Prod_Target: number; Prod_Actual: number; Prod_Eff: number;
  Table_Balance: number; Top_Defect: string;
  Status: "critical" | "warning" | "good";
}
export interface ControllerPerf {
  Controller_ID: number; Controller_Name: string; Lines: string[];
  Total_Checked: number; Total_Defects: number; DHU_Pct: number;
  Rank: number; Status: "critical" | "warning" | "good";
}
export interface FloorICPerf {
  Floor_IC_ID: number; Floor_IC_Name: string; Lines: string[];
  Total_Checked: number; Total_Defects: number; DHU_Pct: number;
  Rank: number; Status: "critical" | "warning" | "good";
}
export interface DefectCount {
  name: string; qty: number; category: string; pct: number;
}
export interface HourlyTrend {
  hour: string; prod_target: number; prod_actual: number;
  quality_checked: number; defects: number; dhu: number; balance: number;
}
export interface DashboardKPIs {
  overall_dhu: number; total_defects: number; total_checked: number;
  total_prod_target: number; total_prod_actual: number; prod_eff: number;
  total_balance: number; finishing_dhu: number;
  active_lines: number; critical_lines: number;
  dates: string[]; latest_date: string;
}
export interface DashboardData {
  kpis: DashboardKPIs;
  lineDHU: LineDHU[];
  controllerPerf: ControllerPerf[];
  floorICPerf: FloorICPerf[];
  defectBreakdown: DefectCount[];
  hourlyTrend: HourlyTrend[];
  hourlyRaw: HourlyQualityRow[];
  finishingRaw: FinishingRow[];
  aoStyles: AOStyleMaster[];
  lineMapping: LineMapping[];
  remarks: { line: string; hour: string; qi: string; text: string; date: string }[];
}
