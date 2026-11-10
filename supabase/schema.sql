-- supabase/schema.sql
-- Sprint 3: localStorage ilerlemesini Supabase'e taşımak için şema. Tüm tablolarda RLS açık.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text check (char_length(display_name) <= 40),
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  last_active date,
  created_at timestamptz not null default now()
);

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  best_score smallint not null check (best_score >= 0),
  total smallint not null check (total > 0),
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

create table if not exists public.badges_earned (
  user_id uuid not null references auth.users(id) on delete cascade,
  badge_id text not null,
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_id)
);

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.badges_earned enable row level security;

-- Kullanıcı yalnızca kendi satırlarını görür/yazar. (select auth.uid()) initplan cache için sarmalandı.
create policy "profiles_own" on public.profiles
  for all to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

create policy "progress_own" on public.lesson_progress
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "badges_own" on public.badges_earned
  for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- Haftalık liderlik tablosu için yalnızca takma ad + XP ifşa eden görünüm (Sprint 4).
create or replace view public.leaderboard with (security_invoker = false) as
  select display_name, xp from public.profiles where display_name is not null order by xp desc limit 50;
grant select on public.leaderboard to authenticated;
