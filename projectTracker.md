# CivicLoop Project Tracker

**Event:** PromptWars x ASTRA, "From Complaints to Action"  
**Source of Truth:** [AGENTS.md](file:///c:/Users/Vineeth%20D%20Souza/OneDrive/Desktop/NagrikAi/AGENTS.md), [PROJECT_BRIEF.md](file:///c:/Users/Vineeth%20D%20Souza/OneDrive/Desktop/NagrikAi/PROJECT_BRIEF.md), [ARCHITECTURE.md](file:///c:/Users/Vineeth%20D%20Souza/OneDrive/Desktop/NagrikAi/ARCHITECTURE.md), [DESIGN.md](file:///c:/Users/Vineeth%20D%20Souza/OneDrive/Desktop/NagrikAi/DESIGN.md)

---

## 1. Current Status & Executive Summary

- **Active Milestone:** Phase 1 Complete -> Transitioning to Phase 2.
- **Verification Status:**
  - `npm run typecheck`: **PASSING** (0 errors)
  - `npm run lint`: **PASSING** (0 errors, 0 warnings)
  - `npm run build`: **PASSING** (All 12 pages & API routes compiled successfully)
  - Dev server: **RUNNING** on `http://localhost:3000`
  - Health check: `GET /api/health` -> `{ ok: true, data: { ok: true, supabase: "not_configured" } }`

---

## 2. What Was Built & Updated in Phase 1 (Foundation)

1. **Project Scaffold & Dependencies:**
   - Next.js 16 (App Router) + React 19 + TypeScript (strict mode).
   - Tailwind CSS v4 wired to custom CSS variables (`--bg`, `--surface`, `--primary`, etc.).
   - Installed: `zod`, `@supabase/supabase-js`, `leaflet`, `react-leaflet`, `@types/leaflet`, `tsx`.
   - Scripts configured in `package.json`: `dev`, `build`, `lint`, `typecheck`, `seed`.
   - `.gitignore` configured to keep `.env*` private while retaining `.env.example`.

2. **Design Tokens & Theme System (`DESIGN.md`):**
   - Palette: White + Emerald Green theme.
   - Dark mode: Class-based (`.dark`), system preference detection, no-flash inline script in `src/app/layout.tsx`, toggle button in header, persisted in `localStorage`.
   - WCAG AA contrast colors and semantic priority colors (critical `#DC2626`, high `#EA580C`, medium `#D97706`, low `#16A34A`).

3. **App Shell & Layout:**
   - **`TopBar.tsx`**: CivicLoop logo, demo role switcher ("Citizen | Official", labelled "Demo mode (mocked login)"), theme toggle, automatic route switching when role changes.
   - **`Sidebar.tsx`**: Visible on desktop (`>= 768px`).
   - **`BottomTabBar.tsx`**: Mobile tab bar (`< 768px`) with touch targets >= 44px.
   - **`src/lib/store.tsx`**: Client context managing persisted role and theme.

4. **All App Routes Scaffolding (`ARCHITECTURE.md` section 3):**
   - `src/app/page.tsx` (redirects to `/report`)
   - `src/app/(citizen)/report/page.tsx`
   - `src/app/(citizen)/my-reports/page.tsx`
   - `src/app/(official)/dashboard/page.tsx`
   - `src/app/(official)/reports/[id]/page.tsx`
   - `src/app/(official)/insights/page.tsx`

5. **All API Routes Scaffolding:**
   - `src/app/api/health/route.ts`
   - `src/app/api/reports/route.ts` (GET / POST stubs)
   - `src/app/api/reports/[id]/route.ts`
   - `src/app/api/reports/[id]/status/route.ts`
   - `src/app/api/reports/[id]/assign/route.ts`
   - `src/app/api/clusters/route.ts`
   - `src/app/api/insights/brief/route.ts`

6. **Lib & Database Architecture:**
   - `src/lib/types.ts`: TypeScript contracts matching the DB schema.
   - `src/lib/config.ts`: Centralized thresholds, model names, weights, coordinates.
   - `src/lib/geo.ts`: Haversine distance calculation in meters.
   - `src/lib/landmarks.ts`: Mocked landmarks for proximity calculation.
   - `src/lib/db.ts`: Server-side Supabase client.
   - `src/lib/ai/*`: Stubs for `gemini.ts`, `understand.ts`, `embed.ts`, `duplicates.ts`, `priority.ts`, `clusters.ts`, `brief.ts`, `fallback.ts`.
   - `supabase/schema.sql`: Full DDL matching `ARCHITECTURE.md` Section 4.
   - `scripts/seed.ts`: Executable seed script harness via `tsx`.

---

## 3. What to Run Next: Step-by-Step Commands

### Immediate Verification Commands:
```bash
# 1. Typecheck (must pass with 0 errors)
npm run typecheck

# 2. Lint (must pass with 0 errors)
npm run lint

# 3. Production build test
npm run build

# 4. Check API health endpoint
# In PowerShell:
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
```

---

## 4. Phase-by-Phase Roadmap

### **Phase 2: AI Pipeline & Core Report Flow (NEXT UP)**
- **Goal:** Working end-to-end report analysis pipeline.
- **Files to Implement:**
  - `src/lib/ai/gemini.ts`: Wrapper around `@google/genai` (or fetch API to Gemini 2.5 Flash / embedding) with timeout, retry, and error handling.
  - `src/lib/ai/understand.ts`: Structured report extraction (category, summary, hazard flags, people affected) validated strictly with Zod.
  - `src/lib/ai/priority.ts`: Transparent rule-based priority calculator computing `priority_score` (0-100), `priority_label`, and itemized `priority_factors` (with text + delta + max points).
  - `src/lib/ai/embed.ts` & `src/lib/ai/duplicates.ts`: Embeddings generation + cosine similarity + haversine distance matching against existing reports.
  - `src/lib/ai/fallback.ts`: Rule-based keyword categorizer and template summary when Gemini API is unavailable or `FORCE_FALLBACK=true`. Sets `ai_mode='fallback'`.
  - `src/app/api/reports/route.ts`: POST route executing the full pipeline in order, logging traces into `priority_factors` and `duplicate_info`.
  - `src/app/(citizen)/report/page.tsx`: Report submission form (text, category override, photo picker with mobile camera capture, draggable map/pin + address, live pipeline feedback card `AIResultCard`).
- **Phase 2 Verification:**
  - Make sample POST requests with both AI and fallback modes.
  - Confirm duplicate detection and factor breakdowns are fully explainable.

### **Phase 3: Database & Synthetic Seed Data**
- **Goal:** Live Supabase persistence + ~45 synthetic reports.
- **Tasks:**
  - Setup Supabase connection via `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
  - Implement `scripts/seed.ts` inserting 45 synthetic Bangalore civic reports (4 duplicate groups, 3 high-priority hazards, 1 clustered street, full status histories).
  - Verify with `npm run seed`.

### **Phase 4: Official Dashboard & Hotspot Insights**
- **Goal:** Official review, assignment, map visualization, and AI action brief.
- **Tasks:**
  - `src/app/(official)/dashboard/page.tsx`: KPI cards (Open, Critical, Merged, Resolved), priority queue list, interactive Leaflet map with priority-colored pins.
  - `src/app/(official)/reports/[id]/page.tsx`: Report detail, factor breakdown bars, status stepper, assignment controls.
  - `src/app/(official)/insights/page.tsx`: Hotspot clusters and LLM-generated action brief.

### **Phase 5: Verification, Polish & Demo Hardening**
- **Tasks:**
  - Mobile testing at 375px width (zero horizontal scroll, tap targets >= 44px).
  - Empty, loading, and error states across all pages.
  - Ensure all mock labels ("Mocked", "Synthetic Data", "Fallback Mode") are visible.
  - Final end-to-end 5-minute demo rehearsal.

---

## 5. Notes for Successive Models/Agents
- **Do not introduce heavy dependencies** without checking `package.json`.
- **Do not bypass TypeScript strict mode** or add `any` without comments.
- **Ensure LLM responses are always parsed with Zod schemas**.
- **Always update this `projectTracker.md`** at the conclusion of each phase.
