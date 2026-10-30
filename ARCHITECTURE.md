# ARCHITECTURE

## 1. Stack
- **Next.js (App Router) + TypeScript (strict) + Tailwind CSS.** Frontend and API routes in one repo.
- **Supabase** (Postgres + Storage). Table access from server routes only, using the service role key. Images go in a public bucket `report-images`.
- **Gemini API** via `@google/genai` (check current docs for exact package and model names). Used for: structured extraction (text + optional image), embeddings, action brief. Model names live in env vars, never hardcoded.
- **Leaflet + react-leaflet + OpenStreetMap tiles.** No API key. Load client-side only (`dynamic(..., { ssr: false })`).
- **zod** to validate every LLM response.
- **Deploy:** Vercel, with env vars set in the dashboard.

## 2. Environment variables
```
GEMINI_API_KEY=
GEMINI_MODEL=            # e.g. a fast flash-class model; verify in docs
GEMINI_EMBED_MODEL=      # an embedding model; verify in docs
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_MAP_CENTER_LAT=12.9716
NEXT_PUBLIC_MAP_CENTER_LNG=77.5946
FORCE_FALLBACK=false     # true = skip Gemini, use rule-based pipeline (demo safety net)
```

## 3. Folder structure
```
src/
  app/
    (citizen)/report/page.tsx          # submit form
    (citizen)/my-reports/page.tsx      # list + status timeline
    (official)/dashboard/page.tsx      # KPIs, priority queue, map
    (official)/reports/[id]/page.tsx   # detail, why-priority, assign, status
    (official)/insights/page.tsx       # hotspots + action brief
    api/reports/route.ts               # POST create (runs pipeline), GET list
    api/reports/[id]/route.ts          # GET detail
    api/reports/[id]/status/route.ts   # PATCH status (+ status_event)
    api/reports/[id]/assign/route.ts   # PATCH assignee
    api/clusters/route.ts              # GET clusters (computed)
    api/insights/brief/route.ts        # POST/GET action brief
  lib/
    db.ts                              # supabase server client
    ai/gemini.ts                       # client wrapper + timeout + retry
    ai/understand.ts                   # structured extraction (zod)
    ai/embed.ts
    ai/duplicates.ts
    ai/priority.ts                     # rule-based score + factors
    ai/clusters.ts
    ai/brief.ts
    ai/fallback.ts                     # keyword categorizer + template summary
    geo.ts                             # haversine
    landmarks.ts                       # hardcoded landmarks (MOCKED, labelled)
    types.ts
  components/ ...
scripts/
  seed.ts                              # synthetic data + embeddings
docs: PROJECT_BRIEF.md ARCHITECTURE.md DESIGN.md LIMITATIONS.md README.md
```

## 4. Data model (SQL)
```sql
create table reports (
  id bigint generated always as identity primary key,
  text text not null,
  image_url text,
  category text not null,              -- see categories below
  category_source text not null default 'ai',  -- 'ai' | 'user' | 'fallback'
  summary text,
  lat double precision not null,
  lng double precision not null,
  address text,
  status text not null default 'submitted',
  priority_score int not null default 0,
  priority_label text not null default 'low',
  priority_factors jsonb not null default '[]',
  hazard_flags jsonb not null default '[]',
  people_affected int default 1,
  embedding jsonb,
  duplicate_of bigint references reports(id),
  duplicate_info jsonb,                -- {similarity, distance_m, original_id}
  cluster_id text,
  assigned_to text,
  ai_mode text not null default 'ai',  -- 'ai' | 'fallback'
  citizen_ref text not null default 'demo-citizen',
  created_at timestamptz not null default now()
);
create table status_events (
  id bigint generated always as identity primary key,
  report_id bigint references reports(id) on delete cascade,
  status text not null,
  note text,
  actor text not null,                 -- 'citizen' | 'system' | 'official:<name>'
  created_at timestamptz not null default now()
);
```
**Categories:** `waterlogging_drainage`, `roads_potholes`, `waste`, `streetlights`, `other`.
**Statuses:** `submitted` -> `under_review` -> `assigned` -> `in_progress` -> `resolved`. Duplicates get status `merged` and `duplicate_of`.
**Assignees (mocked):** Roads Crew A, Drainage Crew B, Sanitation Team, Electrical Team.
Clusters are computed on read (not stored) to avoid staleness; `cluster_id` is optional cache.

## 5. AI pipeline (runs inside POST /api/reports)
Order matters. Each step logs a trace saved to `priority_factors` / `duplicate_info` so the UI can explain it.

### Step 1: Understand (one Gemini call, JSON schema output, validated by zod)
Input: report text, optional image, user-chosen category (if any).
Output:
```json
{
  "category": "waterlogging_drainage|roads_potholes|waste|streetlights|other",
  "summary": "one sentence, max 25 words, plain language",
  "hazard_flags": ["live_wire","open_manhole","flooding_on_road","structural_risk","injury_risk","traffic_risk","health_risk"],
  "hazard_severity": "none|moderate|critical",
  "people_affected_estimate": 1,
  "image_observation": "short description or null"
}
```
If user chose a category and the AI disagrees, keep the user's category, store AI's suggestion in the explanation, and show "AI suggests X". If the LLM fails or times out (8s), validation fails, or `FORCE_FALLBACK=true`, use `fallback.ts` (keyword category, first-sentence summary, keyword hazard flags) and set `ai_mode='fallback'`. The UI must show a visible "Fallback mode (rule-based)" badge.

