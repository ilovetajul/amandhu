# DHU Analytics Dashboard

Real-time garment quality monitoring dashboard for **Aman Tex Ltd.** — built with Next.js 15, TypeScript, Tailwind CSS v4, Recharts, and TanStack Table. Data source: Google Sheets API.

---

## Features

- **KPI Cards** — Sewing DHU%, Finishing DHU%, Total Defects, Pass Rate, Active Orders, Active Staff
- **DHU Trend Chart** — Sewing vs Finishing DHU over time with target reference line
- **Defect Breakdown** — Top 10 defect types by frequency
- **Unit Performance** — Score and DHU comparison across all production units
- **Grade Distribution** — Staff rating breakdown (Excellent / Good / Average / Poor)
- **Performance Table** — Full staff performance with search, filter by grade/unit, sort, pagination
- **Finishing DHU Table** — Inspection results with Pass/Fail status, search, filter
- **Hourly Data Table** — All hourly QC records with search and pagination
- **Dark mode** — Default deep navy theme
- **Mobile responsive** — Works on phone, tablet, desktop
- **Google Sheets live data** — Auto-refresh every 5 minutes, falls back to mock data

---

## Quick Start (Termux / Local)

```bash
# Clone or extract project
cd dhu-dashboard

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Run with mock data (no Google Sheets needed)
npm run dev
```

Open http://localhost:3000

---

## Google Sheets Setup

### Step 1: Upload Data to Google Sheets

Upload your Excel file to Google Sheets. Make sure sheet tab names match exactly:
- `Hourly_Quality_Data`
- `Finishing_DHU_Data`
- `Performance_Summary`
- `AO_Style_Master`

### Step 2: Create Service Account

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g. "dhu-dashboard")
3. Enable **Google Sheets API**
4. Go to **IAM & Admin → Service Accounts**
5. Create a service account, download the JSON key
6. **Copy the service account email** (looks like `xxx@xxx.iam.gserviceaccount.com`)

### Step 3: Share Sheet with Service Account

In your Google Sheet → Share → paste the service account email → Viewer access

### Step 4: Configure Environment

Edit `.env.local`:

```env
# Paste the entire JSON key (minified to one line):
GOOGLE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Your Sheet ID from the URL:
# https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit
GOOGLE_SHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms

USE_MOCK_DATA=false
```

---

## Deploying to Vercel

### Method 1: GitHub + Vercel (Recommended for Termux)

```bash
# Initialize git
git init
git add .
git commit -m "feat: DHU analytics dashboard"

# Push to GitHub (create repo first on github.com)
git remote add origin https://github.com/ilovetajul/dhu-dashboard.git
git push -u origin main
```

Then on [vercel.com](https://vercel.com):
1. Import the GitHub repo
2. Add Environment Variables (paste from `.env.local`)
3. Deploy → Done!

### Method 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Environment Variables in Vercel

In Vercel Dashboard → Project → Settings → Environment Variables, add:
- `GOOGLE_SERVICE_ACCOUNT_KEY` — full JSON key (minified)
- `GOOGLE_SHEET_ID` — your sheet ID
- `USE_MOCK_DATA` — `false`

---

## Project Structure

```
dhu-dashboard/
├── app/
│   ├── layout.tsx          # Root layout, fonts
│   ├── page.tsx            # Main dashboard page
│   ├── globals.css         # Tailwind + custom design tokens
│   └── api/sheets/
│       └── route.ts        # Google Sheets API route (server-side)
├── components/
│   └── dashboard/
│       ├── header.tsx          # Sticky top header
│       ├── kpi-cards.tsx       # 6 animated KPI cards
│       ├── dhu-trend.tsx       # Line chart - DHU over time
│       ├── defect-breakdown.tsx # Bar chart - defect types
│       ├── unit-performance.tsx # Bar chart - unit comparison
│       ├── performance-table.tsx # TanStack Table - staff performance
│       ├── finishing-table.tsx  # TanStack Table - finishing DHU
│       └── hourly-table.tsx     # TanStack Table - hourly data
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   ├── utils.ts            # Utility functions
│   ├── google-sheets.ts    # Google Sheets API client
│   └── mock-data.ts        # Sample data for demo/fallback
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── .env.example
```

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 15.3 | App framework, API routes, SSR |
| React | 19 | UI components |
| TypeScript | 5 | Type safety |
| Tailwind CSS | 4 | Styling with @theme tokens |
| Recharts | 2.15 | DHU trend, defect, unit charts |
| TanStack Table | 8.21 | Sortable, filterable, paginated tables |
| googleapis | 148 | Google Sheets API v4 |
| Lucide React | 0.511 | Icons |
| next/font | built-in | Bricolage Grotesque + DM Mono fonts |

---

## Data Refresh

- API route `/api/sheets` has `revalidate = 300` (5 minutes)
- Manual refresh button in the header
- Falls back to mock data if Google Sheets is unavailable

---

## Customization

### Change Theme Colors
Edit `app/globals.css` under `@theme {}`:
```css
--color-primary: #22d3ee;  /* Change accent color */
--color-bg: #05091a;       /* Change background */
```

### Add New Sheet Tabs
In `lib/google-sheets.ts`, add to `ranges` array and parse in `DashboardData`.

### Change DHU Targets
In `components/dashboard/kpi-cards.tsx`, update the `sub` prop values.

---

*Aman Tex Ltd. Quality Department — DHU Analytics v1.0*
