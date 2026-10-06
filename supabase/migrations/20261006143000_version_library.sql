create table public.mapstone_version_projects (
 id uuid primary key,
 owner_hash text not null check(length(owner_hash)=64),
 owner_id uuid references auth.users(id),
 title text not null,
 updated_at timestamptz not null default now()
);
create index on public.mapstone_version_projects(owner_hash,updated_at desc);
create table public.mapstone_saved_versions (
 project_id uuid not null references public.mapstone_version_projects(id),
 id text not null,
 sequence integer not null,
 created_at timestamptz not null default now(),
 note text not null default '',
 document jsonb not null,
 primary key(project_id,id), unique(project_id,sequence)
);
alter table public.mapstone_version_projects enable row level security;
alter table public.mapstone_saved_versions enable row level security;
revoke all on public.mapstone_version_projects,public.mapstone_saved_versions from public,anon,authenticated;
grant all on public.mapstone_version_projects,public.mapstone_saved_versions to service_role;
create function public.mapstone_save_version(p_project uuid,p_owner text,p_id text,p_document jsonb,p_note text)
returns setof public.mapstone_saved_versions language plpgsql security invoker set search_path='' as $$
declare owner text; seq integer;
begin
 insert into public.mapstone_version_projects(id,owner_hash,title) values(p_project,p_owner,p_document->>'title') on conflict(id) do nothing;
 select owner_hash into owner from public.mapstone_version_projects where id=p_project for update;
 if owner is distinct from p_owner then raise exception 'forbidden'; end if;
 if exists(select 1 from public.mapstone_saved_versions where project_id=p_project and id=p_id) then
  return query select * from public.mapstone_saved_versions where project_id=p_project and id=p_id; return;
 end if;
 select coalesce(max(sequence),0)+1 into seq from public.mapstone_saved_versions where project_id=p_project;
 update public.mapstone_version_projects set title=p_document->>'title',updated_at=now() where id=p_project;
 return query insert into public.mapstone_saved_versions(project_id,id,sequence,note,document) values(p_project,p_id,seq,p_note,p_document) returning *;
end $$;
revoke all on function public.mapstone_save_version(uuid,text,text,jsonb,text) from public,anon,authenticated;
grant execute on function public.mapstone_save_version(uuid,text,text,jsonb,text) to service_role;