### Step 2: Embed
Embed `summary + " " + text`. On failure, skip embedding and use fallback duplicate check: same category + distance <= 50 m + token overlap (Jaccard) >= 0.5.

### Step 3: Duplicate detection
Compare against reports with status not in (`resolved`, `merged`). A report is a **likely duplicate** of the best candidate when ALL hold:
- cosine similarity >= **0.80**
- haversine distance <= **150 m**
- same category, or both in a related pair: (`waterlogging_drainage`, `roads_potholes`)

Store `duplicate_of`, `duplicate_info {similarity, distance_m, original_id}`, set status `merged`, add a status event. Increment the original's duplicate count (computed by counting rows where duplicate_of = id). Show "Likely duplicate of #12 (similarity 0.86, 40 m away)". The official can **un-merge** (mark not a duplicate). AI can be wrong, so keep that human control.

### Step 4: Priority score (rule-based, 0-100, every factor stored)
Factors are stored as `[{key, label, points, max, reason}]`.

| Factor | Max | Rule |
|---|---|---|
| Safety hazard | 35 | critical = 35, moderate = 20, none = 0 |
| Potential impact | 20 | people_affected: 1-5 = 5, 6-50 = 12, 50+ = 20 |
| Duplicate reports | 15 | 3 points per linked duplicate, capped 15 |
| Location sensitivity | 10 | within 200 m of a landmark (school, hospital, main road, market) = 10, within 400 m = 5 (**mocked** landmark list) |
| Age unresolved | 10 | 1 point per day open, capped 10 |
| Recurrence in area | 10 | 2 points per other open report in same category within 300 m in last 30 days, capped 10 |

Labels: `>=70 critical`, `50-69 high`, `30-49 medium`, `<30 low`.
Plain-language explanation is generated from the factors by a **template** (not an LLM) to guarantee it matches the numbers: "High (62): safety hazard +35, 3 duplicate reports +9, near school +10, ...".
A merged duplicate does not get its own queue slot. Its score contributes through the original's duplicate factor. Recompute the original's score after merging.

### Step 5: Hotspot clusters (computed on read in `clusters.ts`)
- Consider open, non-merged reports.
- Single-linkage grouping: two reports connect if within **300 m**.
- A cluster needs **>= 3 reports** and at least **2 categories OR >= 4 reports**.
- Output per cluster: id, centroid, radius (max distance to centroid), report ids, category mix, max priority, total duplicate count, `cluster_priority = max priority + 5 per extra category` (cap 100), and a template label such as "Drainage blockage + waterlogging + potholes near <street>".

### Step 6: Action brief (one Gemini call, cached in memory for 5 minutes)
Input: top 5 reports by priority, clusters, counts by status. Output: JSON `{headline, fix_first: [{ref, why, suggested_crew}], watch: [...], pattern_note}` validated by zod. Max about 150 words total. Fallback: template brief built from the top clusters and scores, labelled "template brief".

## 6. API contract (summary)
- `POST /api/reports` multipart (text, category?, lat, lng, address?, image?) -> returns the full report with `priority_factors`, `duplicate_info`, `ai_mode`.
- `GET /api/reports?status=&category=&role=` -> list sorted by priority desc (officials) or by `citizen_ref` (citizen).
- `GET /api/reports/:id` -> report + status_events + linked duplicates.
- `PATCH /api/reports/:id/status` `{status, note, actor}` -> validates allowed transitions; writes a status_event.
- `PATCH /api/reports/:id/assign` `{assignee}` -> sets assigned_to, moves status to `assigned`, writes status_event.
- `PATCH /api/reports/:id/unmerge` -> clears duplicate_of, recomputes scores.
- `GET /api/clusters`, `GET /api/insights/brief`.
All routes return `{ ok, data | error }`. Never leak the API key to the client.

## 7. Synthetic data (scripts/seed.ts)
Fictional ward, fictional street names ("Maple Lane", "Canal Road", etc.). Coordinates scattered around the map center. **No real personal data.** Mark everywhere as synthetic.
- **~45 reports** across the 5 categories, spread over the past 14 days.
- **4 deliberate duplicate groups** (2-4 reports each, same issue, different wording and slightly different coordinates within ~60 m).
- **3 urgent safety reports** (fallen live wire near a bus stop, open manhole near a school, collapsed footpath edge on a main road).
- **1 clear cluster:** 6-7 reports on one street (drain blockage, waterlogging, potholes, garbage near drain).
- A few reports per status: submitted, under_review, assigned, in_progress, resolved, plus `status_events` history for each.
- Seed script computes embeddings, scores and duplicates through the same pipeline functions as the real API (no hand-written fake scores). Make the seed idempotent (wipe and reinsert).
- Demo helper: keep 1 pre-written "demo report" text that is a near-duplicate of a seeded report so the live demo reliably triggers the duplicate flow. Store it in `docs/demo-script.md`.

## 8. Mocked (must be labelled in UI and docs)
Login/roles, landmark list for location sensitivity, crew assignees, notifications, address geocoding (user types address; pin is source of truth), all report data.
