import { HourlyQualityRow, DefectLog, FinishingRow, LineMapping, AOStyleMaster, DefectMaster } from "./types";

export const MOCK_HOURLY: HourlyQualityRow[] = [
  {Row_ID:"HQ-001",Timestamp:"2026-05-20 08:35",Date:"2026-05-20",Hour_Slot:"08:00-09:00",Unit_No:1,Line_No:"L01",Buyer:"H&M",AO_Number:"AO-2401",Style_No:"STY-100",Color:"Navy",User_ID:4907,User_Name:"Shila",Prod_Target_Hr:100,Prod_Actual:84,Table_Balance_Prev:41,Quality_Target_Hr:100,Quality_Checked:68,Defectives_gmts:9,Defect_Qty:12,Remarks:""},
  {Row_ID:"HQ-002",Timestamp:"2026-05-20 08:35",Date:"2026-05-20",Hour_Slot:"08:00-09:00",Unit_No:1,Line_No:"L02",Buyer:"Zara",AO_Number:"AO-2402",Style_No:"STY-101",Color:"Black",User_ID:4908,User_Name:"Rekha",Prod_Target_Hr:100,Prod_Actual:91,Table_Balance_Prev:29,Quality_Target_Hr:100,Quality_Checked:80,Defectives_gmts:5,Defect_Qty:8,Remarks:"Machine issue"},
  {Row_ID:"HQ-003",Timestamp:"2026-05-20 08:35",Date:"2026-05-20",Hour_Slot:"08:00-09:00",Unit_No:1,Line_No:"L03",Buyer:"Next",AO_Number:"AO-2403",Style_No:"STY-102",Color:"White",User_ID:4909,User_Name:"Sajib",Prod_Target_Hr:100,Prod_Actual:75,Table_Balance_Prev:58,Quality_Target_Hr:100,Quality_Checked:72,Defectives_gmts:7,Defect_Qty:9,Remarks:"High balance"},
  {Row_ID:"HQ-004",Timestamp:"2026-05-20 09:10",Date:"2026-05-20",Hour_Slot:"09:00-10:00",Unit_No:1,Line_No:"L01",Buyer:"H&M",AO_Number:"AO-2401",Style_No:"STY-100",Color:"Navy",User_ID:4907,User_Name:"Shila",Prod_Target_Hr:100,Prod_Actual:88,Table_Balance_Prev:35,Quality_Target_Hr:100,Quality_Checked:82,Defectives_gmts:3,Defect_Qty:3,Remarks:""},
  {Row_ID:"HQ-005",Timestamp:"2026-05-20 09:10",Date:"2026-05-20",Hour_Slot:"09:00-10:00",Unit_No:1,Line_No:"L04",Buyer:"Primark",AO_Number:"AO-2404",Style_No:"STY-103",Color:"Red",User_ID:4910,User_Name:"Monir",Prod_Target_Hr:80,Prod_Actual:78,Table_Balance_Prev:12,Quality_Target_Hr:80,Quality_Checked:76,Defectives_gmts:1,Defect_Qty:1,Remarks:""},
  {Row_ID:"HQ-006",Timestamp:"2026-05-20 09:45",Date:"2026-05-20",Hour_Slot:"09:00-10:00",Unit_No:2,Line_No:"L08",Buyer:"Target",AO_Number:"AO-2408",Style_No:"STY-107",Color:"Olive",User_ID:4960,User_Name:"Karim",Prod_Target_Hr:90,Prod_Actual:82,Table_Balance_Prev:44,Quality_Target_Hr:90,Quality_Checked:75,Defectives_gmts:6,Defect_Qty:8,Remarks:"Fabric issue"},
  {Row_ID:"HQ-007",Timestamp:"2026-05-20 09:45",Date:"2026-05-20",Hour_Slot:"09:00-10:00",Unit_No:2,Line_No:"L09",Buyer:"Gap",AO_Number:"AO-2409",Style_No:"STY-108",Color:"Beige",User_ID:4961,User_Name:"Nasreen",Prod_Target_Hr:100,Prod_Actual:96,Table_Balance_Prev:8,Quality_Target_Hr:100,Quality_Checked:94,Defectives_gmts:1,Defect_Qty:1,Remarks:""},
  {Row_ID:"HQ-050",Timestamp:"2026-05-19 08:35",Date:"2026-05-19",Hour_Slot:"08:00-09:00",Unit_No:1,Line_No:"L01",Buyer:"H&M",AO_Number:"AO-2401",Style_No:"STY-100",Color:"Navy",User_ID:4907,User_Name:"Shila",Prod_Target_Hr:100,Prod_Actual:90,Table_Balance_Prev:20,Quality_Target_Hr:100,Quality_Checked:85,Defectives_gmts:3,Defect_Qty:4,Remarks:""},
  {Row_ID:"HQ-051",Timestamp:"2026-05-19 08:35",Date:"2026-05-19",Hour_Slot:"08:00-09:00",Unit_No:1,Line_No:"L02",Buyer:"Zara",AO_Number:"AO-2402",Style_No:"STY-101",Color:"Black",User_ID:4908,User_Name:"Rekha",Prod_Target_Hr:100,Prod_Actual:88,Table_Balance_Prev:18,Quality_Target_Hr:100,Quality_Checked:82,Defectives_gmts:4,Defect_Qty:5,Remarks:""},
];

