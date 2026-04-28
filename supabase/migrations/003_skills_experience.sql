-- ============================================================
-- Migration 003: Skills + Work Experience tables
-- Run in Supabase SQL Editor
-- ============================================================

-- ── skills ──────────────────────────────────────────────────
create table if not exists public.skills (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  category    text not null,  -- e.g. 'Frontend', 'Backend', 'DevOps', 'Tools'
  level       int default 80, -- 0-100 proficiency
  color       text default '#667eea',
  order_index int default 0,
  created_at  timestamptz default now()
);

alter table public.skills enable row level security;

create policy "Public can view skills"
  on public.skills for select using (true);

create policy "Authenticated can manage skills"
  on public.skills for all
  to authenticated
  using (true) with check (true);

create index if not exists skills_category_idx on public.skills(category, order_index);

-- ── work_experiences ─────────────────────────────────────────
create table if not exists public.work_experiences (
  id          uuid primary key default uuid_generate_v4(),
  company     text not null,
  role        text not null,
  location    text,
  start_date  date not null,
  end_date    date,           -- NULL = current job
  current     boolean default false,
  description text,
  tech_stack  text[],
  order_index int default 0,
  created_at  timestamptz default now()
);

alter table public.work_experiences enable row level security;

create policy "Public can view experiences"
  on public.work_experiences for select using (true);

create policy "Authenticated can manage experiences"
  on public.work_experiences for all
  to authenticated
  using (true) with check (true);

create index if not exists experience_order_idx on public.work_experiences(order_index, start_date desc);
