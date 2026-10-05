-- 공유 확장: 열람 비밀번호는 선택(null = 링크만으로 열람), 보기 링크에서 편집으로 전환하는 별도 비밀번호.
alter table public.mapstone_rooms
  add column if not exists edit_password_hash text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname='mapstone_rooms_edit_password_hash_check' and conrelid='public.mapstone_rooms'::regclass) then
    alter table public.mapstone_rooms add constraint mapstone_rooms_edit_password_hash_check
      check (edit_password_hash is null or length(edit_password_hash)=64);
  end if;
end;
$$;

-- 공유 방 구분: guest_permission이 있는 방만 링크로 열린다(기존 접속 코드 방은 영향 없음).
create index if not exists mapstone_rooms_shared_idx on public.mapstone_rooms (id) where guest_permission is not null;
