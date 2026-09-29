-- Dedicated scheduler authentication avoids depending on a deployment-only
-- Vercel CRON_SECRET. Only the service-role API can verify the Vault secret.
create or replace function public.verify_driver_dispatch_token(p_token_hash text)
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from vault.decrypted_secrets
    where name = 'rentandroll_driver_dispatch_cron_secret'
      and encode(extensions.digest(decrypted_secret, 'sha256'), 'hex') = p_token_hash
  );
$$;
revoke all on function public.verify_driver_dispatch_token(text) from public, anon, authenticated;
grant execute on function public.verify_driver_dispatch_token(text) to service_role;
