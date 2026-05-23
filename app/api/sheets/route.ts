import { NextResponse } from "next/server";
import { computeDashboard, parseSheetRows } from "@/lib/parser";
import { MOCK_HOURLY, MOCK_DEFECT_LOG, MOCK_FINISHING, MOCK_LINE_MAPPING, MOCK_AO, MOCK_DEFECT_MASTER } from "@/lib/mock-data";
import type { HourlyQualityRow, DefectLog, FinishingRow, LineMapping, AOStyleMaster, DefectMaster } from "@/lib/types";

export const revalidate = 60;

export async function GET() {
  const useMock =
    process.env.USE_MOCK_DATA === "true" ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_KEY ||
    !process.env.GOOGLE_SHEET_ID;

  let hourlyRaw: HourlyQualityRow[] = MOCK_HOURLY;
  let defectLog: DefectLog[]        = MOCK_DEFECT_LOG;
  let finishingRaw: FinishingRow[]  = MOCK_FINISHING;
  let lineMapping: LineMapping[]    = MOCK_LINE_MAPPING;
  let aoStyles: AOStyleMaster[]     = MOCK_AO;
  let defectMaster: DefectMaster[]  = MOCK_DEFECT_MASTER;
  let source = "mock";

  if (!useMock) {
    try {
      const { google } = await import("googleapis");
      const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      });
      const sheets = google.sheets({ version: "v4", auth });
      const id = process.env.GOOGLE_SHEET_ID!;

      const res = await sheets.spreadsheets.values.batchGet({
        spreadsheetId: id,
        ranges: [
          "Hourly_Quality_Data!A3:W",   // row 3 = real headers
          "Defect_Log!A2:H",
          "Finishing_DHU_Data!A2:M",
          "Line_Mapping!A2:H",
          "AO_Style_Master!A2:N",       // 14 columns now
          "Defect_Master!A2:C",
        ],
      });

      const [h, dl, f, lm, ao, dm] = res.data.valueRanges ?? [];
      hourlyRaw    = parseSheetRows<HourlyQualityRow>(h?.values  ?? []);
      defectLog    = parseSheetRows<DefectLog>(dl?.values        ?? []);
      finishingRaw = parseSheetRows<FinishingRow>(f?.values      ?? []);
      lineMapping  = parseSheetRows<LineMapping>(lm?.values      ?? []);
      aoStyles     = parseSheetRows<AOStyleMaster>(ao?.values    ?? []);
      defectMaster = parseSheetRows<DefectMaster>(dm?.values     ?? []);
      source = "sheets";
    } catch (err) {
      console.error("[API] Sheets error, using mock:", err);
      source = "mock_fallback";
    }
  }

  try {
    const dashboard = computeDashboard(
      hourlyRaw, defectLog, finishingRaw, lineMapping, aoStyles, defectMaster
    );
    return NextResponse.json(
      { ...dashboard, source },
      { headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Compute error";
    console.error("[API] computeDashboard failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
