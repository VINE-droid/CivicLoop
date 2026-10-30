// ── Domain types for CivicLoop ────────────────────────────
// All values align with ARCHITECTURE.md section 4.

export type Category =
  | 'waterlogging_drainage'
  | 'roads_potholes'
  | 'waste'
  | 'streetlights'
  | 'other';

export type CategorySource = 'ai' | 'user' | 'fallback';

export type Status =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'merged';

export type PriorityLabel = 'critical' | 'high' | 'medium' | 'low';

export type AiMode = 'ai' | 'fallback';

export type HazardSeverity = 'none' | 'moderate' | 'critical';

export type HazardFlag =
  | 'live_wire'
  | 'open_manhole'
  | 'flooding_on_road'
  | 'structural_risk'
  | 'injury_risk'
  | 'traffic_risk'
  | 'health_risk';

/** One row in the priority_factors JSONB column */
export interface PriorityFactor {
  key: string;
  label: string;
  points: number;
  max: number;
  reason: string;
}

/** Stored in duplicate_info JSONB column */
export interface DuplicateInfo {
  similarity: number;
  distance_m: number;
  original_id: number;
}

/** Matches the `reports` table */
export interface Report {
  id: number;
  text: string;
  image_url: string | null;
  category: Category;
  category_source: CategorySource;
  summary: string | null;
  lat: number;
  lng: number;
  address: string | null;
  status: Status;
  priority_score: number;
  priority_label: PriorityLabel;
  priority_factors: PriorityFactor[];
  hazard_flags: HazardFlag[];
  people_affected: number;
  embedding: number[] | null;
  duplicate_of: number | null;
  duplicate_info: DuplicateInfo | null;
  cluster_id: string | null;
  assigned_to: string | null;
  ai_mode: AiMode;
  citizen_ref: string;
  created_at: string; // ISO 8601
}

/** Matches the `status_events` table */
export interface StatusEvent {
  id: number;
  report_id: number;
  status: Status;
  note: string | null;
  actor: string; // 'citizen' | 'system' | 'official:<name>'
  created_at: string;
}

/** Report with its status_events joined */
export interface ReportDetail extends Report {
  status_events: StatusEvent[];
  duplicate_count: number; // computed: count of rows where duplicate_of = this.id
}

/** Computed cluster (never stored, computed on read) */
export interface Cluster {
  id: string;
  centroid: { lat: number; lng: number };
  radius_m: number;
  report_ids: number[];
  category_mix: Category[];
  max_priority: number;
  total_duplicate_count: number;
  cluster_priority: number; // max_priority + 5 per extra category, capped 100
  label: string;
}

/** Action brief from Gemini / template fallback */
export interface ActionBrief {
  headline: string;
  fix_first: Array<{ ref: string; why: string; suggested_crew: string }>;
  watch: Array<{ ref: string; why: string; suggested_crew: string }>;
  pattern_note: string;
  ai_mode: AiMode;
  generated_at: string; // ISO 8601
}

/** Role stored in client state */
export type Role = 'citizen' | 'official';

/** Standard API response envelope */
export type ApiOk<T> = { ok: true; data: T };
export type ApiError = { ok: false; error: string };
export type ApiResponse<T> = ApiOk<T> | ApiError;
