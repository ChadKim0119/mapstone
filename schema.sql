-- Mapstone collab boards (run in Supabase SQL editor)
create table if not exists public.mapstone_boards (
  access_code text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.mapstone_boards enable row level security;

drop policy if exists "mapstone_public_rw" on public.mapstone_boards;
create policy "mapstone_public_rw"
  on public.mapstone_boards
  for all
  using (true)
  with check (true);

-- Realtime so other browsers pick up changes
alter publication supabase_realtime add table public.mapstone_boards;
