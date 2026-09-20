-- Some legacy booking functions still call uuid_generate_v4(), while this
-- database uses PostgreSQL's built-in gen_random_uuid(). Keep the legacy name
-- available in the public schema so security-definer functions can resolve it.

create or replace function public.uuid_generate_v4()
returns uuid
language sql
volatile
as $$
  select gen_random_uuid();
$$;

revoke all on function public.uuid_generate_v4() from public, anon, authenticated;
