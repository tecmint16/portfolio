-- ============================================================
-- Migration 004: Internships table
-- Run in Supabase SQL Editor
-- ============================================================

-- ── internships ──────────────────────────────────────────────
create table if not exists public.internships (
  id          uuid primary key default uuid_generate_v4(),
  company     text not null,
  role        text not null,
  location    text,
  start_date  date not null,
  end_date    date,           -- NULL = current internship
  current     boolean default false,
  description text,
  tech_stack  text[],
  order_index int default 0,
  created_at  timestamptz default now()
);

alter table public.internships enable row level security;

create policy "Public can view internships"
  on public.internships for select using (true);

create policy "Authenticated can manage internships"
  on public.internships for all
  to authenticated
  using (true) with check (true);

create index if not exists internships_order_idx on public.internships(order_index, start_date desc);
