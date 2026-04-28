-- ============================================================
-- Crispian Portfolio — Supabase Database Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── profiles ────────────────────────────────────────────────
create table if not exists public.profiles (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references auth.users on delete cascade,
  full_name    text not null,
  title        text,
  bio          text,
  location     text,
  avatar_url   text,
  github_url   text,
  linkedin_url text,
  email        text,
  available    boolean default true,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── projects ─────────────────────────────────────────────────
create table if not exists public.projects (
  id           uuid primary key default uuid_generate_v4(),
  owner_id     uuid references auth.users on delete cascade,
  title        text not null,
  description  text,
  situation    text,
  task         text,
  action       text,
  result       text,
  tech_stack   text[],
  live_url     text,
  github_url   text,
  cover_url    text,
  featured     boolean default false,
  order_index  int default 0,
  created_at   timestamptz default now(),
  updated_at   timestamptz default now()
);

-- ── contact_messages ─────────────────────────────────────────
create table if not exists public.contact_messages (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  email      text not null,
  message    text not null,
  read       boolean default false,
  created_at timestamptz default now()
);

-- ── Row Level Security ────────────────────────────────────────

-- profiles RLS
alter table public.profiles enable row level security;

create policy "Public can view profiles"
  on public.profiles for select
  using (true);

create policy "Owner can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Owner can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- projects RLS
alter table public.projects enable row level security;

create policy "Public can view projects"
  on public.projects for select
  using (true);

create policy "Owner can manage own projects"
  on public.projects for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

-- contact_messages RLS
alter table public.contact_messages enable row level security;

create policy "Anyone can insert contact message"
  on public.contact_messages for insert
  with check (true);

create policy "Owner can view contact messages"
  on public.contact_messages for select
  using (auth.uid() is not null);

-- ── Indexes ──────────────────────────────────────────────────
create index if not exists projects_featured_idx on public.projects(featured, order_index);
create index if not exists projects_owner_idx on public.projects(owner_id);
create index if not exists messages_created_idx on public.contact_messages(created_at desc);
