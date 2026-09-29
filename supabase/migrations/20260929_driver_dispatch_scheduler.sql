-- Supabase Cron avoids Vercel plan-dependent sub-daily scheduling limits.
create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

create or replace function public.invoke_driver_dispatch_cron()
returns bigint language plpgsql security definer set search_path = public as $$
declare secret_value text;
begin
  select decrypted_secret into secret_value from vault.decrypted_secrets
    where name = 'rentandroll_driver_dispatch_cron_secret';
  if secret_value is null then raise exception 'Driver dispatch cron secret is not configured'; end if;
  return net.http_get(
    url := 'https://rentandroll.com/api/cron/driver-dispatch',
    headers := jsonb_build_object('Authorization', 'Bearer ' || secret_value),
    timeout_milliseconds := 65000
  );
end;
$$;
revoke all on function public.invoke_driver_dispatch_cron() from public, anon, authenticated, service_role;

select cron.schedule('rentandroll-driver-dispatch', '*/5 * * * *', 'select public.invoke_driver_dispatch_cron();');
-- Enable only after the matching application deployment is live and Vault is configured.
select cron.alter_job(jobid, active := false) from cron.job where jobname = 'rentandroll-driver-dispatch';
