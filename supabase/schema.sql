-- Run once in Supabase SQL Editor. Idempotent on subsequent runs.
create table if not exists public.learner_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'ผู้เรียน',
  email text not null,
  created_at timestamptz not null default now()
);
create table if not exists public.teacher_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade
);
create table if not exists public.learner_progress (
  user_id uuid primary key references public.learner_profiles(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint state_is_object check (jsonb_typeof(state) = 'object' and octet_length(state::text) < 100000)
);
alter table public.learner_profiles enable row level security;
alter table public.teacher_accounts enable row level security;
alter table public.learner_progress enable row level security;

-- A browser cannot grant teacher status. Only the project owner does this in SQL.
revoke all on public.teacher_accounts from anon, authenticated;
grant select on public.teacher_accounts to authenticated;
drop policy if exists teacher_self on public.teacher_accounts;
create policy teacher_self on public.teacher_accounts for select to authenticated using (user_id = (select auth.uid()));
create or replace function public.is_teacher()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.teacher_accounts where user_id = (select auth.uid())); $$;
revoke all on function public.is_teacher() from public, anon;
grant execute on function public.is_teacher() to authenticated;

revoke all on public.learner_profiles, public.learner_progress from anon, authenticated;
grant select on public.learner_profiles to authenticated;
grant select, insert, update on public.learner_progress to authenticated;
drop policy if exists profile_read on public.learner_profiles;
create policy profile_read on public.learner_profiles for select to authenticated
using (id = (select auth.uid()) or (select public.is_teacher()));
drop policy if exists progress_read on public.learner_progress;
create policy progress_read on public.learner_progress for select to authenticated
using (user_id = (select auth.uid()) or (select public.is_teacher()));
drop policy if exists progress_insert on public.learner_progress;
create policy progress_insert on public.learner_progress for insert to authenticated
with check (user_id = (select auth.uid()));
drop policy if exists progress_update on public.learner_progress;
create policy progress_update on public.learner_progress for update to authenticated
using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create or replace function public.handle_learner_profile()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.learner_profiles(id, display_name, email)
  values (new.id, coalesce(nullif(left(new.raw_user_meta_data->>'display_name',80),''),'ผู้เรียน'), coalesce(new.email,''))
  on conflict(id) do update set display_name = excluded.display_name, email = excluded.email;
  return new;
end;
$$;
revoke all on function public.handle_learner_profile() from public, anon, authenticated;
drop trigger if exists create_learner_profile on auth.users;
create trigger create_learner_profile after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_learner_profile();
insert into public.learner_profiles(id, display_name, email)
select id, coalesce(nullif(left(raw_user_meta_data->>'display_name',80),''),'ผู้เรียน'), coalesce(email,'') from auth.users
on conflict(id) do nothing;

create or replace function public.stamp_progress()
returns trigger language plpgsql set search_path = ''
as $$ begin new.updated_at = now(); return new; end; $$;
revoke all on function public.stamp_progress() from public, anon, authenticated;
drop trigger if exists stamp_learner_progress on public.learner_progress;
create trigger stamp_learner_progress before insert or update on public.learner_progress
for each row execute function public.stamp_progress();

-- After you sign up, grant your own verified account teacher access manually:
-- insert into public.teacher_accounts(user_id)
-- select id from auth.users where email = 'YOUR_TEACHER_EMAIL'
-- on conflict do nothing;
