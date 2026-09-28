-- Mapstone service boundary: no direct anonymous/authenticated table access.
create table public.mapstone_admin (
  id boolean primary key default true check (id),
  key_hash text not null check (length(key_hash) = 64)
);
alter table public.mapstone_admin enable row level security;
revoke all on public.mapstone_admin from public, anon, authenticated;
grant select on public.mapstone_admin to service_role;

create table public.mapstone_rooms (
  id uuid primary key default gen_random_uuid(),
  code_hash text not null unique check (length(code_hash) = 64),
  title text not null,
  document jsonb not null check (jsonb_typeof(document) = 'object'),
  revision bigint not null default 1 check (revision > 0),
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.mapstone_rooms enable row level security;
revoke all on public.mapstone_rooms from public, anon, authenticated;
grant select,insert,update,delete on public.mapstone_rooms to service_role;

create table public.mapstone_history (
  room_id uuid not null references public.mapstone_rooms(id) on delete cascade,
  revision bigint not null,
  document jsonb not null,
  created_at timestamptz not null default now(),
  primary key (room_id,revision)
);
alter table public.mapstone_history enable row level security;
revoke all on public.mapstone_history from public, anon, authenticated;
grant select,insert,delete on public.mapstone_history to service_role;

-- Invoker trigger: API server already holds service_role; no definer bypass.
create function public.mapstone_save_revision() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if TG_OP = 'UPDATE' then
    NEW.revision := OLD.revision + 1;
    NEW.updated_at := clock_timestamp();
  end if;
  insert into public.mapstone_history(room_id,revision,document)
    values(NEW.id,NEW.revision,NEW.document);
  -- Keep the latest 100 server revisions per room; export JSON for long-term archives.
  delete from public.mapstone_history where room_id=NEW.id and revision <= NEW.revision-100;
  return NEW;
end;
$$;
revoke all on function public.mapstone_save_revision() from public,anon,authenticated;
grant execute on function public.mapstone_save_revision() to service_role;
-- AFTER insert ensures the history foreign key can see the new room.
create trigger mapstone_insert_history after insert on public.mapstone_rooms
for each row execute function public.mapstone_save_revision();
create trigger mapstone_update_history before update on public.mapstone_rooms
for each row execute function public.mapstone_save_revision();
