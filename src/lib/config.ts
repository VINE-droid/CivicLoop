// ── Central config — all thresholds and weights live here ──
// Model names and API keys come from env vars (see .env.example).
// Never import this file on the client for server-only values.

import type { Category, PriorityLabel, Status } from './types';

// ── Categories ─────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  'waterlogging_drainage',
  'roads_potholes',
  'waste',
  'streetlights',
  'other',
];

export const CATEGORY_LABELS: Record<Category, string> = {
  waterlogging_drainage: 'Waterlogging / Drainage',
  roads_potholes:        'Roads / Potholes',
  waste:                 'Waste',
  streetlights:          'Streetlights',
  other:                 'Other',
};

/** Categories treated as compatible for duplicate detection */
export const RELATED_CATEGORY_PAIRS: [Category, Category][] = [
  ['waterlogging_drainage', 'roads_potholes'],
];

// ── Statuses ───────────────────────────────────────────────
export const STATUSES: Status[] = [
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
  'merged',
];

export const STATUS_LABELS: Record<Status, string> = {
  submitted:    'Submitted',
  under_review: 'Under Review',
  assigned:     'Assigned',
  in_progress:  'In Progress',
  resolved:     'Resolved',
  merged:       'Merged (Duplicate)',
};

/** Allowed status transitions: from -> list of valid next statuses */
export const STATUS_TRANSITIONS: Record<Status, Status[]> = {
  submitted:    ['under_review'],
  under_review: ['assigned', 'merged'],
  assigned:     ['in_progress'],
  in_progress:  ['resolved'],
  resolved:     [],
  merged:       [],
};

// ── Assignees (MOCKED — labelled in UI) ───────────────────
export const ASSIGNEES: string[] = [
  'Roads Crew A',
  'Drainage Crew B',
  'Sanitation Team',
  'Electrical Team',
];

// ── Priority scoring weights ───────────────────────────────
export const PRIORITY = {
  // Safety hazard
  HAZARD_CRITICAL: 35,
  HAZARD_MODERATE: 20,
  HAZARD_NONE:      0,

  // Potential impact (people affected)
  IMPACT_SMALL_MAX:    5,   // 1–5 people
  IMPACT_MEDIUM_MAX:  12,   // 6–50 people
  IMPACT_LARGE_MAX:   20,   // 50+ people
  IMPACT_SMALL_THRESHOLD:   5,
  IMPACT_MEDIUM_THRESHOLD: 50,

  // Duplicate reports
  DUPLICATE_POINTS_PER: 3,
  DUPLICATE_MAX:       15,

  // Location sensitivity (landmark proximity — MOCKED)
  LOCATION_NEAR_MAX:    10,  // within 200 m
  LOCATION_FAR_MAX:      5,  // within 400 m
  LOCATION_NEAR_M:     200,
  LOCATION_FAR_M:      400,

  // Age unresolved
  AGE_POINTS_PER_DAY:   1,
  AGE_MAX:             10,

  // Recurrence in area
  RECURRENCE_POINTS_PER: 2,
  RECURRENCE_MAX:       10,
  RECURRENCE_RADIUS_M:  300,
  RECURRENCE_DAYS:       30,
} as const;

// ── Priority labels ────────────────────────────────────────
export const PRIORITY_THRESHOLDS: { label: PriorityLabel; min: number }[] = [
  { label: 'critical', min: 70 },
  { label: 'high',     min: 50 },
  { label: 'medium',   min: 30 },
  { label: 'low',      min:  0 },
];

export function getPriorityLabel(score: number): PriorityLabel {
  for (const { label, min } of PRIORITY_THRESHOLDS) {
    if (score >= min) return label;
  }
  return 'low';
}

// ── Duplicate detection thresholds ────────────────────────
export const DUPLICATE = {
  COSINE_SIMILARITY_MIN: 0.80,
  DISTANCE_MAX_M:        150,
  FALLBACK_DISTANCE_M:    50,
  FALLBACK_JACCARD_MIN:   0.5,
} as const;

// ── Clustering thresholds ──────────────────────────────────
export const CLUSTER = {
  LINK_DISTANCE_M:     300,
  MIN_REPORTS:           3,
  MIN_CATEGORIES:        2,
  ALT_MIN_REPORTS:       4,
  PRIORITY_PER_CATEGORY: 5,
  PRIORITY_CAP:        100,
} as const;

// ── AI pipeline settings ───────────────────────────────────
export const AI = {
  UNDERSTAND_TIMEOUT_MS: 8_000,
  BRIEF_CACHE_MS:        5 * 60 * 1000, // 5 minutes
  BRIEF_TOP_N:           5,
  SUMMARY_MAX_WORDS:    25,
} as const;

// ── Map defaults ───────────────────────────────────────────
export const MAP = {
  CENTER_LAT: parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LAT ?? '12.9716'),
  CENTER_LNG: parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LNG ?? '77.5946'),
  DEFAULT_ZOOM: 14,
} as const;

// ── Demo / seed ────────────────────────────────────────────
export const DEMO = {
  CITIZEN_REF:  'demo-citizen',
  SEED_REPORTS: 45,
} as const;