export const MOCK_DEFECT_LOG: DefectLog[] = [
  {Log_ID:"DL-001",HQ_Row_ID:"HQ-001",Date:"2026-05-20",Unit_No:1,Line_No:"L01",Hour_Slot:"08:00-09:00",Defect_Name:"Broken Stitch",Defect_Qty:5,Defect_Category:"Major"},
  {Log_ID:"DL-002",HQ_Row_ID:"HQ-001",Date:"2026-05-20",Unit_No:1,Line_No:"L01",Hour_Slot:"08:00-09:00",Defect_Name:"Open Seam",Defect_Qty:3,Defect_Category:"Major"},
  {Log_ID:"DL-003",HQ_Row_ID:"HQ-001",Date:"2026-05-20",Unit_No:1,Line_No:"L01",Hour_Slot:"08:00-09:00",Defect_Name:"Raw Edge",Defect_Qty:4,Defect_Category:"Major"},
  {Log_ID:"DL-004",HQ_Row_ID:"HQ-002",Date:"2026-05-20",Unit_No:1,Line_No:"L02",Hour_Slot:"08:00-09:00",Defect_Name:"Skip Stitch",Defect_Qty:3,Defect_Category:"Major"},
  {Log_ID:"DL-005",HQ_Row_ID:"HQ-002",Date:"2026-05-20",Unit_No:1,Line_No:"L02",Hour_Slot:"08:00-09:00",Defect_Name:"Puckering",Defect_Qty:2,Defect_Category:"Minor"},
  {Log_ID:"DL-006",HQ_Row_ID:"HQ-003",Date:"2026-05-20",Unit_No:1,Line_No:"L03",Hour_Slot:"08:00-09:00",Defect_Name:"Uneven Stitch",Defect_Qty:4,Defect_Category:"Major"},
  {Log_ID:"DL-007",HQ_Row_ID:"HQ-003",Date:"2026-05-20",Unit_No:1,Line_No:"L03",Hour_Slot:"08:00-09:00",Defect_Name:"Raw Edge",Defect_Qty:3,Defect_Category:"Major"},
  {Log_ID:"DL-008",HQ_Row_ID:"HQ-004",Date:"2026-05-20",Unit_No:1,Line_No:"L01",Hour_Slot:"09:00-10:00",Defect_Name:"Broken Stitch",Defect_Qty:3,Defect_Category:"Major"},
  {Log_ID:"DL-009",HQ_Row_ID:"HQ-005",Date:"2026-05-20",Unit_No:1,Line_No:"L04",Hour_Slot:"09:00-10:00",Defect_Name:"Skip Stitch",Defect_Qty:1,Defect_Category:"Major"},
  {Log_ID:"DL-010",HQ_Row_ID:"HQ-006",Date:"2026-05-20",Unit_No:2,Line_No:"L08",Hour_Slot:"09:00-10:00",Defect_Name:"Fabric Damage",Defect_Qty:4,Defect_Category:"Critical"},
  {Log_ID:"DL-011",HQ_Row_ID:"HQ-006",Date:"2026-05-20",Unit_No:2,Line_No:"L08",Hour_Slot:"09:00-10:00",Defect_Name:"Broken Stitch",Defect_Qty:2,Defect_Category:"Major"},
  {Log_ID:"DL-012",HQ_Row_ID:"HQ-007",Date:"2026-05-20",Unit_No:2,Line_No:"L09",Hour_Slot:"09:00-10:00",Defect_Name:"Skip Stitch",Defect_Qty:1,Defect_Category:"Major"},
];

export const MOCK_FINISHING: FinishingRow[] = [
  {FD_Row_ID:"FD-001",Date:"2026-05-20",Unit_No:1,Line_No:"L01",AO_Number:"AO-2401",Style_No:"STY-100",Buyer:"H&M",Color:"Navy",Inspected_Qty:327,Defectives_gmts:12,DHU_Pct:3.67,Target_DHU_Pct:3.0,Vs_Target_Pct:0.67,Remarks:"Blade check needed"},
  {FD_Row_ID:"FD-002",Date:"2026-05-20",Unit_No:1,Line_No:"L02",AO_Number:"AO-2402",Style_No:"STY-101",Buyer:"Zara",Color:"Black",Inspected_Qty:459,Defectives_gmts:23,DHU_Pct:5.01,Target_DHU_Pct:3.0,Vs_Target_Pct:2.01,Remarks:"Lot separation"},
  {FD_Row_ID:"FD-003",Date:"2026-05-20",Unit_No:1,Line_No:"L03",AO_Number:"AO-2403",Style_No:"STY-102",Buyer:"Next",Color:"White",Inspected_Qty:612,Defectives_gmts:8,DHU_Pct:1.31,Target_DHU_Pct:3.0,Vs_Target_Pct:-1.69,Remarks:"Good"},
  {FD_Row_ID:"FD-004",Date:"2026-05-20",Unit_No:2,Line_No:"L08",AO_Number:"AO-2408",Style_No:"STY-107",Buyer:"Target",Color:"Olive",Inspected_Qty:445,Defectives_gmts:29,DHU_Pct:6.52,Target_DHU_Pct:3.5,Vs_Target_Pct:3.02,Remarks:"Critical - fabric"},
];

