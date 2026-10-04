alter table public.mapstone_rooms
  add column if not exists guest_password_hash text,
  add column if not exists guest_permission text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname='mapstone_rooms_guest_password_hash_check' and conrelid='public.mapstone_rooms'::regclass) then
    alter table public.mapstone_rooms add constraint mapstone_rooms_guest_password_hash_check
      check (guest_password_hash is null or length(guest_password_hash)=64);
  end if;
  if not exists (select 1 from pg_constraint where conname='mapstone_rooms_guest_permission_check' and conrelid='public.mapstone_rooms'::regclass) then
    alter table public.mapstone_rooms add constraint mapstone_rooms_guest_permission_check
      check (guest_permission is null or guest_permission in ('view','edit'));
  end if;
end;
$$;

create table if not exists public.mapstone_rate_limits (
  window_start timestamptz not null,
  key_hash text not null check (length(key_hash) = 64),
  hits integer not null check (hits > 0),
  primary key (window_start,key_hash)
);
alter table public.mapstone_rate_limits enable row level security;
revoke all on public.mapstone_rate_limits from public, anon, authenticated;
grant select,insert,update,delete on public.mapstone_rate_limits to service_role;

create or replace function public.mapstone_take_rate_limit(p_key_hash text,p_limit integer) returns boolean
language plpgsql security invoker set search_path = '' as $$
declare
  bucket timestamptz := date_trunc('hour',clock_timestamp());
  current_hits integer;
begin
  insert into public.mapstone_rate_limits(window_start,key_hash,hits)
    values(bucket,p_key_hash,1)
  on conflict (window_start,key_hash) do update
    set hits = public.mapstone_rate_limits.hits + 1
  returning hits into current_hits;
  delete from public.mapstone_rate_limits where window_start < bucket - interval '24 hours';
  return current_hits <= p_limit;
end;
$$;
revoke all on function public.mapstone_take_rate_limit(text,integer) from public,anon,authenticated;
grant execute on function public.mapstone_take_rate_limit(text,integer) to service_role;
