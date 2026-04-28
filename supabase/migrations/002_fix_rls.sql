-- ============================================================
-- Crispian Portfolio — RLS Fix Migration
-- Run this in Supabase SQL Editor AFTER 001_init.sql
-- ============================================================

-- ── Drop existing restrictive policies ───────────────────────

-- profiles
drop policy if exists "Owner can update own profile" on public.profiles;
drop policy if exists "Owner can insert own profile" on public.profiles;

-- projects
drop policy if exists "Owner can manage own projects" on public.projects;

-- contact_messages
drop policy if exists "Owner can view contact messages" on public.contact_messages;
drop policy if exists "Owner can delete contact messages" on public.contact_messages;

-- ── Re-create with correct authenticated-user policies ────────

-- profiles: any authenticated user can insert/update/delete
-- (this is a personal portfolio — only one admin exists)
create policy "Authenticated can insert profile"
  on public.profiles for insert
  to authenticated
  with check (true);

create policy "Authenticated can update profile"
  on public.profiles for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete profile"
  on public.profiles for delete
  to authenticated
  using (true);

-- projects: any authenticated user can manage all projects
create policy "Authenticated can manage projects"
  on public.projects for all
  to authenticated
  using (true)
  with check (true);

-- contact_messages: authenticated user can view and delete
create policy "Authenticated can view messages"
  on public.contact_messages for select
  to authenticated
  using (true);

create policy "Authenticated can delete messages"
  on public.contact_messages for delete
  to authenticated
  using (true);
