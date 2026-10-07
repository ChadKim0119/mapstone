-- Deleted versions stay inaccessible; reserving their sequence prevents number reuse.
alter table public.mapstone_saved_versions add column deleted_at timestamptz;