export const MOCK_LINE_MAPPING: LineMapping[] = [
  {Unit_No:1,Line_No:"L01",LQ_ID:4889,LQ_Name:"Monir",Controller_ID:4931,Controller_Name:"Kamrul",Floor_IC_ID:4936,Floor_IC_Name:"Abul"},
  {Unit_No:1,Line_No:"L02",LQ_ID:4890,LQ_Name:"Alamgir",Controller_ID:4931,Controller_Name:"Kamrul",Floor_IC_ID:4936,Floor_IC_Name:"Abul"},
  {Unit_No:1,Line_No:"L03",LQ_ID:4891,LQ_Name:"Sajib",Controller_ID:4931,Controller_Name:"Kamrul",Floor_IC_ID:4936,Floor_IC_Name:"Abul"},
  {Unit_No:1,Line_No:"L04",LQ_ID:4892,LQ_Name:"Liton",Controller_ID:4932,Controller_Name:"Shafiq",Floor_IC_ID:4936,Floor_IC_Name:"Abul"},
  {Unit_No:2,Line_No:"L08",LQ_ID:4960,LQ_Name:"Jamal",Controller_ID:4933,Controller_Name:"Mahbub",Floor_IC_ID:4937,Floor_IC_Name:"Khaled"},
  {Unit_No:2,Line_No:"L09",LQ_ID:4961,LQ_Name:"Karim",Controller_ID:4933,Controller_Name:"Mahbub",Floor_IC_ID:4937,Floor_IC_Name:"Khaled"},
];

export const MOCK_AO: AOStyleMaster[] = [
  {Unit_No:1,Line_No:"L01",AO_Number:"AO-2401",Style_No:"STY-100",Buyer:"H&M",Color:"Navy",Garment_Type:"T-Shirt",Order_Qty:10999,Status:"Active"},
  {Unit_No:1,Line_No:"L02",AO_Number:"AO-2402",Style_No:"STY-101",Buyer:"Zara",Color:"Black",Garment_Type:"Polo Shirt",Order_Qty:3475,Status:"Active"},
  {Unit_No:1,Line_No:"L03",AO_Number:"AO-2403",Style_No:"STY-102",Buyer:"Next",Color:"White",Garment_Type:"Trouser",Order_Qty:14864,Status:"Active"},
  {Unit_No:1,Line_No:"L04",AO_Number:"AO-2404",Style_No:"STY-103",Buyer:"Primark",Color:"Red",Garment_Type:"Jacket",Order_Qty:13195,Status:"Active"},
  {Unit_No:2,Line_No:"L08",AO_Number:"AO-2408",Style_No:"STY-107",Buyer:"Target",Color:"Olive",Garment_Type:"Hoodie",Order_Qty:8355,Status:"Active"},
  {Unit_No:2,Line_No:"L09",AO_Number:"AO-2409",Style_No:"STY-108",Buyer:"Gap",Color:"Beige",Garment_Type:"T-Shirt",Order_Qty:9906,Status:"Active"},
];

export const MOCK_DEFECT_MASTER: DefectMaster[] = [
  {Defect_Name:"Skip Stitch",Category:"Major"},{Defect_Name:"Open Seam",Category:"Major"},
  {Defect_Name:"Raw Edge",Category:"Major"},{Defect_Name:"Broken Stitch",Category:"Major"},
  {Defect_Name:"Uneven Stitch",Category:"Major"},{Defect_Name:"Puckering",Category:"Minor"},
  {Defect_Name:"Needle Hole",Category:"Major"},{Defect_Name:"Fabric Damage",Category:"Critical"},
  {Defect_Name:"Shade Variation",Category:"Critical"},{Defect_Name:"Dirty Mark",Category:"Minor"},
  {Defect_Name:"Button Issue",Category:"Minor"},{Defect_Name:"Oil Stain",Category:"Minor"},
  {Defect_Name:"Wrong Measurement",Category:"Critical"},{Defect_Name:"Hole",Category:"Critical"},
  {Defect_Name:"Spot",Category:"Minor"},
];
