-- CivicLoop database schema
-- Paste this into the Supabase SQL Editor and run it.
-- All data produced by this app is synthetic (see LIMITATIONS.md).

-- ── reports ───────────────────────────────────────────────

create table reports (
  id               bigint generated always as identity primary key,
  text             text not null,
  image_url        text,
  category         text not null,              -- see categories below
  category_source  text not null default 'ai', -- 'ai' | 'user' | 'fallback'
  summary          text,
  lat              double precision not null,
  lng              double precision not null,
  address          text,
  status           text not null default 'submitted',
  priority_score   int not null default 0,
  priority_label   text not null default 'low',
  priority_factors jsonb not null default '[]',
  hazard_flags     jsonb not null default '[]',
  people_affected  int default 1,
  embedding        jsonb,
  duplicate_of     bigint references reports(id),
  duplicate_info   jsonb,               -- {similarity, distance_m, original_id}
  cluster_id       text,
  assigned_to      text,
  ai_mode          text not null default 'ai', -- 'ai' | 'fallback'
  citizen_ref      text not null default 'demo-citizen',
  created_at       timestamptz not null default now()
);

-- ── status_events ─────────────────────────────────────────

create table status_events (
  id         bigint generated always as identity primary key,
  report_id  bigint references reports(id) on delete cascade,
  status     text not null,
  note       text,
  actor      text not null,             -- 'citizen' | 'system' | 'official:<name>'
  created_at timestamptz not null default now()
);

-- ── indexes ───────────────────────────────────────────────

create index reports_status_idx        on reports (status);
create index reports_category_idx      on reports (category);
create index reports_priority_idx      on reports (priority_score desc);
create index reports_location_idx      on reports (lat, lng);
create index reports_created_at_idx    on reports (created_at desc);
create index reports_duplicate_of_idx  on reports (duplicate_of);
create index status_events_report_idx  on status_events (report_id);

-- ── Categories ────────────────────────────────────────────
-- waterlogging_drainage | roads_potholes | waste | streetlights | other
--
-- ── Statuses ──────────────────────────────────────────────
-- submitted -> under_review -> assigned -> in_progress -> resolved
-- duplicates get status 'merged' with duplicate_of set
--
-- ── Assignees (MOCKED) ────────────────────────────────────
-- Roads Crew A | Drainage Crew B | Sanitation Team | Electrical Team
