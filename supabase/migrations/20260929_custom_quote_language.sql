-- Preserve unknown historical language; new quotes record the operator's selection.
alter table public.booking_custom_quotes add column locale text references public.locales(code);

-- Runs inside acceptance's existing transaction. Browser input cannot override
-- the quote language, including when an existing draft is updated/reused.
create function public.inherit_custom_quote_language()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
begin
  if new.custom_quote_id is not null then
    select locale into new.locale from public.booking_custom_quotes where id = new.custom_quote_id;
  end if;
  return new;
end;
$$;
revoke all on function public.inherit_custom_quote_language() from public;
create trigger booking_drafts_custom_quote_language
  before insert or update of custom_quote_id, locale on public.booking_drafts
  for each row execute function public.inherit_custom_quote_language();

-- Existing drafts retain their historical language. Acceptance of a historical
-- quote has no invented language and follows the legacy English display rule.
